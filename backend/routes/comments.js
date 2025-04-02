const express = require("express");
const router = express.Router();
const { Comment, User, Guide, Post } = require("../models");
const { authMiddleware, requiredRole } = require("../middleware/auth");

// GET /comments/guide/:guideId - Get all comments for a guide
router.get("/guide/:guideId", async (req, res) => {
  const { guideId } = req.params;

  // Validate guideId
  if (!guideId || isNaN(parseInt(guideId))) {
    return res.status(400).json({ error: "Invalid guideId" });
  }

  try {
    const comments = await Comment.findAll({
      where: { guideId: parseInt(guideId), postId: null },
      include: [{ model: User, attributes: ["username"] }],
      order: [["createdAt", "ASC"]], // Sort by creation date (oldest first)
    });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// GET /comments/post/:postId - Get all comments for a post
router.get("/post/:postId", async (req, res) => {
  const { postId } = req.params;

  // Validate postId
  if (!postId || isNaN(parseInt(postId))) {
    return res.status(400).json({ error: "Invalid postId" });
  }

  try {
    const comments = await Comment.findAll({
      where: { postId: parseInt(postId), guideId: null }, // Fixed the where clause
      include: [{ model: User, attributes: ["username"] }],
      order: [["createdAt", "ASC"]], // Sort by creation date (oldest first)
    });
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

// POST /comments/guide/:guideId - Create a comment for a guide (authenticated users only)
router.post("/guide/:guideId", authMiddleware, async (req, res) => {
  const { guideId } = req.params;
  const { content } = req.body;

  // Validate guideId
  if (!guideId || isNaN(parseInt(guideId))) {
    return res.status(400).json({ error: "Invalid guideId" });
  }

  // Validate content
  if (!content || !content.trim()) {
    return res.status(400).json({ error: "Comment content cannot be empty" });
  }

  try {
    // Check if the guide exists
    const guide = await Guide.findByPk(parseInt(guideId));
    if (!guide) {
      return res.status(404).json({ error: "Guide not found" });
    }

    const comment = await Comment.create({
      content,
      userId: req.user.id,
      guideId: parseInt(guideId),
      postId: null,
    });

    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [{ model: User, attributes: ["username"] }],
    });

    res.status(201).json(commentWithUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to create comment" });
  }
});

// POST /comments/post/:postId - Create a comment for a post (authenticated users only)
router.post("/post/:postId", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  // Validate postId
  if (!postId || isNaN(parseInt(postId))) {
    return res.status(400).json({ error: "Invalid postId" });
  }

  // Validate content
  if (!content || !content.trim()) {
    return res.status(400).json({ error: "Comment content cannot be empty" });
  }

  try {
    // Check if the post exists
    const post = await Post.findByPk(parseInt(postId));
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const comment = await Comment.create({
      content,
      userId: req.user.id,
      postId: parseInt(postId),
      guideId: null,
    });

    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [{ model: User, attributes: ["username"] }],
    });

    res.status(201).json(commentWithUser);
  } catch (err) {
    res.status(500).json({ error: "Failed to create comment" });
  }
});

// DELETE /comments/:id - Delete a comment (only by the comment owner or super_admin)
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  // Validate comment ID
  if (!id || isNaN(parseInt(id))) {
    return res.status(400).json({ error: "Invalid comment ID" });
  }

  try {
    const comment = await Comment.findByPk(parseInt(id));
    if (!comment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if the user is the comment owner or a super_admin
    if (comment.userId !== req.user.id && req.user.role !== "super_admin") {
      return res
        .status(403)
        .json({ error: "You can only delete your own comment" });
    }

    await comment.destroy();
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

module.exports = router;
