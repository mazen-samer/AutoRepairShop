const express = require("express");
const { Customer } = require("../src/models");
const router = express.Router();

// GET /api/customers - List all customers
router.get("/", async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ message: "Error fetching customers" });
  }
});

// GET /api/customers/:carPlate - Get a customer by CarPlate
router.get("/:carPlate", async (req, res) => {
  try {
    const customer = await Customer.findByPk(req.params.carPlate);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    res.status(500).json({ message: "Error fetching customer" });
  }
});

// POST /api/customers - Create a new customer
router.post("/", async (req, res) => {
  try {
    const newCustomer = await Customer.create(req.body);
    res.status(201).json(newCustomer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({ message: "Error creating customer" });
  }
});

// PUT /api/customers/:carPlate - Update a customer
router.put("/:carPlate", async (req, res) => {
  try {
    const [updated] = await Customer.update(req.body, {
      where: { CarPlate: req.params.carPlate },
    });
    if (!updated) {
      return res.status(404).json({ message: "Customer not found" });
    }
    const updatedCustomer = await Customer.findByPk(req.params.carPlate);
    res.status(200).json(updatedCustomer);
  } catch (error) {
    console.error("Error updating customer:", error);
    res.status(500).json({ message: "Error updating customer" });
  }
});

// DELETE /api/customers/:carPlate - Delete a customer
router.delete("/:carPlate", async (req, res) => {
  try {
    const deleted = await Customer.destroy({
      where: { CarPlate: req.params.carPlate },
    });
    if (!deleted) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting customer:", error);
    res.status(500).json({ message: "Error deleting customer" });
  }
});

module.exports = router; 