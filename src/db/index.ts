import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var __dbPool: mysql.Pool | undefined;
}

const connection =
  global.__dbPool ??
  mysql.createPool({
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: parseInt(process.env.MYSQL_PORT || "3306", 10),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "busmate",
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

if (!global.__dbPool) {
  global.__dbPool = connection;
  console.log("Database pool initialized (MySQL)");
}

export const db = drizzle(connection);
