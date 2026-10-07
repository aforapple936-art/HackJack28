const express = require('express');
const router = express.Router();
const repository = require('../db/repository');

// GET /api/preferences
router.get('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    const prefs = await repository.getPreferences(userId);
    res.json({ success: true, data: prefs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/preferences
router.patch('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    const updated = await repository.updatePreferences(userId, req.body);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
