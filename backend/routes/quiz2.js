// routes/quiz.ts

const express = require("express");
const router = express.Router();
const { User } = require("../models");

router.post("/", async (req, res) => {
  // Changed from "/quiz2" to "/"
  try {
    const { userId, experience_level } = req.body;

    if (!["beginner", "novice", "advanced"].includes(experience_level)) {
      return res.status(400).json({ error: "Invalid experience level" });
    }

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.experience_level = experience_level;
    await user.save();

    return res.json({
      success: true,
      experience_level: user.experience_level,
      message: "Experience level updated successfully",
    });
  } catch (error) {
    console.error("Error saving experience level:", error);
    return res.status(500).json({ error: "Failed to add." });
  }
});

module.exports = router;
