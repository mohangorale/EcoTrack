// Finite State Machine (FSM) validation engine

const TRANSITIONS = {
  REGISTERED: ['COLLECTED'],
  COLLECTED: ['IN_TRANSIT'],
  IN_TRANSIT: ['UNDER_INSPECTION'],
  UNDER_INSPECTION: ['REFURBISHED', 'SENT_FOR_RECYCLING'],
  SENT_FOR_RECYCLING: ['PROCESSED'],
  REFURBISHED: [],
  PROCESSED: []
};

const ROLE_PERMISSIONS = {
  COLLECTED: ['COLLECTION_CENTRE', 'ADMIN'],
  IN_TRANSIT: ['TRANSPORTER', 'ADMIN'],
  UNDER_INSPECTION: ['INSPECTOR', 'ADMIN'],
  REFURBISHED: ['INSPECTOR', 'ADMIN'],
  SENT_FOR_RECYCLING: ['INSPECTOR', 'ADMIN'],
  PROCESSED: ['RECYCLER', 'ADMIN']
};

function isValidTransition(currentStatus, targetStatus) {
  const allowed = TRANSITIONS[currentStatus];
  if (!allowed) return false;
  return allowed.includes(targetStatus);
}

function isRoleAuthorizedForStatus(userRole, targetStatus) {
  if (userRole === 'ADMIN') return true;
  const allowedRoles = ROLE_PERMISSIONS[targetStatus];
  if (!allowedRoles) return false;
  return allowedRoles.includes(userRole);
}

module.exports = {
  TRANSITIONS,
  ROLE_PERMISSIONS,
  isValidTransition,
  isRoleAuthorizedForStatus
};
