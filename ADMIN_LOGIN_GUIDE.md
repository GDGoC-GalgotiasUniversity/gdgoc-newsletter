# Admin Login & Newsletter Publishing Guide

## Problem: "Invalid Token" Error

If you're getting an "Invalid Token" error when trying to publish a newsletter, it means:
1. You're not logged in as an admin
2. Your token is expired
3. You're using a regular user account (not admin)

## Solution: Login as Admin

### Step 1: Get Admin Credentials

The admin account is created automatically when you run the seed script.

**Default Admin Credentials:**
- Email: `gdgocgu@gmail.com`
- Password: `admin123`

**Location:** `backend/db/seeds/seedData.js`

### Step 2: Run Seed Script (if not done yet)

```bash
cd backend
node run-seed.js
```

**Output should show:**
```
🛡️  Creating Master Admin account...
✅ Admin account created successfully!
```

### Step 3: Login to Admin Panel

1. Go to `http://localhost:3001/login`
2. Enter admin credentials:
   - Email: `gdgocgu@gmail.com`
   - Password: `admin123`
3. Click "Login"
4. You should be redirected to admin dashboard

### Step 4: Create Newsletter

1. Click "Create Newsletter" or go to `http://localhost:3001/admin/new`
2. Fill in the form:
   - **Title**: Your newsletter headline
   - **Slug**: URL-friendly identifier (auto-generated)
   - **Summary**: Brief description
   - **Cover Image**: Drag-and-drop or click to upload
   - **Content**: Write your newsletter content
   - **Status**: Select "Published" to publish immediately

3. Click "Publish" button

### Step 5: Verify Newsletter is Published

- Go to `http://localhost:3001/newsletter` to see published newsletters
- Your newsletter should appear in the list

---

## Troubleshooting

### "Invalid Token" Error

**Cause:** Not logged in as admin

**Solution:**
1. Go to login page: `http://localhost:3001/login`
2. Login with admin credentials
3. Try publishing again

### "Access Denied" Error

**Cause:** Logged in as regular user, not admin

**Solution:**
1. Logout
2. Login with admin account (`gdgocgu@gmail.com`)

### "Authentication Required" Error

**Cause:** Not logged in at all

**Solution:**
1. Go to `http://localhost:3001/login`
2. Login with admin credentials

### Token Expired

**Cause:** Token expires after 24 hours

**Solution:**
1. Logout
2. Login again
3. Token will be refreshed

---

## How Authentication Works

### Login Flow

```
1. User enters email & password
   ↓
2. Backend verifies credentials
   ↓
3. Backend generates JWT token (24 hour expiry)
   ↓
4. Frontend stores token in localStorage
   ↓
5. Token sent with every admin request
```

### Token Structure

```javascript
{
  userId: "user_id_from_database",
  role: "admin",  // Must be "admin" to publish
  iat: 1234567890,
  exp: 1234654290  // Expires in 24 hours
}
```

### Admin Check

When publishing a newsletter:
1. Backend receives token
2. Verifies token signature
3. Checks if role is "admin"
4. If both pass → Newsletter published
5. If either fails → "Invalid Token" or "Access Denied"

---

## Changing Admin Credentials

### Change Admin Email

Edit `backend/db/seeds/seedData.js`:
```javascript
const adminEmail = "your-email@example.com";  // Change this
```

Then run seed script again.

### Change Admin Password

Edit `backend/db/seeds/seedData.js`:
```javascript
const hashedPassword = await bcrypt.hash("your-password", salt);  // Change this
```

Then run seed script again.

---

## Creating Additional Admin Users

### Option 1: Via Database

1. Connect to MongoDB
2. Find the `users` collection
3. Create new user with `role: "admin"`

### Option 2: Via API

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin Name",
    "email": "admin@example.com",
    "password": "password123"
  }'
```

Then manually update role to "admin" in database.

---

## Security Notes

⚠️ **Important for Production:**

1. **Change default password**
   - Don't use `admin123` in production
   - Use strong, unique password

2. **Change JWT_SECRET**
   - Generate random secret:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   - Add to `backend/.env`

3. **Use HTTPS**
   - Always use HTTPS in production
   - Never send tokens over HTTP

4. **Secure localStorage**
   - Tokens stored in localStorage are vulnerable to XSS
   - Consider using httpOnly cookies for production

5. **Token Expiration**
   - Current: 24 hours
   - Consider shorter expiry for production (1-2 hours)

---

## Testing Admin Access

### Test 1: Verify Admin User Exists

```bash
# Connect to MongoDB and run:
db.users.findOne({ email: "gdgocgu@gmail.com" })

# Should return:
{
  _id: ObjectId(...),
  name: "GDG Master Admin",
  email: "gdgocgu@gmail.com",
  role: "admin",
  ...
}
```

### Test 2: Test Login Endpoint

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "gdgocgu@gmail.com",
    "password": "admin123"
  }'

# Should return:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "...",
    "name": "GDG Master Admin",
    "email": "gdgocgu@gmail.com",
    "role": "admin"
  }
}
```

### Test 3: Test Admin Route

```bash
curl -X GET http://localhost:5000/admin/newsletters/all \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Should return newsletters (or empty array if none exist)
```

---

## Quick Start Checklist

- [ ] Run seed script: `node backend/run-seed.js`
- [ ] Verify admin user created
- [ ] Go to login page: `http://localhost:3001/login`
- [ ] Login with `gdgocgu@gmail.com` / `admin123`
- [ ] Go to create newsletter: `http://localhost:3001/admin/new`
- [ ] Fill in newsletter details
- [ ] Upload cover image (drag-drop)
- [ ] Write content
- [ ] Set status to "Published"
- [ ] Click "Publish"
- [ ] Verify newsletter appears in public list

---

## Support

If you still have issues:

1. Check backend logs for errors
2. Verify MongoDB connection
3. Verify JWT_SECRET in `.env`
4. Check browser console for errors
5. Verify token is being sent in Authorization header
6. Check admin user exists in database

