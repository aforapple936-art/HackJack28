import React, { useState, useEffect } from 'react';
import { MapPin, Search, HeartPulse, Building2, Phone, Clock, AlertTriangle, Navigation, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import MapPanel from '../components/MapPanel';

export default function NearbySearch() {
  const [center, setCenter] = useState({ lat: 16.5062, lng: 80.6480 });
  const [locationName, setLocationName] = useState('Vijayawada, Andhra Pradesh');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState('hospital');
  const [radius, setRadius] = useState(10000);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchNearbyPlaces = () => {
    setLoading(true);
    api.getNearby(center.lat, center.lng, type, radius)
      .then(res => {
        if (res && res.data) setPlaces(res.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchNearbyPlaces();
  }, [center, type, radius]);

  const handleSearchCity = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    try {
      const res = await api.searchLocation(searchQuery);
      if (res && res.data && res.data.length > 0) {
        const top = res.data[0];
        setCenter({ lat: top.lat, lng: top.lng });
        setLocationName(top.label);
      }
    } catch (err) {
      alert(`Geocoding error: ${err.message}`);
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '2rem', color: '#ffffff', marginBottom: '8px' }}>
          Real-World Location Intelligence & Facilities
        </h1>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
          Verified healthcare clinics, hospitals, and travel hubs with live distance calculation and emergency infrastructure
        </p>
      </div>

      {/* Health Safety Disclaimer Banner */}
      <div style={{
        background: 'rgba(244, 63, 94, 0.08)',
        border: '1px solid rgba(244, 63, 94, 0.25)',
        borderRadius: '12px',
        padding: '12px 18px',
        marginBottom: '24px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: '#fda4af',
        fontSize: '0.84rem'
      }}>
        <ShieldCheck size={20} style={{ flexShrink: 0 }} />
        <div>
          <strong>HEALTH SAFETY RULE:</strong> Choosy provides verified administrative & operational facts to assist facility comparison. It is NOT clinical advice or medical diagnosis. For critical or urgent symptoms, visit an emergency room immediately.
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="glass-panel" style={{ padding: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', alignItems: 'flex-end' }}>
          {/* City / Place Search */}
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Search City or Postal Code:
            </label>
            <form onSubmit={handleSearchCity} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Vijayawada, Guntur, Vizag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-primary btn-sm">
                <Search size={14} />
              </button>
            </form>
          </div>

          {/* Amenity Type Selector */}
          <div>
            <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Facility Category:
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className={`btn btn-sm ${type === 'hospital' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setType('hospital')}
              >
                Hospitals
              </button>
              <button
                className={`btn btn-sm ${type === 'clinic' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setType('clinic')}
              >
                Skin Clinics
              </button>
              <button
                className={`btn btn-sm ${type === 'hotel' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setType('hotel')}
              >
                Hotels & Stays
              </button>
            </div>
          </div>

          {/* Current Region Badge */}
          <div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Active Geolocation:</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
              <MapPin size={16} />
              <span>{locationName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Map & Facility Results Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Interactive Leaflet Map */}
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ marginBottom: '12px', fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', display: 'flex', justifyContent: 'space-between' }}>
            <span>Live Map (OpenStreetMap Tiles)</span>
            <span style={{ color: 'var(--text-muted)' }}>{places.length} verified pins</span>
          </div>
          <MapPanel center={center} markers={places} height="520px" />
        </div>

        {/* Facility Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '560px', overflowY: 'auto' }}>
          {places.map((place, idx) => (
            <div key={place.id || idx} className="glass-panel" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h3 style={{ fontSize: '1.05rem', color: '#ffffff', margin: 0 }}>
                  {place.name}
                </h3>
                {place.distanceKm && (
                  <span className="badge badge-domain">
                    {place.distanceKm} km away
                  </span>
                )}
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                {place.address}
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
                {place.emergency && (
                  <span className="badge" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185' }}>
                    🚨 24x7 Emergency Dept
                  </span>
                )}
                {place.phone && (
                  <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#cbd5e1' }}>
                    <Phone size={12} /> {place.phone}
                  </span>
                )}
                <span className="badge badge-verified">
                  ✓ Verified Location
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                <span>Source: {place.source || 'GeoRegistry'}</span>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + (place.address || ''))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-secondary"
                  style={{ color: 'var(--accent-cyan)', padding: '4px 8px', fontSize: '0.75rem' }}
                >
                  <Navigation size={12} /> Get Directions
                </a>
              </div>
            </div>
          ))}

          {places.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              No facilities found matching current filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
