const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  try {
    const token = req.header('x-auth-token');
    
    if (!token) {
      return res.status(401).json({ 
        status: 'error',
        msg: 'Authentication required' 
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({ 
        status: 'error',
        msg: 'Server configuration error' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!decoded || !decoded.isAdmin) {
      return res.status(403).json({ 
        status: 'error',
        msg: 'Insufficient permissions' 
      });
    }

    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ 
        status: 'error',
        msg: 'Token expired' 
      });
    }

    req.admin = decoded;
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        status: 'error',
        msg: 'Invalid token' 
      });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        status: 'error',
        msg: 'Token expired' 
      });
    }
    console.error('Auth middleware error:', err);
    next(err);
  }
};
