# Printify Pop-Up Store Integration Setup

## ✅ What's Already Done

Your website now has a **modal-based Printify store** integration! When visitors click artwork in your carousel, they'll see a beautiful modal with your Printify Pop-Up Store embedded inside.

### Features Implemented:
- ✅ Modal opens with Printify store iframe
- ✅ Smooth animations and transitions
- ✅ Mobile responsive design
- ✅ Close on X button, backdrop click, or ESC key
- ✅ Purple gradient header with artwork title
- ✅ "🛒 Order Print" button on hover
- ✅ "Coming Soon" badge for pending products

## 🔧 How to Complete Setup

### Step 1: Add Products to Your Printify Pop-Up Store

1. Go to https://www.printify.com/app/store
2. Create products for each artwork:
   - Upload `images/TunnelBow.JPEG`
   - Add product title, description, pricing
   - Select print sizes/formats
   - Publish product

### Step 2: Get Product URLs

After publishing each product, Printify gives you a URL like:
```
https://ordinalrainbows.printify.me/product/1234567890
```

### Step 3: Update Your Code

Open `interactivity.js` and replace the product URLs in the artworks array:

```javascript
const artworks = [
  { 
    image: 'images/TunnelBow.JPEG', 
    printifyUrl: 'https://ordinalrainbows.printify.me/product/YOUR-ACTUAL-URL', // ← Paste your URL here
    title: 'TunnelBow',
    alt: 'TunnelBow - Rainbow light through glass tunnel'
  },
  // ... repeat for other artworks
];
```

**Replace:** `'https://ordinalrainbows.printify.me/product/YOUR-PRODUCT-ID'`  
**With:** Your actual product URL from Printify

### Step 4: Test Locally

1. Open `index.html` in a browser
2. Click on TunnelBow in the Art Portal carousel
3. Modal should open with your Printify product page
4. Test adding to cart and checkout (it's FREE - no payment method needed!)

## 🎨 Current Product Status

| Artwork | Status | Printify URL |
|---------|--------|--------------|
| TunnelBow | ⏳ Needs URL | Update in code |
| Prismatic Cascade | ⏳ Not created | Create in Printify |
| Spectral Dreams | ⏳ Not created | Create in Printify |
| Rainbow Refraction | ⏳ Not created | Create in Printify |
| Light Portal | ⏳ Not created | Create in Printify |
| Color Burst | ⏳ Not created | Create in Printify |
| Rainbow Echo | ⏳ Not created | Create in Printify |
| Crystal Light | ⏳ Not created | Create in Printify |
| Spectrum Wave | ⏳ Not created | Create in Printify |
| Radiant Prism | ⏳ Not created | Create in Printify |
| Luminous Flow | ⏳ Not created | Create in Printify |
| Rainbow Harvest | ⏳ Not created | Create in Printify |

## 💡 How It Works

### Customer Experience:
1. Visitor browses your artwork carousel on your site
2. Clicks "🛒 Order Print" on an artwork
3. Modal opens with Printify store embedded
4. Customer selects size, adds to cart
5. **Customer pays Printify directly** (not you!)
6. Printify prints, ships, handles customer service
7. **You get paid your profit margin**

### Your Experience:
- ✅ No credit card needed
- ✅ No inventory to manage
- ✅ No shipping to handle
- ✅ No customer service emails
- ✅ Just collect earnings

## 🚀 Deployment

Once you've added product URLs:

1. Test everything locally
2. Commit changes to git:
   ```bash
   git add interactivity.js carousel.css
   git commit -m "Add Printify Pop-Up Store modal integration"
   git push origin main
   ```
3. Deploy to your live site (Vercel will auto-deploy)

## 🎉 You're Done!

No Stripe. No PayPal. No Big Cartel. No complexity.  
Just **Printify Pop-Up Store** handling everything for you!

---

**Your Printify Store:** https://ordinalrainbows.printify.me/  
**Need Help?** Check Printify's documentation: https://help.printify.com/
