# Razorpay Payment Integration Setup

This document provides instructions for setting up Razorpay payment gateway in the HeritageBazzar module.

## Prerequisites

1. Create a Razorpay account at [https://razorpay.com](https://razorpay.com)
2. Get your API keys from the Razorpay dashboard

## Backend Setup

1. Copy the environment file:
   ```bash
   cp backend/.env.example backend/.env
   ```

2. Update the `.env` file with your Razorpay credentials:
   ```env
   RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
   RAZORPAY_KEY_SECRET=your_actual_secret_key
   ```

## Frontend Setup

1. Copy the environment file:
   ```bash
   cp frontend/.env.example frontend/.env
   ```

2. Update the `.env` file with your Razorpay key:
   ```env
   VITE_RAZORPAY_KEY_ID=rzp_test_your_actual_key_id
   ```

## Payment Flow

### 1. Order Creation
- User adds items to cart and proceeds to checkout
- System creates an order with `PENDING` status
- Order is saved in the database

### 2. Razorpay Payment
- Frontend creates a Razorpay order via `/orders/razorpay/create-order`
- Razorpay checkout modal opens with payment options
- User completes payment using Razorpay

### 3. Payment Verification
- Razorpay sends payment response to frontend
- Frontend sends payment details to `/orders/razorpay/verify-payment`
- Backend verifies payment signature using HMAC SHA256
- Order status updated to `PAID` with payment details

### 4. Order Display
- User redirected to orders page (`/heritagebazzar/orders`)
- Order shows payment details including:
  - Payment ID
  - Razorpay Order ID
  - Payment date
  - Payment method

## API Endpoints

### Create Razorpay Order
```
POST /orders/razorpay/create-order
Body: { amount: number }
Response: { success: true, razorpayOrder: RazorpayOrder }
```

### Verify Payment
```
POST /orders/razorpay/verify-payment
Body: {
  orderId: string,
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
}
Response: { success: true, order: Order, message: string }
```

## Security Features

1. **Payment Signature Verification**: Backend verifies Razorpay payment signature using HMAC SHA256
2. **Order Ownership**: Only order owner can verify and update payment status
3. **Environment Variables**: Sensitive keys stored in environment variables
4. **User Authentication**: All payment endpoints require user authentication

## Database Schema Updates

The Order model now includes:
- `razorpayOrderId`: Razorpay order ID
- `razorpayPaymentId`: Razorpay payment ID  
- `razorpaySignature`: Payment signature for verification
- `paymentMethod`: Set to "RAZORPAY" for Razorpay payments

## Testing

1. Use Razorpay test mode for development
2. Test cards available in Razorpay documentation
3. Verify payment flow end-to-end
4. Check order status updates in database

## Production Deployment

1. Switch to live Razorpay keys
2. Update environment variables
3. Ensure HTTPS is enabled (required by Razorpay)
4. Test with real payments

## Troubleshooting

### Common Issues

1. **Payment verification fails**: Check Razorpay keys and signature generation
2. **Order not created**: Verify database connection and order creation logic
3. **Frontend errors**: Check Razorpay script loading and environment variables
4. **CORS issues**: Ensure backend allows frontend origin

### Debug Steps

1. Check browser console for JavaScript errors
2. Verify network requests in browser dev tools
3. Check backend logs for payment verification errors
4. Validate environment variables are loaded correctly

## Support

For Razorpay-specific issues, refer to:
- [Razorpay Documentation](https://razorpay.com/docs/)
- [Razorpay Support](https://razorpay.com/support/)
