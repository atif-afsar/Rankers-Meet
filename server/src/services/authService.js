import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';

function generateToken(id) {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'super_secret_rankers_meet_jwt_key_2026_yasir_ali_classes',
    { expiresIn: '7d' }
  );
}

export async function loginAdmin({ email, password }) {
  if (!email || !password) {
    const error = new Error('Please provide both email and password.');
    error.statusCode = 400;
    throw error;
  }

  const admin = await Admin.findOne({ email: email.toLowerCase() });
  if (!admin) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(admin._id);

  return {
    token,
    user: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  };
}

export async function getAdminProfile(adminId) {
  const admin = await Admin.findById(adminId).select('-passwordHash');
  if (!admin) {
    const error = new Error('Admin not found');
    error.statusCode = 404;
    throw error;
  }
  return {
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  };
}
