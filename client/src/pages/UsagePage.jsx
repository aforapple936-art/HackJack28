import React, { useState, useEffect } from 'react';
import { History, Sparkles, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { api } from '../services/api';

export default function UsagePage() {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getUsage()
      .then(res => {
        if (res && res.data) setUsage(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !usage) {
    return <div className="app-container" style={{ padding: '60px 0', textAlign: 'center' }}>Loading AI Credit Ledger...</div>;
  }

  const { credits_balance = 450, tier = 'pro', ledger = [], creditCosts = {} } = usage;

  return (
    <div className="app-container">
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '8px' }}>
          AI Credits, Usage Ledger & Tier Analytics
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
          Transparent usage tracking. Deterministic computations (MCDA, sensitivity, what-if recalculation) are 100% free and consume zero AI credits.
        </p>
      </div>

      {/* Credit Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div className="glass-panel" style={{ padding: '24px', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c4b5fd', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
            <Sparkles size={16} /> Remaining Credits
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff' }}>
            {credits_balance} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>credits</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#34d399', marginTop: '6px' }}>
            Active & ready for AI operations
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
            Current Account Tier
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-cyan)', textTransform: 'capitalize' }}>
            {tier} Tier
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Unlimited local MCDA & up to 500 daily AI calls
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '8px' }}>
            Deterministic Operations
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#10b981' }}>
            0 Credits
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Weight sliders, sorting & rankings run locally
          </div>
        </div>
      </div>

      {/* Credit Costs Schedule */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '16px' }}>
          Configured AI Operation Costs
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Clarification Interview</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>10 Credits</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Criteria Generation</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>15 Credits</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Review Intelligence</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>20 Credits</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Explainable Synthesis</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>15 Credits</div>
          </div>
        </div>
      </div>

      {/* Credit Ledger Table */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <History size={18} color="var(--accent-cyan)" />
          <h3 style={{ fontSize: '1.15rem', color: '#ffffff', margin: 0 }}>
            Audit Ledger Transactions
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                <th style={{ padding: '12px 14px' }}>Timestamp</th>
                <th style={{ padding: '12px 14px' }}>Operation</th>
                <th style={{ padding: '12px 14px' }}>Credits</th>
                <th style={{ padding: '12px 14px' }}>Balance After</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {ledger.map((entry, idx) => (
                <tr key={entry.id || idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                    {new Date(entry.created_at).toLocaleString()}
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#ffffff', textTransform: 'capitalize' }}>
                    {entry.operation.replace(/_/g, ' ')}
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: entry.amount > 0 ? '#34d399' : '#fb7185' }}>
                    {entry.amount > 0 ? `+${entry.amount}` : entry.amount}
                  </td>
                  <td style={{ padding: '12px 14px', fontWeight: 600 }}>
                    {entry.balance_after}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span className="badge badge-verified">✓ Settled</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
