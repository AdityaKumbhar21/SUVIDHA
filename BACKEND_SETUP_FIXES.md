# Backend Setup & Fixes - February 7, 2026

## 🐛 Issues Found & Fixed

### Issue 1: Missing OTP Service File
**Error:** `Cannot find module '../services/otp'`
- **Cause:** Auth controller was trying to import OTP functions from a service file that didn't exist
- **Solution:** Created `backend/src/services/otp.js` with `sendOtp()` and `verifyOtp()` functions

### Issue 2: Incorrect Import Paths
**Errors in `backend/src/controllers/auth.js`:**
- ❌ `require('../utils/validators')` → ✅ `require('../lib/validators')`
- ❌ `require('../utils/customError')` → ✅ `require('../lib/customError')`
- **Cause:** Files were in `lib/` folder, not `utils/` folder
- **Solution:** Fixed both import paths to point to the correct location

### Issue 3: Response Format Mismatch
**Problem:** Auth endpoints were not returning the expected response format
- Frontend expects: `{ success: true, token, userId, message }`
- Backend was returning: `{ token, user: {...} }`
- **Solution:** Updated both handlers to include `success: true` field and proper response structure

---

## 📋 Files Created

### `backend/src/services/otp.js`
- Handles OTP generation and verification
- Uses Twilio for WhatsApp delivery
- Implements:
  - `sendOtp(mobile)` - Generate and send 6-digit OTP valid for 5 minutes
  - `verifyOtp(mobile, otp)` - Verify OTP with attempt tracking (max 5 attempts)
  - Bcrypt hashing for OTP security
  - Automatic OTP cleanup on expiry or successful verification

---

## 🔧 Files Modified

### `backend/src/controllers/auth.js`
Changes made:
1. Fixed import paths (utils → lib)
2. Added `success: true` to sendOtp response
3. Added `success: true` and `userId` to verifyOtp response
4. Aligned response format with frontend expectations

---

## ⚙️ Required Environment Variables

Create a `.env` file in the `backend/` folder with:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/suvidha

# JWT
JWT_SECRET=your-secret-key-here-min-32-chars

# Twilio (for OTP via WhatsApp)
TWILIO_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token

# Optional
PORT=5000
NODE_ENV=development
```

### Getting Twilio Credentials:
1. Sign up at https://www.twilio.com
2. Go to Console → Account info
3. Copy Account SID and Auth Token
4. Set up WhatsApp Sandbox or Business Account

---

## ✅ Status Check

Run these commands to verify setup:

```bash
# Backend: Check if server starts
cd backend
npm run dev

# Expected output:
# SUVIDHA backend running on port 5000
# No errors about missing modules
```

---

## 🧪 Testing Authentication Flow

### 1. Send OTP
```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210"}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

### 2. Verify OTP
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "9876543210", "otp": "123456"}'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGc...",
  "userId": "user_uuid",
  "message": "Authentication successful"
}
```

---

## 📝 API Response Format

All endpoints now follow this format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": { ... }
}
```

---

## 🚀 Next Steps

1. **Set up database:** Create PostgreSQL database and run migrations
   ```bash
   cd backend
   npx prisma migrate dev
   ```

2. **Start backend server:**
   ```bash
   npm run dev
   ```

3. **Verify frontend connection:** Update `frontend/.env.local` to point to backend URL

4. **Test authentication flow:** From frontend login page

---

## 🔐 Security Notes

- OTP tokens are bcrypt hashed (not stored in plain text)
- OTP expires after 5 minutes
- Maximum 5 failed attempts per OTP
- JWT tokens expire after 60 minutes
- All mobile numbers normalized to +91 format
- Sensitive data (tokens, OTPs) never logged

---

## 📞 Troubleshooting

### "Cannot find module" error
- Check file paths in import statements
- Verify file exists in the path specified
- Use relative paths like `../lib/file`

### "OTP not found" error
- OTP might be expired (5 min timeout)
- Phone number format might be different
- Check if OTP table exists in database

### No Twilio credentials error
- Add TWILIO_SID and TWILIO_AUTH_TOKEN to .env
- Restart backend after adding environment variables
- Use absolute path for .env loading

### Database connection error
- Verify PostgreSQL is running
- Check DATABASE_URL format in .env
- Ensure database name exists
- Run migrations: `npx prisma migrate dev`

---

## 📊 Backend API Endpoints

| Method | Endpoint | Handler | Status |
|--------|----------|---------|--------|
| POST | `/api/auth/send-otp` | sendOtpHandler | ✅ Fixed |
| POST | `/api/auth/verify-otp` | verifyOtpHandler | ✅ Fixed |
| GET | `/api/profile` | getMyProfile | - |
| PATCH | `/api/profile` | updateProfile | - |
| POST | `/api/complaint` | createComplaint | - |
| ... | ... | ... | - |

---

**Setup Status:** ✅ Backend authentication ready for testing
**Last Updated:** February 7, 2026
