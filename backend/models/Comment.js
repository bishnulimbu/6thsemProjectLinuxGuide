const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Comment = sequelize.define(
  "Comment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    postId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "posts",
        id: "id",
      },
      guideId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "guides",
          key: "id",
        },
      },
    },
  },
  {
    tableName: "comments",
    timestamps: true,
    validate: {
      exactlyOneOfGuideIdOrPostId() {
        if (
          (this.guideId === null && this.postId === null) ||
          (this.guideId !== null && this.postId !== null)
        ) {
          throw new Error(
            "A comment must be associated with one of guideId or postId",
          );
        }
      },
    },
  },
);

module.exports = Comment;
