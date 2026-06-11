module.exports = {
  ROLES: {
    CUSTOMER: 'customer',
    PROVIDER: 'provider',
    ADMIN: 'admin',
  },
  BOOKING_STATUS: {
    SUBMITTED: 'submitted',
    PENDING: 'pending',
    ACCEPTED: 'accepted',
    REJECTED: 'rejected',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  },
  VERIFICATION_STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
  },
  REVIEW_STATUS: {
    PENDING: 'pending',
    APPROVED: 'approved',
    REJECTED: 'rejected',
  },
  NOTIFICATION_TYPES: {
    REGISTRATION: 'registration',
    PROVIDER_APPROVAL: 'provider_approval',
    BOOKING_CREATED: 'booking_created',
    BOOKING_ACCEPTED: 'booking_accepted',
    BOOKING_REJECTED: 'booking_rejected',
    BOOKING_COMPLETED: 'booking_completed',
    NEW_REVIEW: 'new_review',
    GENERAL: 'general',
  },
};
