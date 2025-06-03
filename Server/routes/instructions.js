const express = require("express");
const { Instruction } = require("../src/models");
const router = express.Router();

// GET /api/instructions - List all instructions
router.get("/", async (req, res) => {
  try {
    const instructions = await Instruction.findAll();
    res.status(200).json(instructions);
  } catch (error) {
    console.error("Error fetching instructions:", error);
    res.status(500).json({ message: "Error fetching instructions" });
  }
});

// GET /api/instructions/:instructionId - Get an instruction by InstructionId
router.get("/:instructionId", async (req, res) => {
  try {
    const instruction = await Instruction.findByPk(req.params.instructionId);
    if (!instruction) {
      return res.status(404).json({ message: "Instruction not found" });
    }
    res.status(200).json(instruction);
  } catch (error) {
    console.error("Error fetching instruction:", error);
    res.status(500).json({ message: "Error fetching instruction" });
  }
});

// POST /api/instructions - Create a new instruction
router.post("/", async (req, res) => {
  try {
    const newInstruction = await Instruction.create(req.body);
    res.status(201).json(newInstruction);
  } catch (error) {
    console.error("Error creating instruction:", error);
    res.status(500).json({ message: "Error creating instruction" });
  }
});

// PUT /api/instructions/:instructionId - Update an instruction
router.put("/:instructionId", async (req, res) => {
  try {
    const [updated] = await Instruction.update(req.body, {
      where: { InstructionId: req.params.instructionId },
    });
    if (!updated) {
      return res.status(404).json({ message: "Instruction not found" });
    }
    const updatedInstruction = await Instruction.findByPk(req.params.instructionId);
    res.status(200).json(updatedInstruction);
  } catch (error) {
    console.error("Error updating instruction:", error);
    res.status(500).json({ message: "Error updating instruction" });
  }
});

// DELETE /api/instructions/:instructionId - Delete an instruction
router.delete("/:instructionId", async (req, res) => {
  try {
    const deleted = await Instruction.destroy({
      where: { InstructionId: req.params.instructionId },
    });
    if (!deleted) {
      return res.status(404).json({ message: "Instruction not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting instruction:", error);
    res.status(500).json({ message: "Error deleting instruction" });
  }
});

module.exports = router; 