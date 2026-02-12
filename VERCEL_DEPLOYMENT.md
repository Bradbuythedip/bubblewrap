# Deploy to Vercel - Quick Guide

This guide shows you how to deploy the Mobile-Optimized PWA to Vercel.

## 🚀 Quick Deploy (Recommended)

### Option 1: Deploy Button

Click this button to deploy directly:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Bradbuythedip/bubblewrap)

### Option 2: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to project
cd /path/to/bubblewrap

# Deploy
vercel
```

Follow the prompts:
- Set up and deploy? **Y**
- Which scope? Select your account
- Link to existing project? **N**
- What's your project's name? **mobile-pwa-bubblewrap**
- In which directory is your code located? **./**
- Want to override settings? **N**

### Option 3: Vercel Dashboard

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Sign in with GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Select "Import Git Repository"
   - Choose: `Bradbuythedip/bubblewrap`

3. **Configure Project**
   - Framework Preset: **Other**
   - Root Directory: **./** (leave as is)
   - Build Command: **(leave empty)**
   - Output Directory: **(leave empty)**
   - Install Command: **npm install**

4. **Deploy**
   - Click "Deploy"
   - Wait 1-2 minutes

5. **Access Your Deployment**
   - PWA Demo: `https://your-project.vercel.app/public/`
   - Docs Site: `https://your-project.vercel.app/docs-site/`

---

## 📁 Project Configuration

The `vercel.json` file is already configured:

```json
{
  "version": 2,
  "name": "mobile-pwa-bubblewrap",
  "builds": [
    {
      "src": "public/**",
      "use": "@vercel/static"
    },
    {
      "src": "docs-site/**",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/docs",
      "dest": "/docs-site/index.html"
    },
    {
      "src": "/(.*)",
      "dest": "/public/$1"
    }
  ]
}
```

This configuration:
- ✅ Serves PWA from `/public/`
- ✅ Serves docs site from `/docs-site/`
- ✅ Sets proper headers for service worker
- ✅ Sets correct MIME types

---

## 🔧 Custom Domain (Optional)

After deployment, add a custom domain:

1. Go to your project dashboard
2. Click "Settings" → "Domains"
3. Add your domain (e.g., `pwa.yourdomain.com`)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-60 minutes)

---

## 🌐 URLs After Deployment

Once deployed, your sites will be accessible at:

**Main Demo:**
- `https://your-project.vercel.app/` (redirects to public/)
- `https://your-project.vercel.app/public/`

**Documentation:**
- `https://your-project.vercel.app/docs-site/`
- `https://your-project.vercel.app/docs` (alias)

**Files:**
- `https://your-project.vercel.app/manifest.json`
- `https://your-project.vercel.app/service-worker.js`
- `https://your-project.vercel.app/icons/icon-192x192.png`

---

## ✅ Verify Deployment

Test these features after deployment:

### PWA Features
```bash
# Open Chrome DevTools
# Go to: https://your-project.vercel.app/

# Check:
1. Application → Manifest (should load)
2. Application → Service Workers (should register)
3. Network → Offline (app should work)
4. Lighthouse → Generate PWA report (should score 90+)
```

### Mobile Features
1. Open on mobile device
2. Test touch gestures (swipe, long-press, double-tap)
3. Test pull-to-refresh
4. Test bottom navigation
5. Test dark mode toggle
6. Test offline functionality

---

## 🔄 Update Deployment

When you push changes to GitHub:

**Automatic Deployment (if connected to Git):**
- Push to GitHub: `git push origin main`
- Vercel automatically redeploys
- Takes ~1-2 minutes

**Manual Deployment:**
```bash
cd /path/to/bubblewrap
vercel --prod
```

---

## 📊 Deployment Settings

### Environment Variables (if needed)

In Vercel dashboard:
1. Go to Project Settings
2. Click "Environment Variables"
3. Add variables:
   - Key: `NODE_ENV`
   - Value: `production`

### Build Settings

- **Framework Preset:** Other
- **Root Directory:** ./
- **Build Command:** (none needed)
- **Output Directory:** (auto-detected)
- **Install Command:** npm install
- **Development Command:** npm start

