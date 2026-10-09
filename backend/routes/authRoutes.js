const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const store = require('../data/store');
const { verifyToken, JWT_SECRET } = require('../middleware/auth');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, mobile, password, confirmPassword, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
        errorCode: 'VALIDATION_ERROR'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match',
        errorCode: 'VALIDATION_ERROR'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
        errorCode: 'VALIDATION_ERROR'
      });
    }

    // Check existing
    const existing = store.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
        errorCode: 'ACCOUNT_EXISTS'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = store.createUser({
      name,
      email,
      mobile: mobile || '',
      address: address || '',
      passwordHash,
      role: 'CUSTOMER',
      organizationName: 'EcoCitizen',
      accountStatus: 'ACTIVE'
    });

    return res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          mobile: user.mobile,
          address: user.address,
          accountStatus: user.accountStatus
        }
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during registration',
      errorCode: 'INTERNAL_ERROR'
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
        errorCode: 'VALIDATION_ERROR'
      });
    }

    const user = store.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        errorCode: 'INVALID_CREDENTIALS'
      });
    }

    if (user.accountStatus === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact administrator.',
        errorCode: 'FORBIDDEN'
      });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        errorCode: 'INVALID_CREDENTIALS'
      });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken: token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          mobile: user.mobile,
          address: user.address,
          organizationName: user.organizationName
        }
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error during login',
      errorCode: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/auth/me
router.get('/me', verifyToken, (req, res) => {
  const user = store.findUserById(req.user.id);
  return res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        mobile: user.mobile,
        address: user.address,
        organizationName: user.organizationName,
        accountStatus: user.accountStatus
      }
    }
  });
});

// PUT /api/auth/profile - Update profile
router.put('/profile', verifyToken, (req, res) => {
  try {
    const { name, mobile, address, organizationName } = req.body;
    const updated = store.updateUserProfile(req.user.id, { name, mobile, address, organizationName });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: updated.id,
          name: updated.name,
          email: updated.email,
          role: updated.role,
          mobile: updated.mobile,
          address: updated.address,
          organizationName: updated.organizationName,
          accountStatus: updated.accountStatus
        }
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error updating profile' });
  }
});

module.exports = router;
