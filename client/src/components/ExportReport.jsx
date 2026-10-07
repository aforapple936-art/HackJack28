import React from 'react';
import { Printer, Download, X, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function ExportReport({ reportData, isOpen, onClose }) {
  if (!isOpen || !reportData) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 300,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '850px',
        maxHeight: '92vh',
        overflowY: 'auto',
        background: '#0d1326',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)'
      }}>
        {/* Actions bar (hidden in print) */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontWeight: 700 }}>
            <ShieldCheck size={20} />
            <span>Official Decision Dossier Report</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handlePrint} className="btn btn-primary btn-sm">
              <Printer size={15} /> Print / Save PDF
            </button>
            <button onClick={onClose} className="btn btn-secondary btn-sm" style={{ padding: '6px' }}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div id="printable-dossier">
          {/* Header */}
          <div style={{ borderBottom: '2px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <h1 style={{ fontSize: '1.6rem', color: '#ffffff', marginBottom: '6px' }}>
                  {reportData.title}
                </h1>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Goal: {reportData.goal}
                </div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <div>Choosy Decision Intelligence</div>
                <div>Generated: {new Date(reportData.generatedAt).toLocaleDateString()}</div>
                <div>Domain: <span style={{ textTransform: 'uppercase', color: 'var(--accent-cyan)' }}>{reportData.domain}</span></div>
              </div>
            </div>
          </div>

          {/* Winner Showcase */}
          {reportData.winner && (
            <div style={{
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.3)',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '24px'
            }}>
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
                ⭐ Recommended Leader (#1 Rank)
              </div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
                {reportData.winner.title}
              </div>
              <div style={{ display: 'flex', gap: '20px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                <span>Price: <strong style={{ color: '#ffffff' }}>{reportData.winner.price}</strong></span>
                <span>Deterministic Score: <strong style={{ color: 'var(--accent-cyan)' }}>{reportData.winner.overallScore}/100</strong></span>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                {reportData.recommendationSummary}
              </p>
            </div>
          )}

          {/* Trade-off & Risk Analysis */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.92rem', color: '#ffffff', marginBottom: '8px' }}>⚖️ Trade-off Assessment</h4>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5 }}>
                {reportData.tradeoffAnalysis || 'No severe trade-off compromise required.'}
              </p>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <h4 style={{ fontSize: '0.92rem', color: '#ffffff', marginBottom: '8px' }}>⚠️ Risk Factors</h4>
              <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5 }}>
                {reportData.riskSummary || 'Standard operational risk level.'}
              </p>
            </div>
          </div>

          {/* Complete Ranking Table */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ fontSize: '1rem', color: '#ffffff', marginBottom: '12px' }}>
              Alternative Evaluation & Ranking Matrix
            </h4>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255, 255, 255, 0.04)', textAlign: 'left', borderBottom: '1px solid var(--border-subtle)' }}>
                  <th style={{ padding: '10px 12px' }}>Rank</th>
                  <th style={{ padding: '10px 12px' }}>Option</th>
                  <th style={{ padding: '10px 12px' }}>Price</th>
                  <th style={{ padding: '10px 12px' }}>Score</th>
                  <th style={{ padding: '10px 12px' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {(reportData.alternativesTable || []).map((alt, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: i === 0 ? 'var(--accent-cyan)' : 'inherit' }}>
                      #{alt.rank}
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{alt.title}</td>
                    <td style={{ padding: '10px 12px' }}>{alt.price}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: 'var(--accent-cyan)' }}>{alt.score}</td>
                    <td style={{ padding: '10px 12px', fontSize: '0.78rem', color: alt.status === 'Qualified' ? '#34d399' : '#fb7185' }}>
                      {alt.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sources Provenance */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '10px' }}>
              Verified Data Provenance Sources
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(reportData.sourcesAndEvidence || []).map((ev, i) => (
                <div key={i} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(255, 255, 255, 0.02)', padding: '8px 12px', borderRadius: '8px' }}>
                  ✓ <strong style={{ color: '#ffffff' }}>{ev.claim}</strong> — Verified via {ev.source} ({ev.confidence})
                </div>
              ))}
            </div>
          </div>

          {/* Legal Disclaimer */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {reportData.disclaimer}
          </div>
        </div>
      </div>
    </div>
  );
}
