import { Registration } from '../models/Registration.js';

export async function fetchDashboardStatistics() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalRegistered,
    totalCheckedIn,
    todayRegistrations,
    guestAggregation,
    examAggregation,
    classAggregation,
    overTimeAggregation,
    recentCheckIns,
  ] = await Promise.all([
    Registration.countDocuments(),
    Registration.countDocuments({ status: 'CHECKED_IN' }),
    Registration.countDocuments({ createdAt: { $gte: today } }),

    Registration.aggregate([
      {
        $group: {
          _id: null,
          totalGuests: { $sum: '$numberOfGuests' },
          checkedInGuests: {
            $sum: {
              $cond: [{ $eq: ['$status', 'CHECKED_IN'] }, '$numberOfGuests', 0],
            },
          },
        },
      },
    ]),

    Registration.aggregate([
      { $group: { _id: '$exam', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),

    Registration.aggregate([
      { $group: { _id: '$classCourse', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),

    Registration.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: '%b %d', date: '$createdAt' },
          },
          count: { $sum: 1 },
          rawDate: { $first: '$createdAt' },
        },
      },
      { $sort: { rawDate: 1 } },
      { $limit: 14 },
    ]),

    Registration.find({ status: 'CHECKED_IN' })
      .sort({ checkedInAt: -1 })
      .limit(10)
      .select('registrationId studentName exam rank classCourse numberOfGuests checkedInAt checkedInBy'),
  ]);

  const pending = totalRegistered - totalCheckedIn;
  const checkedInPercentage =
    totalRegistered > 0 ? Math.round((totalCheckedIn / totalRegistered) * 100) : 0;

  const guests = guestAggregation[0] || { totalGuests: 0, checkedInGuests: 0 };

  return {
    registered: totalRegistered,
    checkedIn: totalCheckedIn,
    pending: pending >= 0 ? pending : 0,
    checkedInPercentage,
    todayRegistrations,
    totalGuests: guests.totalGuests || 0,
    checkedInGuests: guests.checkedInGuests || 0,
    totalAttendanceEstimate: totalCheckedIn + (guests.checkedInGuests || 0),
    byExam: examAggregation.map((e) => ({ exam: e._id || 'Unspecified', count: e.count })),
    byClass: classAggregation.map((c) => ({ classCourse: c._id || 'Unspecified', count: c.count })),
    overTime: overTimeAggregation.map((o) => ({ date: o._id, count: o.count })),
    recentCheckIns,
  };
}
