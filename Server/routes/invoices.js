const express = require("express");
const { Invoice } = require("../src/models");
const router = express.Router();

// GET /api/invoices - List all invoices
router.get("/", async (req, res) => {
  try {
    const invoices = await Invoice.findAll();
    res.status(200).json(invoices);
  } catch (error) {
    console.error("Error fetching invoices:", error);
    res.status(500).json({ message: "Error fetching invoices" });
  }
});

// GET /api/invoices/:invoiceId - Get an invoice by InvoiceId
router.get("/:invoiceId", async (req, res) => {
  try {
    const invoice = await Invoice.findByPk(req.params.invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.status(200).json(invoice);
  } catch (error) {
    console.error("Error fetching invoice:", error);
    res.status(500).json({ message: "Error fetching invoice" });
  }
});

// POST /api/invoices - Create a new invoice
router.post("/", async (req, res) => {
  try {
    const newInvoice = await Invoice.create(req.body);
    res.status(201).json(newInvoice);
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({ message: "Error creating invoice" });
  }
});

// PUT /api/invoices/:invoiceId - Update an invoice
router.put("/:invoiceId", async (req, res) => {
  try {
    const [updated] = await Invoice.update(req.body, {
      where: { InvoiceId: req.params.invoiceId },
    });
    if (!updated) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    const updatedInvoice = await Invoice.findByPk(req.params.invoiceId);
    res.status(200).json(updatedInvoice);
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).json({ message: "Error updating invoice" });
  }
});

// DELETE /api/invoices/:invoiceId - Delete an invoice
router.delete("/:invoiceId", async (req, res) => {
  try {
    const deleted = await Invoice.destroy({
      where: { InvoiceId: req.params.invoiceId },
    });
    if (!deleted) {
      return res.status(404).json({ message: "Invoice not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting invoice:", error);
    res.status(500).json({ message: "Error deleting invoice" });
  }
});

module.exports = router;
