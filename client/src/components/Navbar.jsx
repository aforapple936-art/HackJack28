import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, PlusCircle, Sliders, MapPin, Search, ShieldCheck, Bell, History } from 'lucide-react';
import { api } from '../services/api';

export default function Navbar({ activeTab, setActiveTab, onNewDecision }) {
  const [credits, setCredits] = useState(450);

  useEffect(() => {
    api.getCredits().then(res => {
      if (res && res.balance !== undefined) setCredits(res.balance);
    }).catch(() => {});
  }, [activeTab]);

  return (
    <header className="navbar" style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(7, 10, 19, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '14px 24px',
      marginBottom: '28px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand & Tagline */}
        <div 
          onClick={() => setActiveTab('decisions')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)'
          }}>
            <Compass size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#ffffff' }}>
                CHOOSY
              </span>
              <span className="badge" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee', fontSize: '0.7rem' }}>
                PRO v2.0
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Turning Uncertainty Into Clarity.
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(15, 23, 42, 0.6)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setActiveTab('decisions')}
            className="btn btn-sm"
            style={{
              background: activeTab === 'decisions' ? 'rgba(6, 182, 212, 0.18)' : 'transparent',
              color: activeTab === 'decisions' ? '#22d3ee' : 'var(--text-secondary)',
              border: activeTab === 'decisions' ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid transparent'
            }}
          >
            <ShieldCheck size={16} /> Decisions
          </button>

          <button
            onClick={() => setActiveTab('research')}
            className="btn btn-sm"
            style={{
              background: activeTab === 'research' ? 'rgba(6, 182, 212, 0.18)' : 'transparent',
              color: activeTab === 'research' ? '#22d3ee' : 'var(--text-secondary)',
              border: activeTab === 'research' ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid transparent'
            }}
          >
            <Search size={16} /> Live Research
          </button>

          <button
            onClick={() => setActiveTab('nearby')}
            className="btn btn-sm"
            style={{
              background: activeTab === 'nearby' ? 'rgba(6, 182, 212, 0.18)' : 'transparent',
              color: activeTab === 'nearby' ? '#22d3ee' : 'var(--text-secondary)',
              border: activeTab === 'nearby' ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid transparent'
            }}
          >
            <MapPin size={16} /> Location & Maps
          </button>

          <button
            onClick={() => setActiveTab('compare')}
            className="btn btn-sm"
            style={{
              background: activeTab === 'compare' ? 'rgba(6, 182, 212, 0.18)' : 'transparent',
              color: activeTab === 'compare' ? '#22d3ee' : 'var(--text-secondary)',
              border: activeTab === 'compare' ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid transparent'
            }}
          >
            <History size={16} /> Compare
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className="btn btn-sm"
            style={{
              background: activeTab === 'preferences' ? 'rgba(6, 182, 212, 0.18)' : 'transparent',
              color: activeTab === 'preferences' ? '#22d3ee' : 'var(--text-secondary)',
              border: activeTab === 'preferences' ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid transparent'
            }}
          >
            <Sliders size={16} /> Preferences
          </button>

          <button
            onClick={() => setActiveTab('usage')}
            className="btn btn-sm"
            style={{
              background: activeTab === 'usage' ? 'rgba(6, 182, 212, 0.18)' : 'transparent',
              color: activeTab === 'usage' ? '#22d3ee' : 'var(--text-secondary)',
              border: activeTab === 'usage' ? '1px solid rgba(6, 182, 212, 0.3)' : '1px solid transparent'
            }}
          >
            <Sparkles size={16} /> AI Credits
          </button>
        </nav>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Alerts Trigger Button */}
          <button
            onClick={onOpenAlerts}
            title="Open Decision Alerts"
            className="btn btn-secondary btn-sm"
            style={{ padding: '8px', borderRadius: '12px' }}
          >
            <Bell size={16} color="var(--accent-amber)" />
          </button>

          {/* Credit balance display */}
          <div 
            onClick={() => setActiveTab('usage')}
            title="AI Credits Remaining"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '20px',
              background: 'rgba(139, 92, 246, 0.12)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              cursor: 'pointer'
            }}
          >
            <Sparkles size={14} color="#a78bfa" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#c4b5fd' }}>
              {credits} Credits
            </span>
          </div>

          <button onClick={onNewDecision} className="btn btn-primary">
            <PlusCircle size={16} /> New Decision
          </button>
        </div>
      </div>
    </header>
  );
}

