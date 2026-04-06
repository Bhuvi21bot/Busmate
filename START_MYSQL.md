# 🚀 Quick Start Guide - Fix MySQL Connection Error

## Problem
Your login is failing because **MySQL server is not running**. The error shows:
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```

## Solution - Start MySQL Server

### Step 1: Start MySQL Server

Choose the command for your operating system:

**Linux/Ubuntu:**
```bash
sudo service mysql start
```

**macOS (with Homebrew):**
```bash
brew services start mysql
```

**Windows:**
```bash
net start MySQL80
```

**Docker (if using Docker):**
```bash
docker start mysql
# OR
docker-compose up -d mysql
```

### Step 2: Set MySQL Password (if empty)

If you haven't set a MySQL password, update `.env`:
```env
DB_PASSWORD=your_password_here
```

### Step 3: Create Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE bus_booking;

# Exit MySQL
EXIT;
```

### Step 4: Run Database Migrations

```bash
bun run db:push
```

### Step 5: Start Your App

```bash
bun run dev
```

## ✅ How to Verify It's Working

When you start the dev server, you should see:
```
✅ MySQL connection pool established
```

Instead of:
```
❌ MySQL connection failed: connect ECONNREFUSED
```

## 🔍 Check MySQL Status

**Linux:**
```bash
sudo service mysql status
```

**macOS:**
```bash
brew services list | grep mysql
```

**Windows:**
```bash
sc query MySQL80
```

## 📝 Quick Test Login

After MySQL is running:

1. Go to `/register`
2. Create account with your email
3. Check email for OTP code
4. Verify account
5. Go to `/login`
6. Login successfully! ✅

## 🆘 Still Having Issues?

### Check if MySQL is installed:
```bash
mysql --version
```

### Install MySQL if needed:

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install mysql-server
```

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Windows:**
Download from: https://dev.mysql.com/downloads/installer/

## 🎯 Your Database Credentials

From your `.env` file:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD= (set this!)
DB_NAME=bus_booking
```

---

**After following these steps, your login should work perfectly!** 🚀
