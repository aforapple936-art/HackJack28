import React from 'react';
import { DollarSign, Award, TrendingUp, Sparkles, Layers } from 'lucide-react';

export default function BudgetOptimizer({ budgetAnalysis, currency = 'INR' }) {
  if (!budgetAnalysis) return null;

  const { bestWithinBudget, bestValue, lowestCost, bestPremium, ladder = [] } = budgetAnalysis;

  const formatPrice = (p) => p ? `₹${Number(p).toLocaleString('en-IN')}` : 'N/A';

  return (
    <div className="glass-panel" style={{ padding: '22px', marginTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <DollarSign size={22} color="var(--accent-cyan)" />
        <div>
          <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Budget & Value Optimizer</h3>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Comparative value density, minimum viable thresholds, and stepped budget scenarios
          </div>
        </div>
      </div>

      {/* Category Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        {bestWithinBudget && (
          <div style={{ background: 'rgba(6, 182, 212, 0.05)', border: '1px solid rgba(6, 182, 212, 0.2)', padding: '14px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              <Award size={14} /> Best Within Budget
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#ffffff', marginBottom: '4px' }}>
              {bestWithinBudget.title}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <span>{formatPrice(bestWithinBudget.price)}</span>
              <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Score: {bestWithinBudget.score}</span>
            </div>
          </div>
        )}

        {bestValue && (
          <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '14px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#34d399', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              <TrendingUp size={14} /> Highest Value Density
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#ffffff', marginBottom: '4px' }}>
              {bestValue.title}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <span>{formatPrice(bestValue.price)}</span>
              <span style={{ color: '#34d399', fontWeight: 600 }}>Score: {bestValue.score}</span>
            </div>
          </div>
        )}

        {lowestCost && (
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', padding: '14px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              <DollarSign size={14} /> Lowest Cost Viable
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#ffffff', marginBottom: '4px' }}>
              {lowestCost.title}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <span>{formatPrice(lowestCost.price)}</span>
              <span>Score: {lowestCost.score}</span>
            </div>
          </div>
        )}

        {bestPremium && (
          <div style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '14px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#a78bfa', fontWeight: 700, textTransform: 'uppercase', marginBottom: '6px' }}>
              <Sparkles size={14} /> Top Spec Leader
            </div>
            <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#ffffff', marginBottom: '4px' }}>
              {bestPremium.title}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <span>{formatPrice(bestPremium.price)}</span>
              <span style={{ color: '#a78bfa', fontWeight: 600 }}>Score: {bestPremium.score}</span>
            </div>
          </div>
        )}
      </div>

      {/* Budget Ladder Scenarios */}
      {ladder.length > 0 && (
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '12px' }}>
            <Layers size={14} color="var(--accent-cyan)" /> Budget Ladder Simulation (What Wins at Each Price Bracket)
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${ladder.length}, 1fr)`, gap: '10px' }}>
            {ladder.map((step, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '10px 12px',
                  textAlign: 'center'
                }}
              >
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)', marginBottom: '4px' }}>
                  {formatPrice(step.budgetThreshold)}
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={step.winnerTitle}>
                  {step.winnerTitle}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Score: {step.winnerScore}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
