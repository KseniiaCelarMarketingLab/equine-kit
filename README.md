# Equesolution Landing Page
## Deploy to Vercel in 4 steps

### Step 1 — Set up Stripe Payment Link
1. Go to dashboard.stripe.com
2. Click "Payment Links" → "Create payment link"
3. Add product: "Equestrian Business Marketing Kit" — €15
4. Copy the link (looks like: https://buy.stripe.com/xxxx)
5. Open `src/App.jsx` and paste it into STRIPE_PAYMENT_LINK

### Step 2 — Update your URLs in src/App.jsx
Open `src/App.jsx` and find the CONFIG block at the top:
```js
const CONFIG = {
  STRIPE_PAYMENT_LINK: "https://buy.stripe.com/YOUR_LINK_HERE",  // ← paste Stripe link
  PRODUCTS_PAGE: "https://equesolution.com/products",            // ← your products page
  MAIN_SITE: "https://equesolution.com",                         // ← your main site
};
```

### Step 3 — Deploy to Vercel
Option A (easiest — drag & drop):
1. Go to vercel.com → Sign up with Google
2. Click "Add New Project"
3. Drag this entire folder onto the upload area
4. Click Deploy
5. Done — you get a live URL instantly

Option B (via GitHub):
1. Push this folder to a GitHub repo
2. Go to vercel.com → Import from GitHub
3. Select the repo → Deploy

### Step 4 — Add your custom domain
1. In Vercel dashboard → your project → Settings → Domains
2. Add: equesolution.com
3. Follow DNS instructions (takes 5–30 minutes)

---

## After first sale — set up file delivery
In Stripe dashboard → Settings → Emails → enable "Receipt email"
Add your Google Drive link to the receipt email template.

## Stack
- React 18 + Vite
- No backend needed
- Images embedded as base64 (no CDN needed)
- Payments via Stripe Payment Link (external)
