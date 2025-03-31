const express = require("express");
const router = express.Router();
const { Post, User, Tag, PostTag } = require("../models/index");
const { authMiddleware, requiredRole } = require("../middleware/auth");

// GET /api/posts - Fetch all posts with user and tags
router.get("/", async (req, res) => {
  try {
    const posts = await Post.findAll({
      include: [
        { model: User, attributes: ["username"] },
        { model: Tag, attributes: ["name"], through: { attributes: [] } },
      ],
    });
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch posts",
      details: err.message,
    });
  }
});

// GET /api/posts/:id - Fetch a single post by ID with user and tags
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.id },
      include: [
        { model: User, attributes: ["username"] },
        { model: Tag, attributes: ["name"], through: { attributes: [] } },
      ],
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({
      error: `Failed to fetch post with ID ${req.params.id}`,
      details: err.message,
    });
  }
});

// POST /api/posts - Create a new post (authenticated users only)
router.post("/", authMiddleware, async (req, res) => {
  const { title, content, tags } = req.body;

  // Validate required fields
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  // Validate tags
  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    return res.status(400).json({ error: "At least one tag is required" });
  }

  try {
    // Create the post
    const post = await Post.create({
      title,
      content,
      userId: req.user.id,
    });

    // Create or find tags and associate them with the post
    const tagPromises = tags.map(async (tagName) => {
      const [tag] = await Tag.findOrCreate({
        where: { name: tagName.toLowerCase() },
        defaults: { name: tagName.toLowerCase() },
      });
      return tag;
    });

    const tagInstances = await Promise.all(tagPromises);
    await post.addTags(tagInstances);

    // Fetch the post with associated user and tags
    const createdPost = await Post.findByPk(post.id, {
      include: [
        { model: User, attributes: ["username"] },
        { model: Tag, attributes: ["name"], through: { attributes: [] } },
      ],
    });

    res
      .status(201)
      .json({ message: "Post created successfully", post: createdPost });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      res
        .status(400)
        .json({ error: "Post title already exists", details: err.message });
    } else {
      res.status(500).json({
        error: "Failed to create post",
        details: err.message,
      });
    }
  }
});

// PUT /api/posts/:id - Update a post (author or super_admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  const { title, content, tags } = req.body;

  // Validate required fields
  if (!title || !content) {
    return res.status(400).json({ error: "Title and content are required" });
  }

  // Validate tags
  if (!tags || !Array.isArray(tags) || tags.length === 0) {
    return res.status(400).json({ error: "At least one tag is required" });
  }

  try {
    const post = await Post.findByPk(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user is the author or a super_admin
    if (post.userId !== req.user.id && req.user.role !== "super_admin") {
      return res
        .status(403)
        .json({ error: "You can only edit your own posts" });
    }

    // Update the post
    await post.update({ title, content });

    // Update tags: Remove existing tags and add new ones
    await PostTag.destroy({ where: { postId: post.id } });
    const tagPromises = tags.map(async (tagName) => {
      const [tag] = await Tag.findOrCreate({
        where: { name: tagName.toLowerCase() },
        defaults: { name: tagName.toLowerCase() },
      });
      return tag;
    });

    const tagInstances = await Promise.all(tagPromises);
    await post.addTags(tagInstances);

    // Fetch the updated post with associated user and tags
    const updatedPost = await Post.findByPk(post.id, {
      include: [
        { model: User, attributes: ["username"] },
        { model: Tag, attributes: ["name"], through: { attributes: [] } },
      ],
    });

    res
      .status(200)
      .json({ message: "Post updated successfully", post: updatedPost });
  } catch (err) {
    res.status(500).json({
      error: `Failed to update post with ID ${req.params.id}`,
      details: err.message,
    });
  }
});

// DELETE /api/posts/:id - Delete a post (admin or super_admin, must be the author unless super_admin)
router.delete(
  "/:id",
  authMiddleware,
  requiredRole(["admin", "super_admin"]),
  async (req, res) => {
    try {
      const post = await Post.findByPk(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }

      // Check if the user is the author or a super_admin
      if (post.userId !== req.user.id && req.user.role !== "super_admin") {
        return res
          .status(403)
          .json({ error: "You can only delete your own posts" });
      }

      await post.destroy();
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
      res.status(500).json({
        error: `Failed to delete post with ID ${req.params.id}`,
        details: err.message,
      });
    }
  },
);

module.exports = router;
