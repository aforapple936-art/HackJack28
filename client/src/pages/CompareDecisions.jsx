import React, { useState, useEffect } from 'react';
import { GitCompare, ArrowRight, ShieldCheck, TrendingUp, Award, Layers } from 'lucide-react';
import { api } from '../services/api';

export default function CompareDecisions({ onSelectDecision }) {
  const [decisions, setDecisions] = useState([]);
  const [selectedA, setSelectedA] = useState('');
  const [selectedB, setSelectedB] = useState('');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getDecisions().then(res => {
      if (res && res.data && res.data.length >= 2) {
        setDecisions(res.data);
        setSelectedA(res.data[0].id);
        setSelectedB(res.data[1].id);
      }
    }).catch(console.error);
  }, []);

  const handleRunComparison = async () => {
    if (!selectedA || !selectedB || selectedA === selectedB) return;
    setLoading(true);
    try {
      const res = await api.compareDecisions(selectedA, selectedB);
      if (res && res.data) {
        setComparison(res.data);
      }
    } catch (err) {
      alert(`Comparison error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedA && selectedB && selectedA !== selectedB) {
      handleRunComparison();
    }
  }, [selectedA, selectedB]);

  return (
    <div className="app-container">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '8px' }}>
          Historical & Multi-Decision Comparison Studio
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
          Compare decisions side-by-side to inspect shifting criteria weights, budget variances, score deltas, and evolving recommendations
        </p>
      </div>

      {/* Selectors Bar */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              First Decision (Baseline):
            </label>
            <select
              className="input-field"
              value={selectedA}
              onChange={(e) => setSelectedA(e.target.value)}
            >
              {decisions.map(d => (
                <option key={d.id} value={d.id}>{d.title}</option>
              ))}
            </select>
          </div>

          <div style={{ textAlign: 'center', color: 'var(--accent-cyan)', fontWeight: 800 }}>
            VS
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Second Decision (Comparison Target):
            </label>
            <select
              className="input-field"
              value={selectedB}
              onChange={(e) => setSelectedB(e.target.value)}
            >
              {decisions.map(d => (
                <option key={d.id} value={d.id}>{d.title}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Comparison Results */}
      {comparison && (
        <div>
          {/* Insights Banner */}
          <div style={{
            background: 'rgba(6, 182, 212, 0.08)',
            border: '1px solid rgba(6, 182, 212, 0.25)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '24px'
          }}>
            <h3 style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '8px' }}>
              Key Comparative Insights
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '10px' }}>
              {comparison.insights.tradeoffNotes}
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '0.82rem' }}>
              <span className="badge badge-verified">
                Budget Variance: ₹{Math.abs(comparison.insights.budgetDelta).toLocaleString('en-IN')}
              </span>
              <span className="badge badge-domain">
                Robustness Delta: {comparison.insights.robustnessDelta > 0 ? `+${comparison.insights.robustnessDelta}%` : `${comparison.insights.robustnessDelta}%`}
              </span>
            </div>
          </div>

          {/* Side by Side Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {/* Decision A Card */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <span className="badge badge-domain" style={{ marginBottom: '10px' }}>Baseline Decision</span>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '14px' }}>
                {comparison.decisionA.title}
              </h3>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '10px', marginBottom: '14px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Winner</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--accent-cyan)' }}>
                  {comparison.decisionA.winner?.title || 'N/A'}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Deterministic Score: <strong>{comparison.decisionA.winner?.overall_score}/100</strong>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.82rem', marginBottom: '16px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '8px', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Budget:</span>
                  <div style={{ fontWeight: 600 }}>₹{Number(comparison.decisionA.budget || 0).toLocaleString('en-IN')}</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '8px', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Robustness:</span>
                  <div style={{ fontWeight: 600, color: '#34d399' }}>{comparison.decisionA.robustness}%</div>
                </div>
              </div>

              <button onClick={() => onSelectDecision(comparison.decisionA.id)} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                View Full Dossier <ArrowRight size={14} />
              </button>
            </div>

            {/* Decision B Card */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <span className="badge badge-verified" style={{ marginBottom: '10px' }}>Comparison Target</span>
              <h3 style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '14px' }}>
                {comparison.decisionB.title}
              </h3>

              <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '10px', marginBottom: '14px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Winner</div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#34d399' }}>
                  {comparison.decisionB.winner?.title || 'N/A'}
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  Deterministic Score: <strong>{comparison.decisionB.winner?.overall_score}/100</strong>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.82rem', marginBottom: '16px' }}>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '8px', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Budget:</span>
                  <div style={{ fontWeight: 600 }}>₹{Number(comparison.decisionB.budget || 0).toLocaleString('en-IN')}</div>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '8px', borderRadius: '6px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Robustness:</span>
                  <div style={{ fontWeight: 600, color: '#34d399' }}>{comparison.decisionB.robustness}%</div>
                </div>
              </div>

              <button onClick={() => onSelectDecision(comparison.decisionB.id)} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                View Full Dossier <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
