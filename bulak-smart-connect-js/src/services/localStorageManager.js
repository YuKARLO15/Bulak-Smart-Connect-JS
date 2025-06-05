class LocalStorageManager {
  constructor() {
    this.maxSize = 5 * 1024 * 1024; // 5MB in characters (rough estimate)
    this.warningThreshold = 0.8; // 80%
    this.criticalThreshold = 0.95; // 95%
    
    // Priority levels for data retention (lower number = higher priority)
    this.dataPriorities = {
      // Essential user data (highest priority)
      'token': 1,
      'currentUser': 1,
      'userProfile': 1,
      
      // Current application data (high priority)
      'currentApplicationId': 2,
      'applications': 2,
      'birthCertificateApplication': 2,
      'marriageFormData': 2,
      
      // User queues and appointments (medium priority)
      'userQueue': 3,
      'recentAppointments': 3,
      'pendingQueues': 3,
      'currentQueue': 3,
      
      // Settings and preferences (medium-low priority)
      'lastUsernameChange': 4,
      'visitedPrivacyPolicy': 4,
      'selectedBirthCertificateOption': 4,
      'selectedMarriageOption': 4,
      
      // Temporary and cache data (lowest priority)
      'tempFormData': 5,
      'draftApplications': 5,
      'uploadedFileCache': 5,
      'formValidationErrors': 5,
      'editingApplication': 5,
      'birthCertificateApplicationBackup': 5,
      'SeenAnnouncementIdsFab': 5
    };
  }

  // Calculate current localStorage usage
  getCurrentUsage() {
    try {
      let totalSize = 0;
      const items = {};
      
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          const size = localStorage[key].length;
          totalSize += size;
          items[key] = size;
        }
      }
      
      return {
        totalSize,
        items,
        percentage: (totalSize / this.maxSize) * 100,
        isNearFull: (totalSize / this.maxSize) > this.warningThreshold,
        isCritical: (totalSize / this.maxSize) > this.criticalThreshold
      };
    } catch (error) {
      console.error('Error calculating localStorage usage:', error);
      return { totalSize: 0, items: {}, percentage: 0, isNearFull: false, isCritical: false };
    }
  }

  // Clean up localStorage based on priority
  async performCleanup(targetReduction = 0.3) {
    console.log('🧹 Starting localStorage cleanup...');
    
    const beforeUsage = this.getCurrentUsage();
    console.log(`📊 Before cleanup: ${(beforeUsage.totalSize / 1024 / 1024).toFixed(2)}MB (${beforeUsage.percentage.toFixed(1)}%)`);
    
    const targetSize = beforeUsage.totalSize * (1 - targetReduction);
    let currentSize = beforeUsage.totalSize;
    
    // Step 1: Remove lowest priority items first
    const itemsByPriority = this.getItemsByPriority();
    
    for (let priority = 5; priority >= 3 && currentSize > targetSize; priority--) {
      const itemsToRemove = itemsByPriority[priority] || [];
      
      for (const key of itemsToRemove) {
        if (currentSize <= targetSize) break;
        
        const itemSize = localStorage.getItem(key)?.length || 0;
        localStorage.removeItem(key);
        currentSize -= itemSize;
        console.log(`🗑️ Removed ${key} (${(itemSize/1024).toFixed(1)}KB)`);
      }
    }
    
    // Step 2: Clean up old applications if still over target
    if (currentSize > targetSize) {
      await this.cleanupOldApplications(10); // Keep only 10 most recent
    }
    
    // Step 3: Clean up old appointments if still over target
    if (currentSize > targetSize) {
      await this.cleanupOldAppointments(5); // Keep only 5 most recent
    }
    
    const afterUsage = this.getCurrentUsage();
    console.log(`✅ After cleanup: ${(afterUsage.totalSize / 1024 / 1024).toFixed(2)}MB (${afterUsage.percentage.toFixed(1)}%)`);
    console.log(`💾 Freed up: ${((beforeUsage.totalSize - afterUsage.totalSize) / 1024 / 1024).toFixed(2)}MB`);
    
    return afterUsage;
  }

  // Get items organized by priority
  getItemsByPriority() {
    const itemsByPriority = {};
    
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        // Check for user-specific keys
        const baseKey = key.replace(/_[^_]+$/, ''); // Remove user suffixes
        const priority = this.dataPriorities[key] || this.dataPriorities[baseKey] || 5;
        
        if (!itemsByPriority[priority]) {
          itemsByPriority[priority] = [];
        }
        itemsByPriority[priority].push(key);
      }
    }
    
    return itemsByPriority;
  }

  // Clean up old applications, keeping only the most recent ones
  async cleanupOldApplications(keepCount = 10) {
    try {
      const applications = JSON.parse(localStorage.getItem('applications') || '[]');
      
      if (applications.length > keepCount) {
        // Sort by date and keep only the most recent
        const sortedApps = applications.sort((a, b) => {
          const dateA = new Date(a.lastUpdated || a.date || 0);
          const dateB = new Date(b.lastUpdated || b.date || 0);
          return dateB - dateA;
        });
        
        const recentApps = sortedApps.slice(0, keepCount);
        localStorage.setItem('applications', JSON.stringify(recentApps));
        
        console.log(`🗂️ Applications cleanup: kept ${recentApps.length} out of ${applications.length}`);
        return applications.length - recentApps.length;
      }
      
      return 0;
    } catch (error) {
      console.error('Error cleaning up applications:', error);
      return 0;
    }
  }

  // Clean up old appointments
  async cleanupOldAppointments(keepCount = 5) {
    try {
      const appointments = JSON.parse(localStorage.getItem('recentAppointments') || '[]');
      
      if (appointments.length > keepCount) {
        const recentAppointments = appointments.slice(0, keepCount);
        localStorage.setItem('recentAppointments', JSON.stringify(recentAppointments));
        
        console.log(`📅 Appointments cleanup: kept ${recentAppointments.length} out of ${appointments.length}`);
        return appointments.length - recentAppointments.length;
      }
      
      return 0;
    } catch (error) {
      console.error('Error cleaning up appointments:', error);
      return 0;
    }
  }

  // Safe localStorage.setItem with automatic cleanup
  async safeSetItem(key, value, retryCount = 0) {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError' && retryCount < 3) {
        console.warn(`💾 localStorage quota exceeded for key '${key}', attempting cleanup...`);
        
        // Perform cleanup
        await this.performCleanup(0.3);
        
        // Retry after cleanup
        return this.safeSetItem(key, value, retryCount + 1);
      } else {
        console.error(`❌ Failed to save to localStorage after ${retryCount} retries:`, error);
        
        // Try to save essential data only
        if (this.dataPriorities[key] <= 2) {
          console.log(`🆘 Attempting emergency save for critical data: ${key}`);
          await this.emergencySave(key, value);
        }
        
        return false;
      }
    }
  }

  // Emergency save for critical data
  async emergencySave(key, value) {
    try {
      // Clear all non-essential data
      const itemsByPriority = this.getItemsByPriority();
      
      // Remove all priority 4 and 5 items
      for (let priority = 5; priority >= 4; priority--) {
        const itemsToRemove = itemsByPriority[priority] || [];
        itemsToRemove.forEach(itemKey => {
          localStorage.removeItem(itemKey);
          console.log(`🆘 Emergency removal: ${itemKey}`);
        });
      }
      
      // Try to save again
      localStorage.setItem(key, value);
      console.log(`✅ Emergency save successful for: ${key}`);
      return true;
    } catch (error) {
      console.error(`❌ Emergency save failed for ${key}:`, error);
      return false;
    }
  }

  // Monitor localStorage usage
  startMonitoring() {
    // Check usage every 30 seconds
    setInterval(() => {
      const usage = this.getCurrentUsage();
      
      if (usage.isCritical) {
        console.warn(`🚨 localStorage usage critical: ${usage.percentage.toFixed(1)}%`);
        this.performCleanup(0.4); // More aggressive cleanup
      } else if (usage.isNearFull) {
        console.warn(`⚠️ localStorage usage high: ${usage.percentage.toFixed(1)}%`);
        this.performCleanup(0.2); // Light cleanup
      }
    }, 30000);
  }

  // Get storage usage report
  getUsageReport() {
    const usage = this.getCurrentUsage();
    const report = {
      total: `${(usage.totalSize / 1024 / 1024).toFixed(2)}MB`,
      percentage: `${usage.percentage.toFixed(1)}%`,
      status: usage.isCritical ? 'Critical' : usage.isNearFull ? 'Warning' : 'OK',
      largestItems: Object.entries(usage.items)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([key, size]) => ({
          key,
          size: `${(size / 1024).toFixed(1)}KB`
        }))
    };
    
    return report;
  }
}

export const localStorageManager = new LocalStorageManager();