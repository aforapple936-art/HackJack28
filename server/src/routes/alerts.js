const express = require('express');
const router = express.Router();
const repository = require('../db/repository');

// GET /api/alerts
router.get('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    const alerts = await repository.getAlerts(userId);
    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/alerts
router.post('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    const alert = await repository.createAlert({
      ...req.body,
      user_id: userId
    });
    res.status(201).json({ success: true, data: alert });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/alerts/:id
router.patch('/:id', async (req, res) => {
  try {
    const updated = await repository.toggleAlert(req.params.id, req.body.is_enabled);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
