// src/models/index.js

const sequelize = require("../config/database");
const Customer = require("./Customer");
const Service = require("./Service");
const Appointment = require("./Appointment"); // Assume you created this file
const Invoice = require("./Invoice");
const InvoiceService = require("./InvoiceService");
const Instruction = require("./Instruction"); // Assume you created this file
const Feedback = require("./Feedback"); // Assume you created this file

// 1-to-Many: Customer -> Invoice
Customer.hasMany(Invoice, { foreignKey: "CarPlate", sourceKey: "CarPlate" });
Invoice.belongsTo(Customer, { foreignKey: "CarPlate", targetKey: "CarPlate" });

// 1-to-Many: Customer -> Appointment
Customer.hasMany(Appointment, {
  foreignKey: "CarPlate",
  sourceKey: "CarPlate",
});
Appointment.belongsTo(Customer, {
  foreignKey: "CarPlate",
  targetKey: "CarPlate",
});

// 1-to-Many: Service -> Appointment
Service.hasMany(Appointment, { foreignKey: "ServiceId" });
Appointment.belongsTo(Service, { foreignKey: "ServiceId" });

// Many-to-Many: Invoice <-> Service (through InvoiceService)
Invoice.belongsToMany(Service, {
  through: InvoiceService,
  foreignKey: "InvoiceId",
  otherKey: "ServiceId",
});
Service.belongsToMany(Invoice, {
  through: InvoiceService,
  foreignKey: "ServiceId",
  otherKey: "InvoiceId",
});

// Other relationships for Instruction and Feedback
// Instruction relationships
Instruction.belongsTo(Customer, {
  foreignKey: "CarPlate",
  targetKey: "CarPlate",
});
Instruction.belongsTo(Service, { foreignKey: "ServiceId" });

// Feedback relationships
Feedback.belongsTo(Customer, {
  foreignKey: "LicensePlate",
  targetKey: "CarPlate",
});
Customer.hasMany(Feedback, {
  foreignKey: "LicensePlate",
  sourceKey: "CarPlate",
});

// Export all models and the sequelize instance
module.exports = {
  sequelize,
  Customer,
  Service,
  Appointment,
  Invoice,
  InvoiceService,
  Instruction,
  Feedback,
};
