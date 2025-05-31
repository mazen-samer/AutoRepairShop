const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Service = sequelize.define(
  "Service",
  {
    ServiceId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "ServiceId", // Explicitly map to the column name
    },
    Name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    Description: {
      type: DataTypes.STRING, // Corresponds to NVARCHAR(MAX)
      allowNull: true,
    },
    Tax: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    Discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
  },
  {
    tableName: "Service", // Link to the existing table
    timestamps: false, // Disable createdAt/updatedAt columns
  }
);

module.exports = Service;
