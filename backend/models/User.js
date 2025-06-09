const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("super_admin", "admin", "user"),
      allowNull: false,
      defaultValue: "user",
    },
    experience_level: {
      type: DataTypes.ENUM("beginner", "novice", "advanced"),
      defaultValue: "beginner",
      allowNull: false,
    },
  },
  {
    tableName: "users",
    indexers: [
      {
        unique: true,
        fields: ["username"],
      },
      {
        unique: true,
        fields: ["email"],
      },
    ],
  },
);

module.exports = User;
