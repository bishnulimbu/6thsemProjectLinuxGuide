const express = require("express");
const router = express.Router();
const { Comment, User } = require("../models");
const { authMiddleware, requireRole } = require("../middleware/auth");

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

router.post("/guide/:guideId", authMiddleware, async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: "Empty comment" });
  }
  try {
    const content = await Comment.create({
      content,
      userId: req.user.id,
      guideId: req.params.guideId,
      postId: null,
    });
    const commentWithuser = await Comment.findByPk(commen.id, {
      include: [{ model: user, attributes: ["username"] }],
    });
    res.status(201).json(commentWithuser);
  } catch (err) {
    res.status(500).json({ error: "Falied to create comment" });
  }
});