---

## 🐛 Troubleshooting

### Issue: Service Worker Not Working

**Solution:**
Vercel requires HTTPS, which service workers need. This should work automatically.

If not working:
1. Check `/service-worker.js` loads (200 status)
2. Verify it's not cached with old content
3. Check browser console for errors

### Issue: 404 on Routes

**Solution:**
Make sure `vercel.json` is in root directory:
```bash
git add vercel.json
git commit -m "Add Vercel config"
git push origin main
```

### Issue: Manifest.json Not Loading

**Solution:**
Check headers in Network tab. Should have:
```
Content-Type: application/manifest+json
```

If not, update vercel.json headers section.

### Issue: Icons Not Found

**Solution:**
Generate icons and commit:
```bash
./generate-icons.sh
git add public/icons/
git commit -m "Add app icons"
git push origin main
```

---

## 🚀 Production Checklist

Before deploying to production:

- [ ] Icons generated (all sizes)
- [ ] Service worker configured
- [ ] Manifest.json updated with your domain
- [ ] Test offline functionality
- [ ] Test on real mobile devices
- [ ] Run Lighthouse audit (score 90+)
- [ ] Update meta tags with your info
- [ ] Configure custom domain (if applicable)
- [ ] Test PWA installation
- [ ] Verify all links work

---

## 📈 Performance on Vercel

Expected Lighthouse scores:
- **Performance:** 95-100
- **Accessibility:** 100
- **Best Practices:** 95-100
- **PWA:** 100
- **SEO:** 90-100

Vercel provides:
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ Edge caching
- ✅ Instant deployments
- ✅ Automatic scaling

---

## 💡 Pro Tips

### 1. Preview Deployments

Every push to a branch creates a preview:
- Main branch → Production (`your-project.vercel.app`)
- Other branches → Preview URLs (`branch-name-your-project.vercel.app`)

### 2. Rollback

If something breaks:
1. Go to Deployments tab
2. Find previous working deployment
3. Click "..." → "Promote to Production"

### 3. Analytics

Enable Vercel Analytics:
1. Project Settings → Analytics
2. Enable "Vercel Analytics"
3. View real-time traffic data

### 4. Performance Monitoring

Use Vercel Speed Insights:
1. Install: `npm install @vercel/analytics`
2. Add to your app
3. View performance metrics

---

## 🔗 Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel Docs:** https://vercel.com/docs
- **Vercel CLI:** https://vercel.com/docs/cli
- **Support:** https://vercel.com/support

---

## 🎯 Quick Commands

```bash
# Deploy to production
vercel --prod

# Deploy to preview
vercel

# View deployment logs
vercel logs

# List deployments
vercel ls

# Remove deployment
vercel rm deployment-url

# Link local project
vercel link

# View project info
vercel inspect
```

---

## 📝 Update URLs in Your Code

After deploying, update these files with your Vercel URL:

### twa-manifest.json
```json
{
  "host": "your-project.vercel.app",
  "startUrl": "/",
  "iconUrl": "https://your-project.vercel.app/icons/icon-512x512.png",
  "webManifestUrl": "https://your-project.vercel.app/manifest.json"
}
```

### assetlinks.json
Deploy at: `https://your-project.vercel.app/.well-known/assetlinks.json`

Create `.well-known` directory:
```bash
mkdir -p public/.well-known
cp assetlinks.json public/.well-known/
```

Update vercel.json routes:
```json
{
  "src": "/.well-known/assetlinks.json",
  "dest": "/public/.well-known/assetlinks.json",
  "headers": {
    "Content-Type": "application/json"
  }
}
```

---

## ✅ Deployment Complete

Your PWA is now deployed on Vercel! 🎉

**Next Steps:**
1. Test the live site
2. Share with users
3. Monitor analytics
4. Update as needed

**Support:**
- Vercel: https://vercel.com/support
- Project Issues: https://github.com/Bradbuythedip/bubblewrap/issues

---

**Happy deploying! 🚀**
