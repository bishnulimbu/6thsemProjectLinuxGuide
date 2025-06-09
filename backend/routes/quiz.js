const express = require("express");
const router = express.Router();
const { User } = require("../models");

router.post("/quiz", async (req, res) => {
  try {
    const { userId, answers } = req.body;

    // Simple scoring based on answers
    let score = 0;
    if (answers.sudo === "yes") score += 1;
    if (answers.terminal === "yes") score += 1;
    if (answers.kernel === "yes") score += 1;

    // Determine experience level
    let experience_level = "beginner";
    if (score >= 2) experience_level = "novice";
    if (score === 3) experience_level = "advanced";

    // Update user
    const user = await User.findByPk(userId);
    if (user) {
      user.experience_level = experience_level;
      await user.save();
      res.json({ success: true, experience_level });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    console.error("Error processing quiz:", err);
    res.status(500).json({ error: "Failed to process quiz" });
  }
});

module.exports = router;
