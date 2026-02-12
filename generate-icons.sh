#!/bin/bash
# Icon generation helper script

echo "Icon Generation Helper"
echo "======================"
echo ""
echo "This script will help you generate icons for your PWA."
echo ""
echo "Option 1: Online Tool (Recommended)"
echo "  1. Create a 512x512px PNG logo"
echo "  2. Visit: https://realfavicongenerator.net/"
echo "  3. Upload your logo"
echo "  4. Download generated icons"
echo "  5. Extract to public/icons/"
echo ""
echo "Option 2: PWA Asset Generator"
echo "  npm install -g pwa-asset-generator"
echo "  pwa-asset-generator logo.svg public/icons/ --icon-only"
echo ""
echo "Option 3: ImageMagick (if installed)"

if command -v convert &> /dev/null; then
    echo "  ImageMagick detected!"
    echo ""
    read -p "Do you have a logo.png file? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if [ -f "logo.png" ]; then
            echo "Generating icons..."
            mkdir -p public/icons
            
            sizes=(72 96 128 144 152 192 384 512)
            for size in "${sizes[@]}"; do
                convert logo.png -resize ${size}x${size} public/icons/icon-${size}x${size}.png
                echo "  ✓ Generated icon-${size}x${size}.png"
            done
            
            echo ""
            echo "✅ Icons generated successfully!"
        else
            echo "❌ logo.png not found in current directory"
        fi
    fi
else
    echo "  ImageMagick not installed"
fi

echo ""
echo "Icon requirements:"
echo "  - PNG format"
echo "  - Sizes: 72, 96, 128, 144, 152, 192, 384, 512"
echo "  - Square aspect ratio"
echo "  - No transparency for adaptive icons"
echo ""
