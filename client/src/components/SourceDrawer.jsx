import React from 'react';
import { X, ExternalLink, ShieldCheck, Clock, CheckCircle2, AlertOctagon } from 'lucide-react';
import SourceBadge from './SourceBadge';

export default function SourceDrawer({ evidence, isOpen, onClose }) {
  if (!isOpen || !evidence) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 200,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '640px',
        background: '#0d1326',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldCheck size={22} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Evidence Provenance Inspector</h3>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-secondary" style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Claim Box */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          borderRadius: '12px',
          padding: '16px',
          border: '1px solid var(--border-subtle)',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>
            Fact / Claim
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.4 }}>
            "{evidence.claim}"
          </div>
        </div>

        {/* Provenance Metadata Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Verification Status</div>
            <SourceBadge status={evidence.verification_status} confidence={evidence.confidence} />
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Confidence Score</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--accent-cyan)' }}>
              {evidence.confidence ? `${evidence.confidence}% Verified` : 'Standard'}
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Source / Provider</div>
            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
              {evidence.source_name || evidence.provider || 'Verified Registry'}
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '10px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Retrieved Timestamp</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Clock size={13} />
              {evidence.retrieved_at ? new Date(evidence.retrieved_at).toLocaleString() : 'Recent verification'}
            </div>
          </div>
        </div>

        {/* Raw Verified Snippet */}
        {evidence.raw_snippet && (
          <div style={{
            background: 'rgba(6, 182, 212, 0.05)',
            borderLeft: '3px solid var(--accent-cyan)',
            padding: '12px 14px',
            borderRadius: '4px',
            fontSize: '0.85rem',
            color: '#cbd5e1',
            marginBottom: '20px'
          }}>
            <strong style={{ color: 'var(--accent-cyan)', display: 'block', marginBottom: '4px' }}>Raw Source Extract:</strong>
            {evidence.raw_snippet}
          </div>
        )}

        {/* Conflict Warning if present */}
        {evidence.verification_status === 'conflicting' && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '10px',
            padding: '12px',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            marginBottom: '20px',
            color: '#fda4af',
            fontSize: '0.85rem'
          }}>
            <AlertOctagon size={18} />
            <div>Sources disagree on this data point. Choosy lowered confidence and flagged both values.</div>
          </div>
        )}

        {/* Action button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {evidence.source_url ? (
            <a
              href={evidence.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-secondary"
              style={{ color: 'var(--accent-cyan)' }}
            >
              <ExternalLink size={14} /> Open Original Source
            </a>
          ) : <div />}

          <button onClick={onClose} className="btn btn-primary btn-sm">
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
