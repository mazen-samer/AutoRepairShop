const express = require("express");
const { Appointment } = require("../src/models"); // Adjust the path as necessary
const router = express.Router();

// GET /api/appointments: Retrieve a list of all appointments
router.get("/", async (req, res) => {
    try {
        const appointments = await Appointment.findAll();
        res.status(200).json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Error fetching appointments" });
    }
});

// POST /api/appointments: Create a new appointment
router.post("/", async (req, res) => {
    try {
        console.log(req.body);
        // create a new appointment js object 

        const newAppointment = await Appointment.create(req.body);
        res.status(201).json(newAppointment);
    } catch (error) {
        console.error("Error creating appointment:", error);
        res.status(500).json({ message: "Error creating appointment" });
    }
});

// GET /api/appointments/:id: Retrieve details of a specific appointment
router.get("/:id", async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(parseInt(req.params.id));
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        res.status(200).json(appointment);
    } catch (error) {
        console.error("Error fetching appointment:", error);
        res.status(500).json({ message: "Error fetching appointment" });
    }
});

// PUT /api/appointments/:id: Update an existing appointment
router.put("/:id", async (req, res) => {
    try {
        const [updated] = await Appointment.update(req.body, {
            where: { AppointmentId: req.params.id },
        });
        if (!updated) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        const updatedAppointment = await Appointment.findByPk(req.params.id);
        res.status(200).json(updatedAppointment);
    } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ message: "Error updating appointment" });
    }
});

// DELETE /api/appointments/:id: Delete an appointment
router.delete("/:id", async (req, res) => {
    try {
        // convert the id to an integer
        const parsedId = parseInt(req.params.id);
        const deleted = await Appointment.destroy({
            where: { AppointmentId: parsedId },
        });
        if (!deleted) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        res.status(204).send(); // No content to send back
    } catch (error) {
        console.error("Error deleting appointment:", error);
        res.status(500).json({ message: "Error deleting appointment" });
    }
});


module.exports = router;