import React, { useState, useEffect } from 'react';
import { Sliders, ShieldCheck, Save, Eye, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function PreferencesPage() {
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    api.getPreferences()
      .then(res => {
        if (res && res.data) setPrefs(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!prefs) return;
    try {
      await api.updatePreferences(prefs);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(`Preferences update error: ${err.message}`);
    }
  };

  if (loading || !prefs) {
    return <div className="app-container" style={{ padding: '60px 0', textAlign: 'center' }}>Loading user preference profile...</div>;
  }

  return (
    <div className="app-container" style={{ maxWidth: '900px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '8px' }}>
          Personal Decision Profile & Domain Preferences
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
          Tailor deterministic default criteria weightings and regional biases. All personalization is explainable and never hidden.
        </p>
      </div>

      {/* Transparent Personalization Guarantee */}
      <div style={{
        background: 'rgba(6, 182, 212, 0.08)',
        border: '1px solid rgba(6, 182, 212, 0.25)',
        borderRadius: '14px',
        padding: '16px 20px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px'
      }}>
        <Eye size={22} color="var(--accent-cyan)" style={{ flexShrink: 0 }} />
        <div style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.5 }}>
          <strong>EXPLAINABILITY COMMITMENT:</strong> When your saved preferences influence a recommendation's weights, Choosy will explicitly display: <em>"This recommendation was influenced by your saved preference for long-term value."</em> Hidden algorithmic weights are prohibited.
        </div>
      </div>

      <form onSubmit={handleSave}>
        {/* General Global Preferences */}
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '18px' }}>Global Defaults</h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '18px' }}>
            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Default Currency
              </label>
              <select
                className="input-field"
                value={prefs.default_currency || 'INR'}
                onChange={(e) => setPrefs({ ...prefs, default_currency: e.target.value })}
              >
                <option value="INR">INR (₹ Indian Rupee)</option>
                <option value="USD">USD ($ US Dollar)</option>
                <option value="EUR">EUR (€ Euro)</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
                Risk Tolerance
              </label>
              <select
                className="input-field"
                value={prefs.default_risk_tolerance || 'medium'}
                onChange={(e) => setPrefs({ ...prefs, default_risk_tolerance: e.target.value })}
              >
                <option value="low">Conservative (Low Risk — prioritize warranties & track record)</option>
                <option value="medium">Balanced (Medium Risk — standard trade-offs)</option>
                <option value="high">Aggressive (High Risk — maximum performance or thrill)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Domain Preferences */}
        <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
          <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '18px' }}>Domain Behavioral Biases</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Health Domain */}
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#ffffff', marginBottom: '8px' }}>
                🏥 Healthcare Decisions
              </div>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={prefs.domain_preferences?.health?.prioritize_distance ?? true}
                    onChange={(e) => setPrefs({
                      ...prefs,
                      domain_preferences: {
                        ...prefs.domain_preferences,
                        health: { ...prefs.domain_preferences?.health, prioritize_distance: e.target.checked }
                      }
                    })}
                  />
                  <span>Always prioritize distance / proximity within 5km</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={prefs.domain_preferences?.health?.prefer_verified_fees ?? true}
                    onChange={(e) => setPrefs({
                      ...prefs,
                      domain_preferences: {
                        ...prefs.domain_preferences,
                        health: { ...prefs.domain_preferences?.health, prefer_verified_fees: e.target.checked }
                      }
                    })}
                  />
                  <span>Require transparent verified consultation fees</span>
                </label>
              </div>
            </div>

            {/* Travel Domain */}
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#ffffff', marginBottom: '8px' }}>
                🌴 Travel & Vacations
              </div>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={prefs.domain_preferences?.travel?.safety_priority === 'high'}
                    onChange={(e) => setPrefs({
                      ...prefs,
                      domain_preferences: {
                        ...prefs.domain_preferences,
                        travel: { ...prefs.domain_preferences?.travel, safety_priority: e.target.checked ? 'high' : 'medium' }
                      }
                    })}
                  />
                  <span>Prioritize transit safety & low weather volatility</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button type="submit" className="btn btn-primary">
            <Save size={16} /> Save Preference Profile
          </button>
          {savedSuccess && (
            <span style={{ color: '#34d399', fontWeight: 600, fontSize: '0.88rem' }}>
              ✓ Preferences updated and active!
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
