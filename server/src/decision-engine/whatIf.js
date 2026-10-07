const { computeMCDA } = require('./mcda');
const { evaluateConstraints } = require('./constraints');

/**
 * What-If Simulation Engine
 * Simulates arbitrary weight changes, budget adjustments, constraint toggles,
 * and alternative removals/additions.
 */
function simulateWhatIf(baselineData, overrides = {}) {
  const {
    alternatives = [],
    criteria = [],
    constraints = []
  } = baselineData;

  const {
    weightOverrides = {},       // { [criterionId]: newWeight }
    budgetOverride = null,      // e.g. 100000
    removedAlternativeIds = [], // [altId1, altId2]
    customConstraints = []
  } = overrides;

  // 1. Filter out removed alternatives
  const activeAlternatives = alternatives.filter(a => !removedAlternativeIds.includes(a.id));

  // 2. Adjust criteria weights
  const simulatedCriteria = criteria.map(c => {
    if (weightOverrides[c.id] !== undefined) {
      return { ...c, weight: Number(weightOverrides[c.id]) };
    }
    if (weightOverrides[c.name] !== undefined) {
      return { ...c, weight: Number(weightOverrides[c.name]) };
    }
    return c;
  });

  // 3. Adjust constraints (e.g. Budget ceiling override)
  let simulatedConstraints = [...constraints, ...customConstraints];
  if (budgetOverride !== null && budgetOverride !== undefined) {
    simulatedConstraints = simulatedConstraints.filter(c => !c.criterion.toLowerCase().includes('budget') && !c.criterion.toLowerCase().includes('price'));
    simulatedConstraints.push({
      id: 'whatif-budget',
      type: 'hard',
      criterion: 'Price',
      operator: '<=',
      value: Number(budgetOverride),
      description: `What-If Budget Ceiling: ₹${Number(budgetOverride).toLocaleString('en-IN')}`
    });
  }

  // 4. Evaluate Constraints
  const constrainedAlts = evaluateConstraints(activeAlternatives, simulatedConstraints);

  // 5. Compute new MCDA scores
  const newRankings = computeMCDA(constrainedAlts, simulatedCriteria, simulatedConstraints);

  // 6. Compare with baseline
  const baselineWinner = alternatives.find(a => a.rank === 1) || alternatives[0];
  const newWinner = newRankings.find(a => !a.is_excluded) || null;

  const winnerChanged = Boolean(newWinner && baselineWinner && newWinner.id !== baselineWinner.id);
  const scoreDelta = (newWinner && baselineWinner)
    ? Math.round((newWinner.overall_score - (baselineWinner.overall_score || 0)) * 10) / 10
    : 0;

  return {
    parameters: overrides,
    previousWinnerId: baselineWinner ? baselineWinner.id : null,
    previousWinnerTitle: baselineWinner ? baselineWinner.title : null,
    newWinnerId: newWinner ? newWinner.id : null,
    newWinnerTitle: newWinner ? newWinner.title : 'None (All Excluded)',
    winnerChanged,
    scoreDelta,
    rankings: newRankings.map(r => ({
      id: r.id,
      title: r.title,
      price: r.price,
      overall_score: r.overall_score,
      rank: r.rank,
      is_excluded: r.is_excluded,
      exclusion_reason: r.exclusion_reason
    })),
    explanation: winnerChanged
      ? `Under this simulation, "${newWinner.title}" overtakes "${baselineWinner.title}" as the top recommendation.`
      : `The current leader "${baselineWinner ? baselineWinner.title : 'N/A'}" remains the highest scoring option under this scenario.`
  };
}

module.exports = {
  simulateWhatIf
};
