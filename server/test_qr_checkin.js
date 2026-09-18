const API_BASE = 'http://localhost:5000/api';

async function testCheckInSystem() {
  console.log('=== TESTING 12-QR-CHECKIN-SYSTEM.MD ===\n');

  // 1. Staff Authentication
  console.log('1. Logging in as Staff...');
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'staff@yasiraliclasses.in',
      password: 'Staff@12345',
    }),
  });
  const loginData = await loginRes.json();
  const staffToken = loginData.token;
  const staffName = loginData.user.name;
  console.log(`✓ Staff authenticated: ${staffName} (${loginData.user.role})\n`);

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${staffToken}`,
  };

  const uniqueId = Date.now().toString().slice(-4);
  const testMobile1 = `98765${uniqueId.padStart(5, '0')}`;
  console.log('2. Creating fresh test registration...');
  const regRes = await fetch(`${API_BASE}/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentName: 'Zaid Farooq',
      parentName: 'Farooq Ahmad',
      mobile: testMobile1,
      email: `zaid.${uniqueId}@example.com`,
      classCourse: '12th',
      exam: 'NEET',
      rank: 125,
      schoolCollege: 'Delhi Public School',
      numberOfGuests: 2,
    }),
  });
  const regData = await regRes.json();
  const { registrationId } = regData.data;
  console.log(`✓ Created test registration: ${registrationId}`);

  // Retrieve registration with auth to get secure token
  const regDetailRes = await fetch(`${API_BASE}/registrations/${registrationId}`, {
    headers: authHeaders,
  });
  const regDetailData = await regDetailRes.json();
  const secureToken = regDetailData.data.qrToken;
  console.log(`✓ Retrieved secure token for ${registrationId}: ${secureToken.substring(0, 12)}...\n`);

  // 3. Test Successful Check-in with { token: "secure-token" }
  console.log('3. Testing First Scan: POST /api/checkin with { token }...');
  const firstScanRes = await fetch(`${API_BASE}/checkin`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ token: secureToken }),
  });
  const firstScanData = await firstScanRes.json();

  console.log('Response Status:', firstScanRes.status);
  console.log('Response Data:', JSON.stringify(firstScanData, null, 2));

  if (firstScanData.success && firstScanData.status === 'CHECKED_IN') {
    console.log('✓ PASS: Check-in succeeded with status: "CHECKED_IN" and success: true');
  } else {
    throw new Error('FAIL: Check-in response did not match expected structure');
  }

  // 4. Test Duplicate Check-in (Same token)
  console.log('\n4. Testing Duplicate Check-in (Same token)...');
  const dupRes = await fetch(`${API_BASE}/checkin`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ token: secureToken }),
  });
  const dupData = await dupRes.json();

  if (dupRes.status === 409) {
    console.log('✓ PASS: Correctly rejected duplicate check-in with 409 Conflict');
    console.log('Duplicate Details:', dupData.message, '-', dupData.details);
    if (dupData.message.includes('ALREADY CHECKED IN')) {
      console.log('✓ PASS: Error message states "ALREADY CHECKED IN"');
    }
  } else {
    throw new Error(`FAIL: Expected 409 Conflict, received ${dupRes.status}`);
  }

  // 5. Test Invalid Token
  console.log('\n5. Testing Invalid Token Check-in...');
  const invalidRes = await fetch(`${API_BASE}/checkin`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ token: 'nonexistent-crypto-token-xyz-12345' }),
  });
  const invalidData = await invalidRes.json();

  if (invalidRes.status === 404) {
    console.log('✓ PASS: Correctly rejected non-existent token with 404 Not Found');
    console.log('Invalid Message:', invalidData.message);
    if (invalidData.message.includes('INVALID TICKET')) {
      console.log('✓ PASS: Error message states "INVALID TICKET"');
    }
  } else {
    throw new Error(`FAIL: Expected 404 Not Found, received ${invalidRes.status}`);
  }

  // 6. Test Race Condition Protection (Simultaneous Scans)
  console.log('\n6. Testing Race Condition Protection (2 simultaneous scans)...');
  const testMobile2 = `98764${uniqueId.padStart(5, '0')}`;
  const regRes2 = await fetch(`${API_BASE}/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentName: 'Ayesha Siddiqui',
      parentName: 'Siddiqui Sahab',
      mobile: testMobile2,
      email: `ayesha.${uniqueId}@example.com`,
      classCourse: '11th',
      exam: 'JEE',
      rank: 88,
      schoolCollege: 'St. Mary School',
      numberOfGuests: 1,
    }),
  });
  const regData2 = await regRes2.json();
  const regId2 = regData2.data.registrationId;
  const regDetailRes2 = await fetch(`${API_BASE}/registrations/${regId2}`, {
    headers: authHeaders,
  });
  const regDetailData2 = await regDetailRes2.json();
  const token2 = regDetailData2.data.qrToken;

  // Fire 2 concurrent check-ins at exact same millisecond
  const [resA, resB] = await Promise.all([
    fetch(`${API_BASE}/checkin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ token: token2 }),
    }),
    fetch(`${API_BASE}/checkin`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ token: token2 }),
    }),
  ]);

  const statuses = [resA.status, resB.status];
  console.log(`Concurrent statuses: ${statuses.join(', ')}`);

  const has200 = statuses.includes(200);
  const has409 = statuses.includes(409);

  if (has200 && has409) {
    console.log('✓ PASS: Race condition protection succeeded! Exactly one request was marked checked in (200); the second was atomically caught as duplicate (409).');
  } else {
    throw new Error(`FAIL: Race condition test failed. Statuses: ${statuses.join(', ')}`);
  }

  // 7. Test Manual Fallback Search (via 10-digit mobile)
  console.log('\n7. Testing Manual Fallback Search (10-digit mobile)...');
  const testMobile3 = `98763${uniqueId.padStart(5, '0')}`;
  const regRes3 = await fetch(`${API_BASE}/registrations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      studentName: 'Bilal Hassan',
      parentName: 'Hassan Raza',
      mobile: testMobile3,
      email: `bilal.${uniqueId}@example.com`,
      classCourse: 'Repeater',
      exam: 'NEET',
      rank: 340,
      schoolCollege: 'Aligarh College',
      numberOfGuests: 0,
    }),
  });
  const regData3 = await regRes3.json();

  const manualMobileRes = await fetch(`${API_BASE}/checkin`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({ registrationId: testMobile3 }),
  });
  const manualData = await manualMobileRes.json();

  if (manualMobileRes.status === 200) {
    console.log(`✓ PASS: Manual checkin by 10-digit mobile succeeded: ${manualData.attendee.studentName} (${manualData.attendee.registrationId})`);
  } else {
    throw new Error(`FAIL: Manual checkin failed with status ${manualMobileRes.status}`);
  }

  console.log('\n=== ALL 12-QR-CHECKIN-SYSTEM TESTS PASSED SUCCESSFULLY! ===\n');
}

testCheckInSystem().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
