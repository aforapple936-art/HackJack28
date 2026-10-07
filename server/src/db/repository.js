const { createClient } = require('@supabase/supabase-js');
const config = require('../config');
const seedData = require('./seedData');

// Initialize Supabase Client with Service Role Key
const supabase = createClient(config.supabase.url, config.supabase.serviceRoleKey, {
  auth: { persistSession: false }
});

// In-Memory fallback store with deep copy of seedData
const store = {
  users: [seedData.seedUser],
  preferences: [seedData.seedPreferences],
  decisions: [...seedData.seedDecisions],
  criteria: [...seedData.seedCriteria],
  alternatives: [...seedData.seedAlternatives],
  evidence: [...seedData.seedEvidence],
  reviewInsights: [...seedData.seedReviewInsights],
  scenarios: [...seedData.seedScenarios],
  alerts: [...seedData.seedAlerts],
  creditsLedger: [...seedData.seedCreditsLedger],
  interviews: []
};

class Repository {
  constructor() {
    this.supabase = supabase;
    this.useSupabase = true;
    this.checkedTables = false;
  }

  // Quick check if Supabase tables are initialized
  async checkSupabaseTables() {
    if (this.checkedTables) return this.useSupabase;
    try {
      const { data, error } = await this.supabase.from('decisions').select('id').limit(1);
      if (error && (error.code === '42P01' || error.message.includes('relation "public.decisions" does not exist'))) {
        console.log('ℹ️ Supabase tables not yet created via SQL editor; using built-in high-fidelity store.');
        this.useSupabase = false;
      } else if (!error) {
        console.log('✅ Supabase Cloud PostgreSQL connected and operational.');
        this.useSupabase = true;
      }
    } catch {
      this.useSupabase = false;
    }
    this.checkedTables = true;
    return this.useSupabase;
  }

  // Decisions
  async getDecisions(userId) {
    if (await this.checkSupabaseTables()) {
      const { data, error } = await this.supabase
        .from('decisions')
        .select('*, criteria(*), alternatives(*)')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    }
    return store.decisions.map(d => ({
      ...d,
      criteria: store.criteria.filter(c => c.decision_id === d.id),
      alternatives: store.alternatives.filter(a => a.decision_id === d.id)
    }));
  }

  async getDecisionById(id) {
    if (await this.checkSupabaseTables()) {
      const { data, error } = await this.supabase
        .from('decisions')
        .select('*, criteria(*), alternatives(*)')
        .eq('id', id)
        .single();
      if (!error && data) {
        // Fetch evidence, reviews, scenarios
        const [ev, sc, al] = await Promise.all([
          this.supabase.from('decision_evidence').select('*').eq('decision_id', id),
          this.supabase.from('decision_scenarios').select('*').eq('decision_id', id),
          this.supabase.from('decision_alerts').select('*').eq('decision_id', id)
        ]);
        return {
          ...data,
          evidence: ev.data || [],
          scenarios: sc.data || [],
          alerts: al.data || []
        };
      }
    }

    const decision = store.decisions.find(d => d.id === id);
    if (!decision) return null;
    return {
      ...decision,
      criteria: store.criteria.filter(c => c.decision_id === id).sort((a, b) => a.sort_order - b.sort_order),
      alternatives: store.alternatives.filter(a => a.decision_id === id).sort((a, b) => (a.rank || 99) - (b.rank || 99)),
      evidence: store.evidence.filter(e => e.decision_id === id),
      reviewInsights: store.reviewInsights.filter(r => store.alternatives.some(a => a.decision_id === id && a.id === r.alternative_id)),
      scenarios: store.scenarios.filter(s => s.decision_id === id),
      alerts: store.alerts.filter(a => a.decision_id === id)
    };
  }

