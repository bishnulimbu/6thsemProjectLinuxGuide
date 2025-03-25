const express = require("express");
const router = express.Router();
const { Comment, User } = require("../models");
const { authMiddleware, requireRole } = require("../middleware/auth");

//get all comments for a guide
router.get("/guide/:guideId", async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { guideId: req.params.guideId, postId: null },
      include: [{ model: User, attributes: ["username"] }],
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch comments." });
  }
});

//get all comments for a post
router.get("/post/:postId", async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { guideId: req.params.postId, guideId: null },
      include: [{ model: User, attributes: ["username"] }],
    });
    res.json(comments);
  } catch (err) {
    res.status(500).status({ error: "failed to fetch comments" });
  }
});

//create a comment for a guide with auth users only
router.post("/guide/:guideId", authMiddleware, async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: "Empty comment" });
  }
  try {
    const comment = await Comment.create({
      content,
      userId: req.user.id,
      guideId: req.params.guideId,
      postId: null,
    });
    const commentWithuser = await Comment.findByPk(comment.id, {
      include: [{ model: User, attributes: ["username"] }],
    });
    res.status(201).json(commentWithuser);
  } catch (err) {
    res.status(500).json({ error: "Falied to create comment" });
  }
});

//create a comment for a post auth users only
router.post("/post/:postId", authMiddleware, async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: "empty content." });
  }
  try {
    const comment = await Comment.create({
      content,
      userId: req.user.id,
      postId: req.params.postId,
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

//delete a comment
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).json({ error: "Comment not found." });
    }
    if (comment.userId !== req.user.id && req.user.role !== "super_admin") {
      return res
        .status(403)
        .json({ error: "your can only delete your own comments." });
    }
    await comment.destroy();
    res.json({ message: "comment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete comments." });
  }
});

module.exports = router;
