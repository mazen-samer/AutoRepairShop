const express = require("express");
const { Service } = require("../src/models");
const router = express.Router();

// GET /api/services - List all services
router.get("/", async (req, res) => {
  try {
    const services = await Service.findAll();
    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: "Error fetching services" });
  }
});

// GET /api/services/:serviceId - Get a service by ServiceId
router.get("/:serviceId", async (req, res) => {
  try {
    const service = await Service.findByPk(req.params.serviceId);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    console.error("Error fetching service:", error);
    res.status(500).json({ message: "Error fetching service" });
  }
});

// POST /api/services - Create a new service
router.post("/", async (req, res) => {
  try {
    const newService = await Service.create(req.body);
    res.status(201).json(newService);
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ message: "Error creating service" });
  }
});

// PUT /api/services/:serviceId - Update a service
router.put("/:serviceId", async (req, res) => {
  try {
    const [updated] = await Service.update(req.body, {
      where: { ServiceId: req.params.serviceId },
    });
    if (!updated) {
      return res.status(404).json({ message: "Service not found" });
    }
    const updatedService = await Service.findByPk(req.params.serviceId);
    res.status(200).json(updatedService);
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ message: "Error updating service" });
  }
});

// DELETE /api/services/:serviceId - Delete a service
router.delete("/:serviceId", async (req, res) => {
  try {
    const deleted = await Service.destroy({
      where: { ServiceId: req.params.serviceId },
    });
    if (!deleted) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ message: "Error deleting service" });
  }
});

module.exports = router; 