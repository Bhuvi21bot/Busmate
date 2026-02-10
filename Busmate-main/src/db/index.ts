import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

// Create MySQL connection
const connection = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'busmate',
});

console.log('✅ Database connected (MySQL)');

export const db = drizzle(connection);