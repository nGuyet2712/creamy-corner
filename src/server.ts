import * as dotenv from "dotenv";
// import path from "path";
import { Sequelize } from "sequelize";

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

import app from "./app";

const sequelize = new Sequelize({
  database: process.env.DB_DATABASE_NAME || "",
  username: process.env.DB_MASTER_USER_NAME || "",
  password: String(process.env.DB_MASTER_USER_PASSWORD),
  host: process.env.DB_ENDPOINT || "",
  port: Number(process.env.DB_PORT),
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// const pool = new Pool({
//   user: process.env.DB_MASTER_USER_NAME,
//   host: process.env.DB_ENDPOINT,
//   database: process.env.DB_DATABASE_NAME,
//   password: process.env.DB_MASTER_USER_PASSWORD,
//   port: parseInt(process.env.DB_PORT || "5432"),
// });

const server = app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}...`);
});

process.on("unhandledRejection", (err: Error) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on("SIGTERM", () => {
  console.log("👋 SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("💥 Process terminated!");
  });
});
