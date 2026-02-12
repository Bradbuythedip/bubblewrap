# Quick Start Guide

Get up and running with the mobile-optimized PWA in 5 minutes!

## Prerequisites

- Node.js 14+ installed
- Basic understanding of PWAs
- (Optional) Android device or emulator for testing

## Installation

### 1. Clone or Download

```bash
# If using git
git clone <your-repo-url>
cd pwa-bubblewrap-sample

# Or download and extract ZIP
```

### 2. Install Dependencies

```bash
npm install
```

This installs:
- `http-server` - Local development server
- `@bubblewrap/cli` - PWA to Android converter
- `lighthouse` - PWA testing tool

### 3. Start Development Server

```bash
npm start
```

This will:
- Start server on http://localhost:8080
- Automatically open in your browser
- Enable hot reload (restart server to see changes)

### 4. View the PWA

Open your browser to:
```
http://localhost:8080
```

**Test on mobile:**
1. Find your computer's local IP (e.g., 192.168.1.100)
2. On your phone's browser, visit: `http://192.168.1.100:8080`
3. Test mobile features like gestures and navigation

## Project Structure

```
pwa-bubblewrap-sample/
├── public/               # PWA files (HTML, CSS, JS)
│   ├── index.html       # Main HTML file
│   ├── manifest.json    # PWA manifest
│   ├── service-worker.js # Offline functionality
│   ├── icons/           # App icons (to be generated)
│   └── splash/          # Splash screens (to be generated)
├── css/                 # Stylesheets
│   ├── main.css         # Main styles
│   └── mobile.css       # Mobile-specific styles
├── js/                  # JavaScript files
│   ├── app.js           # Core application logic
│   ├── navigation.js    # Navigation handling
│   └── gestures.js      # Touch gesture handling
├── docs/                # Documentation
│   ├── BUBBLEWRAP_SETUP.md
│   ├── OPTIMIZATION_GUIDE.md
│   └── DEPLOYMENT.md
├── package.json         # Node.js dependencies
├── twa-manifest.json    # Bubblewrap configuration
└── README.md            # Main documentation
```

## Next Steps

### Generate Icons

You'll need to generate app icons for production. Use a tool like:

**Option 1: Using an online tool**
1. Visit https://realfavicongenerator.net/
2. Upload your logo (512x512px recommended)
3. Generate and download icons
4. Place in `public/icons/` directory

**Option 2: Using PWA Asset Generator**
```bash
npx pwa-asset-generator logo.svg public/icons/ \
  --icon-only \
  --background "#667eea" \
  --opaque false
```

### Test PWA Features

Open Chrome DevTools:
1. **Application Tab** → Manifest (check manifest.json)
2. **Application Tab** → Service Workers (verify registration)
3. **Lighthouse Tab** → Generate PWA Report (aim for 90+)

### Convert to Android App

See [docs/BUBBLEWRAP_SETUP.md](docs/BUBBLEWRAP_SETUP.md) for detailed instructions.

Quick version:
```bash
# Initialize Bubblewrap
npm run bubblewrap:init

# Build APK
npm run bubblewrap:build

# Install on device
npm run bubblewrap:install
```

## Features to Explore

### 1. Navigation
- Click bottom navigation tabs
- Swipe left/right to switch views
- Use browser back button

### 2. Touch Gestures
- **Swipe**: Navigate between views
- **Long Press**: Open context menu
- **Double Tap**: Favorite/like items
- **Pull Down**: Refresh content

### 3. Offline Mode
- Open DevTools → Network tab
- Enable "Offline" checkbox
- Refresh page - app still works!

### 4. Install Prompt
- Click "Install" button on home view
- Add app to home screen
- Launch as standalone app

### 5. Dark Mode
- Navigate to Profile view
- Toggle "Dark Mode" switch
- UI adapts to dark theme

## Customization

### Change Colors

Edit CSS variables in `css/main.css`:

```css
:root {
  --primary-color: #667eea;     /* Your brand color */
  --secondary-color: #764ba2;   /* Secondary brand color */
  --bg-color: #f5f7fa;          /* Background */
  /* ... more variables ... */
}
```

Also update in:
- `public/manifest.json` → `theme_color`
- `twa-manifest.json` → `themeColor`

### Update App Name

1. `public/manifest.json` → `name` and `short_name`
2. `public/index.html` → `<title>` tag
3. `twa-manifest.json` → `name` and `launcherName`
4. `package.json` → `name` and `description`

### Add New View

1. Add HTML section in `public/index.html`:
```html
<section class="view" id="new-view">
  <div class="content-wrapper">
    <h2>New View</h2>
    <!-- Your content -->
  </div>
</section>
```

2. Add navigation button:
```html
<button class="nav-item" data-view="new">
  <svg class="nav-icon"><!-- Icon --></svg>
  <span class="nav-label">New</span>
</button>
```

3. Update `js/navigation.js` → `isValidView()` function

## Common Issues

### Issue: Service Worker not updating

**Solution:**
```javascript
// In DevTools → Application → Service Workers
// Click "Unregister" then refresh
// Or use "Update on reload" checkbox
```

### Issue: Can't access from phone

**Solution:**
```bash
# Find your computer's IP
# macOS/Linux:
ifconfig | grep inet

# Windows:
ipconfig

# Ensure firewall allows port 8080
# Use IP address on phone: http://YOUR_IP:8080
```

### Issue: Icons not showing

**Solution:**
- Icons must be in `public/icons/` directory
- Paths in manifest.json must match actual files
- Clear cache and refresh (Ctrl+Shift+R)

### Issue: Gestures not working

**Solution:**
- Gestures require touch device or Chrome DevTools device emulation
- Open DevTools → Toggle device toolbar (Ctrl+Shift+M)
- Select mobile device from dropdown

## Development Tips

### Auto-reload Changes

```bash
# Install browser-sync for live reload
npx browser-sync start --server public --files "**/*"
```

### Debug on Android Device

```bash
# Enable USB debugging on Android device
# Connect via USB
# Open Chrome on desktop

# Navigate to:
chrome://inspect

# Click "Inspect" on your device
```

### Test Service Worker

```javascript
// In browser console
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('SW registered:', reg);
  reg.update(); // Force update
});
```

### Check PWA Score

```bash
# Run Lighthouse
npm test

# Or specific tests
npx lighthouse http://localhost:8080 \
  --only-categories=pwa \
  --view
```

## Resources

- **Main README**: [README.md](README.md)
- **Bubblewrap Setup**: [docs/BUBBLEWRAP_SETUP.md](docs/BUBBLEWRAP_SETUP.md)
- **Optimization Guide**: [docs/OPTIMIZATION_GUIDE.md](docs/OPTIMIZATION_GUIDE.md)
- **Deployment Guide**: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

## Getting Help

- Check documentation in `docs/` folder
- Review code comments in JS files
- Search GitHub issues
- Stack Overflow tag: `progressive-web-apps`

## What's Next?

1. ✅ Get the app running locally
2. 📱 Test on mobile device
3. 🎨 Customize branding and colors
4. 🏗️ Add your own features
5. 📦 Convert to Android with Bubblewrap
6. 🚀 Deploy to dApp Store

---

**Happy coding! 🎉**

Need more help? Check out the detailed documentation or open an issue.
