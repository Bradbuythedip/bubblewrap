# Bubblewrap Setup Guide

This guide walks you through the complete process of converting your PWA into an Android app using Bubblewrap CLI and publishing it to the dApp Store.

## Prerequisites

Before starting, ensure you have the following installed:

### Required Software

1. **Node.js** (v14 or higher)
   ```bash
   node --version
   npm --version
   ```

2. **Java Development Kit (JDK)** 8 or higher
   ```bash
   java -version
   javac -version
   ```

3. **Android SDK** with Build Tools
   - Download Android Studio or standalone SDK tools
   - Set `ANDROID_HOME` environment variable
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
   ```

### Install Bubblewrap CLI

```bash
npm install -g @bubblewrap/cli
```

Verify installation:
```bash
bubblewrap --version
```

## Step 1: Initialize Bubblewrap Project

### Option A: Interactive Init

```bash
cd /path/to/your/pwa
bubblewrap init --manifest=https://your-domain.com/manifest.json
```

The CLI will prompt you for:
- **Application Name**: Your app's full name
- **Short Name**: Shorter version (12 chars max)
- **Package ID**: Reverse domain notation (e.g., com.example.myapp)
- **Host**: Your PWA domain
- **Icon URL**: Path to 512x512 icon
- **Theme Color**: Primary theme color
- **Background Color**: Splash screen background
- **Display Mode**: standalone, fullscreen, or minimal-ui
- **Orientation**: Portrait, landscape, or any

### Option B: Non-Interactive Init

```bash
bubblewrap init \
  --manifest=https://your-domain.com/manifest.json \
  --directory=./twa-project
```

## Step 2: Configure TWA Manifest

After initialization, edit `twa-manifest.json`:

```json
{
  "packageId": "com.example.mobilepwa",
  "host": "your-domain.com",
  "name": "Mobile PWA Demo",
  "launcherName": "PWA Demo",
  "display": "standalone",
  "themeColor": "#667eea",
  "navigationColor": "#667eea",
  "backgroundColor": "#667eea",
  "enableNotifications": true,
  "startUrl": "/",
  "iconUrl": "https://your-domain.com/icons/icon-512x512.png",
  "maskableIconUrl": "https://your-domain.com/icons/icon-512x512-maskable.png",
  "monochromeIconUrl": "https://your-domain.com/icons/icon-512x512-monochrome.png",
  "splashScreenFadeOutDuration": 300,
  "signingKey": {
    "path": "./android.keystore",
    "alias": "android"
  },
  "appVersionName": "1.0.0",
  "appVersionCode": 1,
  "shortcuts": [
    {
      "name": "Open Home",
      "short_name": "Home",
      "url": "/",
      "icon": "https://your-domain.com/icons/icon-192x192.png"
    }
  ],
  "generatorApp": "@bubblewrap/cli",
  "webManifestUrl": "https://your-domain.com/manifest.json",
  "fallbackType": "customtabs",
  "features": {
    "locationDelegation": {
      "enabled": false
    },
    "playBilling": {
      "enabled": false
    }
  },
  "alphaDependencies": {
    "enabled": false
  },
  "enableSiteSettingsShortcut": true,
  "isChromeOSOnly": false,
  "minSdkVersion": 19,
  "targetSdkVersion": 33
}
```

### Important Configuration Options

**`fallbackType`**: Chrome default with fallback
- `"customtabs"` - Opens in Chrome Custom Tabs (recommended)
- `"webview"` - Falls back to WebView if Chrome unavailable

**`splashScreenFadeOutDuration`**: 
- Set to `300` (ms) for smooth transition
- Match with CSS transition in your PWA

**`enableNotifications`**: 
- Set to `true` to enable push notifications

**`minSdkVersion`**:
- `19` - Android 4.4+ (KitKat)
- `21` - Android 5.0+ (Lollipop) - recommended
- `23` - Android 6.0+ (Marshmallow) - for better TWA support

## Step 3: Generate Signing Key

Create a keystore for signing your app:

```bash
keytool -genkey -v \
  -keystore android.keystore \
  -alias android \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass YOUR_STORE_PASSWORD \
  -keypass YOUR_KEY_PASSWORD
```

**Interactive prompts:**
- Full Name
- Organization
- City
- State
- Country Code

**Important:** 
- Save your keystore password securely
- Back up your keystore file
- Never commit keystore to version control

Add to `.gitignore`:
```
*.keystore
*.jks
keystore.properties
```

## Step 4: Configure Digital Asset Links

Digital Asset Links verify your ownership of both the website and the Android app.

### Get SHA-256 Fingerprint

```bash
keytool -list -v \
  -keystore android.keystore \
  -alias android \
  -storepass YOUR_STORE_PASSWORD
