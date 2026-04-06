#!/usr/bin/env bun

/**
 * Setup Verification Script
 * Run this to verify your MySQL database and environment configuration
 */

import mysql from 'mysql2/promise';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const checkMark = '✓';
const crossMark = '✗';

async function verifySetup() {
  console.log(`\n${colors.cyan}🚀 Bus Mate - Setup Verification${colors.reset}\n`);
  
  let allChecksPass = true;

  // 1. Check environment variables
  console.log(`${colors.blue}📋 Checking Environment Variables...${colors.reset}`);
  
  const requiredEnvVars = [
    'DB_HOST',
    'DB_PORT',
    'DB_USER',
    'DB_NAME',
    'BETTER_AUTH_SECRET',
    'GMAIL_USER',
    'GMAIL_APP_PASSWORD',
  ];

  for (const envVar of requiredEnvVars) {
    const value = process.env[envVar];
    if (value && value !== '') {
      console.log(`${colors.green}${checkMark}${colors.reset} ${envVar}: Configured`);
    } else {
      console.log(`${colors.red}${crossMark}${colors.reset} ${envVar}: Missing or empty`);
      allChecksPass = false;
    }
  }

  // Check DB_PASSWORD separately (optional for local dev)
  if (!process.env.DB_PASSWORD || process.env.DB_PASSWORD === '') {
    console.log(`${colors.yellow}⚠${colors.reset} DB_PASSWORD: Empty (this may cause issues)`);
  } else {
    console.log(`${colors.green}${checkMark}${colors.reset} DB_PASSWORD: Configured`);
  }

  console.log('');

  // 2. Check MySQL connection
  console.log(`${colors.blue}🗄️  Testing MySQL Connection...${colors.reset}`);
  
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'bus_booking',
    });

    console.log(`${colors.green}${checkMark}${colors.reset} MySQL connection successful`);

    // Check if tables exist
    const [tables] = await connection.query('SHOW TABLES');
    const tableCount = (tables as any[]).length;
    
    if (tableCount > 0) {
      console.log(`${colors.green}${checkMark}${colors.reset} Found ${tableCount} tables in database`);
      
      // List tables
      console.log(`${colors.cyan}   Tables:${colors.reset}`);
      (tables as any[]).forEach((table: any) => {
        const tableName = Object.values(table)[0];
        console.log(`   - ${tableName}`);
      });
    } else {
      console.log(`${colors.yellow}⚠${colors.reset} No tables found. Run: bun run drizzle-kit push`);
    }

    await connection.end();
  } catch (error: any) {
    console.log(`${colors.red}${crossMark}${colors.reset} MySQL connection failed`);
    console.log(`${colors.red}   Error: ${error.message}${colors.reset}`);
    allChecksPass = false;
  }

  console.log('');

  // 3. Check required packages
  console.log(`${colors.blue}📦 Checking Dependencies...${colors.reset}`);
  
  const requiredPackages = [
    'mysql2',
    'nodemailer',
    'drizzle-orm',
    'better-auth',
  ];

  try {
    const packageJson = await Bun.file('package.json').json();
    const allDeps = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    };

    for (const pkg of requiredPackages) {
      if (allDeps[pkg]) {
        console.log(`${colors.green}${checkMark}${colors.reset} ${pkg}: ${allDeps[pkg]}`);
      } else {
        console.log(`${colors.red}${crossMark}${colors.reset} ${pkg}: Not installed`);
        allChecksPass = false;
      }
    }
  } catch (error) {
    console.log(`${colors.red}${crossMark}${colors.reset} Could not read package.json`);
    allChecksPass = false;
  }

  console.log('');

  // Final summary
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  if (allChecksPass) {
    console.log(`${colors.green}✓ All checks passed! Your setup is ready.${colors.reset}`);
    console.log(`${colors.cyan}  Run: bun run dev${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠ Some checks failed. Please review the errors above.${colors.reset}`);
    console.log(`${colors.cyan}  Refer to: SETUP_INSTRUCTIONS.md${colors.reset}`);
  }
  console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);
}

verifySetup().catch(console.error);
