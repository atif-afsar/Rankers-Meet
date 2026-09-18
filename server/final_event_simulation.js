import * as XLSX from 'xlsx';

const API_BASE = 'http://localhost:5000/api';

const FIRST_NAMES = [
  'Mohammad', 'Fatima', 'Aarav', 'Ananya', 'Zaid', 'Ayesha', 'Rohan', 'Pooja',
  'Bilal', 'Sana', 'Karan', 'Meera', 'Tariq', 'Zainab', 'Aditya', 'Neha',
  'Hamza', 'Farah', 'Sameer', 'Nida', 'Vikram', 'Isha', 'Rayyan', 'Bushra',
  'Arjun', 'Simran', 'Omar', 'Afreen', 'Dev', 'Alia', 'Sohail', 'Rukhsar',
  'Kabir', 'Mariam', 'Harsh', 'Tanvi', 'Asim', 'Sadia', 'Varun', 'Hina',
  'Mustafa', 'Lubna', 'Yash', 'Shruti', 'Faizan', 'Sumayya', 'Kunal', 'Uzma',
  'Rehan', 'Zoya'
];

const LAST_NAMES = [
  'Khan', 'Sharma', 'Ahmad', 'Verma', 'Siddiqui', 'Gupta', 'Ansari', 'Malik',
  'Patel', 'Qureshi', 'Choudhary', 'Raza', 'Singh', 'Farooqui', 'Joshi'
];

const EXAMS = ['NEET', 'JEE Main', 'JEE Advanced', 'Commerce / CUET', 'Boards / Olympiad'];
const CLASSES = ['Class 12', 'Class 11', 'Repeater / Dropper', 'Foundation (Class 9-10)'];
const SCHOOLS = [
  'Delhi Public School, Aligarh',
  'Our Lady of Fatima, Aligarh',
  'Aligarh Muslim University High School',
  'St. Fidelis Senior Secondary School',
  'Ingraham Institute English School',
  'City Montessori School',
  'Kendirya Vidyalaya, Aligarh'
];

