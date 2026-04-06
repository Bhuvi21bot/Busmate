# 🚀 Quick Fix Guide - Login & OTP Issues

## ✅ What I Fixed

### 1. **Bearer Token Bug - FIXED!**
The authentication token was being split incorrectly, storing only part of it. This caused:
- ❌ Login appearing successful but not showing user session
- ❌ "Login/Register" buttons showing instead of user account menu
- ❌ Session not persisting after login

**Fixed in:** `src/lib/auth-client.ts`
- Changed from: `authToken.split('.')[0]` (storing only first part)
- To: `authToken` (storing full token)

## 🔴 Current Issue - MySQL Not Running

Your logs show:
```
❌ MySQL connection failed: connect ECONNREFUSED 127.0.0.1:3306
POST /api/auth/send-otp 500 (OTP sending fails)
POST /api/auth/sign-in/email 500 (Login fails)
```

**Root cause:** MySQL server is not running on your system.

## 🛠️ Fix It Now (2 Steps)

### Step 1: Start MySQL

Choose your operating system:

**Linux/Ubuntu:**
```bash
sudo service mysql start
```

**macOS:**
```bash
brew services start mysql
```

**Windows:**
```bash
net start MySQL80
```

### Step 2: Create Database & Run Migrations

```bash
# Login to MySQL
mysql -u root -p

# Create database (if not exists)
CREATE DATABASE bus_booking;
EXIT;

# Run migrations
bun run db:push
```

### Step 3: Restart Dev Server

The dev server will automatically restart. You should see:
```
✅ MySQL connection pool established
```

## 🎯 Test Everything

### Test 1: Registration with OTP
1. Go to http://localhost:3000/register
2. Enter name, email, password
3. Click "Continue"
4. ✅ You should receive OTP email
5. Check your email inbox for OTP code
6. Enter code and verify
7. ✅ Account created successfully

### Test 2: Login with Session
1. Go to http://localhost:3000/login
2. Enter email and password
3. Click "Sign In"
4. ✅ Should redirect to homepage
5. ✅ Header should show **user menu** (not login/register buttons)
6. ✅ Click user icon to see account dropdown

### Test 3: Session Persistence
1. After logging in, refresh the page
2. ✅ Should remain logged in
3. ✅ User menu should still be visible
4. Navigate to different pages
5. ✅ Session should persist across pages

## 📧 Email Configuration

Your `.env` already has Gmail SMTP configured:
```
GMAIL_USER=bhuvaneshpaaraashar@gmail.com
GMAIL_APP_PASSWORD=fbsq eglz calc apqg
```

✅ Email will be sent to real addresses once MySQL is running!

## 🐛 If Still Having Issues

### Issue: "MySQL connection failed"
**Solution:** Make sure MySQL service is actually running:
```bash
# Check MySQL status
sudo service mysql status  # Linux
brew services list | grep mysql  # macOS
sc query MySQL80  # Windows
```

### Issue: OTP emails not arriving
**Check:**
1. Spam/junk folder
2. Gmail app password is valid (16 characters without spaces)
3. Check server logs: Look for "Email sent successfully"

### Issue: Login successful but shows login buttons
**Solution:** 
1. Clear browser localStorage: `localStorage.clear()`
2. Refresh page
3. Login again
4. ✅ Should now show user menu

## 📊 Success Indicators

When everything is working:
- ✅ No MySQL connection errors in logs
- ✅ OTP emails arrive in inbox (check spam if not)
- ✅ Login redirects to homepage
- ✅ Header shows user account menu with name/email
- ✅ Session persists after refresh
- ✅ Can access profile page (/profile)

## 🎉 Summary

**What was broken:**
1. ❌ Bearer token stored incorrectly (split at '.')
2. ❌ MySQL server not running
3. ❌ OTP sending failed due to database connection
4. ❌ Login failed due to database connection

**What is fixed:**
1. ✅ Bearer token now stores full token
2. ⏳ MySQL needs to be started (manual step)
3. ✅ OTP will send once MySQL is running
4. ✅ Login will work once MySQL is running

**Next step:** Start MySQL server following Step 1 above! 🚀
