const express = require('express');
const router = express.Router();
const store = require('../data/store');

// GET /api/public/items/:itemId - Public safe projection
router.get('/items/:itemId', (req, res) => {
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

    // Safe public projection (no customer personal email/phone, but includes item metadata)
    return res.status(200).json({
      success: true,
      data: {
        item: {
          itemId: item.itemId,
          deviceName: item.deviceName,
          brand: item.brand || 'Dell',
          category: item.category,
          condition: item.condition,
          weight: item.weight,
          photoUrl: item.photoUrl,
          currentStatus: item.currentStatus,
          createdAt: item.createdAt,
          lastUpdatedAt: item.lastUpdatedAt
        }
      }
    });
  } catch (err) {
    console.error('Public item lookup error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while resolving item',
      errorCode: 'INTERNAL_ERROR'
    });
  }
});

// GET /api/public/items/:itemId/history - Public chronological timeline
router.get('/items/:itemId/history', (req, res) => {
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

    const rawHistory = store.getHistoryByItemId(itemId);

    // Safe public event projection
    const history = rawHistory.map(evt => ({
      status: evt.status,
      location: evt.location,
      notes: evt.notes,
      roleAtEvent: evt.roleAtEvent,
      createdAt: evt.createdAt
    }));

    return res.status(200).json({
      success: true,
      data: {
        itemId: item.itemId,
        history
      }
    });
  } catch (err) {
    console.error('Public history lookup error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while retrieving history',
      errorCode: 'INTERNAL_ERROR'
    });
  }
});

module.exports = router;
