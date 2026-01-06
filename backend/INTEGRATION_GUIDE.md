# 🔐 Authentication & 💳 Payment Integration Guide

## ✅ What's Been Setup

### 1. Google OAuth (Supabase Auth)
- Middleware for protected routes
- User profile endpoints
- Auto-managed by Supabase

### 2. Razorpay Payment Gateway
- Create payment orders
- Verify payments
- Webhook for payment status
- Get payment details

---

## 🚀 SETUP STEPS

### Part 1: Google OAuth with Supabase

#### Step 1: Get Google OAuth Credentials
1. Go to: https://console.cloud.google.com/
2. Create/Select project: **LabDash**
3. Enable **Google+ API**
4. Create OAuth 2.0 Client ID:
   - Type: Web application
   - Redirect URI: `https://fnouqfyhksvxzarhxljz.supabase.co/auth/v1/callback`
5. Copy **Client ID** and **Client Secret**

#### Step 2: Configure in Supabase
1. Open: https://app.supabase.com/project/fnouqfyhksvxzarhxljz/auth/providers
2. Find **Google** provider
3. Enable and paste:
   - Client ID
   - Client Secret
4. Save

---

### Part 2: Razorpay Payment Gateway

#### Step 1: Get Razorpay API Keys
1. Go to: https://dashboard.razorpay.com/signin
2. Sign up/Login
3. Settings → API Keys → Generate Keys
4. Copy:
   - **Key ID** (rzp_test_xxxxx)
   - **Key Secret**

#### Step 2: Setup Webhook
1. Settings → Webhooks → Add New Webhook
2. Webhook URL: `http://your-backend-url/api/payments/webhook`
3. Events to subscribe:
   - `payment.captured`
   - `payment.failed`
4. Copy **Webhook Secret**

#### Step 3: Update .env File
```env
# Razorpay (replace with your keys)
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

---

## 📱 Android App Integration

### 1. Google Sign-In (Supabase)

```kotlin
// In your Android app
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.gotrue.Auth
import io.github.jan.supabase.gotrue.providers.Google

val supabase = createSupabaseClient(
    supabaseUrl = "https://fnouqfyhksvxzarhxljz.supabase.co",
    supabaseKey = "your_anon_key"
) {
    install(Auth)
}

// Sign in with Google
suspend fun signInWithGoogle() {
    supabase.auth.signInWith(Google)
}

// Get current user
val user = supabase.auth.currentUserOrNull()
val token = supabase.auth.currentAccessTokenOrNull()
```

### 2. Razorpay Payment

```kotlin
// In your Android app - build.gradle
implementation 'com.razorpay:checkout:1.6.33'

// Create order from backend first
suspend fun createOrder(amount: Int): OrderResponse {
    val response = apiService.createPaymentOrder(
        CreateOrderRequest(amount = amount)
    )
    return response
}

// Open Razorpay checkout
fun startPayment(orderId: String, amount: Int) {
    val checkout = Checkout()
    checkout.setKeyID(BuildConfig.RAZORPAY_KEY_ID)
    
    val options = JSONObject()
    options.put("name", "LabDash")
    options.put("description", "Lab Test Payment")
    options.put("order_id", orderId)
    options.put("currency", "INR")
    options.put("amount", amount * 100) // paise
    
    checkout.open(activity, options)
}

// Handle payment result
override fun onPaymentSuccess(razorpayPaymentId: String) {
    // Verify payment on backend
    verifyPayment(razorpayPaymentId)
}
```

---

## 🔌 API Endpoints

### Authentication (Supabase handles most of this automatically)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/auth/profile` | Get user profile |
| PUT | `/api/auth/profile` | Update profile |
| POST | `/api/auth/signout` | Sign out |

### Payments (Razorpay)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/payments/create-order` | Create Razorpay order | No |
| POST | `/api/payments/verify` | Verify payment signature | No |
| POST | `/api/payments/webhook` | Razorpay webhook handler | No |
| GET | `/api/payments/:payment_id` | Get payment details | Optional |

---

## 💡 Usage Examples

### Create Payment Order
```http
POST http://localhost:5000/api/payments/create-order
Content-Type: application/json

{
  "amount": 399,
  "currency": "INR",
  "receipt": "order_rcptid_11",
  "notes": {
    "test_id": "1",
    "user_id": "user_123"
  }
}
```

**Response:**
```json
{
  "success": true,
  "order_id": "order_xxxxx",
  "amount": 39900,
  "currency": "INR",
  "key_id": "rzp_test_xxxxx"
}
```

### Verify Payment
```http
POST http://localhost:5000/api/payments/verify
Content-Type: application/json

{
  "razorpay_order_id": "order_xxxxx",
  "razorpay_payment_id": "pay_xxxxx",
  "razorpay_signature": "signature_xxxxx"
}
```

---

## 🔒 Protected Routes Example

Add authentication middleware to protect routes:

```javascript
const { authenticateUser } = require('../middleware/auth');

// Protect order creation
router.post('/orders', authenticateUser, ordersController.createOrder);

// Protect user profile
router.get('/auth/profile', authenticateUser, authController.getProfile);
```

---

## 🧪 Testing

### Test Payment (Test Mode)
Use Razorpay test cards:
- Card: 4111 1111 1111 1111
- CVV: Any 3 digits
- Expiry: Any future date

### Test Google Login
- Use any Google account
- Works in test mode immediately

---

## 📊 Flow Diagram

### Payment Flow:
1. User selects tests → Total amount calculated
2. Android app calls: `POST /api/payments/create-order`
3. Backend creates Razorpay order → Returns order_id
4. Android app opens Razorpay checkout with order_id
5. User completes payment
6. Android app receives payment_id & signature
7. App calls: `POST /api/payments/verify` 
8. Backend verifies → Updates order status
9. Webhook confirms payment status

### Login Flow:
1. User clicks "Sign in with Google" in Android app
2. Supabase handles OAuth flow
3. User redirected back with access token
4. App stores token
5. Use token in `Authorization: Bearer <token>` header for API calls

---

## ⚠️ Important Notes

1. **Never expose secrets in Android app** - Only use:
   - Supabase ANON key (public)
   - Razorpay KEY_ID (public)

2. **Always verify payments server-side** - Don't trust client

3. **Use HTTPS in production** - HTTP only for local testing

4. **Test mode first** - Switch to live keys when ready

---

## 🎯 Next Steps

1. ✅ Setup Google OAuth credentials
2. ✅ Setup Razorpay account & keys  
3. ✅ Update .env with all keys
4. ✅ Test payment flow with test card
5. ✅ Integrate in Android app
6. ✅ Deploy backend with HTTPS
7. ✅ Switch to production keys

Your backend is now ready for authentication & payments! 🚀
