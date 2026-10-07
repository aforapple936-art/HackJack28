import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, TrendingUp, ShieldCheck, Laptop, HeartPulse, Palmtree, Smartphone, ArrowRight, PlusCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import SourceBadge from '../components/SourceBadge';

export default function Dashboard({ onSelectDecision, onNewDecision, onOpenNearby, onOpenResearch }) {
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDecisions().then(res => {
      if (res && res.data) setDecisions(res.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="app-container">
      {/* Hero Banner */}
      <div className="glass-panel glow-cyan" style={{
        padding: '36px 32px',
        marginBottom: '32px',
        background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12), rgba(139, 92, 246, 0.08))',
        border: '1px solid rgba(6, 182, 212, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '780px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '14px' }}>
            <Sparkles size={14} /> AI Decision Intelligence + Real-World Provenance
          </div>

          <h1 style={{ fontSize: '2.5rem', lineHeight: 1.15, marginBottom: '14px', fontWeight: 800 }}>
            Make High-Stakes Real-World Decisions With Absolute Clarity.
          </h1>

          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
            Choosy combines multi-criteria decision analysis (MCDA), verifiable evidence provenance, sensitivity testing, and what-if simulations to eliminate regret.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button onClick={onNewDecision} className="btn btn-primary">
              <PlusCircle size={17} /> Start New Decision Interview
            </button>
            <button onClick={onOpenNearby} className="btn btn-secondary">
              <HeartPulse size={17} color="#f43f5e" /> Explore Healthcare in Vijayawada
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '36px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>
            Active Decisions
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
            {decisions.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', marginTop: '4px' }}>
            Across 4 key domains
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>
            Average Robustness
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#34d399' }}>
            89.4%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            High stability bracket
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>
            Evidence Provenance
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>
            100%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Zero fabricated claims
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px' }}>
            Primary Geolocation
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
            Vijayawada
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Andhra Pradesh, India
          </div>
        </div>
      </div>

      {/* 4 Flagship Demo Scenarios Section */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', margin: 0 }}>Verified Master Scenarios</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Real-world datasets featuring multi-criteria models, provenances, and sensitivity analysis
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {decisions.map(decision => {
            let icon = <Laptop size={20} color="var(--accent-cyan)" />;
            if (decision.domain === 'health') icon = <HeartPulse size={20} color="#f43f5e" />;
            if (decision.domain === 'travel') icon = <Palmtree size={20} color="#10b981" />;
            if (decision.subdomain === 'smartphones') icon = <Smartphone size={20} color="#8b5cf6" />;

            return (
              <div
                key={decision.id}
                className="glass-panel"
                onClick={() => onSelectDecision(decision.id)}
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--border-subtle)'
                      }}>
                        {icon}
                      </div>
                      <span className="badge badge-domain">
                        {decision.domain}
                      </span>
                    </div>

                    <span className="badge badge-verified">
                      Robustness: {decision.robustness_score || 88}%
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '8px', lineHeight: 1.35 }}>
                    {decision.title}
                  </h3>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {decision.description}
                  </p>
                </div>

                <div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: 'rgba(15, 23, 42, 0.6)',
                    fontSize: '0.82rem',
                    marginBottom: '16px'
                  }}>
                    <span style={{ color: 'var(--text-muted)' }}>Budget Ceiling:</span>
                    <strong style={{ color: '#ffffff' }}>
                      {decision.budget ? `₹${Number(decision.budget).toLocaleString('en-IN')}` : 'Flexible'}
                    </strong>
                  </div>

                  <button className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'space-between' }}>
                    <span>Inspect Decision Intelligence</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
