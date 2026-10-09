const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const store = require('../data/store');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// All admin routes require ADMIN role
router.use(verifyToken);
router.use(authorizeRoles('ADMIN'));

// GET /api/admin/stats
router.get('/stats', (req, res) => {
  try {
    const stats = store.getDashboardStats();
    return res.status(200).json({
      success: true,
      data: stats
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while compiling statistics',
      errorCode: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/admin/items
router.get('/items', (req, res) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;
    const { items, total } = store.getAllItems({
      status,
      category,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    });

    return res.status(200).json({
      success: true,
      data: {
        items,
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total
        }
      }
    });
  } catch (err) {
    console.error('Admin items error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching items',
      errorCode: 'INTERNAL_ERROR'
    });
  }
});

// POST /api/admin/users - Provision stakeholder account
router.post('/users', async (req, res) => {
  try {
    const { name, email, password, role, organizationName } = req.body;

    const allowedRoles = ['COLLECTION_CENTRE', 'TRANSPORTER', 'INSPECTOR', 'RECYCLER', 'ADMIN', 'CUSTOMER'];
    if (!role || !allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role specified. Must be one of: ${allowedRoles.join(', ')}`,
        errorCode: 'VALIDATION_ERROR'
      });
    }

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
        errorCode: 'VALIDATION_ERROR'
      });
    }

    const existing = store.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
        errorCode: 'ACCOUNT_EXISTS'
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = store.createUser({
      name,
      email,
      passwordHash,
      role,
      organizationName: organizationName || '',
      accountStatus: 'ACTIVE'
    });

    return res.status(201).json({
      success: true,
      message: 'Stakeholder account provisioned successfully',
      data: {
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          organizationName: newUser.organizationName,
          accountStatus: newUser.accountStatus
        }
      }
    });
  } catch (err) {
    console.error('Create user error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while provisioning user',
      errorCode: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/admin/users - List users
router.get('/users', (req, res) => {
  try {
    const users = store.getAllUsers();
    return res.status(200).json({
      success: true,
      data: {
        users
      }
    });
  } catch (err) {
    console.error('List users error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while listing users',
      errorCode: 'INTERNAL_ERROR'
    });
  }
});

// PATCH /api/admin/users/:userId/status - Activate or suspend account
router.patch('/users/:userId/status', (req, res) => {
  try {
    const { userId } = req.params;
    const { accountStatus } = req.body;

    if (!accountStatus || !['ACTIVE', 'SUSPENDED'].includes(accountStatus)) {
      return res.status(400).json({
        success: false,
        message: "Status must be 'ACTIVE' or 'SUSPENDED'",
        errorCode: 'VALIDATION_ERROR'
      });
    }

    const updated = store.updateUserStatus(userId, accountStatus);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Target user not found',
        errorCode: 'USER_NOT_FOUND'
      });
    }

    return res.status(200).json({
      success: true,
      message: `User status changed to ${accountStatus}`,
      data: {
        userId: updated.id,
        accountStatus: updated.accountStatus
      }
    });
  } catch (err) {
    console.error('Change user status error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while changing user status',
      errorCode: 'INTERNAL_ERROR'
    });
  }
});

module.exports = router;