  async createDecision(decisionData) {
    const id = decisionData.id || `dec-${Date.now()}`;
    const newDec = {
      id,
      ...decisionData,
      status: decisionData.status || 'ready',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (await this.checkSupabaseTables()) {
      const { data, error } = await this.supabase.from('decisions').insert(newDec).select().single();
      if (!error && data) return data;
    }

    store.decisions.unshift(newDec);
    return newDec;
  }

  async updateDecision(id, updates) {
    if (await this.checkSupabaseTables()) {
      const { data, error } = await this.supabase.from('decisions').update(updates).eq('id', id).select().single();
      if (!error && data) return data;
    }

    const idx = store.decisions.findIndex(d => d.id === id);
    if (idx !== -1) {
      store.decisions[idx] = { ...store.decisions[idx], ...updates, updated_at: new Date().toISOString() };
      return store.decisions[idx];
    }
    return null;
  }

  // Criteria
  async saveCriteria(criteriaList) {
    if (await this.checkSupabaseTables()) {
      await this.supabase.from('criteria').upsert(criteriaList);
    }
    criteriaList.forEach(c => {
      const idx = store.criteria.findIndex(item => item.id === c.id);
      if (idx !== -1) store.criteria[idx] = { ...store.criteria[idx], ...c };
      else store.criteria.push(c);
    });
    return criteriaList;
  }

  // Alternatives
  async saveAlternatives(altList) {
    if (await this.checkSupabaseTables()) {
      await this.supabase.from('alternatives').upsert(altList);
    }
    altList.forEach(a => {
      const idx = store.alternatives.findIndex(item => item.id === a.id);
      if (idx !== -1) store.alternatives[idx] = { ...store.alternatives[idx], ...a };
      else store.alternatives.push(a);
    });
    return altList;
  }

  // Evidence
  async addEvidence(evidenceList) {
    if (await this.checkSupabaseTables()) {
      await this.supabase.from('decision_evidence').insert(evidenceList);
    }
    evidenceList.forEach(e => store.evidence.push({ ...e, id: e.id || `ev-${Date.now()}-${Math.random()}` }));
    return evidenceList;
  }

  // Scenarios
  async saveScenario(scenarioData) {
    const sc = {
      id: scenarioData.id || `sc-${Date.now()}`,
      ...scenarioData,
      created_at: new Date().toISOString()
    };
    if (await this.checkSupabaseTables()) {
      await this.supabase.from('decision_scenarios').insert(sc);
    }
    store.scenarios.push(sc);
    return sc;
  }

  // Alerts
  async getAlerts(userId) {
    if (await this.checkSupabaseTables()) {
      const { data } = await this.supabase.from('decision_alerts').select('*');
      if (data && data.length > 0) return data;
    }
    return store.alerts;
  }

  async createAlert(alertData) {
    const al = {
      id: alertData.id || `al-${Date.now()}`,
      ...alertData,
      is_enabled: true,
      created_at: new Date().toISOString()
    };
    if (await this.checkSupabaseTables()) {
      await this.supabase.from('decision_alerts').insert(al);
    }
    store.alerts.push(al);
    return al;
  }

  async toggleAlert(id, isEnabled) {
    if (await this.checkSupabaseTables()) {
      await this.supabase.from('decision_alerts').update({ is_enabled: isEnabled }).eq('id', id);
    }
    const alert = store.alerts.find(a => a.id === id);
    if (alert) alert.is_enabled = isEnabled;
    return alert;
  }

  // User Preferences
  async getPreferences(userId) {
    if (await this.checkSupabaseTables()) {
      const { data } = await this.supabase.from('user_preferences').select('*').limit(1).single();
      if (data) return data;
    }
    return store.preferences[0];
  }

  async updatePreferences(userId, updates) {
    if (await this.checkSupabaseTables()) {
      const { data } = await this.supabase.from('user_preferences').update(updates).eq('user_id', userId).select().single();
      if (data) return data;
    }
    store.preferences[0] = { ...store.preferences[0], ...updates, updated_at: new Date().toISOString() };
    return store.preferences[0];
  }

  // Credits & Ledger
  async getCredits(userId) {
    if (await this.checkSupabaseTables()) {
      const { data } = await this.supabase.from('profiles').select('credits_balance, tier').eq('id', userId).single();
      if (data) return data;
    }
    return {
      credits_balance: store.users[0].credits_balance,
      tier: store.users[0].tier,
      ledger: store.creditsLedger
    };
  }

  async deductCredits(userId, operation, amount, metadata = {}) {
    const current = store.users[0].credits_balance;
    const newBalance = Math.max(0, current - amount);
    store.users[0].credits_balance = newBalance;

    const entry = {
      id: `cl-${Date.now()}`,
      user_id: userId,
      operation,
      amount: -amount,
      balance_after: newBalance,
      metadata,
      created_at: new Date().toISOString()
    };
    store.creditsLedger.unshift(entry);

    if (await this.checkSupabaseTables()) {
      await this.supabase.from('credit_ledger').insert(entry);
      await this.supabase.from('profiles').update({ credits_balance: newBalance }).eq('id', userId);
    }

    return { balance: newBalance, entry };
  }
}

module.exports = new Repository();
