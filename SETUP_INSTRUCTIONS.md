# 🚀 Bus Mate - Complete Setup Guide

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Bun** (latest version)
- **MySQL** (v8.0 or higher)

## 🗄️ Database Setup

### Step 1: Install MySQL

**Windows:**
```bash
# Download MySQL from: https://dev.mysql.com/downloads/installer/
# Run installer and follow setup wizard
```

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo systemctl enable mysql
```

### Step 2: Secure MySQL Installation

```bash
sudo mysql_secure_installation
```

Follow the prompts to set a root password and secure your installation.

### Step 3: Create Database

Login to MySQL:
```bash
mysql -u root -p
```

Create the database:
```sql
CREATE DATABASE bus_booking;
EXIT;
```

### Step 4: Update Environment Variables

Update your `.env` file with your MySQL password:

```env
# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=bus_booking
```

### Step 5: Run Database Migrations

```bash
bun run drizzle-kit push
```

This will create all necessary tables:
- ✅ user
- ✅ session
- ✅ account
- ✅ verification
- ✅ otp_verification
- ✅ drivers
- ✅ bookings
- ✅ vehicles
- ✅ wallets
- ✅ wallet_transactions
- ✅ reviews

## 📧 Email Configuration (Gmail)

### Step 1: Enable 2-Factor Authentication
1. Go to Google Account settings
2. Security → 2-Step Verification → Enable

### Step 2: Generate App Password
1. Google Account → Security → 2-Step Verification
2. Scroll to "App passwords"
3. Create app password for "Mail"
4. Copy the 16-character password

### Step 3: Update .env
Your `.env` already has Gmail configured:
```env
GMAIL_USER=bhuvaneshpaaraashar@gmail.com
GMAIL_APP_PASSWORD=fbsq eglz calc apqg
EMAIL_FROM=Bus Mate <bhuvaneshpaaraashar@gmail.com>
```

## 🚀 Running the Application

### 1. Install Dependencies
```bash
bun install
```

### 2. Push Database Schema
```bash
bun run drizzle-kit push
```

### 3. Start Development Server
```bash
bun run dev
```

### 4. Access Application
Open [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication Flow

### Registration Process
1. User enters name, email, password
2. System sends 6-digit OTP to email
3. User verifies OTP within 10 minutes
4. Account is created and activated
5. User is redirected to login

### Login Process
1. User enters email and password
2. System validates credentials
3. User is logged in and redirected

## 🧪 Testing OTP in Development

In development mode, the OTP is shown in:
- ✅ Toast notification (on screen)
- ✅ Console logs
- ✅ Email inbox (if Gmail is configured)

## 🔧 Troubleshooting

### MySQL Connection Issues

**Error: "Access denied for user 'root'@'localhost'"**
```bash
# Reset MySQL root password
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_new_password';
FLUSH PRIVILEGES;
EXIT;
```

**Error: "Can't connect to MySQL server"**
```bash
# Check if MySQL is running
sudo systemctl status mysql  # Linux
brew services list | grep mysql  # macOS
```

### Email Sending Issues

**Error: "Invalid login credentials"**
- Verify Gmail App Password is correct
- Ensure 2FA is enabled on Google Account
- Remove spaces from app password in .env

**Emails going to spam:**
- Check spam folder
- Add sender to contacts
- Configure SPF/DKIM records (production only)

### OTP Issues

**OTP expired:**
- OTPs expire after 10 minutes
- Request new code using "Resend" button

**OTP not received:**
- Check spam folder
- Verify email address is correct
- Check console in development mode

## 📱 Features Working

✅ **Authentication**
- Email/Password registration with OTP verification
- Secure login system
- Session management
- Protected routes

✅ **OTP Verification**
- Email-based verification
- 6-digit codes
- 10-minute expiry
- Resend functionality
- Beautiful email templates

✅ **Database**
- MySQL with Drizzle ORM
- Complete schema for bus booking
- Driver management
- Booking system
- Wallet & transactions

✅ **UI/UX**
- Dark/Light theme toggle
- English/Hindi translation
- Responsive design
- Smooth animations
- Toast notifications

## 🎯 Next Steps After Setup

1. ✅ Test registration with real email
2. ✅ Verify OTP email delivery
3. ✅ Test login flow
4. ✅ Check theme toggle
5. ✅ Test language switcher
6. ✅ Explore all pages

## 📞 Support

If you encounter any issues:
1. Check this guide first
2. Review console errors
3. Verify .env configuration
4. Check MySQL connection
5. Test email configuration

---

**Ready to launch!** 🚀 Follow these steps and your Bus Mate application will be fully functional with MySQL database and OTP verification.
