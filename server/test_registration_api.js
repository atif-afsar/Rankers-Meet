async function testRegistrationApi() {
  const baseUrl = 'http://localhost:5000/api';

  console.log('--- TEST 1: POST /api/registrations with 06-REGISTRATION-API.md payload ---');
  const payload = {
    studentName: 'Bilal Hassan',
    parentName: 'Hassan Tariq',
    mobile: '9876501234',
    email: 'bilal.hassan@example.com',
    classCourse: '12th',
    exam: 'NEET',
    rank: 312,
    schoolCollege: 'Aligarh Public School',
    guestCount: 2,
  };

  const regRes = await fetch(`${baseUrl}/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const regData = await regRes.json();
  console.log('Registration Status:', regRes.status);
  console.log('Response Structure:', JSON.stringify(regData, null, 2));

  if (!regData.success || !regData.data?.registrationId || !regData.data?.studentName || !regData.data?.status) {
    throw new Error('Response does not match 06-REGISTRATION-API.md schema.');
  }

  if (regData.data.qrToken) {
    throw new Error('Private field qrToken was leaked in public response data.');
  }
  console.log('PASSED: Response schema is safe and matches specification.');

  console.log('\n--- TEST 2: Admin Login & GET /api/registrations with filters ---');
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@yasiraliclasses.in', password: 'Admin@12345' }),
  });
  const { token } = await loginRes.json();

  const filterRes = await fetch(`${baseUrl}/registrations?page=1&limit=20&checkedIn=false`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const filterData = await filterRes.json();
  console.log(`Query ?checkedIn=false returned: ${filterData.data.length} records.`);
  const allNotCheckedIn = filterData.data.every((r) => r.status === 'REGISTERED' || r.checkedIn === false);
  if (!allNotCheckedIn) {
    throw new Error('Filter ?checkedIn=false returned checked-in records.');
  }
  console.log('PASSED: ?checkedIn=false filter is accurate.');

  console.log('\n--- TEST 3: Invalid Mobile Format Rejection ---');
  const invalidRes = await fetch(`${baseUrl}/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...payload,
      email: 'unique@example.com',
      mobile: '12345', // invalid phone
    }),
  });
  const invalidData = await invalidRes.json();
  console.log('Invalid mobile response status:', invalidRes.status, 'Message:', invalidData.message);
  if (invalidRes.status !== 400) {
    throw new Error('Invalid mobile was not rejected with status 400.');
  }
  console.log('PASSED: Mobile validation correctly rejected invalid format.');

  console.log('\n--- ALL 06-REGISTRATION-API SPEC TESTS PASSED! ---');
}

testRegistrationApi().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
