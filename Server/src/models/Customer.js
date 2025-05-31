const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Customer = sequelize.define(
  "Customer",
  {
    CarPlate: {
      type: DataTypes.STRING(50),
      primaryKey: true, // This is our primary key
      allowNull: false,
      field: "CarPlate",
    },
    Name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    PhoneNumber: DataTypes.STRING(50),
    Email: DataTypes.STRING(255),
    Mileage: DataTypes.INTEGER,
    BillingAddress: DataTypes.STRING,
    ShippingAddress: DataTypes.STRING,
    TaxIdentificationNumber: DataTypes.STRING(100),
    Status: DataTypes.STRING(50),
  },
  {
    tableName: "Customer",
    timestamps: false,
  }
);

module.exports = Customer;