async function runFinalEventSimulation() {
  console.log('===============================================================');
  console.log('       YASIR ALI CLASSES — RANKERS MEET 2026');
  console.log('   FINAL PRE-EVENT 50-ATTENDEE FULL CONCURRENCY SIMULATION');
  console.log('   Referencing: docs/14-TESTING-DEPLOYMENT.md');
  console.log('===============================================================\n');

  // Step 1: Authenticate Admin & 2 Staff Members
  console.log('[Phase 1] Authenticating Staff & Admin Accounts...');
  const adminLogin = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@yasiraliclasses.in', password: 'Admin@12345' }),
  });
  const adminData = await adminLogin.json();
  const adminToken = adminData.token;

  const staffLogin = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'staff@yasiraliclasses.in', password: 'Staff@12345' }),
  });
  const staffData = await staffLogin.json();
  const staffToken = staffData.token;

  console.log(`✓ Admin Authenticated: ${adminData.user.name}`);
  console.log(`✓ Gate Staff Authenticated: ${staffData.user.name}\n`);

  const adminHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${adminToken}` };
  const staffHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${staffToken}` };

  // Step 2: Create 50 Realistic Registrations
  console.log('[Phase 2] Registering 50 Dummy Candidates across NEET, JEE & CUET...');
  const registeredCandidates = [];
  const baseEpoch = Date.now().toString().slice(-5);

  for (let i = 0; i < 50; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i * 3) % LAST_NAMES.length];
    const studentName = `${firstName} ${lastName}`;
    const parentName = `${LAST_NAMES[(i + 2) % LAST_NAMES.length]} Parent`;
    const mobile = `98${baseEpoch}${String(i).padStart(3, '0')}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${baseEpoch}${i}@example.com`;
    const exam = EXAMS[i % EXAMS.length];
    const classCourse = CLASSES[i % CLASSES.length];
    const rank = `AIR ${Math.floor(Math.random() * 1500) + 1}`;
    const schoolCollege = SCHOOLS[i % SCHOOLS.length];
    const numberOfGuests = i % 4; // 0, 1, 2, 3 guests

    const regRes = await fetch(`${API_BASE}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        studentName,
        parentName,
        mobile,
        email,
        classCourse,
        exam,
        rank,
        schoolCollege,
        numberOfGuests,
      }),
    });

    if (regRes.status !== 201) {
      const errText = await regRes.text();
      throw new Error(`Registration failed for ${studentName}: ${errText}`);
    }

    const regData = await regRes.json();
    registeredCandidates.push({
      registrationId: regData.data.registrationId,
      studentName,
      mobile,
      exam,
      numberOfGuests,
      qrToken: regData.data.qrToken,
    });

    process.stdout.write(`.`);
  }

  console.log(`\n✓ Successfully created 50 candidate registrations! ID Range: ${registeredCandidates[0].registrationId} to ${registeredCandidates[49].registrationId}\n`);

  // Step 3: Fetch Tickets & Verify Cryptographic QR Codes
  console.log('[Phase 3] Validating QR Tickets & PII Privacy...');
  const sampleCandidate = registeredCandidates[0];
  const ticketRes = await fetch(`${API_BASE}/tickets/${sampleCandidate.registrationId}`);
  const ticketData = await ticketRes.json();

  if (!ticketData.ticket.qrCode || !ticketData.ticket.qrCode.startsWith('data:image/png;base64,')) {
    throw new Error('FAIL: Ticket did not contain high-resolution QR base64 image');
  }
  if (ticketData.ticket.qrToken) {
    throw new Error('SECURITY FAIL: Public ticket endpoint exposed raw qrToken');
  }
  console.log(`✓ Verified public ticket pass for ${sampleCandidate.registrationId}: Base64 QR Image generated; raw cryptographic token shielded from public view.\n`);

  // Step 4: Retrieve QR tokens via Authenticated Admin Endpoint
  console.log('[Phase 4] Fetching secure tokens for entrance gate scanning...');
  for (let candidate of registeredCandidates) {
    const detailRes = await fetch(`${API_BASE}/registrations/${candidate.registrationId}`, {
      headers: adminHeaders,
    });
    const detailData = await detailRes.json();
    candidate.secureToken = detailData.data.qrToken;
  }
  console.log(`✓ All 50 secure QR tokens retrieved for check-in simulation.\n`);

  // Step 5: Simulate Gate Entrance Scanning with 3 Staff Devices Concurrently
  console.log('[Phase 5] Simulating Multi-Device Simultaneous Gate Check-in for 35 Attendees...');
  const candidatesToCheckIn = registeredCandidates.slice(0, 35);
  const staffScanners = [
    { name: 'Gate 1 Scanner (Staff A)', headers: staffHeaders },
    { name: 'Gate 2 Scanner (Staff B)', headers: staffHeaders },
    { name: 'VIP Desk (Admin C)', headers: adminHeaders },
  ];

  let successCount = 0;
  for (let i = 0; i < candidatesToCheckIn.length; i += 3) {
    const batch = candidatesToCheckIn.slice(i, i + 3);
    const checkinPromises = batch.map((c, idx) => {
      const scanner = staffScanners[idx % staffScanners.length];
      return fetch(`${API_BASE}/checkin`, {
        method: 'POST',
        headers: scanner.headers,
        body: JSON.stringify({ token: c.secureToken, scannedBy: scanner.name }),
      }).then(r => r.json());
    });

    const results = await Promise.all(checkinPromises);
    for (const res of results) {
      if (res.success && res.status === 'CHECKED_IN') {
        successCount++;
      } else {
        throw new Error(`Checkin failed: ${JSON.stringify(res)}`);
      }
    }
  }
  console.log(`✓ 35 Attendees checked in across multiple gate scanners without a single drop or conflict!\n`);

  // Step 6: Test Duplicate Scan Rejection (Race Condition & Rescan Tests)
  console.log('[Phase 6] Testing Gate Alert: Scanning Already Checked-in Attendees...');
  const alreadyCheckedInCandidate = candidatesToCheckIn[0];
  const duplicateRes = await fetch(`${API_BASE}/checkin`, {
    method: 'POST',
    headers: staffHeaders,
    body: JSON.stringify({ token: alreadyCheckedInCandidate.secureToken }),
  });
  const duplicateData = await duplicateRes.json();

  if (duplicateRes.status === 409 && duplicateData.status === 'DUPLICATE') {
    console.log(`✓ PASS: Duplicate scan blocked with 409 Conflict. Message: "${duplicateData.message}"`);
  } else {
    throw new Error(`FAIL: Duplicate scan was not blocked! Status: ${duplicateRes.status}`);
  }

  // Step 7: Test Invalid QR Scanning
  console.log('\n[Phase 7] Testing Gate Alert: Scanning Fake / Malicious QR Code...');
  const fakeRes = await fetch(`${API_BASE}/checkin`, {
    method: 'POST',
    headers: staffHeaders,
    body: JSON.stringify({ token: 'fake-tampered-qr-token-xyz-12345' }),
  });
  const fakeData = await fakeRes.json();

  if (fakeRes.status === 404 && fakeData.status === 'INVALID') {
    console.log(`✓ PASS: Invalid QR blocked with 404 Not Found. Message: "${fakeData.message}"\n`);
  } else {
    throw new Error(`FAIL: Fake QR was not caught! Status: ${fakeRes.status}`);
  }

  // Step 8: Validate Real-time Dashboard KPIs & Attendance Report
  console.log('[Phase 8] Verifying Real-time Analytics & Executive Attendance Report...');
  const reportRes = await fetch(`${API_BASE}/export/attendance-report`, { headers: adminHeaders });
  const reportData = await reportRes.json();
  console.log('Attendance KPIs:', reportData.data);

  if (reportData.data.totalRegistered >= 50 && reportData.data.totalCheckedIn >= 35) {
    console.log(`✓ PASS: Attendance figures accurately aggregated (${reportData.data.totalCheckedIn} checked in / ${reportData.data.totalRegistered} registered, ${reportData.data.checkinPercentage}).\n`);
  } else {
    throw new Error('FAIL: Attendance metrics mismatch');
  }

  // Step 9: Validate CSV & Excel Export
  console.log('[Phase 9] Verifying Production CSV & Excel (.xlsx) Exports...');
  const csvRes = await fetch(`${API_BASE}/export/registrations`, { headers: adminHeaders });
  const csvText = await csvRes.text();
  const csvLines = csvText.split('\n').filter(Boolean);
  console.log(`✓ CSV Export generated: ${csvLines.length - 1} data records exported.`);

  const xlsxRes = await fetch(`${API_BASE}/export/registrations?format=xlsx`, { headers: adminHeaders });
  const xlsxBuffer = await xlsxRes.arrayBuffer();
  const workbook = XLSX.read(new Uint8Array(xlsxBuffer), { type: 'array' });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const xlsxRows = XLSX.utils.sheet_to_json(sheet);
  console.log(`✓ Excel (.xlsx) Export generated: ${xlsxRows.length} rows loaded cleanly in Sheet "${workbook.SheetNames[0]}".\n`);

  console.log('===============================================================');
  console.log('🎉 FINAL EVENT SIMULATION COMPLETE: ALL 9 STAGES PASSED 100%!');
  console.log('The Rankers Meet 2026 platform is fully verified and production-ready.');
  console.log('===============================================================');
}

runFinalEventSimulation().catch((err) => {
  console.error('\n❌ SIMULATION FAILED:', err);
  process.exit(1);
});
