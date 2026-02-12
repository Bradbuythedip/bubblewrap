// Main Application JavaScript

// App State
const app = {
  isOnline: navigator.onLine,
  isTWA: false,
  isInstalled: false,
  deferredPrompt: null,
  currentView: 'home'
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('[App] Initializing...');
  
  // Detect environment
  detectEnvironment();
  
  // Register service worker
  registerServiceWorker();
  
  // Setup splash screen
  setupSplashScreen();
  
  // Setup install prompt
  setupInstallPrompt();
  
  // Setup notifications
  setupNotifications();
  
  // Setup offline/online detection
  setupNetworkDetection();
  
  // Setup dark mode
  setupDarkMode();
  
  // Initialize pull-to-refresh
  setupPullToRefresh();
  
  // Setup haptic feedback
  setupHapticFeedback();
  
  console.log('[App] Initialized successfully');
});

// Detect if running in TWA or browser
function detectEnvironment() {
  // Check if running as TWA
  app.isTWA = document.referrer.includes('android-app://');
  
  // Check if running as installed PWA
  app.isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                    window.navigator.standalone === true;
  
  // Check browser
  const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
  
  console.log('[App] Environment:', {
    isTWA: app.isTWA,
    isInstalled: app.isInstalled,
    isChrome: isChrome,
    userAgent: navigator.userAgent
  });
  
  // Add environment classes to body
  if (app.isTWA) document.body.classList.add('twa');
  if (app.isInstalled) document.body.classList.add('installed');
  if (isChrome) document.body.classList.add('chrome');
}

// Register Service Worker
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js');
      console.log('[SW] Registered:', registration.scope);
      
      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('[SW] Update found');
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            showUpdateNotification();
          }
        });
      });
      
      // Check for updates periodically
      setInterval(() => {
        registration.update();
      }, 60000); // Check every minute
      
    } catch (error) {
      console.error('[SW] Registration failed:', error);
    }
  }
}

// Splash Screen
function setupSplashScreen() {
  const splashScreen = document.getElementById('splash-screen');
  const appContainer = document.getElementById('app');
  
  // Minimum splash time for smooth UX
  const minSplashTime = 1500;
  const startTime = Date.now();
  
  window.addEventListener('load', () => {
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, minSplashTime - elapsedTime);
    
    setTimeout(() => {
      splashScreen.classList.add('fade-out');
      appContainer.style.display = 'flex';
      
      // Remove splash screen from DOM after animation
      setTimeout(() => {
        splashScreen.remove();
      }, 300);
    }, remainingTime);
  });
}

// Install Prompt
function setupInstallPrompt() {
  const installBtn = document.getElementById('install-btn');
  const installPrompt = document.getElementById('install-prompt');
  const promptInstallBtn = document.getElementById('prompt-install');
  const promptCancelBtn = document.getElementById('prompt-cancel');
  
  // Listen for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    console.log('[Install] Prompt available');
    e.preventDefault();
    app.deferredPrompt = e;
    
    // Show install button
    if (installBtn) {
      installBtn.style.display = 'inline-flex';
    }
  });
  
  // Install button click
  if (installBtn) {
    installBtn.addEventListener('click', () => {
      if (installPrompt) {
        installPrompt.style.display = 'block';
      }
    });
  }
  
  // Prompt install button
  if (promptInstallBtn) {
    promptInstallBtn.addEventListener('click', async () => {
      if (!app.deferredPrompt) return;
      
      app.deferredPrompt.prompt();
      const { outcome } = await app.deferredPrompt.userChoice;
      
      console.log('[Install] User choice:', outcome);
      
      if (outcome === 'accepted') {
        console.log('[Install] PWA installed');
      }
      
      app.deferredPrompt = null;
      installPrompt.style.display = 'none';
    });
  }
  
  // Prompt cancel button
  if (promptCancelBtn) {
    promptCancelBtn.addEventListener('click', () => {
      installPrompt.style.display = 'none';
    });
  }
  
  // Listen for app installed event
  window.addEventListener('appinstalled', () => {
    console.log('[Install] PWA was installed');
    app.isInstalled = true;
    if (installBtn) installBtn.style.display = 'none';
    if (installPrompt) installPrompt.style.display = 'none';
  });
}

// Notifications
function setupNotifications() {
  const notifyBtn = document.getElementById('notify-btn');
  
  if (notifyBtn) {
    notifyBtn.addEventListener('click', async () => {
      if (!('Notification' in window)) {
        alert('This browser does not support notifications');
        return;
      }
      
      if (Notification.permission === 'granted') {
        showNotification('Notifications Enabled', 'You will receive updates');
        return;
      }
      
      if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        
        if (permission === 'granted') {
          showNotification('Notifications Enabled', 'You will receive updates');
          notifyBtn.textContent = 'Enabled';
          notifyBtn.disabled = true;
        }
      }
    });
    
    // Update button state
    if (Notification.permission === 'granted') {
      notifyBtn.textContent = 'Enabled';
      notifyBtn.disabled = true;
    }
  }
}

