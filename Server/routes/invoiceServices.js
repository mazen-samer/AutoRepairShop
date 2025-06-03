const express = require("express");
const { InvoiceService } = require("../src/models");
const router = express.Router();

// GET /api/invoiceServices - List all invoice services
router.get("/", async (req, res) => {
  try {
    const invoiceServices = await InvoiceService.findAll();
    res.status(200).json(invoiceServices);
  } catch (error) {
    console.error("Error fetching invoice services:", error);
    res.status(500).json({ message: "Error fetching invoice services" });
  }
});

// GET /api/invoiceServices/:invoiceServiceId - Get an invoice service by InvoiceServiceId
router.get("/:invoiceServiceId", async (req, res) => {
  try {
    const invoiceService = await InvoiceService.findByPk(req.params.invoiceServiceId);
    if (!invoiceService) {
      return res.status(404).json({ message: "InvoiceService not found" });
    }
    res.status(200).json(invoiceService);
  } catch (error) {
    console.error("Error fetching invoice service:", error);
    res.status(500).json({ message: "Error fetching invoice service" });
  }
});

// POST /api/invoiceServices - Create a new invoice service
router.post("/", async (req, res) => {
  try {
    const newInvoiceService = await InvoiceService.create(req.body);
    res.status(201).json(newInvoiceService);
  } catch (error) {
    console.error("Error creating invoice service:", error);
    res.status(500).json({ message: "Error creating invoice service" });
  }
});

// PUT /api/invoiceServices/:invoiceServiceId - Update an invoice service
router.put("/:invoiceServiceId", async (req, res) => {
  try {
    const [updated] = await InvoiceService.update(req.body, {
      where: { InvoiceServiceId: req.params.invoiceServiceId },
    });
    if (!updated) {
      return res.status(404).json({ message: "InvoiceService not found" });
    }
    const updatedInvoiceService = await InvoiceService.findByPk(req.params.invoiceServiceId);
    res.status(200).json(updatedInvoiceService);
  } catch (error) {
    console.error("Error updating invoice service:", error);
    res.status(500).json({ message: "Error updating invoice service" });
  }
});

// DELETE /api/invoiceServices/:invoiceServiceId - Delete an invoice service
router.delete("/:invoiceServiceId", async (req, res) => {
  try {
    const deleted = await InvoiceService.destroy({
      where: { InvoiceServiceId: req.params.invoiceServiceId },
    });
    if (!deleted) {
      return res.status(404).json({ message: "InvoiceService not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting invoice service:", error);
    res.status(500).json({ message: "Error deleting invoice service" });
  }
});

module.exports = router; 