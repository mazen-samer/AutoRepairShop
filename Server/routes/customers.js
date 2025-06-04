const express = require("express");
const { Customer, Invoice, Service, InvoiceService } = require("../src/models");
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

router.get("/:carPlate/servicing-history", async (req, res) => {
  try {
    const carPlateParam = req.params.carPlate;

    const customer = await Customer.findByPk(carPlateParam);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Fetch invoices for the customer and include the associated services
    // Sequelize knows to go through InvoiceService because of the belongsToMany definition
    const invoices = await Invoice.findAll({
      where: { CarPlate: carPlateParam },
      include: [
        {
          model: Service, // Directly include the Service model
          attributes: ["ServiceId", "Name", "Price", "Description"], // Specify attributes of Service you want
          // By default, Sequelize will use the plural model name for the alias, so 'Services'
          // If you defined an 'as' alias in Invoice.belongsToMany(Service, { as: 'MyAlias', ...}), use that here.
          through: {
            attributes: [], // This ensures we don't get attributes from the InvoiceService junction table itself
          },
        },
      ],
      // We don't strictly need invoice attributes if we only care about the services,
      // but keeping InvoiceId might be useful for debugging or future expansion.
      attributes: ["InvoiceId", "CarPlate"],
    });

    if (!invoices || invoices.length === 0) {
      return res.status(200).json([]); // No invoices for this customer, so no service history
    }

    // Process the results to get a unique list of services
    const servicesRendered = new Map();

    invoices.forEach((invoice) => {
      // When using belongsToMany, the associated models are usually available
      // as a pluralized property (e.g., invoice.Services)
      // Please verify the exact property name by logging an 'invoice' object if it doesn't work.
      const associatedServices = invoice.Services; // Default alias is often plural: "Services"

      if (associatedServices && associatedServices.length > 0) {
        associatedServices.forEach((service) => {
          if (service && !servicesRendered.has(service.ServiceId)) {
            servicesRendered.set(service.ServiceId, {
              ServiceId: service.ServiceId,
              Name: service.Name,
              Price: service.Price,
              Description: service.Description,
            });
          }
        });
      }
    });

    res.status(200).json(Array.from(servicesRendered.values()));
  } catch (error) {
    console.error("Error fetching customer servicing history:", error);
    // Send back the actual error for more detailed client-side debugging if needed
    res.status(500).json({
      message: "Error fetching customer servicing history",
      error: error.message,
    });
  }
});

module.exports = router;
