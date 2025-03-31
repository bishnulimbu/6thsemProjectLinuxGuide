const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const PostTag = sequelize.define(
  "PostTag",
  {
    postId: {
      type: DataTypes.INTEGER,
      references: {
        model: "posts",
        key: "id",
      },
    },
    tagId: {
      type: DataTypes.INTEGER,
      references: {
        model: "tags",
        key: "id",
      },
    },
  },
  {
    tableName: "post_tags",
    timestamps: false,
  },
);

module.exports = PostTag;
