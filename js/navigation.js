// Navigation Management

// Navigation state
const navigation = {
  currentView: 'home',
  history: ['home'],
  viewCache: new Map()
};

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('[Navigation] Initializing...');
  setupNavigation();
  handleDeepLinks();
});

// Setup navigation handlers
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const views = document.querySelectorAll('.view');
  
  // Navigation item click handlers
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const viewName = item.dataset.view;
      if (viewName) {
        navigateTo(viewName);
        triggerHaptic('light');
      }
    });
  });
  
  // Handle browser back button
  window.addEventListener('popstate', (e) => {
    const viewName = e.state?.view || 'home';
    navigateTo(viewName, false);
  });
  
  // Handle initial route
  const initialView = getInitialView();
  if (initialView !== 'home') {
    navigateTo(initialView, false);
  }
}

// Navigate to a view
function navigateTo(viewName, updateHistory = true) {
  console.log('[Navigation] Navigate to:', viewName);
  
  const views = document.querySelectorAll('.view');
  const navItems = document.querySelectorAll('.nav-item');
  const headerTitle = document.querySelector('.header-title');
  
  // Deactivate all views and nav items
  views.forEach(view => view.classList.remove('active'));
  navItems.forEach(item => item.classList.remove('active'));
  
  // Activate target view and nav item
  const targetView = document.getElementById(`${viewName}-view`);
  const targetNavItem = document.querySelector(`[data-view="${viewName}"]`);
  
  if (targetView) {
    targetView.classList.add('active');
    
    // Update header title
    if (headerTitle) {
      headerTitle.textContent = capitalizeFirstLetter(viewName);
    }
    
    // Scroll to top
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }
  
  if (targetNavItem) {
    targetNavItem.classList.add('active');
  }
  
  // Update navigation state
  navigation.currentView = viewName;
  
  // Update history
  if (updateHistory) {
    const url = new URL(window.location);
    url.searchParams.set('view', viewName);
    window.history.pushState({ view: viewName }, '', url);
    navigation.history.push(viewName);
  }
  
  // Track page view
  trackEvent('navigation', 'view_change', viewName);
  
  // Load view data if needed
  loadViewData(viewName);
  
  // Announce to screen readers
  announceNavigation(viewName);
}

// Get initial view from URL or storage
function getInitialView() {
  // Check URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const viewParam = urlParams.get('view');
  
  if (viewParam && isValidView(viewParam)) {
    return viewParam;
  }
  
  // Check saved state
  const savedView = sessionStorage.getItem('currentView');
  if (savedView && isValidView(savedView)) {
    return savedView;
  }
  
  return 'home';
}

// Validate view name
function isValidView(viewName) {
  const validViews = ['home', 'explore', 'profile'];
  return validViews.includes(viewName);
}

// Load view-specific data
async function loadViewData(viewName) {
  // Check cache first
  if (navigation.viewCache.has(viewName)) {
    console.log('[Navigation] Using cached data for:', viewName);
    return navigation.viewCache.get(viewName);
  }
  
  console.log('[Navigation] Loading data for:', viewName);
  
  try {
    // Simulate API call (replace with actual data fetching)
    const data = await fetchViewData(viewName);
    navigation.viewCache.set(viewName, data);
    
    // Render data
    renderViewData(viewName, data);
    
    return data;
  } catch (error) {
    console.error('[Navigation] Failed to load view data:', error);
    showError('Failed to load content');
  }
}

// Fetch view data (placeholder)
async function fetchViewData(viewName) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Return mock data
  return {
    view: viewName,
    timestamp: Date.now(),
    data: {}
  };
}

// Render view data
function renderViewData(viewName, data) {
  console.log('[Navigation] Rendering data for:', viewName, data);
  
  // View-specific rendering logic
  switch (viewName) {
    case 'home':
      renderHomeView(data);
      break;
    case 'explore':
      renderExploreView(data);
      break;
    case 'profile':
      renderProfileView(data);
      break;
  }
}

// View-specific renderers
function renderHomeView(data) {
  // Home view is already rendered in HTML
  // Add dynamic content here if needed
}

function renderExploreView(data) {
  // Explore view rendering
  // Can add dynamic search results, etc.
}

function renderProfileView(data) {
  // Profile view rendering
  // Can add user-specific data
}

// Handle deep links
function handleDeepLinks() {
  // Check for deep link parameters
  const urlParams = new URLSearchParams(window.location.search);
  
  // Handle specific actions
  const action = urlParams.get('action');
  if (action) {
    handleDeepLinkAction(action);
  }
  
  // Handle shared content
  if (urlParams.has('title') || urlParams.has('text') || urlParams.has('url')) {
    handleSharedContent({
      title: urlParams.get('title'),
      text: urlParams.get('text'),
      url: urlParams.get('url')
    });
  }
}

// Handle deep link actions
function handleDeepLinkAction(action) {
  console.log('[Navigation] Handling deep link action:', action);
  
  switch (action) {
    case 'explore':
      navigateTo('explore');
      break;
    case 'profile':
      navigateTo('profile');
      break;
    default:
      console.warn('[Navigation] Unknown action:', action);
  }
}

// Handle shared content (Web Share Target API)
function handleSharedContent(content) {
  console.log('[Navigation] Handling shared content:', content);
  
  // Show notification
  if (content.title || content.text) {
    showNotification(
      'Content Shared',
      content.title || content.text || 'New content received'
    );
  }
  
  // Navigate to appropriate view
  navigateTo('home');
  
  // Process shared content
  // Add your logic here
}

