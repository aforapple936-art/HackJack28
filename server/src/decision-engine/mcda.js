/**
 * Choosy Deterministic Decision Engine — Multi-Criteria Decision Analysis (MCDA)
 * Pure deterministic mathematics — No LLM arithmetic hallucinations.
 */

function normalizeValue(value, min, max, scaleType) {
  if (min === max) return 100;
  if (value === null || value === undefined || isNaN(value)) return 50; // Neutral default

  const clamped = Math.max(min, Math.min(max, Number(value)));

  if (scaleType === 'lower_is_better') {
    // e.g. Price, Distance, Travel Time
    return ((max - clamped) / (max - min)) * 100;
  } else {
    // e.g. Performance, Battery, Rating, Reliability
    return ((clamped - min) / (max - min)) * 100;
  }
}

function computeMCDA(alternatives, criteria, constraints = []) {
  if (!alternatives || alternatives.length === 0) return [];
  if (!criteria || criteria.length === 0) return alternatives;

  const totalWeight = criteria.reduce((sum, c) => sum + (Number(c.weight) || 0), 0) || 100;

  // 1. Identify Min and Max per criterion for normalization
  const criterionRanges = {};
  criteria.forEach(crit => {
    const values = alternatives
      .map(alt => {
        // Look up either in specs, direct fields, or nested
        if (alt.specs && alt.specs[crit.name] !== undefined) return Number(alt.specs[crit.name]);
        if (crit.name.toLowerCase().includes('price') && alt.price) return Number(alt.price);
        if (crit.name.toLowerCase().includes('rating') && alt.rating) return Number(alt.rating);
        if (crit.name.toLowerCase().includes('distance') && alt.location_info && alt.location_info.distance_km) {
          return Number(alt.location_info.distance_km);
        }
        return null;
      })
      .filter(v => v !== null && !isNaN(v));

    if (values.length > 0) {
      criterionRanges[crit.id] = {
        min: Math.min(...values),
        max: Math.max(...values)
      };
    } else {
      criterionRanges[crit.id] = { min: 0, max: 100 };
    }
  });

  // 2. Score each alternative deterministically
  const scoredAlternatives = alternatives.map(alt => {
    let rawScoreSum = 0;
    const criterionScores = {};

    criteria.forEach(crit => {
      const range = criterionRanges[crit.id] || { min: 0, max: 100 };
      let rawVal = 70; // baseline

      if (alt.specs && alt.specs[crit.name] !== undefined) {
        rawVal = Number(alt.specs[crit.name]);
      } else if (crit.name.toLowerCase().includes('price') && alt.price) {
        rawVal = Number(alt.price);
      } else if (crit.name.toLowerCase().includes('rating') && alt.rating) {
        rawVal = Number(alt.rating);
      } else if (crit.name.toLowerCase().includes('distance') && alt.location_info && alt.location_info.distance_km) {
        rawVal = Number(alt.location_info.distance_km);
      } else {
        // If pre-seeded score exists
        rawVal = alt.normalized_score || 75;
      }

      const normalized = normalizeValue(rawVal, range.min, range.max, crit.scale_type);
      const weightNormalized = (Number(crit.weight) || 0) / totalWeight;
      const weightedContribution = normalized * weightNormalized;

      criterionScores[crit.id] = {
        criterionName: crit.name,
        rawValue: rawVal,
        normalizedScore: Math.round(normalized * 10) / 10,
        weightedScore: Math.round(weightedContribution * 10) / 10
      };

      rawScoreSum += weightedContribution;
    });

    const finalScore = Math.round(rawScoreSum * 10) / 10;

    return {
      ...alt,
      overall_score: finalScore,
      normalized_score: finalScore,
      criterion_breakdown: criterionScores
    };
  });

  // 3. Rank alternatives by overall_score descending (non-excluded first)
  const sorted = [...scoredAlternatives].sort((a, b) => {
    if (a.is_excluded && !b.is_excluded) return 1;
    if (!a.is_excluded && b.is_excluded) return -1;
    return (b.overall_score || 0) - (a.overall_score || 0);
  });

  return sorted.map((item, index) => ({
    ...item,
    rank: item.is_excluded ? null : index + 1
  }));
}

module.exports = {
  normalizeValue,
  computeMCDA
};
