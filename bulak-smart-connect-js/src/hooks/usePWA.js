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
      
      // **KEY FIX**: Show install prompt immediately in production
      // Don't wait for user interaction in production environments
      const isProduction = window.location.hostname !== 'localhost' && 
                          window.location.hostname !== '127.0.0.1';
      
      if (isProduction) {
        // In production, show prompt immediately to avoid browser timeout
        console.log('🚀 Production environment detected - showing install prompt immediately');
        setShowInstallPrompt(true);
      } else {
        // In development, you can delay if needed
        setTimeout(() => setShowInstallPrompt(true), 1000);
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
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        
        console.log('📊 Install prompt outcome:', outcome);

        if (outcome === 'accepted') {
          console.log('✅ User accepted the install prompt');
        }

        setDeferredPrompt(null);
        setShowInstallPrompt(false);
        localStorage.setItem('pwa-install-prompt-time', Date.now().toString());

        return outcome === 'accepted';
      } catch (error) {
        console.error('❌ Error during installation:', error);
      }
    }

    // Fallback: show manual installation instructions
    console.log('📖 Showing manual installation instructions...');
    showManualInstallInstructions();
    return false;
  };

  const showManualInstallInstructions = () => {
    const isChrome = navigator.userAgent.includes('Chrome');
    const isEdge = navigator.userAgent.includes('Edge');
    const isSafari = navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome');
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    let instructions = '';
    let title = 'Install Bulak LGU Smart Connect';
    
    if (isChrome || isEdge) {
      if (isMobile) {
        instructions = '1. Tap the menu button (⋮) in your browser\n2. Look for "Install app" or "Add to Home Screen"\n3. Tap "Install" to add to your home screen';
      } else {
        instructions = '1. Look for the install icon (⊕) in the address bar\n2. Or click the menu button (⋮) and select "Install Bulak LGU Smart Connect"\n3. Click "Install" in the popup dialog';
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
      background: white;
      border-radius: 12px;
      padding: 24px;
      max-width: 400px;
      margin: 20px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
    `;

    content.innerHTML = `
      <h3 style="margin: 0 0 16px 0; color: #1C4D5A; font-size: 18px; font-weight: 600;">${title}</h3>
      <p style="margin: 0 0 20px 0; color: #333; line-height: 1.5; white-space: pre-line;">${instructions}</p>
      <div style="display: flex; gap: 12px; justify-content: flex-end;">
        <button id="pwa-modal-close" style="
          background: #f5f5f5;
          border: none;
          border-radius: 6px;
          padding: 8px 16px;
          cursor: pointer;
          font-size: 14px;
        ">Maybe Later</button>
        <button id="pwa-modal-ok" style="
          background: #1C4D5A;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 8px 16px;
          cursor: pointer;
          font-size: 14px;
        ">Got it!</button>
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
