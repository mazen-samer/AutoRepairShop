const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Invoice = sequelize.define(
  "Invoice",
  {
    InvoiceId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "InvoiceId",
    },
    InvoiceDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    CarPlate: {
      // This is the foreign key
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    DueDate: DataTypes.DATEONLY,
    OrderReference: DataTypes.STRING(255),
    Status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        isIn: [["Draft", "Unpaid", "Partially Paid", "Paid", "Cancelled"]],
      },
    },
    InternalReference: DataTypes.STRING(255),
    AdditionalNotes: DataTypes.STRING,
    InvoiceNotes: DataTypes.STRING,
    PaymentMethod: DataTypes.STRING(100),
    AmountPaid: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
  },
  {
    tableName: "Invoice",
    timestamps: false,
  }
);

module.exports = Invoice;
