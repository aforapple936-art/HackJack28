import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Phone, AlertCircle, Navigation } from 'lucide-react';

// Fix Leaflet's default icon issue with bundlers
const customMarkerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapRecenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.setView([center.lat, center.lng], map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function MapPanel({ center = { lat: 16.5062, lng: 80.6480 }, markers = [], height = '380px' }) {
  const defaultCenter = [center.lat || 16.5062, center.lng || 80.6480];

  return (
    <div style={{ height, width: '100%', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border-subtle)', position: 'relative' }}>
      <MapContainer
        center={defaultCenter}
        zoom={13}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapRecenter center={center} />

        {/* Center / User Location Marker */}
        <Marker position={defaultCenter} icon={customMarkerIcon}>
          <Popup>
            <div style={{ color: '#0f172a', fontWeight: 600 }}>
              📍 Search Center Location
            </div>
          </Popup>
        </Marker>

        {/* Markers for places */}
        {markers.map((item, idx) => {
          const lat = item.lat || (item.location_info && item.location_info.lat);
          const lng = item.lng || (item.location_info && item.location_info.lng);
          if (!lat || !lng) return null;

          return (
            <Marker key={idx} position={[lat, lng]} icon={customMarkerIcon}>
              <Popup>
                <div style={{ color: '#0f172a', minWidth: '180px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '4px' }}>
                    {item.name || item.title}
                  </div>
                  {item.address && (
                    <div style={{ fontSize: '0.78rem', color: '#475569', marginBottom: '6px' }}>
                      {item.address}
                    </div>
                  )}
                  {item.distanceKm && (
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#0284c7' }}>
                      Distance: {item.distanceKm} km
                    </div>
                  )}
                  {item.emergency && (
                    <div style={{ fontSize: '0.72rem', color: '#e11d48', fontWeight: 700, marginTop: '2px' }}>
                      🚨 24x7 Emergency Dept Available
                    </div>
                  )}
                  {item.phone && (
                    <div style={{ fontSize: '0.75rem', color: '#334155', marginTop: '4px' }}>
                      📞 {item.phone}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
