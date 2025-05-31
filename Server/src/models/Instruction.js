const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Instruction = sequelize.define(
  "Instruction",
  {
    InstructionId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: "InstructionId",
    },
    ServiceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // Foreign key association is in src/models/index.js
    },
    CarPlate: {
      type: DataTypes.STRING(50),
      allowNull: false,
      // Foreign key association is in src/models/index.js
    },
    InstructionsBefore: {
      type: DataTypes.STRING, // Corresponds to NVARCHAR(MAX)
      allowNull: true,
    },
    InstructionsDuring: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    InstructionsAfter: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "Instruction",
    timestamps: false,
  }
);

module.exports = Instruction;
