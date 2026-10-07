import React from 'react';
import { CheckCircle2, AlertTriangle, Sparkles, AlertOctagon, Clock, HelpCircle } from 'lucide-react';

export default function SourceBadge({ status, confidence, onClick, claim = null }) {
  const normalized = (status || 'unknown').toLowerCase();

  let badgeClass = 'badge-unknown';
  let icon = <HelpCircle size={12} />;
  let label = 'Unknown';

  if (normalized === 'verified') {
    badgeClass = 'badge-verified';
    icon = <CheckCircle2 size={12} />;
    label = 'Verified';
  } else if (normalized === 'estimate') {
    badgeClass = 'badge-estimate';
    icon = <AlertTriangle size={12} />;
    label = 'Estimate';
  } else if (normalized === 'ai_inference') {
    badgeClass = 'badge-ai';
    icon = <Sparkles size={12} />;
    label = 'AI Inference';
  } else if (normalized === 'conflicting') {
    badgeClass = 'badge-conflicting';
    icon = <AlertOctagon size={12} />;
    label = 'Conflicting Sources';
  } else if (normalized === 'stale') {
    badgeClass = 'badge-estimate';
    icon = <Clock size={12} />;
    label = 'Stale Data';
  }

  return (
    <span
      className={`badge ${badgeClass}`}
      onClick={onClick}
      title={claim ? `Claim: ${claim}` : 'Click to inspect source provenance'}
      style={{ cursor: onClick ? 'pointer' : 'default', userSelect: 'none' }}
    >
      {icon}
      <span>{label}</span>
      {confidence && <span style={{ opacity: 0.75, fontSize: '0.68rem' }}>({confidence}%)</span>}
    </span>
  );
}
