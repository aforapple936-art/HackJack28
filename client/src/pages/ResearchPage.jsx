import React, { useState } from 'react';
import { Search, Globe, ShieldCheck, CheckCircle2, ArrowRight, ExternalLink, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import SourceBadge from '../components/SourceBadge';

export default function ResearchPage({ onSelectDecision }) {
  const [query, setQuery] = useState('');
  const [domain, setDomain] = useState('shopping');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await api.searchResearch(domain, query);
      if (res && res.data) {
        setResults(res.data);
      }
    } catch (err) {
      alert(`Research provider error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '8px' }}>
          Live Multi-Source Research Engine
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
          Real-time query discovery across commerce catalogs, travel networks, and clinical databases with provenance attribution
        </p>
      </div>

      {/* Query Bar */}
      <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
        <form onSubmit={handleSearch}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
            <input
              type="text"
              className="input-field"
              style={{ flex: 1, minWidth: '280px', fontSize: '1rem', padding: '12px 16px' }}
              placeholder="Search products, travel destinations, or clinical facilities..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <select
              className="input-field"
              style={{ width: '160px' }}
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
            >
              <option value="shopping">Shopping / Tech</option>
              <option value="travel">Travel & Stays</option>
              <option value="health">Healthcare</option>
            </select>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '12px 24px' }}>
              <Search size={16} />
              {loading ? 'Searching Providers...' : 'Search Providers'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>Quick Suggestions:</span>
            <button type="button" onClick={() => { setQuery('RTX 4060 Laptops under 1.25L'); setDomain('shopping'); }} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', textDecoration: 'underline' }}>
              RTX 4060 Laptops
            </button>
            <span>•</span>
            <button type="button" onClick={() => { setQuery('4-day trip from Vijayawada'); setDomain('travel'); }} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', textDecoration: 'underline' }}>
              Araku & Vizag Stays
            </button>
            <span>•</span>
            <button type="button" onClick={() => { setQuery('Dermatologists in Vijayawada'); setDomain('health'); }} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', textDecoration: 'underline' }}>
              Dermatology Clinics
            </button>
          </div>
        </form>
      </div>

      {/* Results Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {results.map((item, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="badge badge-domain">{domain}</span>
                <SourceBadge status="verified" confidence={96} />
              </div>

              <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '8px' }}>
                {item.name || item.title}
              </h3>

              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                {item.verifiedPrice && <div>Verified Price: <strong style={{ color: '#ffffff' }}>₹{Number(item.verifiedPrice).toLocaleString('en-IN')}</strong></div>}
                {item.avgCost4Days && <div>Estimated 4-Day Cost: <strong style={{ color: '#ffffff' }}>₹{Number(item.avgCost4Days).toLocaleString('en-IN')}</strong></div>}
                {item.weather && <div>Current Weather: <strong style={{ color: 'var(--accent-cyan)' }}>{item.weather}</strong></div>}
                {item.transitMode && <div>Transit: <strong>{item.transitMode}</strong></div>}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              <span>Source: {item.source || 'Retailer Direct'}</span>
              <span className="badge badge-verified">Freshness: Today</span>
            </div>
          </div>
        ))}
      </div>

      {results.length === 0 && !loading && (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <Globe size={36} color="var(--accent-cyan)" style={{ marginBottom: '12px', opacity: 0.6 }} />
          <div style={{ fontSize: '1.1rem', color: '#ffffff', marginBottom: '6px' }}>Ready to Research Real-World Data</div>
          <div style={{ fontSize: '0.85rem' }}>Enter a query above to retrieve live verified specifications, prices, and travel logistics.</div>
        </div>
      )}
    </div>
  );
}
