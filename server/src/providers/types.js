/**
 * Choosy Data Provider Abstraction & Provenance Types
 */

const VerificationStatus = {
  VERIFIED: 'verified',
  PARTIALLY_VERIFIED: 'partially_verified',
  ESTIMATE: 'estimate',
  AI_INFERENCE: 'ai_inference',
  USER_PROVIDED: 'user_provided',
  CONFLICTING: 'conflicting',
  STALE: 'stale',
  UNKNOWN: 'unknown'
};

const AvailabilityStatus = {
  AVAILABLE: 'available',
  LIMITED_STOCK: 'limited_stock',
  OUT_OF_STOCK: 'out_of_stock',
  APPOINTMENTS_AVAILABLE: 'appointments_available',
  NO_APPOINTMENTS: 'no_appointments',
  UNAVAILABLE: 'unavailable',
  UNKNOWN: 'unknown'
};

module.exports = {
  VerificationStatus,
  AvailabilityStatus
};
