const express = require("express");
const router = express.Router();
const { User } = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { authMiddleware } = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

router.post("/signup", authMiddleware, async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  // Validate role if provided
  const validRoles = ["super_admin", "admin", "user"];
  const userRole = role || "user"; // Default to "user" if role is not provided
  if (!validRoles.includes(userRole)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  // Only super_admin can create admin or super_admin
  const currentUser = req.user; // From authMiddleware
  if (
    (userRole === "admin" || userRole === "super_admin") &&
    (!currentUser || currentUser.role !== "super_admin")
  ) {
    return res.status(403).json({
      error: "Only super_admin can create admin or super_admin users",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds for bcrypt
    const user = await User.create({
      username,
      password: hashedPassword,
      role: userRole, // Set the role for the new user
    });
    res.status(201).json({ message: "User created", userId: user.id });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(400).json({ error: "Username already taken" });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token, userId: user.id });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
