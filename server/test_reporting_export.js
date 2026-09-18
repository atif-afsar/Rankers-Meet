import * as XLSX from 'xlsx';

const API_BASE = 'http://localhost:5000/api';

async function testReportingAndExport() {
  console.log('=== TESTING 13-REPORTING-EXPORT.MD ===\n');

  // 1. Authenticate Admin
  console.log('1. Authenticating Admin...');
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@yasiraliclasses.in',
      password: 'Admin@12345',
    }),
  });
  const loginData = await loginRes.json();
  const token = loginData.token;
  console.log(`✓ Authenticated as: ${loginData.user.name} (${loginData.user.role})\n`);

  const authHeaders = {
    Authorization: `Bearer ${token}`,
  };

  // 2. Test CSV Export of Registrations
  console.log('2. Testing CSV Export: GET /api/export/registrations...');
  const csvRes = await fetch(`${API_BASE}/export/registrations`, {
    headers: authHeaders,
  });

  if (csvRes.status !== 200) {
    throw new Error(`CSV Export failed with status ${csvRes.status}`);
  }

  const contentType = csvRes.headers.get('content-type');
  console.log(`✓ Content-Type: ${contentType}`);
  if (!contentType.includes('text/csv')) {
    throw new Error(`Expected text/csv, received ${contentType}`);
  }

  const csvText = await csvRes.text();
  const firstLine = csvText.split('\n')[0].replace(/"/g, '').trim();
  console.log('CSV Header Columns:\n', firstLine);

  const requiredFields = [
    'Registration ID',
    'Student Name',
    'Parent Name',
    'Mobile',
    'Email',
    'Class/Course',
    'Exam',
    'Rank',
    'School/College',
    'Guest Count',
    'Status',
    'Checked In',
    'Checked In At',
    'Created At',
  ];

  for (const field of requiredFields) {
    if (!firstLine.includes(field)) {
      throw new Error(`FAIL: Missing required field "${field}" in CSV export!`);
    }
  }
  console.log(`✓ PASS: All 14 required fields present in CSV export!\n`);

  // 3. Test Excel (.xlsx) Export
  console.log('3. Testing Excel Export: GET /api/export/registrations?format=xlsx...');
  const xlsxRes = await fetch(`${API_BASE}/export/registrations?format=xlsx`, {
    headers: authHeaders,
  });

  if (xlsxRes.status !== 200) {
    throw new Error(`Excel Export failed with status ${xlsxRes.status}`);
  }

  const xlsxBuffer = await xlsxRes.arrayBuffer();
  const workbook = XLSX.read(new Uint8Array(xlsxBuffer), { type: 'array' });
  const sheetName = workbook.SheetNames[0];
  console.log(`✓ Workbook parsed successfully! First sheet: "${sheetName}"`);

  const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
  console.log(`✓ Total rows in Excel sheet: ${sheetData.length}`);
  if (sheetData.length > 0) {
    console.log('Sample Excel Row:', JSON.stringify(sheetData[0], null, 2));
  }
  console.log('✓ PASS: Valid .xlsx workbook generated.\n');

  // 4. Test Filter Respect (Only NEET students)
  console.log('4. Testing Filter Respect in Export: GET /api/export/registrations?exam=NEET...');
  const filterRes = await fetch(`${API_BASE}/export/registrations?exam=NEET`, {
    headers: authHeaders,
  });
  const filterCsv = await filterRes.text();
  const filterRows = filterCsv.split('\n').filter(Boolean);
  console.log(`Total rows returned (including header): ${filterRows.length}`);

  // Skip header, verify every data row has NEET
  for (let i = 1; i < filterRows.length; i++) {
    if (!filterRows[i].includes('NEET')) {
      throw new Error(`FAIL: Found non-NEET row in NEET-filtered export: ${filterRows[i]}`);
    }
  }
  console.log('✓ PASS: Filter respect verified — only NEET attendees included!\n');

  // 5. Test Check-in History Export
  console.log('5. Testing Check-in History Export: GET /api/export/checkin-history...');
  const checkinRes = await fetch(`${API_BASE}/export/checkin-history`, {
    headers: authHeaders,
  });
  const checkinCsv = await checkinRes.text();
  const checkinFirstLine = checkinCsv.split('\n')[0].replace(/"/g, '').trim();
  console.log('Check-in History Header Columns:\n', checkinFirstLine);

  const checkinRequired = ['Registration ID', 'Student', 'Check-in time', 'Staff', 'Device'];
  for (const field of checkinRequired) {
    if (!checkinFirstLine.includes(field)) {
      throw new Error(`FAIL: Missing required field "${field}" in check-in history export!`);
    }
  }
  console.log('✓ PASS: Check-in history export contains all required fields!\n');

  // 6. Test Attendance Report Summary
  console.log('6. Testing Attendance Report Summary: GET /api/export/attendance-report...');
  const reportRes = await fetch(`${API_BASE}/export/attendance-report`, {
    headers: authHeaders,
  });
  const reportData = await reportRes.json();
  console.log('Attendance Report Data:\n', JSON.stringify(reportData.data, null, 2));

  const { totalRegistered, totalCheckedIn, totalPending, totalGuests, checkinPercentage } =
    reportData.data;

  if (
    typeof totalRegistered === 'number' &&
    typeof totalCheckedIn === 'number' &&
    typeof totalPending === 'number' &&
    typeof totalGuests === 'number' &&
    typeof checkinPercentage === 'string'
  ) {
    console.log('✓ PASS: Attendance report provides totalRegistered, totalCheckedIn, totalPending, totalGuests, checkinPercentage!\n');
  } else {
    throw new Error('FAIL: Missing fields in attendance report summary');
  }

  console.log('=== ALL 13-REPORTING-EXPORT TESTS PASSED SUCCESSFULLY! ===\n');
}

testReportingAndExport().catch((err) => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
