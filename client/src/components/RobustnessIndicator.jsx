import React from 'react';
import { ShieldCheck, CheckCircle2, FileQuestion, BarChart3 } from 'lucide-react';

export default function RobustnessIndicator({ robustness, confidence }) {
  if (!robustness) return null;

  const {
    robustnessScore = 88,
    breakdown = { marginPts: 25, evidencePts: 28, completenessPts: 18, stabilityPts: 17 },
    label = 'High Robustness'
  } = robustness;

  return (
    <div className="glass-panel" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={20} color="var(--accent-emerald)" />
          <h4 style={{ fontSize: '1.05rem', margin: 0 }}>Choosy Robustness Metric</h4>
        </div>
        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-heading)' }}>
          {robustnessScore}%
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{
        width: '100%',
        height: '8px',
        background: '#1e293b',
        borderRadius: '9999px',
        overflow: 'hidden',
        marginBottom: '14px'
      }}>
        <div style={{
          width: `${robustnessScore}%`,
          height: '100%',
          background: 'linear-gradient(90deg, #10b981, #06b6d4)',
          borderRadius: '9999px'
        }} />
      </div>

      {/* Factor Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Lead Margin</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {breakdown.marginPts}/30 pts
          </div>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Evidence Quality</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {breakdown.evidencePts}/30 pts
          </div>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Data Completeness</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {breakdown.completenessPts}/20 pts
          </div>
        </div>

        <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '8px 10px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Weight Stability</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            {breakdown.stabilityPts}/20 pts
          </div>
        </div>
      </div>
    </div>
  );
}
