const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const InvoiceService = sequelize.define(
  "InvoiceService",
  {
    InvoiceServiceId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "InvoiceServiceId",
    },
    InvoiceId: {
      // Foreign key
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    ServiceId: {
      // Foreign key
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    UnitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    Quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "InvoiceService",
    timestamps: false,
  }
);

module.exports = InvoiceService;
