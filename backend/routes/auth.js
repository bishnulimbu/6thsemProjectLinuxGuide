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
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message:
    "Too many login requests from this IP, please try again after 1 minute.",
});

const validateUserInput = [
  body("username")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters long."),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  body("role")
    .optional()
    .isIn(["super_admin", "admin", "user"])
    .withMessage("Invalid role."),
  body("email").optional().isEmail().withMessage("Invalid email format."),
];

router.post("/signup", validateUserInput, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      logger.warn(`Signup failed: Username already exists=${username}`);
      return res.status(400).json({ error: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      role: "user",
    });
    logger.info(`User created successfully: ${username} (ID: ${user.id})`);
    res
      .status(201)
      .json({ message: "User created", userId: user.id, role: user.role });
  } catch (err) {
    logger.error(`Failed to create user: ${err.message}`);
    res
      .status(500)
      .json({ error: "Failed to create user", details: err.message });
  }
});

// POST for admin signup
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
        return res
          .status(400)
          .json({ error: "Username or email already exists" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        email,
        username,
        password: hashedPassword,
        role: role || "admin", // Allow super_admin to set role, default to admin
      });
      logger.info(
        `Admin created user: ${username} (ID: ${user.id}, Role: ${user.role})`,
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
        .json({ error: "Failed to create user", details: err.message });
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
        `Login failed: Invalid credentials for username - ${username}`,
      );
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    logger.info(`User logged in: ${username} (ID: ${user.id})`);
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

// GET /users - Fetch all users (super_admin only)
router.get(
  "/users",
  authMiddleware,
  requiredRole(["super_admin"]),
  async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: { exclude: ["password"] }, // Exclude password from response
      });
      res.status(200).json(users);
    } catch (err) {
      logger.error(`Failed to get users: ${err.message}`);
      res
        .status(500)
        .json({ error: "Failed to fetch users", details: err.message });
    }
  },
);

// GET /users/:id - View a specific user (super_admin only)
router.get(
  "/users/:id",
  authMiddleware,
  requiredRole(["super_admin"]),
  async (req, res) => {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    try {
      const user = await User.findByPk(parseInt(id), {
        attributes: { exclude: ["password"] }, // Exclude password from response
      });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    } catch (err) {
      logger.error(`Failed to fetch user: ${err.message}`);
      res
        .status(500)
        .json({ error: "Failed to fetch user", details: err.message });
    }
  },
);

// PUT /users/:id - Edit a specific user (super_admin only)
router.put(
  "/users/:id",
  authMiddleware,
  requiredRole(["super_admin"]),
  validateUserInput,
  async (req, res) => {
    const { id } = req.params;
    const { username, email, password, role } = req.body;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findByPk(parseInt(id));
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Prevent self-editing role or deletion
      if (
        req.user.id === parseInt(id) &&
        (role || user.role === "super_admin")
      ) {
        return res
          .status(400)
          .json({ error: "Cannot edit your own role or a super_admin user" });
      }

      // Check for duplicate username or email (excluding the current user)
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }],
          id: { [Op.ne]: parseInt(id) }, // Exclude the current user
        },
      });
      if (existingUser) {
        logger.warn(
          `Edit user failed: Username or email already exists - ${username}, ${email}`,
        );
        return res
          .status(400)
          .json({ error: "Username or email already exists" });
      }

      // Update user fields
      const updatedData = {};
      if (username) updatedData.username = username;
      if (email) updatedData.email = email;
      if (password) updatedData.password = await bcrypt.hash(password, 10);
      if (role) updatedData.role = role;

      await user.update(updatedData);
      logger.info(`User updated: ID ${id} by super_admin ${req.user.id}`);
      res
        .status(200)
        .json({ message: "User updated successfully", userId: user.id });
    } catch (err) {
      logger.error(`Failed to update user: ${err.message}`);
      res
        .status(500)
        .json({ error: "Failed to update user", details: err.message });
    }
  },
);

// DELETE /users/:id - Delete a user (super_admin only)
router.delete(
  "/users/:id", // Fixed the route path (removed extra slashes)
  authMiddleware,
  requiredRole(["super_admin"]),
  async (req, res) => {
    const { id } = req.params;

    // Validate ID
    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    try {
      const user = await User.findByPk(parseInt(id));
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

      await user.destroy();
      logger.info(`User deleted: ID ${id} by super_admin ${req.user.id}`);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
      logger.error(`Failed to delete user: ${err.message}`);
      res
        .status(500)
        .json({ error: "Failed to delete user", details: err.message });
    }
  },
);

module.exports = router;
