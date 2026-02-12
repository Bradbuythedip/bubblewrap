// Gesture Handling for Mobile Optimization

// Gesture state
const gestures = {
  touchStartX: 0,
  touchStartY: 0,
  touchEndX: 0,
  touchEndY: 0,
  touchStartTime: 0,
  isSwipeEnabled: true,
  swipeThreshold: 50,
  velocityThreshold: 0.3,
  longPressThreshold: 500,
  longPressTimer: null
};

// Initialize gestures when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('[Gestures] Initializing...');
  setupSwipeGestures();
  setupLongPress();
  setupDoubleTap();
  setupPinchZoom();
  console.log('[Gestures] Ready');
});

// Swipe Gestures
function setupSwipeGestures() {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;
  
  mainContent.addEventListener('touchstart', handleTouchStart, { passive: true });
  mainContent.addEventListener('touchmove', handleTouchMove, { passive: false });
  mainContent.addEventListener('touchend', handleTouchEnd, { passive: true });
  mainContent.addEventListener('touchcancel', handleTouchCancel, { passive: true });
}

function handleTouchStart(e) {
  gestures.touchStartX = e.touches[0].clientX;
  gestures.touchStartY = e.touches[0].clientY;
  gestures.touchStartTime = Date.now();
  
  // Clear any existing long press timer
  if (gestures.longPressTimer) {
    clearTimeout(gestures.longPressTimer);
  }
}

function handleTouchMove(e) {
  // Clear long press timer on move
  if (gestures.longPressTimer) {
    clearTimeout(gestures.longPressTimer);
    gestures.longPressTimer = null;
  }
  
  // Prevent default for horizontal swipes to avoid browser navigation
  const deltaX = Math.abs(e.touches[0].clientX - gestures.touchStartX);
  const deltaY = Math.abs(e.touches[0].clientY - gestures.touchStartY);
  
  if (deltaX > deltaY && deltaX > 10) {
    // Horizontal swipe detected
    e.preventDefault();
  }
}

function handleTouchEnd(e) {
  gestures.touchEndX = e.changedTouches[0].clientX;
  gestures.touchEndY = e.changedTouches[0].clientY;
  
  const deltaX = gestures.touchEndX - gestures.touchStartX;
  const deltaY = gestures.touchEndY - gestures.touchStartY;
  const deltaTime = Date.now() - gestures.touchStartTime;
  
  // Calculate velocity
  const velocityX = Math.abs(deltaX) / deltaTime;
  const velocityY = Math.abs(deltaY) / deltaTime;
  
  // Determine swipe direction
  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal swipe
    if (Math.abs(deltaX) > gestures.swipeThreshold || velocityX > gestures.velocityThreshold) {
      if (deltaX > 0) {
        handleSwipeRight();
      } else {
        handleSwipeLeft();
      }
    }
  } else {
    // Vertical swipe
    if (Math.abs(deltaY) > gestures.swipeThreshold || velocityY > gestures.velocityThreshold) {
      if (deltaY > 0) {
        handleSwipeDown();
      } else {
        handleSwipeUp();
      }
    }
  }
  
  // Clear long press timer
  if (gestures.longPressTimer) {
    clearTimeout(gestures.longPressTimer);
    gestures.longPressTimer = null;
  }
}

function handleTouchCancel() {
  // Reset gesture state
  gestures.touchStartX = 0;
  gestures.touchStartY = 0;
  gestures.touchEndX = 0;
  gestures.touchEndY = 0;
  
  if (gestures.longPressTimer) {
    clearTimeout(gestures.longPressTimer);
    gestures.longPressTimer = null;
  }
}

// Swipe direction handlers
function handleSwipeLeft() {
  console.log('[Gestures] Swipe left');
  
  if (!gestures.isSwipeEnabled) return;
  
  // Navigate to next view
  const views = ['home', 'explore', 'profile'];
  const currentIndex = views.indexOf(window.navigation?.currentView || 'home');
  const nextIndex = (currentIndex + 1) % views.length;
  
  if (typeof navigateTo === 'function') {
    navigateTo(views[nextIndex]);
  }
  
  triggerHaptic('light');
  showSwipeIndicator('left');
  
  trackEvent('gesture', 'swipe', 'left');
}

function handleSwipeRight() {
  console.log('[Gestures] Swipe right');
  
  if (!gestures.isSwipeEnabled) return;
  
  // Navigate to previous view
  const views = ['home', 'explore', 'profile'];
  const currentIndex = views.indexOf(window.navigation?.currentView || 'home');
  const prevIndex = (currentIndex - 1 + views.length) % views.length;
  
  if (typeof navigateTo === 'function') {
    navigateTo(views[prevIndex]);
  }
  
  triggerHaptic('light');
  showSwipeIndicator('right');
  
  trackEvent('gesture', 'swipe', 'right');
}

