import { useState, useEffect } from 'react';

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    // Enhanced debugging for production issues
    const checkPWAStatus = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = window.navigator.standalone === true;
      const isInstalled = isStandalone || isInWebAppiOS;
      
      const debug = {
        isHTTPS: window.location.protocol === 'https:',
        hasServiceWorker: 'serviceWorker' in navigator,
        userAgent: navigator.userAgent,
        isStandalone,
        isIOSStandalone: isInWebAppiOS,
        isInstalled,
        currentURL: window.location.href,
        manifestPresent: !!document.querySelector('link[rel="manifest"]'),
        browserSupportsInstall: 'BeforeInstallPromptEvent' in window || 
                               navigator.userAgent.includes('Chrome') || 
                               navigator.userAgent.includes('Edge'),
      };

      console.log('🔍 PWA Status Check:', debug);
      setDebugInfo(debug);
      setIsInstalled(isInstalled);

      // Check if PWA is installable based on criteria
      if (!isInstalled && debug.isHTTPS && debug.manifestPresent) {
        setCanInstall(true);
        
        // Auto-show install prompt after a delay if not shown by browser
        const lastPromptTime = localStorage.getItem('pwa-install-prompt-time');
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;
        
        if (!lastPromptTime || (now - parseInt(lastPromptTime)) > oneDayMs) {
          setTimeout(() => {
            if (!deferredPrompt && !isInstalled) {
              console.log('📱 Auto-showing install prompt after delay');
              setShowInstallPrompt(true);
            }
          }, 3000); // Wait 3 seconds for beforeinstallprompt
        }
      }
    };

    checkPWAStatus();

    const handleBeforeInstallPrompt = (e) => {
      console.log('🎯 beforeinstallprompt event fired!');
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
      
      // **CRITICAL FIX**: Only prevent default, don't auto-show
      // Let user interaction trigger the prompt to avoid browser blocking
      console.log('💾 Install prompt deferred - waiting for user interaction');
      
      // Check if we should show our custom modal
      const lastPromptTime = localStorage.getItem('pwa-install-prompt-time');
      const now = Date.now();
      const oneDayMs = 24 * 60 * 60 * 1000;
      
      if (!lastPromptTime || (now - parseInt(lastPromptTime)) > oneDayMs) {
        // Small delay to avoid immediate conflicts
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 500);
      }
    };

    const handleAppInstalled = () => {
      console.log('✅ PWA was installed');
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      setIsInstalled(true);
      setCanInstall(false);
      localStorage.removeItem('pwa-install-prompt-time');
    };

    // Add event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check again after service worker loads
    const recheckTimer = setTimeout(checkPWAStatus, 2000);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearTimeout(recheckTimer);
    };
  }, [deferredPrompt]);

  const installPWA = async () => {
    console.log('🚀 Attempting to install PWA...');
    
    if (deferredPrompt) {
      try {
        console.log('📱 Using deferred prompt...');
        
        // **CRITICAL**: This must be called within user interaction
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log('📊 Install prompt outcome:', outcome);

        if (outcome === 'accepted') {
          console.log('✅ User accepted the install prompt');
        } else {
          console.log('❌ User dismissed the install prompt');
        }

        // Clean up regardless of outcome
        setDeferredPrompt(null);
        setShowInstallPrompt(false);
        localStorage.setItem('pwa-install-prompt-time', Date.now().toString());

        return outcome === 'accepted';
      } catch (error) {
        console.error('❌ Error during installation:', error);
        
        // If prompt fails, show manual instructions
        showManualInstallInstructions();
        return false;
      }
    }

    // Fallback: show manual installation instructions
    console.log('📖 No deferred prompt available - showing manual installation instructions...');
    showManualInstallInstructions();
    return false;
  };

  const showManualInstallInstructions = () => {
    const isChrome = navigator.userAgent.includes('Chrome');
    const isEdge = navigator.userAgent.includes('Edge');
    const isSafari = navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome');
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    let instructions = '';
    let title = 'Install Bulak LGU Connect';
    
    if (isChrome || isEdge) {
      if (isMobile) {
        instructions = '1. Tap the menu button (⋮) in your browser\n2. Look for "Install app" or "Add to Home Screen"\n3. Tap "Install" to add to your home screen';
      } else {
        instructions = '1. Look for the install icon (⊕) in the address bar\n2. Or click the menu button (⋮) and select "Install Bulak LGU Connect"\n3. Click "Install" in the popup dialog';
      }
    } else if (isSafari) {
      instructions = '1. Tap the Share button (□↗) at the bottom\n2. Scroll down and select "Add to Home Screen"\n3. Tap "Add" to confirm installation';
    } else {
      instructions = '1. Look for "Install" or "Add to Home Screen" in your browser menu\n2. Follow the prompts to install the app\n3. The app will be added to your device\'s home screen';
    }

    // Create a custom modal for better UX than alert()
    createInstallInstructionModal(title, instructions);
  };

  const createInstallInstructionModal = (title, instructions) => {
    // Remove existing modal if any
    const existingModal = document.getElementById('pwa-install-modal');
    if (existingModal) {
      existingModal.remove();
    }

    // Colors matching InstallPrompt.jsx
    const PRIMARY_BLUE = '#1C4D5A';
    const Light_Blue = '#d5dcdd';

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'pwa-install-modal';
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      background: linear-gradient(135deg, #fff 80%, ${Light_Blue} 100%);
      border-radius: 16px;
      padding: 24px;
      max-width: 400px;
      margin: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    `;

    content.innerHTML = `
      <h3 style="
        margin: 0 0 16px 0; 
        color: ${PRIMARY_BLUE}; 
        font-size: 18px; 
        font-weight: 600;
        text-align: center;
      ">${title}</h3>
      <p style="
        margin: 0 0 24px 0; 
        color: #222; 
        line-height: 1.6; 
        white-space: pre-line;
        font-size: 14px;
      ">${instructions}</p>
      <div style="
        display: flex; 
        gap: 12px; 
        justify-content: center;
      ">
        <button id="pwa-modal-close" style="
          background: transparent;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          color: #757575;
          transition: background-color 0.2s ease;
        " 
        onmouseover="this.style.backgroundColor='#f5f5f5'"
        onmouseout="this.style.backgroundColor='transparent'"
        >Maybe Later</button>
        <button id="pwa-modal-ok" style="
          background: ${PRIMARY_BLUE};
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 24px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          box-shadow: 0 2px 4px rgba(28, 77, 90, 0.2);
          transition: background-color 0.2s ease;
        "
        onmouseover="this.style.backgroundColor='#133740'"
        onmouseout="this.style.backgroundColor='${PRIMARY_BLUE}'"
        >Got it!</button>
      </div>
    `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    // Add event listeners
    const closeModal = () => {
      modal.remove();
      localStorage.setItem('pwa-install-prompt-time', Date.now().toString());
    };

    document.getElementById('pwa-modal-close').onclick = closeModal;
    document.getElementById('pwa-modal-ok').onclick = closeModal;
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };
  };

  const dismissInstallPrompt = () => {
    setShowInstallPrompt(false);
    localStorage.setItem('pwa-install-prompt-time', Date.now().toString());
  };

  return {
    showInstallPrompt: showInstallPrompt && !isInstalled,
    installPWA,
    isInstallable: canInstall,
    isInstalled,
    debugInfo,
    dismissInstallPrompt,
  };
};
