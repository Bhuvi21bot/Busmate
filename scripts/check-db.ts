import mysql from "mysql2/promise";

async function checkDb() {
  console.log("Checking database...");
  try {
    const connection = await mysql.createConnection({
      host: "127.0.0.1",
      port: 3306,
      user: "root",
      password: "root",
    });

    console.log("Connected to MySQL!");
    const [rows] = await connection.query("SHOW DATABASES LIKE 'busmate'");
    
    if ((rows as any[]).length === 0) {
      console.log("Database 'busmate' not found. Creating it...");
      await connection.query("CREATE DATABASE busmate");
      console.log("Database 'busmate' created!");
    } else {
      console.log("Database 'busmate' already exists.");
    }

    await connection.end();
  } catch (error) {
    console.error("Error checking/creating database:", error);
  }
}

checkDb();