// Transition animations
function animateViewTransition(fromView, toView, direction = 'forward') {
  const transitions = {
    forward: {
      from: { transform: 'translateX(0)', opacity: '1' },
      to: { transform: 'translateX(-100%)', opacity: '0' }
    },
    backward: {
      from: { transform: 'translateX(0)', opacity: '1' },
      to: { transform: 'translateX(100%)', opacity: '0' }
    }
  };
  
  // Apply transition
  // Implementation depends on your animation library
}

// Menu handling
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.menu-btn');
  
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      toggleMenu();
      triggerHaptic('medium');
    });
  }
});

// Toggle side menu
function toggleMenu() {
  console.log('[Navigation] Toggle menu');
  
  let menu = document.querySelector('.side-menu');
  
  if (!menu) {
    menu = createSideMenu();
    document.body.appendChild(menu);
  }
  
  menu.classList.toggle('open');
  
  // Add overlay
  if (menu.classList.contains('open')) {
    showMenuOverlay();
  } else {
    hideMenuOverlay();
  }
}

// Create side menu
function createSideMenu() {
  const menu = document.createElement('nav');
  menu.className = 'side-menu';
  menu.innerHTML = `
    <div class="menu-header">
      <h2>Menu</h2>
      <button class="close-menu-btn" aria-label="Close menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
    <div class="menu-items">
      <button class="menu-item" data-action="home">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        </svg>
        <span>Home</span>
      </button>
      <button class="menu-item" data-action="settings">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M12 1v6m0 6v6m7.07-13.07l-4.24 4.24m-5.66 5.66l-4.24 4.24m16.97-1.41l-6-6m-6-6l-6-6"></path>
        </svg>
        <span>Settings</span>
      </button>
      <button class="menu-item" data-action="about">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
        <span>About</span>
      </button>
    </div>
  `;
  
  // Add event listeners
  const closeBtn = menu.querySelector('.close-menu-btn');
  closeBtn.addEventListener('click', () => {
    toggleMenu();
  });
  
  const menuItems = menu.querySelectorAll('.menu-item');
  menuItems.forEach(item => {
    item.addEventListener('click', () => {
      const action = item.dataset.action;
      handleMenuAction(action);
      toggleMenu();
    });
  });
  
  return menu;
}

// Show menu overlay
function showMenuOverlay() {
  let overlay = document.querySelector('.menu-overlay');
  
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    overlay.addEventListener('click', () => {
      toggleMenu();
    });
    document.body.appendChild(overlay);
  }
  
  setTimeout(() => overlay.classList.add('visible'), 10);
}

// Hide menu overlay
function hideMenuOverlay() {
  const overlay = document.querySelector('.menu-overlay');
  if (overlay) {
    overlay.classList.remove('visible');
    setTimeout(() => overlay.remove(), 300);
  }
}

// Handle menu actions
function handleMenuAction(action) {
  console.log('[Navigation] Menu action:', action);
  
  switch (action) {
    case 'home':
      navigateTo('home');
      break;
    case 'settings':
      navigateTo('profile');
      break;
    case 'about':
      showAboutDialog();
      break;
    default:
      console.warn('[Navigation] Unknown menu action:', action);
  }
}

// Show about dialog
function showAboutDialog() {
  alert('Mobile PWA Demo v1.0.0\n\nA highly optimized Progressive Web App with Bubblewrap integration.');
}

// Show error message
function showError(message) {
  console.error('[Navigation] Error:', message);
  
  // Create error toast
  const toast = document.createElement('div');
  toast.className = 'error-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: calc(var(--bottom-nav-height) + 16px);
    left: 16px;
    right: 16px;
    background: #ef4444;
    color: white;
    padding: 16px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 10000;
    animation: slideUp 0.3s ease;
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Announce to screen readers
function announceNavigation(viewName) {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.className = 'sr-only';
  announcement.textContent = `Navigated to ${capitalizeFirstLetter(viewName)}`;
  
  document.body.appendChild(announcement);
  
  setTimeout(() => announcement.remove(), 1000);
}

// Utility function
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Add styles for menu
const menuStyles = document.createElement('style');
menuStyles.textContent = `
  .side-menu {
    position: fixed;
    top: 0;
    left: 0;
    width: 280px;
    height: 100vh;
    background: var(--surface-color);
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 10000;
    padding: var(--spacing-md);
  }
  
  .side-menu.open {
    transform: translateX(0);
  }
  
  .menu-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
    padding-bottom: var(--spacing-md);
    border-bottom: 1px solid var(--border-color);
  }
  
  .menu-header h2 {
    font-size: 24px;
    font-weight: 700;
  }
  
  .close-menu-btn {
    width: 40px;
    height: 40px;
    border: none;
    background: transparent;
    color: var(--text-primary);
    cursor: pointer;
    border-radius: 50%;
  }
  
  .close-menu-btn:active {
    background: var(--border-color);
  }
  
  .menu-items {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .menu-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    border: none;
    background: transparent;
    color: var(--text-primary);
    font-size: 16px;
    text-align: left;
    cursor: pointer;
    border-radius: var(--border-radius-md);
    min-height: 56px;
  }
  
  .menu-item:active {
    background: var(--border-color);
  }
  
  .menu-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  .menu-overlay.visible {
    opacity: 1;
  }
  
  @keyframes slideDown {
    from { transform: translateY(0); opacity: 1; }
    to { transform: translateY(20px); opacity: 0; }
  }
`;

document.head.appendChild(menuStyles);

// Export navigation for debugging
if (typeof window !== 'undefined') {
  window.navigation = navigation;
}

console.log('[Navigation] Ready');
