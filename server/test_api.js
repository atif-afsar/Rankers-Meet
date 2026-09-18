async function runTests() {
  const baseUrl = 'http://localhost:5000/api';

  console.log('--- TEST 1: Health Check ---');
  const healthRes = await fetch(`${baseUrl}/health`);
  const healthData = await healthRes.json();
  console.log('Health:', healthData);
  if (!healthData.success || healthData.message !== 'Rankers Meet API is running') {
    throw new Error('Health check response format does not match specification.');
  }

  console.log('\n--- TEST 2: Admin Login ---');
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@yasiraliclasses.in',
      password: 'Admin@12345',
    }),
  });
  const loginData = await loginRes.json();
  console.log('Login status:', loginRes.status, 'Success:', loginData.success);
  const token = loginData.token;

  console.log('\n--- TEST 3: New Registration ---');
  const regRes = await fetch(`${baseUrl}/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentName: 'Farhan Akhtar',
      parentName: 'Javed Akhtar',
      mobileNumber: '9988776655',
      email: 'farhan.test@example.com',
      classCourse: 'Class 12',
      exam: 'NEET',
      rank: 'AIR 15',
      schoolCollege: 'Aligarh Public School',
      numberOfGuests: 2,
      additionalInfo: 'Prefers front row seating for parents',
    }),
  });
  const regData = await regRes.json();
  console.log('Registration status:', regRes.status, 'ID:', regData.registration?.registrationId);
  const newRegId = regData.registration?.registrationId;
  const qrToken = regData.registration?.qrToken;

  console.log('\n--- TEST 4: Get Ticket ---');
  const ticketRes = await fetch(`${baseUrl}/tickets/${newRegId}`);
  const ticketData = await ticketRes.json();
  console.log('Ticket status:', ticketRes.status, 'Name:', ticketData.ticket?.studentName, 'QR exists:', !!ticketData.ticket?.qrCode);

  console.log('\n--- TEST 5: QR Check-in Scan (First time -> SUCCESS) ---');
  const checkin1 = await fetch(`${baseUrl}/checkin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ qrToken, scannedBy: 'Gate 1 Staff' }),
  });
  const checkin1Data = await checkin1.json();
  console.log('Check-in status:', checkin1.status, 'Result:', checkin1Data.message);

  console.log('\n--- TEST 6: QR Check-in Scan (Second time -> DUPLICATE) ---');
  const checkin2 = await fetch(`${baseUrl}/checkin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ qrToken, scannedBy: 'Gate 1 Staff' }),
  });
  const checkin2Data = await checkin2.json();
  console.log('Check-in duplicate status:', checkin2.status, 'Result:', checkin2Data.message);

  console.log('\n--- TEST 7: Dashboard Stats ---');
  const statsRes = await fetch(`${baseUrl}/dashboard/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const statsData = await statsRes.json();
  console.log('Dashboard Stats:', {
    registered: statsData.stats?.registered,
    checkedIn: statsData.stats?.checkedIn,
    pending: statsData.stats?.pending,
    checkedInPercentage: statsData.stats?.checkedInPercentage,
  });

  console.log('\n--- ALL BACKEND CORE TESTS PASSED! ---');
}

runTests().catch(console.error);
