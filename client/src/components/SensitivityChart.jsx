import React from 'react';
import { Gauge, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export default function SensitivityChart({ sensitivity }) {
  if (!sensitivity) return null;

  const {
    stabilityLevel = 'HIGH',
    scoreMargin = 4.2,
    runnerUpTitle = 'Competitor',
    criticalCriteria = [],
    summary = ''
  } = sensitivity;

  const isLow = stabilityLevel === 'LOW';
  const isMed = stabilityLevel === 'MEDIUM';

  const badgeStyle = isLow
    ? { background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185', border: '1px solid rgba(244, 63, 94, 0.3)' }
    : isMed
    ? { background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }
    : { background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)' };

  return (
    <div className="glass-panel" style={{ padding: '22px', marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Gauge size={22} color="var(--accent-cyan)" />
          <div>
            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Sensitivity & Recommendation Stability</h3>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Deterministic weight sweep testing resistance to priority fluctuations
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge" style={badgeStyle}>
            {isLow ? <AlertTriangle size={13} /> : <ShieldCheck size={13} />}
            Stability: {stabilityLevel}
          </span>
          <span className="badge" style={{ background: 'rgba(6, 182, 212, 0.12)', color: '#38bdf8' }}>
            Lead Margin: {scoreMargin}%
          </span>
        </div>
      </div>

      {/* Stability description */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        borderRadius: '12px',
        padding: '14px 16px',
        border: '1px solid var(--border-subtle)',
        marginBottom: '16px',
        fontSize: '0.88rem',
        color: '#e2e8f0',
        lineHeight: 1.5
      }}>
        {summary}
      </div>

      {/* Critical Tipping Points */}
      {criticalCriteria && criticalCriteria.length > 0 ? (
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={14} color="var(--accent-amber)" /> Sensitivity Tipping Points
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {criticalCriteria.map((crit, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#ffffff' }}>
                    {crit.criterionName}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {crit.switchNote}
                  </div>
                </div>
                <div style={{
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  color: '#fbbf24',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}>
                  ±{crit.switchThresholdDelta}% Threshold
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={{ fontSize: '0.84rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
          No immediate tipping points detected. Top choice dominates across all weight brackets.
        </div>
      )}
    </div>
  );
}
