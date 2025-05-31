const express = require("express");
const { sequelize, Customer } = require("./src/models"); // Import DB connection and models

const app = express();
const port = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Hello World! Welcome to the Auto Repair Shop API! 🚗");
});

// A new test route to verify the database connection and model usage
app.get("/customers", async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Error fetching customers" });
  }
});

// The main logic to start the server
const start = async () => {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log(
      "✅ Connection to the database has been established successfully."
    );

    // IMPORTANT: Since your tables already exist, we don't need sequelize.sync()

    // Start the Express server only after the DB connection is successful
    app.listen(port, () => {
      console.log(`🚀 Server is listening on port ${port}`);
    });
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  }
};

// Run the function to start the server
start();
