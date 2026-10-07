const express = require('express');
const router = express.Router();
const repository = require('../db/repository');
const config = require('../config');

// GET /api/usage
router.get('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    const usageData = await repository.getCredits(userId);
    res.json({
      success: true,
      data: {
        ...usageData,
        creditCosts: config.creditCosts,
        tierConfig: config.userTiers[usageData.tier || 'advanced']
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/usage/credits
router.get('/credits', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    const data = await repository.getCredits(userId);
    res.json({ success: true, balance: data.credits_balance, tier: data.tier });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
