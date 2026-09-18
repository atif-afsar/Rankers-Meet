import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';

export async function protect(req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Please log in.',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'super_secret_rankers_meet_jwt_key_2026_yasir_ali_classes'
    );

    const admin = await Admin.findById(decoded.id).select('-passwordHash');
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'The admin user assigned to this token no longer exists.',
      });
    }

    req.user = admin;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token. Please log in again.',
    });
  }
}

export function authorize(...roles) {
  const normalizedRoles = roles.map((r) => r.toUpperCase());
  return (req, res, next) => {
    const userRole = (req.user?.role || '').toUpperCase();
    if (!normalizedRoles.includes(userRole) && userRole !== 'SUPERADMIN') {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not authorized to perform this action.`,
      });
    }
    next();
  };
}
