import React, { useState } from 'react';
import { Sliders, RefreshCw, BookmarkPlus, ArrowRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function ScenarioManager({ decision, onScenarioSaved }) {
  if (!decision) return null;

  const [weights, setWeights] = useState(() => {
    const map = {};
    (decision.criteria || []).forEach(c => { map[c.id] = c.weight; });
    return map;
  });

  const [budget, setBudget] = useState(decision.budget || '');
  const [removedAlts, setRemovedAlts] = useState([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);
  const [scenarioName, setScenarioName] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleWeightChange = (id, val) => {
    setWeights(prev => ({ ...prev, [id]: Number(val) }));
  };

  const toggleRemoveAlt = (id) => {
    setRemovedAlts(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const runSimulation = async () => {
    setIsSimulating(true);
    setSaveSuccess(false);
    try {
      const res = await api.simulateWhatIf(decision.id, {
        weightOverrides: weights,
        budgetOverride: budget ? Number(budget) : null,
        removedAlternativeIds: removedAlts
      });
      if (res && res.data) {
        setSimulationResult(res.data);
      }
    } catch (err) {
      alert(`Simulation failed: ${err.message}`);
    } finally {
      setIsSimulating(false);
    }
  };

  const saveCurrentScenario = async () => {
    if (!scenarioName.trim()) {
      alert('Please enter a name for this scenario');
      return;
    }
    if (!simulationResult) return;

    try {
      await api.saveScenario(decision.id, {
        name: scenarioName,
        description: `Simulated weight & budget variations on ${decision.title}`,
        parameters: { weightOverrides: weights, budgetOverride: budget, removedAlternativeIds: removedAlts },
        winner_id: simulationResult.newWinnerId,
        previous_winner_id: simulationResult.previousWinnerId,
        winner_changed: simulationResult.winnerChanged,
        score_delta: simulationResult.scoreDelta,
        explanation: simulationResult.explanation
      });
      setSaveSuccess(true);
      if (onScenarioSaved) onScenarioSaved();
    } catch (err) {
      alert(`Failed to save scenario: ${err.message}`);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', marginTop: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sliders size={22} color="var(--accent-cyan)" />
          <div>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Advanced What-If Simulator</h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Test hypothetical weight shifts, budget alterations, or eliminate specific competitors
            </div>
          </div>
        </div>

        <button onClick={runSimulation} disabled={isSimulating} className="btn btn-primary btn-sm">
          <RefreshCw size={14} className={isSimulating ? 'spin' : ''} />
          {isSimulating ? 'Simulating...' : 'Run Simulation'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '20px' }}>
        {/* Weight Adjusters */}
        <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <h4 style={{ fontSize: '0.92rem', marginBottom: '12px', color: '#ffffff' }}>Hypothetical Criteria Weights</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(decision.criteria || []).map(crit => (
              <div key={crit.id}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{crit.name}</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>{weights[crit.id] || crit.weight}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="60"
                  value={weights[crit.id] || crit.weight}
                  onChange={(e) => handleWeightChange(crit.id, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Budget & Alternative Toggles */}
        <div style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <h4 style={{ fontSize: '0.92rem', marginBottom: '12px', color: '#ffffff' }}>Budget & Alternative Filters</h4>

          <div style={{ marginBottom: '14px' }}>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              What if Budget is capped at (₹):
            </label>
            <input
              type="number"
              className="input-field"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g. 100000"
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Remove / Exclude specific alternatives from consideration:
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(decision.alternatives || []).map(alt => (
                <label key={alt.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.83rem', color: '#cbd5e1', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={removedAlts.includes(alt.id)}
                    onChange={() => toggleRemoveAlt(alt.id)}
                  />
                  <span>Exclude "{alt.title.slice(0, 32)}..."</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Simulation Result Box */}
      {simulationResult && (
        <div style={{
          background: simulationResult.winnerChanged ? 'rgba(245, 158, 11, 0.08)' : 'rgba(16, 185, 129, 0.08)',
          border: `1px solid ${simulationResult.winnerChanged ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
          borderRadius: '14px',
          padding: '18px',
          marginBottom: '18px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1rem', color: simulationResult.winnerChanged ? '#fbbf24' : '#34d399' }}>
              {simulationResult.winnerChanged ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
              {simulationResult.winnerChanged ? 'Recommendation Flip Detected!' : 'Recommendation Stable Under Scenario'}
            </div>

            {simulationResult.scoreDelta !== 0 && (
              <span className="badge badge-domain">Score Delta: {simulationResult.scoreDelta > 0 ? `+${simulationResult.scoreDelta}` : simulationResult.scoreDelta}</span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.9rem', marginBottom: '12px', color: '#ffffff' }}>
            <span style={{ color: 'var(--text-muted)' }}>Previous: {simulationResult.previousWinnerTitle || 'N/A'}</span>
            <ArrowRight size={16} color="var(--accent-cyan)" />
            <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>Simulated Winner: {simulationResult.newWinnerTitle}</span>
          </div>

          <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '14px' }}>
            {simulationResult.explanation}
          </p>

          {/* Save Scenario form */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <input
              type="text"
              className="input-field"
              style={{ maxWidth: '320px', padding: '6px 12px', fontSize: '0.85rem' }}
              placeholder="Name this scenario (e.g. Budget 20% cut)"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
            />
            <button onClick={saveCurrentScenario} className="btn btn-secondary btn-sm">
              <BookmarkPlus size={14} /> Save Scenario
            </button>
            {saveSuccess && (
              <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: 600 }}>
                ✓ Scenario saved successfully!
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
