# Printful API Integration - Setup Complete! 🎉

## What's Been Built

✅ **Order page** (`order.html`) - Beautiful branded order form  
✅ **Order handler** (`order.js`) - Handles form submission & pricing  
✅ **Backend API routes** (`backend/routes/printful.js`) - Connects to Printful  
✅ **Art carousel updated** - Now links to order page instead of external sites  
✅ **API key stored** - In `.env.printful` (keep this secret!)

---

## How It Works Now

1. **Customer clicks artwork** → Opens `order.html` in new tab
2. **Selects size & enters shipping info** → Auto-calculates pricing
3. **Clicks "Proceed to Payment"** → (Payment integration coming next)
4. **Order sent to Printful API** → Printful prints & ships
5. **You get paid!** → Profit deposited to your bank

---

## What You Need To Do Next

### Step 1: Get Your Printful Product Template ID

The TunnelBow product you created has a unique ID. Find it:

1. Go to **My Products** in Printful dashboard
2. Click on your TunnelBow product
3. Look at the URL - it will be something like:
   ```
   printful.com/ca/dashboard/product-templates/published/17274045
   ```
4. That number at the end (`17274045`) is your product template ID
5. Copy that number

### Step 2: Update interactivity.js

Open `interactivity.js` and find line ~323:

```javascript
{ 
  image: 'images/TunnelBow.JPEG', 
  printfulProductId: '17274045', // ← PASTE YOUR REAL ID HERE
  title: 'TunnelBow',
  alt: 'TunnelBow - Rainbow light through glass tunnel'
},
```

Replace `17274045` with your actual product template ID.

### Step 3: Deploy Backend with API Key

Your backend needs the Printful API key. Add to Railway:

1. Go to your Railway project dashboard
2. Click on your backend service
3. Go to **Variables** tab
4. Add new variable:
   - Name: `PRINTFUL_API_KEY`
   - Value: `[YOUR-API-KEY-FROM-.env.printful-FILE]`
5. Click **Deploy**

### Step 4: Test the Order Flow

1. Open your portfolio site
2. Click on TunnelBow in the art carousel
3. Order page should open with the artwork
4. Fill out the form and test pricing updates
5. (Won't process real order yet - payment integration needed)

---

## Next: Payment Integration

For customers to actually pay, we need to add either:

**Option A: Stripe** (Most professional)
- Create Stripe account
- Add Stripe.js to order page
- Process payment → Send to Printful

**Option B: PayPal** (Simpler)
- Add PayPal button to order page
- On payment success → Send to Printful

**Option C: Manual Payment** (Temporary)
- Customer emails you
- You process payment manually
- Then submit order to Printful via dashboard

Which payment option sounds best for you?

---

## Files Created

```
/
├── order.html           # Beautiful order form (customer-facing)
├── order.js             # Order form logic & pricing
├── .env.printful        # API key (NEVER commit to git!)
└── backend/
    └── routes/
        └── printful.js  # Printful API integration
```

---

## Security Notes

🔒 **IMPORTANT:** 
- Never commit `.env.printful` to git
- API key gives access to your Printful account
- Keep it secret, keep it safe!

---

## Current Status

✅ TunnelBow artwork uploaded to Printful  
✅ API key generated  
✅ Order page built  
✅ Backend routes created  
⏳ Need product template ID (see Step 1 above)  
⏳ Payment integration (coming next)  
⏳ Deploy backend with API key

---

## Questions?

- **Find product ID:** Check URL when viewing product in Printful
- **Test order page:** `order.html?image=images/TunnelBow.JPEG&title=TunnelBow&productId=17274045`
- **API not working:** Make sure Railway has `PRINTFUL_API_KEY` variable

Let me know when you've got the product ID and we'll add payment! 💳