```

Copy the SHA256 fingerprint (format: `AA:BB:CC:...`).

### Create assetlinks.json

Create `.well-known/assetlinks.json` on your web server:

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.example.mobilepwa",
    "sha256_cert_fingerprints": [
      "AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:00:11:22:33:44:55:66:77:88:99"
    ]
  }
}]
```

**Deploy to:**
```
https://your-domain.com/.well-known/assetlinks.json
```

**Verify:**
```bash
curl https://your-domain.com/.well-known/assetlinks.json
```

**Test with Google's tool:**
```
https://developers.google.com/digital-asset-links/tools/generator
```

### Important Requirements

1. **HTTPS required** - Asset links only work over HTTPS
2. **Content-Type** - Must be `application/json`
3. **No redirects** - Must be accessible without redirects
4. **Remove colons** - SHA256 should be formatted with colons

## Step 5: Build the APK

### Development Build (Unsigned)

```bash
bubblewrap build
```

### Production Build (Signed)

```bash
bubblewrap build \
  --signingKeyPath=./android.keystore \
  --signingKeyAlias=android \
  --signingKeyPassword=YOUR_KEY_PASSWORD \
  --keystorePassword=YOUR_STORE_PASSWORD
```

### Build Output

The APK will be generated at:
```
./app-release-signed.apk
```

File size typically: 1-5 MB (depending on configuration)

## Step 6: Test the APK

### Install on Physical Device

```bash
# Enable USB debugging on your device
# Connect device via USB

adb devices  # Verify device is connected
adb install app-release-signed.apk
```

### Install via Bubblewrap

```bash
bubblewrap install
```

### Test Checklist

- [ ] App installs without errors
- [ ] App icon appears correctly
- [ ] Splash screen displays properly
- [ ] App opens in Chrome (not external browser)
- [ ] Navigation works smoothly
- [ ] Offline functionality works
- [ ] Push notifications work (if enabled)
- [ ] Deep links work correctly
- [ ] Back button behavior is correct
- [ ] App doesn't show browser UI (address bar)

## Step 7: Update the App

When you need to update your app:

1. **Update version in twa-manifest.json:**
```json
{
  "appVersionName": "1.0.1",
  "appVersionCode": 2
}
```

2. **Rebuild:**
```bash
bubblewrap build
```

3. **Version codes must increment** - Android requires each update to have a higher `appVersionCode`

### Update Command

```bash
bubblewrap update --manifest=https://your-domain.com/manifest.json
```

This fetches the latest manifest and updates your TWA configuration.

## Troubleshooting

### Issue: "Failed to find Android SDK"

**Solution:**
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### Issue: "App opens in browser instead of TWA"

**Solutions:**
1. Verify Digital Asset Links are correctly configured
2. Check SHA256 fingerprint matches
3. Ensure assetlinks.json is accessible via HTTPS
4. Clear Chrome app data and reinstall

### Issue: "Splash screen flickers"

**Solution:**
Match `splashScreenFadeOutDuration` in twa-manifest.json with CSS transition time:
```json
"splashScreenFadeOutDuration": 300
```
```css
.splash-screen {
  transition: opacity 0.3s ease;
}
```

### Issue: "Build fails with Gradle error"

**Solution:**
```bash
# Clear Gradle cache
rm -rf ~/.gradle/caches/

# Retry build
bubblewrap build
```

### Issue: "Unable to verify Digital Asset Links"

**Solution:**
1. Test URL directly: `https://your-domain.com/.well-known/assetlinks.json`
2. Check response headers include `Content-Type: application/json`
3. Verify no redirects occur
4. Use Google's verification tool

## Advanced Configuration

### Custom Splash Screen

Edit `android/app/src/main/res/values/styles.xml`:

```xml
<style name="LauncherTheme" parent="Theme.AppCompat.NoActionBar">
    <item name="android:windowBackground">@drawable/splash_screen</item>
</style>
```

### Custom Browser Fallback

In twa-manifest.json:
```json
{
  "fallbackType": "customtabs",
  "features": {
    "locationDelegation": {
      "enabled": true
    }
  }
}
```

### Enable Chrome Features

```json
{
  "features": {
    "locationDelegation": {
      "enabled": true
    },
    "playBilling": {
      "enabled": true
    }
  }
}
```

## Publishing to dApp Store

See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete publishing instructions.

## Resources

- [Bubblewrap GitHub](https://github.com/GoogleChromeLabs/bubblewrap)
- [TWA Documentation](https://developers.google.com/web/android/trusted-web-activity)
- [Digital Asset Links](https://developers.google.com/digital-asset-links)
- [Android Developer Guide](https://developer.android.com/guide)

## Support

For issues:
- Bubblewrap Issues: https://github.com/GoogleChromeLabs/bubblewrap/issues
- Stack Overflow: Tag `trusted-web-activity`

---

**Next Steps:** After building your APK, proceed to [DEPLOYMENT.md](./DEPLOYMENT.md) to learn how to publish to the dApp Store.
