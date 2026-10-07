const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': '00000000-0000-0000-0000-000000000001',
    ...(options.headers || {})
  };

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `HTTP error ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Decisions
  getDecisions: () => request('/decisions'),
  getDecisionById: (id) => request(`/decisions/${id}`),
  createDecision: (payload) => request('/decisions', { method: 'POST', body: JSON.stringify(payload) }),
  simulateWhatIf: (id, overrides) => request(`/decisions/${id}/simulate`, { method: 'POST', body: JSON.stringify(overrides) }),
  saveScenario: (id, payload) => request(`/decisions/${id}/scenarios`, { method: 'POST', body: JSON.stringify(payload) }),
  exportReport: (id) => request(`/decisions/${id}/export`, { method: 'POST' }),

  // AI Operations
  interview: (userText, history) => request('/ai/interview', { method: 'POST', body: JSON.stringify({ userText, history }) }),
  generateCriteria: (goal, domain) => request('/ai/generate-criteria', { method: 'POST', body: JSON.stringify({ goal, domain }) }),
  analyzeReviews: (alternativeTitle, reviewsText) => request('/ai/analyze-reviews', { method: 'POST', body: JSON.stringify({ alternativeTitle, reviewsText }) }),
  explainScenario: (winnerTitle, runnerUpTitle, tradeOffDetails) => request('/ai/explain-scenario', { method: 'POST', body: JSON.stringify({ winnerTitle, runnerUpTitle, tradeOffDetails }) }),

  // Research & Providers
  searchResearch: (domain, query, location) => request('/research/search', { method: 'POST', body: JSON.stringify({ domain, query, location }) }),
  verifyClaims: (claims) => request('/research/verify', { method: 'POST', body: JSON.stringify({ claims }) }),
  discoverAlternatives: (domain, goal, budget) => request('/research/alternatives', { method: 'POST', body: JSON.stringify({ domain, goal, budget }) }),

  // Location & Nearby
  getNearby: (lat, lng, type, radius) => request(`/nearby?lat=${lat}&lng=${lng}&type=${type || 'hospital'}&radius=${radius || 10000}`),
  searchLocation: (q) => request(`/nearby/search?q=${encodeURIComponent(q)}`),

  // Preferences & Personalization
  getPreferences: () => request('/preferences'),
  updatePreferences: (payload) => request('/preferences', { method: 'PATCH', body: JSON.stringify(payload) }),

  // AI Usage & Credits
  getUsage: () => request('/usage'),
  getCredits: () => request('/usage/credits'),

  // Decision Alerts
  getAlerts: () => request('/alerts'),
  createAlert: (payload) => request('/alerts', { method: 'POST', body: JSON.stringify(payload) }),
  toggleAlert: (id, isEnabled) => request(`/alerts/${id}`, { method: 'PATCH', body: JSON.stringify({ is_enabled: isEnabled }) }),

  // Collaboration & Comparison
  compareDecisions: (decisionIdA, decisionIdB) => request('/decisions/compare', { method: 'POST', body: JSON.stringify({ decisionIdA, decisionIdB }) }),
  shareDecision: (id) => request(`/decisions/${id}/share`, { method: 'POST' }),
  getCollaborators: (id) => request(`/decisions/${id}/collaborators`)
};

