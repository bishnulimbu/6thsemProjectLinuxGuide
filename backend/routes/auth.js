const express = require("express");
const router = express.Router();
const { User } = require("../models/index");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { authMiddleware, requiredRole } = require("../middleware/auth");
const { body, validationResult } = require("express-validator");
const rateLimit = require("express-rate-limit");
const logger = require("../utils/logger");
const { Op } = require("sequelize");

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables.");
}
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const loginLimmiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  max: 5,
  message:
    "Too many login requests from this IP, please try again after 1 minute.",
});

const validateUserInput = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 character long."),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 character long."),
  body("role")
    .optional()
    .isIn(["super_admin", "admin", "user"])
    .withMessage("Invalid role."),
];

router.post("/signup", validateUserInput, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, password } = req.body;

  // Validate role if for normal user.
  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      logger.warn(`Signup failed: Username already exists=${username}`);
      return res.status(400).json({ error: "Username already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds for bcrypt
    const user = await User.create({
      username,
      password: hashedPassword,
      role: "user", // Set the role for the new user
    });
    logger.info(`User created successfully: ${username} (ID: ${user.id})`);
    res
      .status(201)
      .json({ message: "User created", userId: user.id, role: user.id });
  } catch (err) {
    logger.error(`Failed to create user: ${err.message}`);
    res
      .status(500)
      .json({ error: "Failed to create User.", details: err.message });
  }
});

//post for admin signup
router.post(
  "/admin-signup",
  authMiddleware,
  requiredRole(["super_admin"]),
  validateUserInput,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, username, password, role } = req.body;
    try {
      const existingUser = await User.findOne({
        where: { [Op.or]: [{ username }, { email }] },
      });
      if (existingUser) {
        logger.warn(
          `Admin signup failed: Username or Email already exists - ${username}, ${email}`,
        );
        return res.status(400).json({ error: "Username already exists." });
      }
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds for bcrypt
      const user = await User.create({
        email,
        username,
        password: hashedPassword,
        role: "admin",
      });
      logger.info(
        `Admin created user:${username} (ID: ${user.id},Role:${role}`,
      );
      res.status(201).json({
        message: "User created successfully",
        userId: user.id,
        role: user.role,
      });
    } catch (err) {
      logger.error(`Failed to create user: ${err.message}`);
      res
        .status(500)
        .json({ error: "failed to create user", detailes: err.message });
    }
  },
);

router.post("/login", loginLimmiter, validateUserInput, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      logger.warn(
        `login failed: Invalid credentials for username - ${username}`,
      );
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    logger.info(`User logged in: ${username} (ID: ${user.id}`);
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

//user info api for amdin page
router.get(
  "/users",
  authMiddleware,
  requiredRole(["super_admin"]),
  async (req, res) => {
    try {
      const users = await User.findAll();
      res.status(200).json(users);
    } catch (err) {
      logger.error(`Falied to get users:${err.message}`);
      res
        .status(500)
        .json({ error: "Failed to fetch users", details: err.message });
    }
  },
);

//delete user api for admin
router.delete(
  "users//:id",
  authMiddleware,
  requiredRole(["super_admin"]),
  async (req, res) => {
    const { id } = req.params; // Extract id from route parameters

    try {
      // Find the user by ID
      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Prevent deleting a super_admin user
      if (user.role === "super_admin") {
        return res
          .status(403)
          .json({ error: "Cannot delete a super_admin user" });
      }

      // Prevent self-deletion
      if (req.user.id === parseInt(id)) {
        return res.status(400).json({ error: "Cannot delete yourself" });
      }

      // Delete the user
      await user.destroy();
      logger.info(`User deleted: ID ${id} by super_admin ${req.user.id}`);
      res.status(200).json({ message: "User successfully deleted" });
    } catch (err) {
      logger.error(`Failed to delete user: ${err.message}`);
      res
        .status(500)
        .json({ error: "Failed to delete user", details: err.message });
    }
  },
);

module.exports = router;
