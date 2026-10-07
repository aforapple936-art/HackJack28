const { computeMCDA } = require('./mcda');

/**
 * Sensitivity Analysis Engine
 * Calculates how stable the recommendation is by varying criteria weights
 * and detecting critical threshold switching points.
 */
function analyzeSensitivity(alternatives, criteria, constraints = []) {
  if (!alternatives || alternatives.length < 2 || !criteria || criteria.length === 0) {
    return {
      stabilityLevel: 'HIGH',
      confidenceMargin: 100,
      sensitivityReport: 'Single option or criteria set — sensitivity testing trivial.',
      criticalCriteria: []
    };
  }

  // Baseline ranking
  const baseline = computeMCDA(alternatives, criteria, constraints);
  const baselineWinner = baseline.find(a => !a.is_excluded);
  const baselineRunnerUp = baseline.filter(a => !a.is_excluded)[1];

  if (!baselineWinner) {
    return { stabilityLevel: 'LOW', confidenceMargin: 0, criticalCriteria: [] };
  }

  const scoreMargin = baselineRunnerUp
    ? Math.round(((baselineWinner.overall_score - baselineRunnerUp.overall_score) / (baselineWinner.overall_score || 1)) * 100 * 10) / 10
    : 100;

  const criticalCriteria = [];
  let minFlippingDelta = 100;

  // Sweep each criterion weight ±20%, ±40%, ±60%
  criteria.forEach(targetCrit => {
    const origWeight = Number(targetCrit.weight) || 10;
    let switchedAt = null;

    // Test weight scales from 0.2x to 2.5x
    const multipliers = [0.2, 0.5, 0.75, 1.25, 1.5, 2.0, 2.5];
    for (const mult of multipliers) {
      const simulatedCriteria = criteria.map(c => {
        if (c.id === targetCrit.id) return { ...c, weight: origWeight * mult };
        return c;
      });

      const simRun = computeMCDA(alternatives, simulatedCriteria, constraints);
      const simWinner = simRun.find(a => !a.is_excluded);

      if (simWinner && simWinner.id !== baselineWinner.id) {
        const deltaPercent = Math.abs(Math.round((mult - 1) * 100));
        switchedAt = {
          newWeightPercent: Math.round(origWeight * mult),
          deltaPercent,
          newWinnerTitle: simWinner.title
        };
        if (deltaPercent < minFlippingDelta) {
          minFlippingDelta = deltaPercent;
        }
        break;
      }
    }

    if (switchedAt) {
      criticalCriteria.push({
        criterionId: targetCrit.id,
        criterionName: targetCrit.name,
        baselineWeight: origWeight,
        switchThresholdDelta: switchedAt.deltaPercent,
        switchNote: `If "${targetCrit.name}" weight changes by ${switchedAt.deltaPercent}%, "${switchedAt.newWinnerTitle}" overtakes.`
      });
    }
  });

  // Classify Stability
  let stabilityLevel = 'HIGH';
  if (scoreMargin < 3.5 || minFlippingDelta < 15) {
    stabilityLevel = 'LOW';
  } else if (scoreMargin < 8.0 || minFlippingDelta < 30) {
    stabilityLevel = 'MEDIUM';
  }

  return {
    stabilityLevel,
    scoreMargin,
    runnerUpTitle: baselineRunnerUp ? baselineRunnerUp.title : null,
    minFlippingDelta: minFlippingDelta === 100 ? null : minFlippingDelta,
    criticalCriteria,
    summary: stabilityLevel === 'LOW'
      ? 'This decision is highly sensitive. Slight changes in your priorities could alter the winner.'
      : stabilityLevel === 'MEDIUM'
      ? 'Moderately stable decision. The top choice leads comfortably but could yield if key priorities shift.'
      : 'Robust and highly stable decision. The winning alternative maintains superiority across substantial priority variations.'
  };
}

module.exports = {
  analyzeSensitivity
};
