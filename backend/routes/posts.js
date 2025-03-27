const express = require("express");
const router = express.Router();
const { Post, User } = require("../models");
const { authMiddleware, requiredRole } = require("../middleware/auth");

// Get all posts (only published posts for non-admins)
router.get("/", async (req, res) => {
  try {
    const user = req.user; // From authMiddleware (optional, if logged in)
    const isAdmin =
      user && (user.role === "admin" || user.role === "super_admin");

    const where = isAdmin ? {} : { status: "published" }; // Admins see all posts, others see only published
    const posts = await Post.findAll({
      where,
      include: [{ model: User, attributes: ["username"] }],
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// Get a single post by ID (only published posts for non-admins)
router.get("/:id", async (req, res) => {
  try {
    const user = req.user;
    const isAdmin =
      user && (user.role === "admin" || user.role === "super_admin");

    const where = isAdmin
      ? { id: req.params.id }
      : { id: req.params.id, status: "published" };
    const post = await Post.findOne({
      where,
      include: [{ model: User, attributes: ["username"] }],
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
});

// Create a new post (authenticated users only)
router.post("/", authMiddleware, async (req, res) => {
  const { title, content, tags, status } = req.body;
  if (!title || !content || !tags) {
    return res
      .status(400)
      .json({ error: "Title, content, and tags are required" });
  }

  try {
    const post = await Post.create({
      title,
      content,
      tags,
      status: status || "draft", // Default to draft if not specified
      userId: req.user.id, // Set userId from the authenticated user
    });
    res.status(201).json(post);
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ error: "Post title already exists" });
    } else {
      res.status(500).json({ error: "Failed to create post" });
    }
  }
});

// Update a post (author or super_admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  const { title, content, tags, status } = req.body;
  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.userId !== req.user.id && req.user.role !== "super_admin") {
      return res
        .status(403)
        .json({ error: "You can only edit your own posts" });
    }

    await post.update({ title, content, tags, status });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to update post" });
  }
});

// Delete a post (super_admin only)
router.delete(
  "/:id",
  authMiddleware,
  requiredRole(["super_admin"]),
  async (req, res) => {
    try {
      const post = await Post.findByPk(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      await post.destroy();
      res.json({ message: "Post deleted" });
    } catch (err) {
      res.status(500).json({ error: "Failed to delete post" });
    }
  },
);

module.exports = router;
