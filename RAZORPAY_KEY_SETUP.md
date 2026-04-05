# 🔑 Razorpay Setup Required

The 401 Unauthorized error means you're using the placeholder Razorpay key. Follow these steps:

## Step 1: Get Your Razorpay Test Keys

1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Sign up or log in
3. Navigate to **Settings → API Keys**
4. Copy your **Test Key ID** (starts with `rzp_test_`)

## Step 2: Update Environment Variables

### Frontend (.env)
Create/update `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_TEST_KEY_HERE
```

### Backend (.env)
Create/update `backend/.env`:
```env
RAZORPAY_KEY_ID=rzp_test_YOUR_ACTUAL_TEST_KEY_HERE
RAZORPAY_KEY_SECRET=your_actual_secret_key_here
```

## Step 3: Restart Your Servers

After updating the environment variables:
1. Stop both frontend and backend servers
2. Restart them to load the new environment variables

## Step 4: Test the Payment Flow

1. Add items to cart
2. Proceed to checkout
3. Fill address details
4. Click "Pay with Razorpay"
5. You should see the Razorpay payment modal (not 401 error)

## 🧪 Test Mode

For testing, you can use Razorpay's test cards:
- **Card Number**: 4111 1111 1111 1111
- **Expiry**: Any future date
- **CVV**: Any 3 digits
- **Name**: Any name

## 🔍 Current Error Analysis

The error you're seeing:
```
POST https://api.razorpay.com/v2/standard_checkout/preferences?key_id=rzp_test_YourKeyHere 401 (Unauthorized)
```

This confirms the issue is with the API key. Once you replace `rzp_test_YourKeyHere` with your actual test key, it will work!

## 📋 Quick Setup Checklist

- [ ] Get Razorpay test keys from dashboard
- [ ] Update frontend/.env with VITE_RAZORPAY_KEY_ID
- [ ] Update backend/.env with RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET
- [ ] Restart both servers
- [ ] Test payment flow

The integration code is correct - you just need real Razorpay credentials!
