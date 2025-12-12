# Admin Login Troubleshooting Guide

## ✅ Database Verification Complete

The admin user exists and is correctly configured:
- **Email**: `admin@sajhakirana.com`
- **Password**: `admin123`
- **Role**: `admin`
- **Password Hash**: Valid and working

## 🔍 Test Results

All backend checks passed:
1. ✅ User exists in database
2. ✅ User has admin role
3. ✅ Password hash validates correctly
4. ✅ Backend authentication logic works

## ❌ Common Causes of 401 Error

Since the backend is working, the 401 error is likely caused by:

### 1. **Wrong Credentials**
You might be using incorrect email or password. Double-check:
- Email: `admin@sajhakirana.com` (NOT `admin@example.com`)
- Password: `admin123`

### 2. **Extra Spaces**
Check for accidental spaces:
- Before/after email
- Before/after password

### 3. **Wrong Login Endpoint**
Make sure you're using:
- `/admin/login` page (NOT `/login`)
- URL: `http://localhost:5173/admin/login`

### 4. **Backend Not Running**
Verify backend server is running on port 5003:
```bash
cd backend
npm run dev
```

### 5. **CORS Issues**
Check browser console for CORS errors

## 🧪 Test the Backend Directly

### Using cURL:
```bash
curl -X POST http://localhost:5003/auth/admin/login \
  -H "Content-Type: application/json" \
  -d "{\"identifier\":\"admin@sajhakirana.com\",\"password\":\"admin123\"}"
```

### Expected Response:
```json
{
  "success": true,
  "message": "Admin login successful",
  "user": {
    "userId": 1,
    "name": "Admin User",
    "email": "admin@sajhakirana.com",
    "role": "admin"
  },
  "token": "eyJhbGc..."
}
```

### If You Get 401:
Check the error message in the response:
- "User with this email does not exist" → Wrong email
- "This account does not have admin privileges" → User exists but not admin
- "Incorrect password" → Wrong password

## 🔧 Quick Fixes

### Reset Admin Password:
If you forgot the password, run:
```bash
cd backend
npx tsx -e "
import { prismaClient } from './src/config/client.js';
import bcrypt from 'bcrypt';

const newPassword = 'newpassword123';
const hash = await bcrypt.hash(newPassword, 10);

await prismaClient.user.update({
  where: { email: 'admin@sajhakirana.com' },
  data: { password: hash }
});

console.log('Password updated to:', newPassword);
await prismaClient.\$disconnect();
"
```

### Create New Admin:
```bash
cd backend
npm run seed:admin
```

## 📝 Correct Login Steps

1. Make sure backend is running: `cd backend && npm run dev`
2. Open browser: `http://localhost:5173/admin/login`
3. Enter credentials:
   - Email: `admin@sajhakirana.com`
   - Password: `admin123`
4. Click "Sign In"

## 🐛 Check Backend Logs

When you try to login, check the backend console for logs like:
```
[Admin Login] Attempting login for: admin@sajhakirana.com
[Admin Login] Login successful for: admin@sajhakirana.com
```

If you see error logs, they will tell you exactly what's wrong.
