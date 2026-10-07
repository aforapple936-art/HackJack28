const express = require('express');
const router = express.Router();
const repository = require('../db/repository');
const { computeMCDA } = require('../decision-engine/mcda');
const { evaluateConstraints } = require('../decision-engine/constraints');
const { analyzeSensitivity } = require('../decision-engine/sensitivity');
const { calculateRobustnessScore } = require('../decision-engine/robustness');
const { simulateWhatIf } = require('../decision-engine/whatIf');
const { optimizeBudget } = require('../decision-engine/budgetOptimizer');
const gemini = require('../ai/gemini');

// GET /api/decisions - List all
router.get('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    const decisions = await repository.getDecisions(userId);
    res.json({ success: true, count: decisions.length, data: decisions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/decisions/:id - Full decision view with MCDA & Sensitivity
router.get('/:id', async (req, res) => {
  try {
    const decision = await repository.getDecisionById(req.params.id);
    if (!decision) {
      return res.status(404).json({ success: false, error: 'Decision not found' });
    }

    // Run deterministic MCDA
    const constrainedAlts = evaluateConstraints(decision.alternatives, decision.constraints || []);
    const rankedAlts = computeMCDA(constrainedAlts, decision.criteria || [], decision.constraints || []);

    // Run Sensitivity Analysis
    const sensitivity = analyzeSensitivity(rankedAlts, decision.criteria || [], decision.constraints || []);

    // Calculate Robustness Score
    const robustness = calculateRobustnessScore({
      scoreMargin: sensitivity.scoreMargin,
      evidenceList: decision.evidence || [],
      missingInfoList: decision.missing_info || [],
      stabilityLevel: sensitivity.stabilityLevel
    });

    // Run Budget Optimizer
    const budgetAnalysis = optimizeBudget(rankedAlts, decision.budget);

    // Identify winner and runner-up
    const winner = rankedAlts.find(a => !a.is_excluded);
    const runnerUp = rankedAlts.filter(a => !a.is_excluded)[1];

    res.json({
      success: true,
      data: {
        ...decision,
        alternatives: rankedAlts,
        winning_alternative_id: winner ? winner.id : null,
        runner_up_alternative_id: runnerUp ? runnerUp.id : null,
        winner,
        runnerUp,
        sensitivity,
        robustness,
        budgetAnalysis
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/decisions - Create new decision
router.post('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    const { title, description, domain, subdomain, goal, budget, currency, criteria, alternatives, constraints } = req.body;

    const newDecision = await repository.createDecision({
      user_id: userId,
      title: title || goal || 'New Decision',
      description,
      domain: domain || 'general',
      subdomain,
      goal: goal || title,
      budget: budget ? Number(budget) : null,
      currency: currency || 'INR',
      constraints: constraints || []
    });

    if (criteria && Array.isArray(criteria)) {
      const preparedCriteria = criteria.map((c, i) => ({
        id: c.id || `crit-${Date.now()}-${i}`,
        decision_id: newDecision.id,
        name: c.name,
        description: c.description,
        weight: Number(c.weight) || 20,
        scale_type: c.scale_type || 'higher_is_better',
        unit: c.unit || '',
        is_hard_constraint: Boolean(c.is_hard_constraint),
        sort_order: i + 1
      }));
      await repository.saveCriteria(preparedCriteria);
    }

    if (alternatives && Array.isArray(alternatives)) {
      const preparedAlts = alternatives.map((a, i) => ({
        id: a.id || `alt-${Date.now()}-${i}`,
        decision_id: newDecision.id,
        title: a.title,
        description: a.description,
        price: a.price ? Number(a.price) : null,
        currency: a.currency || 'INR',
        source_type: a.source_type || 'manual',
        primary_url: a.primary_url || '',
        availability_status: a.availability_status || 'available',
        specs: a.specs || {},
        location_info: a.location_info || {},
        rating: a.rating ? Number(a.rating) : 4.5,
        review_count: a.review_count ? Number(a.review_count) : 10
      }));
      await repository.saveAlternatives(preparedAlts);
    }

    const full = await repository.getDecisionById(newDecision.id);
    res.status(201).json({ success: true, data: full });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/decisions/:id/simulate - What-If simulation
router.post('/:id/simulate', async (req, res) => {
  try {
    const decision = await repository.getDecisionById(req.params.id);
    if (!decision) return res.status(404).json({ success: false, error: 'Decision not found' });

    const overrides = req.body;
    const simulationResult = simulateWhatIf(decision, overrides);

    res.json({ success: true, data: simulationResult });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/decisions/:id/scenarios - Save scenario
router.post('/:id/scenarios', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || '00000000-0000-0000-0000-000000000001';
    const { name, description, parameters, winner_id, previous_winner_id, winner_changed, score_delta, explanation } = req.body;

    const saved = await repository.saveScenario({
      decision_id: req.params.id,
      user_id: userId,
      name,
      description,
      parameters: parameters || {},
      winner_id,
      previous_winner_id,
      winner_changed: Boolean(winner_changed),
      score_delta: Number(score_delta) || 0,
      explanation
    });

    res.json({ success: true, data: saved });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/decisions/compare - Compare two decisions side by side
router.post('/compare', async (req, res) => {
  try {
    const { decisionIdA, decisionIdB } = req.body;
    if (!decisionIdA || !decisionIdB) {
      return res.status(400).json({ success: false, error: 'Both decisionIdA and decisionIdB are required' });
    }

    const [decA, decB] = await Promise.all([
      repository.getDecisionById(decisionIdA),
      repository.getDecisionById(decisionIdB)
    ]);

    if (!decA || !decB) {
      return res.status(404).json({ success: false, error: 'One or both decisions not found' });
    }

    // Run evaluations
    const constrainedA = evaluateConstraints(decA.alternatives, decA.constraints || []);
    const rankedA = computeMCDA(constrainedA, decA.criteria || [], decA.constraints || []);
    const winnerA = rankedA.find(a => !a.is_excluded);

    const constrainedB = evaluateConstraints(decB.alternatives, decB.constraints || []);
    const rankedB = computeMCDA(constrainedB, decB.criteria || [], decB.constraints || []);
    const winnerB = rankedB.find(a => !a.is_excluded);

    const comparison = {
      decisionA: {
        id: decA.id,
        title: decA.title,
        domain: decA.domain,
        budget: decA.budget,
        winner: winnerA,
        alternativesCount: decA.alternatives.length,
        confidence: decA.confidence_score,
        robustness: decA.robustness_score,
        createdAt: decA.created_at
      },
      decisionB: {
        id: decB.id,
        title: decB.title,
        domain: decB.domain,
        budget: decB.budget,
        winner: winnerB,
        alternativesCount: decB.alternatives.length,
        confidence: decB.confidence_score,
        robustness: decB.robustness_score,
        createdAt: decB.created_at
      },
      insights: {
        domainMatch: decA.domain === decB.domain,
        budgetDelta: (decB.budget || 0) - (decA.budget || 0),
        sameWinner: Boolean(winnerA && winnerB && winnerA.title === winnerB.title),
        confidenceDelta: Math.round(((decB.confidence_score || 0) - (decA.confidence_score || 0)) * 10) / 10,
        robustnessDelta: Math.round(((decB.robustness_score || 0) - (decA.robustness_score || 0)) * 10) / 10,
        tradeoffNotes: `Decision A favored ${winnerA ? winnerA.title : 'N/A'} whereas Decision B leads with ${winnerB ? winnerB.title : 'N/A'}.`
      }
    };

    res.json({ success: true, data: comparison });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/decisions/:id/share - Generate share link
router.post('/:id/share', async (req, res) => {
  try {
    const decision = await repository.getDecisionById(req.params.id);
    if (!decision) return res.status(404).json({ success: false, error: 'Decision not found' });

    const shareToken = `share-${req.params.id.slice(0, 8)}-${Date.now()}`;
    res.json({
      success: true,
      data: {
        decisionId: req.params.id,
        shareToken,
        shareUrl: `http://localhost:5173/?shared=${shareToken}&decision=${req.params.id}`
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/decisions/:id/collaborators - Get collaborator preferences & group decision
router.get('/:id/collaborators', async (req, res) => {
  try {
    const decision = await repository.getDecisionById(req.params.id);
    if (!decision) return res.status(404).json({ success: false, error: 'Decision not found' });

    // Seed realistic collaborators for vacation / group decision
    const collaborators = [
      {
        id: 'collab-1',
        name: 'You (Owner)',
        weight: 0.35,
        topPreference: decision.alternatives[0]?.title || 'Option 1',
        priorities: 'Balanced budget & comfort'
      },
      {
        id: 'collab-2',
        name: 'Priya (Participant)',
        weight: 0.25,
        topPreference: decision.alternatives[1]?.title || 'Option 2',
        priorities: 'Scenery, nature & relaxation'
      },
      {
        id: 'collab-3',
        name: 'Rahul (Participant)',
        weight: 0.20,
        topPreference: decision.alternatives[0]?.title || 'Option 1',
        priorities: 'Transit speed & adventure'
      },
      {
        id: 'collab-4',
        name: 'Kavita (Participant)',
        weight: 0.20,
        topPreference: decision.alternatives[2]?.title || 'Option 3',
        priorities: 'Culinary experience & nightlife'
      }
    ];

    const groupScoreMap = {};
    decision.alternatives.forEach(alt => {
      let weightedSum = 0;
      collaborators.forEach(c => {
        const prefBonus = c.topPreference === alt.title ? 100 : 70;
        weightedSum += prefBonus * c.weight;
      });
      groupScoreMap[alt.title] = Math.round(weightedSum * 10) / 10;
    });

    const consensusWinner = Object.entries(groupScoreMap).sort((a, b) => b[1] - a[1])[0];

    res.json({
      success: true,
      data: {
        collaborators,
        groupScores: groupScoreMap,
        groupRecommendation: consensusWinner ? consensusWinner[0] : 'None',
        consensusScore: consensusWinner ? consensusWinner[1] : 0,
        conflictSummary: `Noticeable divergence: Priya strongly favors ${collaborators[1].topPreference} while Rahul and You prefer ${collaborators[0].topPreference}. Group weighted scoring resolved in favor of ${consensusWinner ? consensusWinner[0] : 'N/A'}.`
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

