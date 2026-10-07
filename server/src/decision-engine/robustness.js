/**
 * Choosy Decision Robustness Score
 * Combines score margin, evidence quality, missing information, and weight stability.
 */

function calculateRobustnessScore(options = {}) {
  const {
    scoreMargin = 10,
    evidenceList = [],
    missingInfoList = [],
    stabilityLevel = 'HIGH'
  } = options;

  // 1. Margin Component (0 - 30 pts)
  // 10%+ margin gives full 30 pts
  const marginPts = Math.min(30, Math.max(5, (scoreMargin / 10) * 30));

  // 2. Evidence Verification Component (0 - 30 pts)
  let evidencePts = 25;
  if (evidenceList.length > 0) {
    const verifiedCount = evidenceList.filter(e => e.verification_status === 'verified').length;
    const ratio = verifiedCount / evidenceList.length;
    evidencePts = Math.round(ratio * 30);
  }

  // 3. Completeness Component (0 - 20 pts)
  const missingCount = missingInfoList.length;
  const completenessPts = Math.max(5, 20 - (missingCount * 5));

  // 4. Stability Component (0 - 20 pts)
  let stabilityPts = 20;
  if (stabilityLevel === 'MEDIUM') stabilityPts = 14;
  if (stabilityLevel === 'LOW') stabilityPts = 8;

  const total = Math.min(100, Math.round(marginPts + evidencePts + completenessPts + stabilityPts));

  return {
    robustnessScore: total,
    confidenceScore: Math.round(Math.min(99, total * 1.02)),
    breakdown: {
      marginPts: Math.round(marginPts),
      evidencePts,
      completenessPts,
      stabilityPts
    },
    label: total >= 85 ? 'High Robustness' : total >= 70 ? 'Moderate Robustness' : 'Low Robustness'
  };
}

module.exports = {
  calculateRobustnessScore
};
