import { loginAdmin, getAdminProfile } from '../services/authService.js';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await loginAdmin({ email, password });
    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      ...result,
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res) {
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully.',
  });
}

export async function getMe(req, res, next) {
  try {
    const profile = await getAdminProfile(req.user._id);
    return res.status(200).json({
      success: true,
      user: profile,
    });
  } catch (err) {
    next(err);
  }
}
