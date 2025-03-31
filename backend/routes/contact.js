const express = require("express");
const router = express.Router();
const { Contact } = require("../models/index");

// POST /api/contact - Submit a contact form
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: "Name, email, and message are required" });
  }

  try {
    const contact = await Contact.create({ name, email, message });
    res
      .status(201)
      .json({ message: "Contact form submitted successfully", contact });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to submit contact form", details: err.message });
  }
});

module.exports = router;
