const express = require('express');
const router = express.Router();
const repository = require('../db/repository');
const { computeMCDA } = require('../decision-engine/mcda');
const { evaluateConstraints } = require('../decision-engine/constraints');

// POST /api/decisions/:id/export - Generates formatted printable / exportable report data
router.post('/:id/export', async (req, res) => {
  try {
    const decision = await repository.getDecisionById(req.params.id);
    if (!decision) return res.status(404).json({ success: false, error: 'Decision not found' });

    const constrained = evaluateConstraints(decision.alternatives, decision.constraints || []);
    const ranked = computeMCDA(constrained, decision.criteria || [], decision.constraints || []);
    const winner = ranked.find(a => !a.is_excluded);

    const report = {
      title: decision.title,
      goal: decision.goal,
      domain: decision.domain,
      budget: decision.budget ? `₹${decision.budget.toLocaleString('en-IN')}` : 'Not specified',
      generatedAt: new Date().toISOString(),
      platform: 'Choosy Decision Intelligence Platform',
      disclaimer: 'This document provides deterministic multi-criteria decision support and real-world evidence. It does not replace independent professional or clinical judgment.',
      winner: winner ? {
        title: winner.title,
        price: winner.price ? `₹${winner.price.toLocaleString('en-IN')}` : 'N/A',
        overallScore: winner.overall_score,
        rank: winner.rank
      } : null,
      recommendationSummary: decision.recommendation_summary,
      tradeoffAnalysis: decision.tradeoff_analysis,
      riskSummary: decision.risk_summary,
      criteriaList: decision.criteria.map(c => ({
        name: c.name,
        weight: `${c.weight}%`,
        scale: c.scale_type,
        hardConstraint: c.is_hard_constraint ? 'Yes' : 'No'
      })),
      alternativesTable: ranked.map(a => ({
        rank: a.rank || 'Excluded',
        title: a.title,
        price: a.price ? `₹${a.price.toLocaleString('en-IN')}` : 'N/A',
        score: a.overall_score,
        status: a.is_excluded ? a.exclusion_reason : 'Qualified'
      })),
      sourcesAndEvidence: (decision.evidence || []).map(e => ({
        claim: e.claim,
        source: e.source_name,
        url: e.source_url,
        status: e.verification_status,
        confidence: `${e.confidence}%`,
        retrievedAt: e.retrieved_at
      }))
    };

    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
