const express = require("express");
const router = express.Router();
const { Guide, User } = require("../models");
const { authMiddleware, requireRole } = require("../middleware/auth");

// Get all guides (only published guides for non-admins)
router.get("/", async (req, res) => {
  try {
    const user = req.user; // From authMiddleware (optional, if logged in)
    const isAdmin =
      user && (user.role === "admin" || user.role === "super_admin");

    const where = isAdmin ? {} : { status: "published" }; // Admins see all guides, others see only published
    const guides = await Guide.findAll({
      where,
      include: [{ model: User, attributes: ["username"] }],
    });
    res.json(guides);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch guides" });
  }
});

// Get a single guide by ID (only published guides for non-admins)
router.get("/:id", async (req, res) => {
  try {
    const user = req.user;
    const isAdmin =
      user && (user.role === "admin" || user.role === "super_admin");

    const where = isAdmin
      ? { id: req.params.id }
      : { id: req.params.id, status: "published" };
    const guide = await Guide.findOne({
      where,
      include: [{ model: User, attributes: ["username"] }],
    });

    if (!guide) {
      return res.status(404).json({ error: "Guide not found" });
    }
    res.json(guide);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch guide" });
  }
});

// Create a new guide (admin or super_admin only)
router.post(
  "/",
  authMiddleware,
  requireRole(["admin", "super_admin"]),
  async (req, res) => {
    const { title, description, status } = req.body;
    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }

    try {
      const guide = await Guide.create({
        title,
        description,
        status: status || "draft", // Default to draft if not specified
        userId: req.user.id, // Set userId from the authenticated user
      });
      res.status(201).json(guide);
    } catch (err) {
      res.status(500).json({ error: "Failed to create guide" });
    }
  },
);

// Update a guide (admin or super_admin only, must be the author)
router.put(
  "/:id",
  authMiddleware,
  requireRole(["admin", "super_admin"]),
  async (req, res) => {
    const { title, description, status } = req.body;
    try {
      const guide = await Guide.findByPk(req.params.id);
      if (!guide) {
        return res.status(404).json({ error: "Guide not found" });
      }

      if (guide.userId !== req.user.id && req.user.role !== "super_admin") {
        return res
          .status(403)
          .json({ error: "You can only edit your own guides" });
      }

      await guide.update({ title, description, status });
      res.json(guide);
    } catch (err) {
      res.status(500).json({ error: "Failed to update guide" });
    }
  },
);

// Delete a guide (super_admin only)
router.delete(
  "/:id",
  authMiddleware,
  requireRole(["super_admin"]),
  async (req, res) => {
    try {
      const guide = await Guide.findByPk(req.params.id);
      if (!guide) {
        return res.status(404).json({ error: "Guide not found" });
      }

      await guide.destroy();
      res.json({ message: "Guide deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete guide" });
    }
  },
);

module.exports = router;
