const express = require('express');
const router = express.Router();
const gemini = require('../ai/gemini');
const repository = require('../db/repository');
const config = require('../config');

// Middleware to check & deduct AI credits
async function checkCredits(req, res, operation, cost) {
  const userId = req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
  const creds = await repository.getCredits(userId);
  if (creds.credits_balance < cost) {
    res.status(402).json({
      success: false,
      error: `Insufficient AI credits. Operation requires ${cost} credits, balance is ${creds.credits_balance}.`,
      required: cost,
      currentBalance: creds.credits_balance
    });
    return null;
  }
  await repository.deductCredits(userId, operation, cost, { endpoint: req.originalUrl });
  return userId;
}

// POST /api/ai/interview - Clarification & Setup Interview
router.post('/interview', async (req, res) => {
  try {
    const { userText, history } = req.body;
    if (!userText) return res.status(400).json({ success: false, error: 'User statement is required' });

    const userId = await checkCredits(req, res, 'interview', config.creditCosts.interview);
    if (!userId) return;

    const interviewData = await gemini.conductInterview(userText, history || []);
    res.json({
      success: true,
      data: interviewData,
      creditsUsed: config.creditCosts.interview
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/ai/generate-criteria - Automatic criteria generation
router.post('/generate-criteria', async (req, res) => {
  try {
    const { goal, domain } = req.body;
    if (!goal) return res.status(400).json({ success: false, error: 'Goal is required' });

    const userId = await checkCredits(req, res, 'generate_criteria', config.creditCosts.generateCriteria);
    if (!userId) return;

    const criteria = await gemini.generateCriteria(goal, domain || 'general');
    res.json({
      success: true,
      data: criteria,
      creditsUsed: config.creditCosts.generateCriteria
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/ai/analyze-reviews - Review themes & defects extraction
router.post('/analyze-reviews', async (req, res) => {
  try {
    const { alternativeTitle, reviewsText } = req.body;
    if (!alternativeTitle) return res.status(400).json({ success: false, error: 'Alternative title is required' });

    const userId = await checkCredits(req, res, 'analyze_reviews', config.creditCosts.analyzeReviews);
    if (!userId) return;

    const analysis = await gemini.analyzeReviews(alternativeTitle, reviewsText || 'Verified reviews across verified portals');
    res.json({
      success: true,
      data: analysis,
      creditsUsed: config.creditCosts.analyzeReviews
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/ai/explain-scenario - Natural language trade-off explanation
router.post('/explain-scenario', async (req, res) => {
  try {
    const { winnerTitle, runnerUpTitle, tradeOffDetails } = req.body;

    const userId = await checkCredits(req, res, 'explain_scenario', config.creditCosts.explainScenario);
    if (!userId) return;

    const explanation = await gemini.explainScenario(winnerTitle, runnerUpTitle, tradeOffDetails || {});
    res.json({
      success: true,
      data: explanation,
      creditsUsed: config.creditCosts.explainScenario
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
