# Mobile Optimization Guide

This guide covers all the mobile optimizations implemented in this PWA sample and best practices for creating a native-like mobile experience.

## Table of Contents

1. [Splash Screen Optimization](#splash-screen-optimization)
2. [Chrome Browser Default Configuration](#chrome-browser-default-configuration)
3. [Mobile-Intuitive Navigation](#mobile-intuitive-navigation)
4. [Touch Gestures](#touch-gestures)
5. [Performance Optimization](#performance-optimization)
6. [Responsive Design](#responsive-design)
7. [Accessibility](#accessibility)
8. [Progressive Enhancement](#progressive-enhancement)

---

## 1. Splash Screen Optimization

### Overview

A well-designed splash screen provides a smooth transition from app launch to content display, reducing perceived load time.

### Implementation

#### HTML Structure

```html
<div id="splash-screen" class="splash-screen">
  <div class="splash-content">
    <div class="splash-logo">
      <!-- Your logo SVG or image -->
    </div>
    <h1 class="splash-title">Your App Name</h1>
    <div class="splash-loader">
      <div class="loader-bar"></div>
    </div>
  </div>
</div>
```

#### CSS Styling

```css
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition: opacity 0.3s ease-out;
}

.splash-screen.fade-out {
  opacity: 0;
  visibility: hidden;
}
```

#### JavaScript Control

```javascript
function setupSplashScreen() {
  const splashScreen = document.getElementById('splash-screen');
  const appContainer = document.getElementById('app');
  
  // Minimum display time for smooth UX
  const minSplashTime = 1500;
  const startTime = Date.now();
  
  window.addEventListener('load', () => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minSplashTime - elapsed);
    
    setTimeout(() => {
      splashScreen.classList.add('fade-out');
      appContainer.style.display = 'flex';
      
      setTimeout(() => splashScreen.remove(), 300);
    }, remaining);
  });
}
```

### Manifest Configuration

```json
{
  "background_color": "#667eea",
  "theme_color": "#667eea"
}
```

### TWA Configuration

```json
{
  "backgroundColor": "#667eea",
  "themeColor": "#667eea",
  "splashScreenFadeOutDuration": 300
}
```

### Best Practices

✅ **DO:**
- Match splash screen colors with manifest
- Keep animation duration under 300ms
- Use vector graphics (SVG) for logo
- Provide loading indicator
- Match theme colors across all configs

❌ **DON'T:**
- Show splash screen for too long (>3s)
- Use heavy images that slow load
- Mismatch colors between configs
- Skip fade-out animation

### Testing

```javascript
// Test splash screen timing
const startTime = performance.now();
window.addEventListener('load', () => {
  const loadTime = performance.now() - startTime;
  console.log('Load time:', loadTime, 'ms');
});
```

---

## 2. Chrome Browser Default Configuration

### Overview

TWA (Trusted Web Activity) allows your PWA to run in Chrome without browser UI, creating a native app experience.

### TWA Manifest Configuration

```json
{
  "fallbackType": "customtabs",
  "features": {
    "locationDelegation": {
      "enabled": false
    },
    "playBilling": {
      "enabled": false
    }
  },
  "minSdkVersion": 19,
  "targetSdkVersion": 33
}
```

### Fallback Strategy

**Priority Order:**
1. **Chrome TWA** (preferred) - Full native experience
2. **Chrome Custom Tabs** - Chrome UI with customization
3. **System Default Browser** - Fallback for devices without Chrome

### JavaScript Detection

```javascript
function detectBrowserEnvironment() {
  const isTWA = document.referrer.includes('android-app://');
  const isChrome = /Chrome/.test(navigator.userAgent) && 
                   /Google Inc/.test(navigator.vendor);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  
  return { isTWA, isChrome, isStandalone };
}

// Adapt UI based on environment
const env = detectBrowserEnvironment();
if (env.isTWA) {
  document.body.classList.add('twa-mode');
  // Hide browser-specific UI elements
}
```

### Digital Asset Links (Required)

**Location:** `https://your-domain.com/.well-known/assetlinks.json`

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.example.app",
    "sha256_cert_fingerprints": [
      "YOUR_SHA256_FINGERPRINT"
    ]
  }
}]
```

### Verification

```bash
# Test asset links
curl https://your-domain.com/.well-known/assetlinks.json

# Verify with Google's tool
https://developers.google.com/digital-asset-links/tools/generator
```

### Best Practices

✅ **DO:**
- Set `fallbackType` to `"customtabs"`
- Verify Digital Asset Links work
- Test on devices with and without Chrome
- Use HTTPS for all assets

❌ **DON'T:**
- Assume Chrome is always available
- Skip Digital Asset Links setup
- Use self-signed SSL certificates
- Rely on browser-specific features

---

## 3. Mobile-Intuitive Navigation

### Bottom Navigation Bar

**Why Bottom Navigation?**
- Easier thumb access on large phones
- Follows Material Design guidelines
- Familiar pattern for mobile users

#### HTML Structure

```html
<nav class="bottom-nav">
  <button class="nav-item active" data-view="home">
    <svg class="nav-icon"><!-- Icon --></svg>
    <span class="nav-label">Home</span>
  </button>
  <button class="nav-item" data-view="explore">
    <svg class="nav-icon"><!-- Icon --></svg>
    <span class="nav-label">Explore</span>
  </button>
  <button class="nav-item" data-view="profile">
    <svg class="nav-icon"><!-- Icon --></svg>
    <span class="nav-label">Profile</span>
  </button>
</nav>
```

#### CSS Styling

```css
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: var(--surface-color);
  border-top: 1px solid var(--border-color);
  display: flex;
  justify-content: space-around;
  padding-bottom: env(safe-area-inset-bottom);
  z-index: 100;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: none;
  background: transparent;
  color: var(--text-tertiary);
  min-height: 56px;
}

.nav-item.active {
  color: var(--primary-color);
}
```

### Touch Target Sizes

**Minimum sizes:**
- Buttons: 48x48dp (44x44px)
- Icons: 24x24dp
- Touch targets: 48x48dp minimum

```css
button, a, input {
  min-height: 44px;
  min-width: 44px;
}
```

### Safe Area Support (Notch Devices)

```css
/* iOS notch support */
@supports (padding: env(safe-area-inset-top)) {
  .app-header {
    padding-top: env(safe-area-inset-top);
    height: calc(var(--header-height) + env(safe-area-inset-top));
  }
  
  .bottom-nav {
    padding-bottom: env(safe-area-inset-bottom);
    height: calc(var(--bottom-nav-height) + env(safe-area-inset-bottom));
  }
}
```

### Viewport Configuration

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no">
```

---

## 4. Touch Gestures

### Swipe Navigation

```javascript
let touchStartX = 0;
let touchEndX = 0;

element.addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
}, { passive: true });

element.addEventListener('touchend', e => {
  touchEndX = e.changedTouches[0].clientX;
  handleSwipe();
}, { passive: true });

function handleSwipe() {
  const diff = touchStartX - touchEndX;
  const threshold = 50;
  
  if (Math.abs(diff) > threshold) {
    if (diff > 0) {
      // Swipe left
      navigateNext();
    } else {
      // Swipe right
      navigatePrevious();
    }
  }
}
```

### Long Press

```javascript
let pressTimer;

element.addEventListener('touchstart', e => {
  pressTimer = setTimeout(() => {
    handleLongPress(e);
  }, 500);
}, { passive: true });

element.addEventListener('touchend', () => {
  clearTimeout(pressTimer);
}, { passive: true });
```

### Double Tap

```javascript
let lastTap = 0;

element.addEventListener('touchend', e => {
  const currentTime = Date.now();
  const tapLength = currentTime - lastTap;
  
  if (tapLength < 300 && tapLength > 0) {
    handleDoubleTap(e);
  }
  
  lastTap = currentTime;
});
```

### Pinch Zoom

```javascript
let initialDistance = 0;

element.addEventListener('touchstart', e => {
  if (e.touches.length === 2) {
    initialDistance = getDistance(e.touches[0], e.touches[1]);
  }
}, { passive: true });

element.addEventListener('touchmove', e => {
  if (e.touches.length === 2) {
    const currentDistance = getDistance(e.touches[0], e.touches[1]);
    const scale = currentDistance / initialDistance;
    element.style.transform = `scale(${scale})`;
  }
}, { passive: false });
```

### Pull to Refresh

```javascript
let startY = 0;
let pullDistance = 0;

scrollContainer.addEventListener('touchstart', e => {
  if (scrollContainer.scrollTop === 0) {
    startY = e.touches[0].pageY;
  }
}, { passive: true });

scrollContainer.addEventListener('touchmove', e => {
  if (scrollContainer.scrollTop === 0) {
    pullDistance = e.touches[0].pageY - startY;
    
    if (pullDistance > 80) {
      // Trigger refresh
    }
  }
}, { passive: true });
```

---

## 5. Performance Optimization

### Service Worker Caching

```javascript
const CACHE_NAME = 'pwa-cache-v1';
const ASSETS = [
  '/',
  '/css/main.css',
  '/js/app.js',
  '/icons/icon-192x192.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

### Lazy Loading Images

```javascript
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        imageObserver.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}
```

### Hardware Acceleration

```css
.accelerated {
  transform: translateZ(0);
  will-change: transform;
  backface-visibility: hidden;
}
```

### Debounce & Throttle

```javascript
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
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
```

---

## 6. Responsive Design

### Mobile-First Approach

```css
/* Base styles for mobile */
.container {
  padding: 16px;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    padding: 24px;
    max-width: 768px;
    margin: 0 auto;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 32px;
    max-width: 1024px;
  }
}
```

### Flexible Grid

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}
```

### Viewport Units

```css
.full-height {
  height: 100vh;
  /* Account for mobile browser bars */
  height: calc(var(--vh, 1vh) * 100);
}
```

```javascript
// Fix for mobile viewport height
const vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

window.addEventListener('resize', () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
});
```

---

## 7. Accessibility

### Screen Reader Support

```html
<button aria-label="Close menu">
  <svg aria-hidden="true"><!-- Icon --></svg>
</button>

<div role="alert" aria-live="polite">
  Content updated
</div>
```

### Focus Management

```css
button:focus-visible {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}
```

### Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 8. Progressive Enhancement

### Feature Detection

```javascript
// Check for service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// Check for notifications
if ('Notification' in window) {
  Notification.requestPermission();
}

// Check for Web Share
if (navigator.share) {
  navigator.share({ title, text, url });
}
```

### Fallbacks

```javascript
// Clipboard with fallback
if (navigator.clipboard) {
  navigator.clipboard.writeText(text);
} else {
  // Fallback method
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  textarea.remove();
}
```

---

## Performance Checklist

- [ ] Lighthouse PWA score 90+
- [ ] First Contentful Paint < 1.8s
- [ ] Time to Interactive < 3.8s
- [ ] Service worker caching implemented
- [ ] Images lazy loaded
- [ ] CSS minified and inlined (critical)
- [ ] JavaScript code-split
- [ ] Gzip/Brotli compression enabled
- [ ] HTTP/2 enabled
- [ ] Resource hints used (preload, prefetch)

## Mobile UX Checklist

- [ ] Touch targets minimum 48x48dp
- [ ] Bottom navigation implemented
- [ ] Swipe gestures work smoothly
- [ ] Pull-to-refresh functional
- [ ] Safe area insets supported
- [ ] Haptic feedback on interactions
- [ ] Splash screen optimized
- [ ] Offline functionality works
- [ ] Responsive on all screen sizes
- [ ] No horizontal scrolling

---

## Resources

- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
- [Material Design Guidelines](https://material.io/design)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Can I Use](https://caniuse.com/)

---

**Next:** See [DEPLOYMENT.md](./DEPLOYMENT.md) for publishing your optimized PWA.
