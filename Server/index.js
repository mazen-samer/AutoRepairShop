const express = require("express");
const { sequelize } = require("./src/models"); // Import DB connection and models
const app = express();
const port = 3000;
const cors = require("cors");

const appointmentsRouter = require("./routes/appointments");
const customersRouter = require("./routes/customers");
const servicesRouter = require("./routes/services");
const invoicesRouter = require("./routes/invoices");
const feedbackRouter = require("./routes/feedback");
const invoiceServicesRouter = require("./routes/invoiceServices");
const instructionsRouter = require("./routes/instructions");
const authRouter = require("./routes/auth"); // <<< ADD THIS LINE

app.use(cors());
app.use(express.json());
app.use("/api/appointments", appointmentsRouter);
app.use("/api/customers", customersRouter);
app.use("/api/services", servicesRouter);
app.use("/api/invoices", invoicesRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/invoiceServices", invoiceServicesRouter);
app.use("/api/instructions", instructionsRouter);
app.use("/api/auth", authRouter); // <<< ADD THIS LINE

const start = async () => {
  try {
    // Test the database connection
    await sequelize.authenticate();
    console.log(
      "✅ Connection to the database has been established successfully."
    );

    // IMPORTANT: Since your tables already exist, we don't need sequelize.sync()
    // await sequelize.sync();
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
