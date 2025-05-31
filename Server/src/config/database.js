// src/config/database.js

const { Sequelize } = require("sequelize");
require("dotenv").config(); // Import and configure dotenv

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
      // Tedious-specific options
      options: {
        encrypt: false, // Use true for Azure SQL or if you have SSL certificates
        trustServerCertificate: true, // Change to false in production with a valid cert
      },
    },
    logging: console.log, // Set to false to disable logging of SQL queries
  }
);

module.exports = sequelize;
