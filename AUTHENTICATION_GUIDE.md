# 🔐 Authentication System Setup Guide

## ✅ **Kya Complete Ho Gaya:**

### 1. **User Registration & Login System**
- ✅ Signup page with email/phone/password
- ✅ Login page with email/OTP options
- ✅ Admin login page with special password
- ✅ User profile page with order history

### 2. **Backend Authentication**
- ✅ Supabase integration
- ✅ JWT token generation
- ✅ Password hashing with bcrypt
- ✅ OTP generation and verification
- ✅ Auth middleware for protected routes

### 3. **Frontend Navigation**
- ✅ Dynamic navbar (shows Login/Signup OR Profile)
- ✅ Profile dropdown with logout
- ✅ Admin panel link (only for admin users)

### 4. **Admin Protection**
- ✅ Admin login page: `admin-login.html`
- ✅ Admin password: `Admin@12345` (change karna production mein!)
- ✅ Admin panel auto-redirect if not authenticated

---

## 📋 **Setup Instructions:**

### **Step 1: Supabase Tables Create Karein**

1. Supabase Dashboard kholo: https://app.supabase.com
2. Apna project select karo
3. SQL Editor mein jao
4. `backend/database/auth-tables.sql` file ka content copy karo
5. Paste karke **RUN** karo

**Tables created:**
- ✅ `users` - User accounts
- ✅ `otp_verifications` - OTP codes
- ✅ `user_orders` - Order history
- ✅ `user_lab_tests` - Lab test records

### **Step 2: Environment Variables Check Karein**

`backend/.env` file mein ye values honi chahiye:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
JWT_SECRET=labdash-super-secret-jwt-key-2025-production-ready
ADMIN_PASSWORD=Admin@12345
```

### **Step 3: Server Restart Karein**

```bash
cd d:\LabDash\backend
node src/index.js
```

---

## 🎯 **Testing Instructions:**

### **Test 1: User Registration**
1. Visit: `http://localhost:5000/signup.html`
2. Fill form:
   - Name: Test User
   - Email: test@example.com
   - Phone: +91 9876543210
   - Password: Test@123
3. Click "Create Account"
4. Should redirect to login page

### **Test 2: User Login**
1. Visit: `http://localhost:5000/login.html`
2. Enter email + password
3. Click "Login"
4. Should redirect to homepage with profile button visible

### **Test 3: Phone OTP Login**
1. Visit: `http://localhost:5000/login.html`
2. Click "Phone" tab
3. Enter phone number: +91 9876543210
4. Click "Send OTP"
5. Check console for OTP (in development mode)
6. Enter OTP and click "Verify & Login"

### **Test 4: Admin Login**
1. Visit: `http://localhost:5000/admin-login.html`
2. Enter:
   - Email: admin@labdash.com
   - Password: Admin@12345
3. Click "Admin Login"
4. Should redirect to admin dashboard

### **Test 5: Profile Page**
1. Login as normal user
2. Visit: `http://localhost:5000/profile.html`
3. Should show user info and order history
4. Try clicking "Logout"

### **Test 6: Navigation Check**
1. Visit: `http://localhost:5000/`
2. **Before login:** Should show "Login" and "Get Started" buttons
3. **After login:** Should show profile icon with user badge
4. Click profile icon → dropdown should show:
   - User name & email
   - My Profile
   - My Orders
   - Admin Panel (only if admin)
   - Logout

---

## 🔑 **API Endpoints:**

### **Public Endpoints:**
```
POST /api/auth/signup          - User registration
POST /api/auth/login           - Email/password login
POST /api/auth/send-otp        - Send OTP to phone
POST /api/auth/verify-otp      - Verify OTP and login
POST /api/auth/admin-login     - Admin authentication
```

### **Protected Endpoints:**
```
GET /api/auth/me               - Get current user (requires token)
```

**Headers for protected endpoints:**
```
Authorization: Bearer <your_jwt_token>
```

---

## 🛡️ **Security Features:**

1. ✅ **Password Hashing:** bcrypt with 10 salt rounds
2. ✅ **JWT Tokens:** 7 days expiry
3. ✅ **OTP Expiry:** 5 minutes
4. ✅ **Admin Password:** Separate from user passwords
5. ✅ **Route Protection:** Middleware checks JWT
6. ✅ **Role-Based Access:** Admin vs User differentiation

---

## 🔄 **User Flow:**

### **New User:**
```
1. Visit website
2. Click "Get Started" → signup.html
3. Fill registration form
4. Account created → redirected to login.html
5. Login with email/password
6. Redirected to homepage
7. Profile button visible in navbar
8. Can access profile.html
```

### **Existing User:**
```
1. Visit website
2. Click "Login" → login.html
3. Choose email or phone login
4. Enter credentials / OTP
5. Login successful
6. Redirected to homepage with profile access
```

### **Admin User:**
```
1. Visit admin-login.html
2. Enter admin email + Admin@12345
3. Authenticated as admin
4. Redirected to admin.html
5. Can access admin panel
6. Normal users CANNOT access admin panel
```

---

## 📱 **Mobile Responsive:**

All auth pages are fully responsive:
- ✅ Signup page
- ✅ Login page
- ✅ Admin login page
- ✅ Profile page
- ✅ Navigation dropdown

---

## 🚀 **Next Steps (Optional Enhancements):**

1. **Email Verification:** Send verification link to email
2. **Forgot Password:** Password reset via email
3. **Google OAuth:** Social login integration
4. **Phone Number Verification:** Actual SMS via Twilio
5. **2FA (Two-Factor Auth):** Extra security layer
6. **Session Management:** Remember me feature
7. **Activity Logs:** Track user login history

---

## 🐛 **Troubleshooting:**

### **Problem 1: "User not found" after signup**
**Solution:** Check Supabase tables created correctly

### **Problem 2: Admin login failing**
**Solution:** Check ADMIN_PASSWORD in .env file

### **Problem 3: Token expired error**
**Solution:** Logout and login again (JWT expires after 7 days)

### **Problem 4: OTP not working**
**Solution:** Check otp_verifications table exists in Supabase

### **Problem 5: Profile button not showing**
**Solution:** Clear browser localStorage and login again

---

## 📞 **Support:**

Koi issue ho to check karein:
1. Backend server running: `http://localhost:5000`
2. Supabase tables created
3. .env file properly configured
4. Browser console for errors
5. Network tab for API calls

**Default Admin Credentials:**
- Email: `admin@labdash.com`
- Password: `Admin@12345`

⚠️ **IMPORTANT:** Production mein deploy karne se pehle:
1. Change ADMIN_PASSWORD
2. Change JWT_SECRET
3. Remove OTP from API response
4. Enable HTTPS
5. Add rate limiting

---

## ✅ **Summary:**

Aapke website mein ab complete user authentication system hai! 🎉

- ✅ Users apna account bana sakte hain
- ✅ Email/Phone se login kar sakte hain
- ✅ Profile page access kar sakte hain
- ✅ Admin panel sirf admin ke liye accessible
- ✅ Har user ka apna data isolated
- ✅ Secure JWT-based authentication

**Test karo aur batao agar koi problem ho!** 🚀
