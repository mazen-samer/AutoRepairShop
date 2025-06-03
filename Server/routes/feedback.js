const express = require("express");
const { Feedback } = require("../src/models");
const router = express.Router();

// GET /api/feedback - List all feedback
router.get("/", async (req, res) => {
  try {
    const feedback = await Feedback.findAll();
    res.status(200).json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Error fetching feedback" });
  }
});

// GET /api/feedback/:feedbackId - Get feedback by FeedbackId
router.get("/:feedbackId", async (req, res) => {
  try {
    const feedback = await Feedback.findByPk(req.params.feedbackId);
    if (!feedback) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.status(200).json(feedback);
  } catch (error) {
    console.error("Error fetching feedback:", error);
    res.status(500).json({ message: "Error fetching feedback" });
  }
});

// POST /api/feedback - Create new feedback
router.post("/", async (req, res) => {
  try {
    const newFeedback = await Feedback.create(req.body);
    res.status(201).json(newFeedback);
  } catch (error) {
    console.error("Error creating feedback:", error);
    res.status(500).json({ message: "Error creating feedback" });
  }
});

// PUT /api/feedback/:feedbackId - Update feedback
router.put("/:feedbackId", async (req, res) => {
  try {
    const [updated] = await Feedback.update(req.body, {
      where: { FeedbackId: req.params.feedbackId },
    });
    if (!updated) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    const updatedFeedback = await Feedback.findByPk(req.params.feedbackId);
    res.status(200).json(updatedFeedback);
  } catch (error) {
    console.error("Error updating feedback:", error);
    res.status(500).json({ message: "Error updating feedback" });
  }
});

// DELETE /api/feedback/:feedbackId - Delete feedback
router.delete("/:feedbackId", async (req, res) => {
  try {
    const deleted = await Feedback.destroy({
      where: { FeedbackId: req.params.feedbackId },
    });
    if (!deleted) {
      return res.status(404).json({ message: "Feedback not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting feedback:", error);
    res.status(500).json({ message: "Error deleting feedback" });
  }
});

module.exports = router; 