function handleSwipeUp() {
  console.log('[Gestures] Swipe up');
  
  // Could be used for revealing more content or modal
  trackEvent('gesture', 'swipe', 'up');
}

function handleSwipeDown() {
  console.log('[Gestures] Swipe down');
  
  // Could trigger refresh or dismiss
  const mainContent = document.getElementById('main-content');
  if (mainContent && mainContent.scrollTop === 0) {
    // Trigger pull-to-refresh
    if (typeof refreshContent === 'function') {
      refreshContent();
    }
  }
  
  trackEvent('gesture', 'swipe', 'down');
}

// Show visual swipe indicator
function showSwipeIndicator(direction) {
  const indicator = document.createElement('div');
  indicator.className = `swipe-indicator ${direction}`;
  
  const arrow = direction === 'left' ? '←' : '→';
  indicator.innerHTML = `<span style="font-size: 24px;">${arrow}</span>`;
  
  document.body.appendChild(indicator);
  
  setTimeout(() => indicator.classList.add('active'), 10);
  
  setTimeout(() => {
    indicator.classList.remove('active');
    setTimeout(() => indicator.remove(), 200);
  }, 300);
}

// Long Press
function setupLongPress() {
  const longPressElements = document.querySelectorAll('.feature-card, .list-item');
  
  longPressElements.forEach(element => {
    element.addEventListener('touchstart', (e) => {
      gestures.longPressTimer = setTimeout(() => {
        handleLongPress(element, e);
      }, gestures.longPressThreshold);
    }, { passive: true });
    
    element.addEventListener('touchend', () => {
      if (gestures.longPressTimer) {
        clearTimeout(gestures.longPressTimer);
        gestures.longPressTimer = null;
      }
    }, { passive: true });
    
    element.addEventListener('touchmove', () => {
      if (gestures.longPressTimer) {
        clearTimeout(gestures.longPressTimer);
        gestures.longPressTimer = null;
      }
    }, { passive: true });
  });
}

function handleLongPress(element, event) {
  console.log('[Gestures] Long press detected');
  
  // Visual feedback
  element.style.transform = 'scale(0.95)';
  setTimeout(() => {
    element.style.transform = '';
  }, 200);
  
  // Haptic feedback
  triggerHaptic('medium');
  
  // Show context menu
  showContextMenu(element, event);
  
  trackEvent('gesture', 'long_press', element.className);
}

// Context Menu
function showContextMenu(element, event) {
  // Remove any existing context menu
  const existingMenu = document.querySelector('.context-menu');
  if (existingMenu) {
    existingMenu.remove();
  }
  
  const menu = document.createElement('div');
  menu.className = 'context-menu';
  menu.innerHTML = `
    <button class="context-menu-item">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
      <span>View Details</span>
    </button>
    <button class="context-menu-item">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="18" cy="5" r="3"></circle>
        <circle cx="6" cy="12" r="3"></circle>
        <circle cx="18" cy="19" r="3"></circle>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
      </svg>
      <span>Share</span>
    </button>
    <button class="context-menu-item">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
      <span>Save</span>
    </button>
  `;
  
  // Position menu
  const touch = event.touches[0];
  menu.style.cssText = `
    position: fixed;
    top: ${touch.clientY}px;
    left: ${touch.clientX}px;
    transform: translate(-50%, -100%);
    background: var(--surface-color);
    border-radius: var(--border-radius-md);
    box-shadow: var(--shadow-lg);
    z-index: 10000;
    padding: var(--spacing-sm);
    min-width: 200px;
    animation: scaleIn 0.2s ease;
  `;
  
  document.body.appendChild(menu);
  
  // Add event listeners to menu items
  const menuItems = menu.querySelectorAll('.context-menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      const action = item.textContent.trim();
      handleContextMenuAction(action, element);
      menu.remove();
    });
  });
  
  // Close menu on outside click
  setTimeout(() => {
    document.addEventListener('click', function closeMenu() {
      menu.remove();
      document.removeEventListener('click', closeMenu);
    });
  }, 100);
}

function handleContextMenuAction(action, element) {
  console.log('[Gestures] Context menu action:', action);
  
  switch (action) {
    case 'View Details':
      alert(`Viewing details for: ${element.querySelector('h4')?.textContent || 'Item'}`);
      break;
    case 'Share':
      shareContent(element);
      break;
    case 'Save':
      saveItem(element);
      break;
  }
  
  triggerHaptic('light');
}

// Double Tap
function setupDoubleTap() {
  let lastTap = 0;
  let tapTimeout = null;
  
  const doubleTapElements = document.querySelectorAll('.feature-card, .hero-card');
  
  doubleTapElements.forEach(element => {
    element.addEventListener('touchend', (e) => {
      const currentTime = Date.now();
      const tapLength = currentTime - lastTap;
      
      if (tapLength < 300 && tapLength > 0) {
        // Double tap detected
        handleDoubleTap(element, e);
        e.preventDefault();
      }
      
      lastTap = currentTime;
    }, { passive: false });
  });
}