// Show notification
function showNotification(title, body, options = {}) {
  if ('serviceWorker' in navigator && Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then(registration => {
      registration.showNotification(title, {
        body: body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [200, 100, 200],
        tag: 'notification',
        ...options
      });
    });
  }
}

// Update notification
function showUpdateNotification() {
  if (Notification.permission === 'granted') {
    showNotification(
      'Update Available',
      'A new version is available. Refresh to update.',
      {
        actions: [
          { action: 'update', title: 'Update' },
          { action: 'dismiss', title: 'Dismiss' }
        ],
        requireInteraction: true
      }
    );
  }
}

// Network Detection
function setupNetworkDetection() {
  const showOfflineIndicator = () => {
    let indicator = document.querySelector('.offline-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'offline-indicator';
      indicator.textContent = 'You are offline';
      document.body.appendChild(indicator);
    }
    setTimeout(() => indicator.classList.add('show'), 100);
  };
  
  const hideOfflineIndicator = () => {
    const indicator = document.querySelector('.offline-indicator');
    if (indicator) {
      indicator.classList.remove('show');
      setTimeout(() => indicator.remove(), 300);
    }
  };
  
  window.addEventListener('online', () => {
    console.log('[Network] Back online');
    app.isOnline = true;
    hideOfflineIndicator();
    showNotification('Back Online', 'Internet connection restored');
  });
  
  window.addEventListener('offline', () => {
    console.log('[Network] Gone offline');
    app.isOnline = false;
    showOfflineIndicator();
  });
  
  // Check initial state
  if (!navigator.onLine) {
    showOfflineIndicator();
  }
}

// Dark Mode
function setupDarkMode() {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  
  // Check saved preference
  const savedTheme = localStorage.getItem('theme') || 'auto';
  applyTheme(savedTheme);
  
  if (darkModeToggle) {
    // Set initial state
    if (savedTheme === 'dark' || 
        (savedTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      darkModeToggle.checked = true;
    }
    
    darkModeToggle.addEventListener('change', (e) => {
      const theme = e.target.checked ? 'dark' : 'light';
      applyTheme(theme);
      localStorage.setItem('theme', theme);
    });
  }
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem('theme') === 'auto') {
      applyTheme('auto');
    }
  });
}

function applyTheme(theme) {
  if (theme === 'auto') {
    theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.documentElement.setAttribute('data-theme', theme);
}

// Pull to Refresh
function setupPullToRefresh() {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  
  let startY = 0;
  let pullDistance = 0;
  const threshold = 80;
  let isPulling = false;
  
  mainContent.addEventListener('touchstart', (e) => {
    if (mainContent.scrollTop === 0) {
      startY = e.touches[0].pageY;
      isPulling = true;
    }
  }, { passive: true });
  
  mainContent.addEventListener('touchmove', (e) => {
    if (!isPulling) return;
    
    const currentY = e.touches[0].pageY;
    pullDistance = currentY - startY;
    
    if (pullDistance > 0 && mainContent.scrollTop === 0) {
      // Visual feedback can be added here
    }
  }, { passive: true });
  
  mainContent.addEventListener('touchend', () => {
    if (isPulling && pullDistance > threshold) {
      // Trigger refresh
      refreshContent();
    }
    
    isPulling = false;
    pullDistance = 0;
  }, { passive: true });
}

async function refreshContent() {
  console.log('[Refresh] Refreshing content...');
  
  // Show loading state
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    mainContent.style.opacity = '0.6';
  }
  
  // Simulate refresh (replace with actual data fetching)
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Update service worker cache
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'CACHE_URLS',
      urls: [location.href]
    });
  }
  
  // Restore opacity
  if (mainContent) {
    mainContent.style.opacity = '1';
  }
  
  console.log('[Refresh] Content refreshed');
  
  // Haptic feedback
  triggerHaptic('light');
}

// Haptic Feedback
function setupHapticFeedback() {
  // Add haptic feedback to interactive elements
  const interactiveElements = document.querySelectorAll('button, .nav-item, .feature-card, .list-item');
  
  interactiveElements.forEach(element => {
    element.addEventListener('click', () => {
      triggerHaptic('light');
    });
  });
}

function triggerHaptic(intensity = 'light') {
  if (!('vibrate' in navigator)) return;
  
  const patterns = {
    light: 10,
    medium: 20,
    heavy: 30
  };
  
  navigator.vibrate(patterns[intensity] || patterns.light);
}

// Utility Functions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Lazy load images
function setupLazyLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        }
      });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// Analytics (placeholder)
function trackEvent(category, action, label) {
  console.log('[Analytics]', { category, action, label });
  // Implement your analytics here
}

// Error handling
window.addEventListener('error', (e) => {
  console.error('[Error]', e.error);
  // Report errors to your error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('[Promise Rejection]', e.reason);
  // Report promise rejections
});

// Export app for debugging
if (typeof window !== 'undefined') {
  window.app = app;
}

console.log('[App] Ready');
