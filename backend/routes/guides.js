const express = require("express");
const router = express.Router();
const { Guide, User } = require("../models/index");
const { authMiddleware, requiredRole } = require("../middleware/auth");

// Get all guides (only published guides for non-admins)
router.get("/", async (req, res) => {
  try {
    const user = req.user; // From authMiddleware (optional, if logged in)
    console.log(user);
    const guides = await Guide.findAll({
      include: [{ model: User, attributes: ["username"] }],
    });
    res.status(200).json(guides);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch guides",
      details: err.message,
    });
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
    res.status(200).json(guide);
  } catch (err) {
    res.status(500).json({
      error: `Failed to fetch guide with ID ${req.params.id}`,
      details: err.message,
    });
  }
});

// Create a new guide (admin or super_admin only)
router.post(
  "/",
  authMiddleware,
  requiredRole(["admin", "super_admin"]),
  async (req, res) => {
    const { title, description, status } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }

    // Validate status if provided
    if (status && !["draft", "published"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    try {
      const guide = await Guide.create({
        title,
        description,
        status: status || "draft", // Default to draft if not specified
        userId: req.user.id, // Set userId from the authenticated user
      });
      res.status(201).json({ message: "Guide created successfully", guide });
    } catch (err) {
      res.status(500).json({
        error: "Failed to create guide",
        details: err.message,
      });
    }
  },
);

// Update a guide (admin or super_admin only, must be the author unless super_admin)
router.put(
  "/:id",
  authMiddleware,
  requiredRole(["admin", "super_admin"]),
  async (req, res) => {
    const { title, description, status } = req.body;

    // Validate status if provided
    if (status && !["draft", "published"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    try {
      const guide = await Guide.findByPk(req.params.id);
      if (!guide) {
        return res.status(404).json({ error: "Guide not found" });
      }

      // Check if the user is the author or a super_admin
      if (guide.userId !== req.user.id && req.user.role !== "super_admin") {
        return res
          .status(403)
          .json({ error: "You can only edit your own guides" });
      }

      await guide.update({ title, description, status });
      res.status(200).json({ message: "Guide updated successfully", guide });
    } catch (err) {
      res.status(500).json({
        error: `Failed to update guide with ID ${req.params.id}`,
        details: err.message,
      });
    }
  },
);

// Update guide status (admin or super_admin only, must be the author unless super_admin)
router.patch(
  "/:id",
  authMiddleware,
  requiredRole(["admin", "super_admin"]),
  async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    if (!["draft", "published"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    try {
      const guide = await Guide.findByPk(id);
      if (!guide) {
        return res.status(404).json({ error: "Guide not found" });
      }

      // Check if the user is the author or a super_admin
      if (guide.userId !== req.user.id && req.user.role !== "super_admin") {
        return res
          .status(403)
          .json({ error: "You can only update the status of your own guides" });
      }

      guide.status = status;
      await guide.save();
      res.status(200).json({ message: "Guide status updated", guide });
    } catch (err) {
      res.status(500).json({
        error: `Failed to update guide status for ID ${id}`,
        details: err.message,
      });
    }
  },
);

// Delete a guide (admin or super_admin, must be the author unless super_admin)
router.delete(
  "/:id",
  authMiddleware,
  requiredRole(["admin", "super_admin"]),
  async (req, res) => {
    try {
      const guide = await Guide.findByPk(req.params.id);
      if (!guide) {
        return res.status(404).json({ error: "Guide not found" });
      }

      // Check if the user is the author or a super_admin
      if (guide.userId !== req.user.id && req.user.role !== "super_admin") {
        return res
          .status(403)
          .json({ error: "You can only delete your own guides" });
      }

      await guide.destroy();
      res.status(200).json({ message: "Guide deleted successfully" });
    } catch (err) {
      res.status(500).json({
        error: `Failed to delete guide with ID ${req.params.id}`,
        details: err.message,
      });
    }
  },
);

module.exports = router;
