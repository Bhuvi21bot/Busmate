# 🚀 Quick Start Guide - Fix OTP & Login Issues

## ❌ Current Problem

Your MySQL database server is **not running**. This causes:
- ❌ OTP email sending to fail (can't store OTP in database)
- ❌ Login/Register not working (can't query user data)
- ❌ Session not persisting (can't save session tokens)

## ✅ Solution (Just 3 Steps!)

### Step 1: Start MySQL Server

Choose your operating system:

#### **Linux/Ubuntu:**
```bash
sudo service mysql start
# OR
sudo systemctl start mysql
```

#### **macOS (with Homebrew):**
```bash
brew services start mysql
# OR
mysql.server start
```

#### **Windows:**
```bash
net start MySQL80
# OR use MySQL Workbench to start the server
```

#### **Docker (if using Docker):**
```bash
docker start mysql-container-name
# OR
docker-compose up -d mysql
```

### Step 2: Verify MySQL is Running

```bash
# Check MySQL status
mysql --version

# Try to connect (you'll be prompted for password)
mysql -u root -p

# If connection works, you'll see:
# mysql>
```

Inside MySQL console, verify database exists:
```sql
SHOW DATABASES;
# Should show 'bus_booking' in the list

# If not, create it:
CREATE DATABASE bus_booking;

# Exit MySQL
EXIT;
```

### Step 3: Push Database Schema

```bash
# This creates all tables in your database
bun run db:push
```

You should see output like:
```
✅ Tables created successfully
✅ Schema is synced
```

## 🎯 Test Everything Works

### 1. Check Server Logs
After MySQL starts, your dev server logs should show:
```
✅ MySQL connection pool established
```

### 2. Test Registration
1. Go to: `http://localhost:3000/register`
2. Fill in your details with **real email**
3. Click "Continue"
4. **Check your email inbox** for OTP code
5. Enter the 6-digit code
6. ✅ Account created!

### 3. Test Login
1. Go to: `http://localhost:3000/login`
2. Enter your credentials
3. ✅ Login successful!
4. ✅ Header shows your name (not Login/Register buttons)

## 🔧 Troubleshooting

### MySQL Won't Start?

**Error: "MySQL is not installed"**
```bash
# Linux/Ubuntu
sudo apt-get install mysql-server

# macOS
brew install mysql

# Windows - Download from:
https://dev.mysql.com/downloads/installer/
```

**Error: "Access denied for user 'root'"**
- Update password in `.env` file:
```env
DB_PASSWORD=your_actual_mysql_password
```

**Error: "Can't connect through socket"**
- MySQL might be using a different port
- Check your MySQL configuration

### Still Not Working?

1. **Check .env file** has correct values:
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bus_booking
```

2. **Restart dev server** after MySQL starts:
```bash
# Kill and restart
pkill -f "next dev"
bun run dev
```

3. **Check MySQL is listening on port 3306:**
```bash
# Linux/macOS
netstat -an | grep 3306

# Should show: tcp 0.0.0.0:3306 LISTEN
```

## 📧 Email Configuration

Your Gmail SMTP is already configured! Once MySQL starts, OTP emails will be sent automatically to:
- **From:** Your Gmail (set in .env)
- **To:** User's registration email
- **Contains:** Beautiful green-on-black themed 6-digit OTP
- **Expires:** 10 minutes

Make sure these are set in `.env`:
```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
```

## ✅ Success Checklist

- [ ] MySQL server is running
- [ ] Database `bus_booking` exists
- [ ] Schema is pushed (`bun run db:push`)
- [ ] Dev server shows "MySQL connection pool established"
- [ ] Registration sends OTP email
- [ ] OTP verification works
- [ ] Login successful
- [ ] Header shows user account menu

---

## 🎉 Once MySQL Starts, Everything Works!

All your features are ready:
- ✅ OTP email verification
- ✅ Secure authentication
- ✅ Session management
- ✅ Beautiful UI with dark/light themes
- ✅ English/Hindi translations
- ✅ Bus booking system
- ✅ Driver dashboard
- ✅ Wallet management
- ✅ Payment integration (Razorpay)

**Just start MySQL and you're good to go!** 🚀