function handleDoubleTap(element, event) {
  console.log('[Gestures] Double tap detected');
  
  // Visual feedback - quick scale animation
  element.style.transition = 'transform 0.1s ease';
  element.style.transform = 'scale(0.95)';
  
  setTimeout(() => {
    element.style.transform = 'scale(1.05)';
  }, 100);
  
  setTimeout(() => {
    element.style.transform = '';
  }, 200);
  
  // Haptic feedback
  triggerHaptic('medium');
  
  // Action - could be like/favorite
  toggleFavorite(element);
  
  trackEvent('gesture', 'double_tap', element.className);
}

function toggleFavorite(element) {
  const isFavorite = element.classList.toggle('favorite');
  
  // Show heart animation
  showHeartAnimation(element, isFavorite);
  
  console.log('[Gestures] Favorite toggled:', isFavorite);
}

function showHeartAnimation(element, isFavorite) {
  const heart = document.createElement('div');
  heart.innerHTML = isFavorite ? '❤️' : '💔';
  heart.style.cssText = `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 48px;
    animation: heartPop 0.5s ease;
    pointer-events: none;
    z-index: 1000;
  `;
  
  element.style.position = 'relative';
  element.appendChild(heart);
  
  setTimeout(() => heart.remove(), 500);
}

// Pinch Zoom (for images or specific content)
function setupPinchZoom() {
  let initialDistance = 0;
  let currentScale = 1;
  
  const zoomableElements = document.querySelectorAll('.zoomable');
  
  zoomableElements.forEach(element => {
    element.addEventListener('touchstart', (e) => {
      if (e.touches.length === 2) {
        initialDistance = getDistance(e.touches[0], e.touches[1]);
        currentScale = parseFloat(element.dataset.scale || 1);
      }
    }, { passive: true });
    
    element.addEventListener('touchmove', (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        const scale = currentScale * (currentDistance / initialDistance);
        
        // Limit scale between 1 and 4
        const limitedScale = Math.min(Math.max(scale, 1), 4);
        
        element.style.transform = `scale(${limitedScale})`;
        element.dataset.scale = limitedScale;
      }
    }, { passive: false });
    
    element.addEventListener('touchend', () => {
      initialDistance = 0;
    }, { passive: true });
  });
}

function getDistance(touch1, touch2) {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

// Share content
async function shareContent(element) {
  const title = element.querySelector('h4')?.textContent || 'Mobile PWA';
  const text = element.querySelector('p')?.textContent || 'Check out this mobile PWA!';
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: title,
        text: text,
        url: window.location.href
      });
      console.log('[Gestures] Content shared successfully');
      triggerHaptic('medium');
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('[Gestures] Share failed:', error);
      }
    }
  } else {
    // Fallback - copy to clipboard
    const textToCopy = `${title}\n${text}\n${window.location.href}`;
    copyToClipboard(textToCopy);
    alert('Link copied to clipboard!');
  }
}

// Save item
function saveItem(element) {
  const title = element.querySelector('h4')?.textContent || 'Item';
  
  // Add saved state
  element.classList.add('saved');
  
  // Show notification
  if (typeof showNotification === 'function') {
    showNotification('Saved', `${title} has been saved`);
  }
  
  console.log('[Gestures] Item saved:', title);
  triggerHaptic('medium');
}

// Copy to clipboard
function copyToClipboard(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('[Gestures] Copied to clipboard');
    }).catch(err => {
      console.error('[Gestures] Failed to copy:', err);
    });
  } else {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    textarea.remove();
  }
}

// Add CSS animations
const gestureStyles = document.createElement('style');
gestureStyles.textContent = `
  @keyframes scaleIn {
    from { transform: translate(-50%, -100%) scale(0.8); opacity: 0; }
    to { transform: translate(-50%, -100%) scale(1); opacity: 1; }
  }
  
  @keyframes heartPop {
    0% { transform: translate(-50%, -50%) scale(0); opacity: 1; }
    50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
    100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
  }
  
  .context-menu-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    border: none;
    background: transparent;
    color: var(--text-primary);
    font-size: 16px;
    cursor: pointer;
    border-radius: var(--border-radius-sm);
    width: 100%;
    text-align: left;
  }
  
  .context-menu-item:active {
    background: var(--border-color);
  }
  
  .favorite {
    border: 2px solid var(--primary-color);
  }
  
  .saved {
    opacity: 0.7;
  }
`;

document.head.appendChild(gestureStyles);

// Export gestures for debugging
if (typeof window !== 'undefined') {
  window.gestures = gestures;
}

console.log('[Gestures] Module loaded');
