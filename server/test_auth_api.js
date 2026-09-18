async function testAuthSecurity() {
  const API_URL = 'http://localhost:5000/api';

  console.log('--- TEST 1: Generic Error for Non-existent Email ---');
  const fakeRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'unknown_fake_user@yasiraliclasses.in', password: 'SomePassword123' }),
  });
  const fakeData = await fakeRes.json();
  console.log(`Status: ${fakeRes.status}, Message: "${fakeData.message}"`);
  if (fakeRes.status !== 401 || fakeData.message !== 'Invalid email or password.') {
    throw new Error('Did not return generic 401 message for unknown email');
  }

  console.log('\n--- TEST 2: Generic Error for Wrong Password ---');
  const wrongPassRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@yasiraliclasses.in', password: 'WrongPassword123' }),
  });
  const wrongPassData = await wrongPassRes.json();
  console.log(`Status: ${wrongPassRes.status}, Message: "${wrongPassData.message}"`);
  if (wrongPassRes.status !== 401 || wrongPassData.message !== 'Invalid email or password.') {
    throw new Error('Did not return generic 401 message for wrong password');
  }

  console.log('\n--- TEST 3: Protected Route Rejects Unauthenticated Request ---');
  const noAuthRes = await fetch(`${API_URL}/dashboard/stats`);
  const noAuthData = await noAuthRes.json();
  console.log(`Status: ${noAuthRes.status}, Message: "${noAuthData.message}"`);
  if (noAuthRes.status !== 401) {
    throw new Error('Unauthenticated request was not rejected with 401');
  }

  console.log('\n--- TEST 4: Staff Login and RBAC Restriction on Settings ---');
  const staffLoginRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'staff@yasiraliclasses.in', password: 'Staff@12345' }),
  });
  const staffData = await staffLoginRes.json();
  console.log(`Staff Login Status: ${staffLoginRes.status}, Role: ${staffData.user.role}`);

  const staffUpdateRes = await fetch(`${API_URL}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${staffData.token}`,
    },
    body: JSON.stringify({ maxCapacity: 9999 }),
  });
  const staffUpdateData = await staffUpdateRes.json();
  console.log(`Staff PUT /api/settings Status: ${staffUpdateRes.status}, Message: "${staffUpdateData.message}"`);
  if (staffUpdateRes.status !== 403) {
    throw new Error('Staff was not blocked from modifying settings with 403 Forbidden');
  }

  console.log('\n--- TEST 5: Admin Login and Settings Update Authorization ---');
  const adminLoginRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@yasiraliclasses.in', password: 'Admin@12345' }),
  });
  const adminData = await adminLoginRes.json();
  console.log(`Admin Login Status: ${adminLoginRes.status}, Role: ${adminData.user.role}`);

  const adminUpdateRes = await fetch(`${API_URL}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminData.token}`,
    },
    body: JSON.stringify({ maxCapacity: 1200 }),
  });
  const adminUpdateData = await adminUpdateRes.json();
  console.log(`Admin PUT /api/settings Status: ${adminUpdateRes.status}, Success: ${adminUpdateData.success}`);
  if (adminUpdateRes.status !== 200 || !adminUpdateData.success) {
    throw new Error('Admin settings update failed');
  }

  console.log('\n--- ALL ADMIN AUTHENTICATION TESTS PASSED! ---');
}

testAuthSecurity().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
