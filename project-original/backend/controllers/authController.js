const jwt = require('jsonwebtoken');
const Profile = require('../models/Profile');

// Simple in-memory user storage for demo (replace with database)
const users = {};
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Register user
const register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password, and name',
      });
    }

    // Check if user already exists
    if (users[email]) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Create user (in real app, hash password and save to database)
    users[email] = {
      email,
      password, // In production, this should be hashed
      name,
      id: Date.now().toString(),
    };

    // Create JWT token
    const token = jwt.sign(
      { email, id: users[email].id },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: users[email].id,
          email,
          name,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    // Check if user exists
    const user = users[email];
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Verify password (in real app, compare hashed password)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Create JWT token
    const token = jwt.sign(
      { email: user.email, id: user.id },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get demo credentials
const getDemoCredentials = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      email: 'demo@example.com',
      password: 'demo123',
    },
  });
};

module.exports = {
  register,
  login,
  getDemoCredentials,
};
