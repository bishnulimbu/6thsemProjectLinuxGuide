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
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "User",
        key: "id",
      },
    },
    guideId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Guide",
        key: "id",
      },
    },
  },
  {
    tableName: "comments",
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

model.exports = Comment;
