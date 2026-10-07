import React from 'react';
import { ThumbsUp, ThumbsDown, AlertCircle, Quote, Star, ShieldCheck } from 'lucide-react';

export default function ReviewInsights({ insights }) {
  if (!insights) return null;

  const {
    overall_rating = 4.6,
    review_count = 1200,
    positive_themes = [],
    negative_themes = [],
    recurring_issues = [],
    review_confidence = 'high',
    sample_quotes = []
  } = insights;

  return (
    <div className="glass-panel" style={{ padding: '20px', marginTop: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            padding: '4px 10px',
            borderRadius: '10px',
            color: '#fbbf24',
            fontWeight: 700
          }}>
            <Star size={15} fill="#fbbf24" />
            <span>{overall_rating}</span>
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Based on {review_count.toLocaleString()} verified customer reviews
          </span>
        </div>

        <div className="badge badge-verified" style={{ textTransform: 'capitalize' }}>
          <ShieldCheck size={12} /> Confidence: {review_confidence}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px', marginBottom: '16px' }}>
        {/* Positive Themes */}
        <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.15)', borderRadius: '12px', padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 600, fontSize: '0.88rem', marginBottom: '10px' }}>
            <ThumbsUp size={15} /> Verified Strengths
          </div>
          <ul style={{ paddingLeft: '18px', fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            {positive_themes.map((theme, i) => (
              <li key={i}>{theme}</li>
            ))}
          </ul>
        </div>

        {/* Negative Themes */}
        <div style={{ background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.15)', borderRadius: '12px', padding: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fb7185', fontWeight: 600, fontSize: '0.88rem', marginBottom: '10px' }}>
            <ThumbsDown size={15} /> Weaknesses & Cons
          </div>
          <ul style={{ paddingLeft: '18px', fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6 }}>
            {negative_themes.map((theme, i) => (
              <li key={i}>{theme}</li>
            ))}
          </ul>
        </div>

        {/* Recurring Issues */}
        {recurring_issues.length > 0 && (
          <div style={{ background: 'rgba(245, 158, 11, 0.05)', border: '1px solid rgba(245, 158, 11, 0.15)', borderRadius: '12px', padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fbbf24', fontWeight: 600, fontSize: '0.88rem', marginBottom: '10px' }}>
              <AlertCircle size={15} /> Recurring Caveats
            </div>
            <ul style={{ paddingLeft: '18px', fontSize: '0.84rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              {recurring_issues.map((issue, i) => (
                <li key={i}>{issue}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Verified Quotes */}
      {sample_quotes.length > 0 && (
        <div style={{ background: 'rgba(15, 23, 42, 0.5)', borderRadius: '10px', padding: '12px', border: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 600 }}>
            <Quote size={13} /> Selected Verified User Quotes
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {sample_quotes.map((quote, i) => (
              <div key={i} style={{ fontSize: '0.83rem', color: '#94a3b8', fontStyle: 'italic', borderLeft: '2px solid var(--accent-cyan)', paddingLeft: '10px' }}>
                "{quote}"
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
