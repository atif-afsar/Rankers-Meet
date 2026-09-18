import { fetchDashboardStatistics } from '../services/dashboardService.js';

export async function getDashboardStats(req, res, next) {
  try {
    const stats = await fetchDashboardStatistics();
    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (err) {
    next(err);
  }
}
