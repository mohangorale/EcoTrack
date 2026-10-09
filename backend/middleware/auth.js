const jwt = require('jsonwebtoken');
const store = require('../data/store');

const JWT_SECRET = process.env.JWT_SECRET || 'ecotrack_secure_jwt_secret_token_2026_super_key!';

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: Authentication token required',
      errorCode: 'UNAUTHENTICATED'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = store.findUserById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User account not found',
        errorCode: 'UNAUTHENTICATED'
      });
    }

    if (user.accountStatus === 'SUSPENDED') {
      return res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact administrator.',
        errorCode: 'FORBIDDEN'
      });
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      organizationName: user.organizationName,
      accountStatus: user.accountStatus
    };

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication token',
      errorCode: 'UNAUTHENTICATED'
    });
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        errorCode: 'UNAUTHENTICATED'
      });
    }

    if (req.user.role === 'ADMIN') {
      return next(); // Admin has omni-access
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' is not authorized for this resource`,
        errorCode: 'FORBIDDEN'
      });
    }

    next();
  };
}

module.exports = {
  verifyToken,
  authorizeRoles,
  JWT_SECRET
};
