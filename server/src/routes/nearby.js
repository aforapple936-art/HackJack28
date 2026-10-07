const express = require('express');
const router = express.Router();
const placesProvider = require('../providers/placesProvider');

// GET /api/nearby - Location-aware search for hospitals, doctors, hotels
router.get('/', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat) || 16.5062;
    const lng = parseFloat(req.query.lng) || 80.6480;
    const type = req.query.type || 'hospital';
    const radius = parseInt(req.query.radius) || 10000;

    const places = await placesProvider.searchNearby(lat, lng, type, radius);

    // Health safety warning if searching health facilities
    const healthSafetyNotice = (type === 'hospital' || type === 'clinic')
      ? 'HEALTH SAFETY NOTICE: Choosy compares verified operational and facility parameters. This is not medical advice or clinical triage. For urgent conditions, contact emergency services immediately.'
      : null;

    res.json({
      success: true,
      center: { lat, lng },
      count: places.length,
      healthSafetyNotice,
      data: places
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/locations/search - Geocoding search
router.get('/search', async (req, res) => {
  try {
    const query = req.query.q || 'Vijayawada';
    const results = await placesProvider.geocode(query);
    res.json({ success: true, count: results.length, data: results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
