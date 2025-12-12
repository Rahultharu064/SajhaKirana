# Admin Authentication Quick Start Guide

## Step 1: Create Your First Admin User

Run the seed script to create an initial admin user:

```bash
cd backend
npm run seed:admin
```

**Default Credentials:**
- Email: `admin@sajhakirana.com`
- Password: `admin123`

> **Note**: You can customize these credentials using environment variables:
> - `ADMIN_NAME`
> - `ADMIN_EMAIL`
> - `ADMIN_PASSWORD`

## Step 2: Test Admin Login

### Option A: Using the Frontend

1. Navigate to: `http://localhost:5173/admin/login`
2. Enter the admin credentials
3. Click "Sign In"
4. You'll be redirected to the admin dashboard

### Option B: Using cURL

```bash
curl -X POST http://localhost:5003/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "admin@sajhakirana.com",
    "password": "admin123"
  }'
```

## Step 3: Create Additional Admin Users (Optional)

### Via Frontend:
Navigate to: `http://localhost:5173/admin/create`

### Via API:
```bash
curl -X POST http://localhost:5003/auth/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Admin",
    "email": "newadmin@example.com",
    "password": "securepassword123"
  }'
```

## Troubleshooting

### Error: "User with this email does not exist"
- The user account doesn't exist
- Run the seed script or create an admin user

### Error: "This account does not have admin privileges"
- The user exists but has role 'customer', not 'admin'
- Update the user's role in the database:
  ```sql
  UPDATE User SET role = 'admin' WHERE email = 'your-email@example.com';
  ```

### Error: "Incorrect password"
- The password is wrong
- Reset the password or use the correct one

## Files Created/Modified

### Backend:
- ✅ `backend/src/controllers/authController.ts` - Enhanced error messages
- ✅ `backend/src/middlewares/roleMiddleware.ts` - Role-based authorization
- ✅ `backend/src/scripts/seedAdmin.ts` - Admin seed script
- ✅ `backend/package.json` - Added seed:admin script

### Frontend:
- ✅ `frontend/src/pages/Admin/AdminLogin.tsx` - Admin login page
- ✅ `frontend/src/pages/Admin/CreateAdmin.tsx` - Admin creation page
- ✅ `frontend/src/routes/index.tsx` - Added admin routes

## Next Steps

1. **Change the default password** after first login
2. **Protect the `/admin/create` endpoint** in production
3. **Add role-based middleware** to admin routes using `requireAdmin` from `roleMiddleware.ts`
