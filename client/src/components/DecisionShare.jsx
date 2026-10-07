import React, { useState, useEffect } from 'react';
import { Users, Share2, Copy, Check, X, ShieldAlert, Award, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function DecisionShare({ decisionId, isOpen, onClose }) {
  if (!isOpen) return null;

  const [collabData, setCollabData] = useState(null);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!decisionId) return;
    setLoading(true);

    Promise.all([
      api.shareDecision(decisionId).catch(() => ({ data: { shareUrl: window.location.href } })),
      api.getCollaborators(decisionId).catch(() => null)
    ]).then(([shareRes, collabRes]) => {
      if (shareRes?.data?.shareUrl) setShareUrl(shareRes.data.shareUrl);
      if (collabRes?.data) setCollabData(collabRes.data);
    }).finally(() => setLoading(false));
  }, [decisionId]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 250,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        background: '#0d1326',
        border: '1px solid rgba(6, 182, 212, 0.3)',
        borderRadius: '24px',
        padding: '28px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={18} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Collaborative Group Decision Studio</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Multi-participant preference aggregation, weighted consensus, and conflict detection
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-secondary" style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Share Link Box */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          borderRadius: '12px',
          padding: '14px 16px',
          border: '1px solid var(--border-subtle)',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>
            Shareable Invitation Link
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              readOnly
              className="input-field"
              style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)' }}
              value={shareUrl || 'Generating link...'}
            />
            <button onClick={copyToClipboard} className="btn btn-primary btn-sm">
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Consensus Result Showcase */}
        {collabData && (
          <div>
            <div style={{
              background: 'rgba(6, 182, 212, 0.08)',
              border: '1px solid rgba(6, 182, 212, 0.25)',
              borderRadius: '14px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.82rem', textTransform: 'uppercase', marginBottom: '6px' }}>
                <Award size={16} /> Group Consensus Recommendation
              </div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '4px' }}>
                {collabData.groupRecommendation}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                Weighted Consensus Score: <strong style={{ color: 'var(--accent-cyan)' }}>{collabData.consensusScore}/100</strong>
              </div>
            </div>

            {/* Disagreement Warning */}
            {collabData.conflictSummary && (
              <div style={{
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                borderRadius: '12px',
                padding: '12px 14px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.84rem',
                color: '#fde68a'
              }}>
                <ShieldAlert size={18} style={{ flexShrink: 0 }} />
                <div>
                  <strong>Preference Divergence Detected:</strong> {collabData.conflictSummary}
                </div>
              </div>
            )}

            {/* Participants Weights Matrix */}
            <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '10px' }}>
              Participant Individual Weights & Preferences
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {(collabData.collaborators || []).map((collab, i) => (
                <div
                  key={collab.id || i}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    padding: '12px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '10px'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.9rem' }}>
                      {collab.name}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      Priorities: {collab.priorities}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      Favors: "{collab.topPreference.slice(0, 24)}..."
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Influence Weight: {Math.round(collab.weight * 100)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close Studio
          </button>
        </div>
      </div>
    </div>
  );
}
