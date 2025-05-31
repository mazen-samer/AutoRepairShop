const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Appointment = sequelize.define(
  "Appointment",
  {
    AppointmentId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "AppointmentId",
    },
    CarPlate: {
      type: DataTypes.STRING(50),
      allowNull: false,
      // This is a foreign key, the association is defined in src/models/index.js
    },
    ServiceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // This is a foreign key, the association is defined in src/models/index.js
    },
    AppointmentDate: {
      type: DataTypes.DATEONLY, // Represents a DATE without time
      allowNull: false,
    },
    AppointmentTime: {
      type: DataTypes.TIME, // Represents a TIME
      allowNull: false,
    },
    Staff: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    Status: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        // This replicates the CHECK constraint in your SQL
        isIn: [["Pending", "Completed", "Denied"]],
      },
    },
  },
  {
    tableName: "Appointment",
    timestamps: false, // We don't need createdAt/updatedAt for this table
  }
);

module.exports = Appointment;
