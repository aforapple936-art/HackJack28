require('dotenv').config();

module.exports = {
  port: process.env.PORT || 4000,
  nodeEnv: process.env.NODE_ENV || 'development',
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || '',
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash'
  },

  creditCosts: {
    interview: 10,
    generateCriteria: 15,
    analyzeReviews: 20,
    explainScenario: 15,
    deepResearch: 25,
    exportReport: 5
  },
  userTiers: {
    basic: { name: 'Basic', maxAiOpsDaily: 20, maxAlternatives: 5 },
    advanced: { name: 'Advanced', maxAiOpsDaily: 100, maxAlternatives: 12 },
    pro: { name: 'Pro', maxAiOpsDaily: 500, maxAlternatives: 25 }
  }
};
