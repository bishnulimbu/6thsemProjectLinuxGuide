const express = require("express");
const { Op } = require("sequelize");
const router = express.Router();
const { Guide, Post, Tag } = require("../models");

router.get("/", async (req, res) => {
  try {
    const { search } = req.query;

    if (!search) {
      return res.status(400).json({ error: "Search term is required" });
    }

    const searchTerm = `%${search}%`;

    // Search Guides (no tags)
    const guides = await Guide.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: searchTerm } },
          { description: { [Op.like]: searchTerm } },
        ],
      },
    });

    // Fetch ALL posts with their tags
    const posts = await Post.findAll({
      include: [
        {
          model: Tag,
          through: { attributes: [] },
          required: false,
        },
      ],
    });

    // Combine results
    const results = [
      ...guides.map((guide) => ({
        ...guide.toJSON(),
        type: "guide",
        tags: [],
      })),
      ...posts.map((post) => ({
        ...post.toJSON(),
        type: "post",
        tags: post.Tags || [],
      })),
    ];

    // Filter results by title/content/description/tag name
    const filteredResults = results.filter((item) => {
      const text = `${item.title || ""} ${item.description || ""} ${
        item.content || ""
      }`.toLowerCase();
      const tagMatch =
        item.type === "post" &&
        item.tags.some((tag) =>
          tag.name.toLowerCase().includes(search.toLowerCase()),
        );

      return (
        text.includes(search.toLowerCase()) ||
        (item.type === "post" && tagMatch)
      );
    });

    res.json(filteredResults);
  } catch (err) {
    console.error("Error searching content:", err);
    res.status(500).json({ error: "Failed to search content" });
  }
});

module.exports = router;
