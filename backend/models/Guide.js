const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Guide = sequelize.define(
  "Guide",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("draft", "published"),
      allowNull: false,
      defaultValue: "draft",
    },
    level: {
      type: DataTypes.ENUM("beginner", "novice", "advanced"),
      defaultValue: "beginner",
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
  },
  {
    tableName: "guides",
  },
);

module.exports = Guide;
