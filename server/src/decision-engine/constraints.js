/**
 * Choosy Constraint Engine
 * Distinguishes strictly between Hard Constraints (disqualifying violations)
 * and Soft Constraints (penalties that affect ranking without excluding).
 */

function evaluateConstraints(alternatives, constraints = []) {
  if (!constraints || constraints.length === 0) {
    return alternatives.map(a => ({ ...a, is_excluded: false, exclusion_reason: null }));
  }

  return alternatives.map(alt => {
    let isExcluded = false;
    let exclusionReason = null;
    let softPenalty = 0;

    for (const c of constraints) {
      let candidateValue = null;

      // Extract field from price, specs, location, or direct property
      const fieldLower = (c.criterion || '').toLowerCase();
      if (fieldLower.includes('price') || fieldLower.includes('budget') || fieldLower.includes('fee')) {
        candidateValue = Number(alt.price);
      } else if (fieldLower.includes('distance') && alt.location_info && alt.location_info.distance_km) {
        candidateValue = Number(alt.location_info.distance_km);
      } else if (fieldLower.includes('rating') && alt.rating) {
        candidateValue = Number(alt.rating);
      } else if (alt.specs && alt.specs[c.criterion] !== undefined) {
        candidateValue = Number(alt.specs[c.criterion]);
      }

      if (candidateValue === null || isNaN(candidateValue)) continue;

      const targetVal = Number(c.value);
      let violated = false;

      switch (c.operator) {
        case '<=':
          violated = candidateValue > targetVal;
          break;
        case '<':
          violated = candidateValue >= targetVal;
          break;
        case '>=':
          violated = candidateValue < targetVal;
          break;
        case '>':
          violated = candidateValue <= targetVal;
          break;
        case '==':
          violated = candidateValue !== targetVal;
          break;
        default:
          break;
      }

      if (violated) {
        if (c.type === 'hard') {
          isExcluded = true;
          exclusionReason = `Excluded: Violates hard constraint "${c.criterion} ${c.operator} ${c.value}" (Actual: ${candidateValue})`;
          break; // Hard constraint immediately excludes
        } else {
          // Soft constraint applies a score deduction
          softPenalty += 10;
        }
      }
    }

    const adjustedScore = Math.max(0, (alt.overall_score || 0) - softPenalty);

    return {
      ...alt,
      is_excluded: isExcluded,
      exclusion_reason: exclusionReason,
      overall_score: isExcluded ? 0 : adjustedScore,
      soft_penalty_applied: softPenalty
    };
  });
}

module.exports = {
  evaluateConstraints
};
