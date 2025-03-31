const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const { Op } = require("sequelize");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
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
  },
  { tableName: "users" },
);

module.exports = User;
