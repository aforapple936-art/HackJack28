import React, { useState, useEffect } from 'react';
import { Bell, ShieldCheck, PlusCircle, Check, X, ToggleLeft, ToggleRight, DollarSign, Clock } from 'lucide-react';
import { api } from '../services/api';

export default function AlertManager({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [alerts, setAlerts] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [targetDecisionId, setTargetDecisionId] = useState('');
  const [alertType, setAlertType] = useState('price_drop');
  const [threshold, setThreshold] = useState('');

  const fetchAlerts = () => {
    setLoading(true);
    Promise.all([
      api.getAlerts().catch(() => ({ data: [] })),
      api.getDecisions().catch(() => ({ data: [] }))
    ]).then(([alertRes, decRes]) => {
      if (alertRes?.data) setAlerts(alertRes.data);
      if (decRes?.data) {
        setDecisions(decRes.data);
        if (decRes.data.length > 0) setTargetDecisionId(decRes.data[0].id);
      }
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleToggle = async (id, currentStatus) => {
    try {
      await api.toggleAlert(id, !currentStatus);
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_enabled: !currentStatus } : a));
    } catch (err) {
      alert(`Failed to toggle alert: ${err.message}`);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!targetDecisionId) return;

    try {
      await api.createAlert({
        decision_id: targetDecisionId,
        alert_type: alertType,
        target_field: alertType === 'price_drop' ? 'price' : 'availability',
        condition_op: 'less_than',
        threshold_value: threshold || '100000',
        frequency: 'daily'
      });
      setThreshold('');
      fetchAlerts();
    } catch (err) {
      alert(`Alert creation failed: ${err.message}`);
    }
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
              background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bell size={18} color="#ffffff" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Decision Alerts & Monitoring</h3>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Automated threshold monitoring backed by live provider feeds
              </div>
            </div>
          </div>
          <button onClick={onClose} className="btn btn-sm btn-secondary" style={{ padding: '6px' }}>
            <X size={18} />
          </button>
        </div>

        {/* Create Alert Form */}
        <form onSubmit={handleCreate} style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '16px',
          marginBottom: '24px'
        }}>
          <h4 style={{ fontSize: '0.9rem', color: '#ffffff', marginBottom: '12px' }}>
            Configure New Alert
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Monitored Decision:
              </label>
              <select
                className="input-field"
                value={targetDecisionId}
                onChange={(e) => setTargetDecisionId(e.target.value)}
              >
                {decisions.map(d => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Alert Condition:
              </label>
              <select
                className="input-field"
                value={alertType}
                onChange={(e) => setAlertType(e.target.value)}
              >
                <option value="price_drop">Price drops below threshold</option>
                <option value="fee_change">Consultation fee update</option>
                <option value="availability_change">Availability status change</option>
                <option value="recommendation_flip">Recommendation winner flips</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Target Threshold (₹ / Value):
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. 115000"
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-sm" style={{ width: '100%' }}>
            <PlusCircle size={14} /> Activate Live Monitor
          </button>
        </form>

        {/* Existing Alerts List */}
        <h4 style={{ fontSize: '0.95rem', color: '#ffffff', marginBottom: '12px' }}>
          Active Monitored Triggers ({alerts.length})
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {alerts.map((al, idx) => (
            <div
              key={al.id || idx}
              style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div>
                <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.9rem', marginBottom: '2px' }}>
                  {al.alert_type === 'price_drop' ? `Price Drop Alert (< ₹${Number(al.threshold_value).toLocaleString('en-IN')})` : al.alert_type.replace(/_/g, ' ')}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Frequency: {al.frequency || 'Daily'} • Status: {al.is_enabled ? 'Active Monitoring' : 'Paused'}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleToggle(al.id, al.is_enabled)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: al.is_enabled ? '#34d399' : '#64748b' }}
              >
                {al.is_enabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
              </button>
            </div>
          ))}

          {alerts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              No active alerts. Configure one above to receive price drop or availability triggers.
            </div>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
