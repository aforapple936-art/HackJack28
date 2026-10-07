/**
 * Choosy Generic Budget Optimizer
 * Evaluates value, premium upgrades, and budget threshold steps.
 */

function optimizeBudget(alternatives, maxBudget = null) {
  if (!alternatives || alternatives.length === 0) return null;

  const valid = alternatives.filter(a => a.price && !isNaN(a.price));
  if (valid.length === 0) return null;

  const budgetCap = maxBudget ? Number(maxBudget) : Math.max(...valid.map(v => v.price));

  // 1. Within budget options
  const withinBudget = valid.filter(a => a.price <= budgetCap);

  // 2. Best Within Budget (Highest score under budget)
  const bestWithinBudget = withinBudget.length > 0
    ? [...withinBudget].sort((a, b) => (b.overall_score || 0) - (a.overall_score || 0))[0]
    : null;

  // 3. Best Value (Score per rupee / value density)
  const bestValue = [...valid].sort((a, b) => {
    const valA = (a.overall_score || 70) / (a.price / 1000);
    const valB = (b.overall_score || 70) / (b.price / 1000);
    return valB - valA;
  })[0];

  // 4. Lowest Cost Acceptable
  const lowestCost = [...withinBudget].sort((a, b) => a.price - b.price)[0] || valid[0];

  // 5. Best Premium Option
  const bestPremium = [...valid].sort((a, b) => (b.overall_score || 0) - (a.overall_score || 0))[0];

  // 6. Budget Ladder Scenarios (Step increments: e.g. 50k, 75k, 100k, 125k, or auto calculated)
  const minP = Math.min(...valid.map(v => v.price));
  const maxP = Math.max(...valid.map(v => v.price));
  const step = Math.max(1000, Math.round((maxP - minP) / 4 / 1000) * 1000);

  const ladderSteps = [
    minP,
    minP + step,
    minP + (step * 2),
    maxP
  ];

  const ladder = ladderSteps.map(budgetStep => {
    const qualified = valid.filter(a => a.price <= budgetStep);
    const winner = qualified.sort((a, b) => (b.overall_score || 0) - (a.overall_score || 0))[0];
    return {
      budgetThreshold: budgetStep,
      winnerTitle: winner ? winner.title : 'None within budget',
      winnerScore: winner ? winner.overall_score : 0,
      price: winner ? winner.price : null
    };
  });

  return {
    maxBudget: budgetCap,
    bestWithinBudget: bestWithinBudget ? { id: bestWithinBudget.id, title: bestWithinBudget.title, price: bestWithinBudget.price, score: bestWithinBudget.overall_score } : null,
    bestValue: bestValue ? { id: bestValue.id, title: bestValue.title, price: bestValue.price, score: bestValue.overall_score } : null,
    lowestCost: lowestCost ? { id: lowestCost.id, title: lowestCost.title, price: lowestCost.price, score: lowestCost.overall_score } : null,
    bestPremium: bestPremium ? { id: bestPremium.id, title: bestPremium.title, price: bestPremium.price, score: bestPremium.overall_score } : null,
    ladder
  };
}

module.exports = {
  optimizeBudget
};
