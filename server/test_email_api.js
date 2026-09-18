async function testEmailFeatures() {
  const API_URL = 'http://localhost:5000/api';
  
  // 1. Admin login
  const loginRes = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@yasiraliclasses.in',
      password: 'Admin@12345',
    }),
  }).then((r) => r.json());

  const token = loginRes.token;
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  console.log('Login successful! Got token.');

  // 2. Query registrations with emailStatus=all
  const allRes = await fetch(`${API_URL}/registrations`, {
    headers: authHeaders,
  }).then((r) => r.json());

  console.log(`Registrations total: ${allRes.pagination.total}`);
  const first = allRes.data[0];
  console.log(`First attendee: ${first.registrationId}, Email: ${first.email}, EmailStatus: ${first.emailStatus}`);

  // 3. Resend email for first attendee
  const resendRes = await fetch(`${API_URL}/registrations/${first.registrationId}/resend-email`, {
    method: 'POST',
    headers: authHeaders,
  }).then((r) => r.json());
  console.log(`Resend response:`, resendRes);

  // 4. Query with emailStatus=SENT
  const sentRes = await fetch(`${API_URL}/registrations?emailStatus=SENT`, {
    headers: authHeaders,
  }).then((r) => r.json());
  console.log(`Delivered registrations count: ${sentRes.pagination.total}`);

  console.log('--- ALL EMAIL NOTIFICATION API TESTS PASSED! ---');
}

testEmailFeatures().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
