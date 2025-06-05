// routes/auth.js
const express = require("express");
const { User } = require("../src/models");
const router = express.Router();

// POST /api/auth/register - Create a new user (for demo purposes)
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

    // Storing plain text password directly
    const newUser = await User.create({ username, password });

    res.status(201).json({
      userId: newUser.userId,
      username: newUser.username,
      message: "User registered successfully.",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Error registering user" });
  }
});

// POST /api/auth/login - User Sign In
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required." });
    }

    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // Direct password comparison (plain text)
    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // For this demo, just a success message. In a real app, you'd set up a session or JWT.
    res.status(200).json({
      message: "Login successful!",
      userId: user.userId,
      username: user.username,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

module.exports = router;
