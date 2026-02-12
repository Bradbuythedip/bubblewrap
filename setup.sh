#!/bin/bash

# PWA Bubblewrap Sample - Setup Script
# This script helps you set up the project for development

set -e

echo "=================================================="
echo "  PWA Bubblewrap Sample - Setup Script"
echo "=================================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js 14+ from https://nodejs.org/"
    exit 1
else
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✅ Node.js installed: $NODE_VERSION${NC}"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
else
    NPM_VERSION=$(npm -v)
    echo -e "${GREEN}✅ npm installed: $NPM_VERSION${NC}"
fi

echo ""
echo "Installing dependencies..."
npm install

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "=================================================="
echo "  Next Steps"
echo "=================================================="
echo ""
echo "1. Start development server:"
echo "   ${YELLOW}npm start${NC}"
echo ""
echo "2. View in browser:"
echo "   ${YELLOW}http://localhost:8080${NC}"
echo ""
echo "3. Generate icons (required for production):"
echo "   - Create a 512x512px logo"
echo "   - Use https://realfavicongenerator.net/"
echo "   - Place icons in public/icons/"
echo ""
echo "4. Convert to Android app:"
echo "   - See docs/BUBBLEWRAP_SETUP.md"
echo "   - Run: npm run bubblewrap:init"
echo ""
echo "5. Deploy to dApp Store:"
echo "   - See docs/DEPLOYMENT.md"
echo ""
echo "=================================================="
echo "  Documentation"
echo "=================================================="
echo ""
echo "• Quick Start:        QUICK_START.md"
echo "• Full README:        README.md"
echo "• Bubblewrap Setup:   docs/BUBBLEWRAP_SETUP.md"
echo "• Optimizations:      docs/OPTIMIZATION_GUIDE.md"
echo "• Deployment:         docs/DEPLOYMENT.md"
echo ""
echo "Happy coding! 🚀"
echo ""
