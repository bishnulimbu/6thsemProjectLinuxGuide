const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Role = require('../models/role');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

router.post('/signup', async (req, res) => {
  console.log('Signup route hit');
  const { username, password } = req.body;

  // Log the raw request body and extracted values
  console.log('Request body:', req.body);
  console.log('Username:', username);
  console.log('Password:', password);

  // Validate request body
  if (!username || !password) {
    console.log('Validation failed: username or password missing');
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    console.log('Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);

    console.log('Creating user...');
    const user = await User.create({
      username,
      password: hashedPassword,
      role_id: 3,
    });
    console.log('User created:', user.id);
    res.status(201).json({ message: 'User created', userId: user.id });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: 'Username already taken' });
    } else {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

router.post('/login', async (req, res) => {
  console.log('Login route hit');
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username }, include: Role });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.Role.role_name },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
