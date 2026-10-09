const express = require('express');
const router = express.Router();
const store = require('../data/store');
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const { isValidTransition, isRoleAuthorizedForStatus } = require('../utils/stateMachine');

// POST /api/items - Customer registers e-waste
router.post('/', verifyToken, authorizeRoles('CUSTOMER', 'ADMIN'), (req, res) => {
  try {
    const { deviceName, category, condition, quantity, pickupLocation, description } = req.body;

    if (!deviceName || !pickupLocation) {
      return res.status(400).json({
        success: false,
        message: 'Device name and pickup location are required',
        errorCode: 'VALIDATION_ERROR'
      });
    }

    const item = store.createItem(
      {
        deviceName,
        category: category || 'OTHER',
        condition: condition || 'NON_WORKING',
        quantity: quantity || 1,
        pickupLocation,
        description: description || ''
      },
      req.user.id
    );

    return res.status(201).json({
      success: true,
      message: 'Item registered successfully',
      data: {
        item: {
          itemId: item.itemId,
          deviceName: item.deviceName,
          category: item.category,
          currentStatus: item.currentStatus,
          createdAt: item.createdAt
        },
        trackingUrl: item.qrCodeUrl
      }
    });
  } catch (err) {
    console.error('Register item error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while registering item',
      errorCode: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/items/my - Customer retrieves own registered items
router.get('/my', verifyToken, authorizeRoles('CUSTOMER', 'ADMIN'), (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const { items, total } = store.getItemsByOwner(req.user.id, {
      status,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    });

    return res.status(200).json({
      success: true,
      data: {
        items: items.map(item => ({
          itemId: item.itemId,
          deviceName: item.deviceName,
          category: item.category,
          condition: item.condition,
          pickupLocation: item.pickupLocation,
          currentStatus: item.currentStatus,
          qrCodeUrl: item.qrCodeUrl,
          createdAt: item.createdAt,
          lastUpdatedAt: item.lastUpdatedAt
        })),
        pagination: {
          page: parseInt(page, 10),
          limit: parseInt(limit, 10),
          total
        }
      }
    });
  } catch (err) {
    console.error('Get my items error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching items',
      errorCode: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/items/:itemId - Authorized item details
router.get('/:itemId', verifyToken, (req, res) => {
  try {
    const { itemId } = req.params;
    const item = store.findItemByItemId(itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: `Item with ID ${itemId} not found`,
        errorCode: 'ITEM_NOT_FOUND'
      });
    }

    // Authorization check: Customer can only view their own item; stakeholders/admins can view any
    if (req.user.role === 'CUSTOMER' && item.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to view this item',
        errorCode: 'FORBIDDEN'
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        item
      }
    });
  } catch (err) {
    console.error('Get item details error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while fetching item details',
      errorCode: 'INTERNAL_ERROR'
    });
  }
});

// PATCH /api/items/:itemId/status - Update item status by authorized stakeholder
router.patch(
  '/:itemId/status',
  verifyToken,
  authorizeRoles('COLLECTION_CENTRE', 'TRANSPORTER', 'INSPECTOR', 'RECYCLER', 'ADMIN'),
  (req, res) => {
    try {
      const { itemId } = req.params;
      const { status, location, notes } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Target status is required',
          errorCode: 'VALIDATION_ERROR'
        });
      }

      const item = store.findItemByItemId(itemId);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: `Item with ID ${itemId} not found`,
          errorCode: 'ITEM_NOT_FOUND'
        });
      }

      // Check role authorization for target status
      if (!isRoleAuthorizedForStatus(req.user.role, status)) {
        return res.status(403).json({
          success: false,
          message: `Role '${req.user.role}' is not authorized to transition item to status '${status}'`,
          errorCode: 'FORBIDDEN'
        });
      }

      // Check state machine transition validity
      if (!isValidTransition(item.currentStatus, status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status transition: Cannot transition from '${item.currentStatus}' to '${status}'`,
          errorCode: 'INVALID_STATUS_TRANSITION'
        });
      }

      const result = store.updateItemStatus(itemId, status, location, notes, req.user);

      return res.status(200).json({
        success: true,
        message: 'Item status updated successfully',
        data: {
          itemId: result.item.itemId,
          currentStatus: result.item.currentStatus,
          lastUpdatedAt: result.item.lastUpdatedAt
        }
      });
    } catch (err) {
      console.error('Update status error:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while updating status',
        errorCode: 'INTERNAL_ERROR'
      });
    }
  }
);

// POST /api/items/:itemId/inspection - Diagnostic inspection decision
router.post(
  '/:itemId/inspection',
  verifyToken,
  authorizeRoles('INSPECTOR', 'ADMIN'),
  (req, res) => {
    try {
      const { itemId } = req.params;
      const { decision, location, notes } = req.body;

      if (!decision || !['APPROVE_REFURBISHMENT', 'SEND_FOR_RECYCLING'].includes(decision)) {
        return res.status(400).json({
          success: false,
          message: "Valid decision ('APPROVE_REFURBISHMENT' or 'SEND_FOR_RECYCLING') is required",
          errorCode: 'VALIDATION_ERROR'
        });
      }

      const item = store.findItemByItemId(itemId);
      if (!item) {
        return res.status(404).json({
          success: false,
          message: `Item with ID ${itemId} not found`,
          errorCode: 'ITEM_NOT_FOUND'
        });
      }

      if (item.currentStatus !== 'UNDER_INSPECTION') {
        return res.status(400).json({
          success: false,
          message: `Inspection can only be performed when item is in 'UNDER_INSPECTION' state (current: '${item.currentStatus}')`,
          errorCode: 'INVALID_STATUS_TRANSITION'
        });
      }

      const updated = store.recordInspection(itemId, decision, notes, req.user);

      return res.status(200).json({
        success: true,
        message: 'Inspection decision recorded',
        data: {
          itemId: updated.itemId,
          decision: updated.inspectionDecision,
          currentStatus: updated.currentStatus
        }
      });
    } catch (err) {
      console.error('Record inspection error:', err);
      return res.status(500).json({
        success: false,
        message: 'Internal server error while recording inspection',
        errorCode: 'INTERNAL_ERROR'
      });
    }
  }
);

module.exports = router;
