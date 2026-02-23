/**
 * Convert ivolve Compliance Excel to JSON
 * Based on actual spreadsheet structure analysis
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Excel date serial to ISO date string
function excelDateToISO(serial) {
  if (!serial || typeof serial !== 'number') return null;
  // Excel dates are days since 1900-01-01 (with a bug for 1900 leap year)
  const utcDays = Math.floor(serial - 25569);
  const utcValue = utcDays * 86400 * 1000;
  const date = new Date(utcValue);
  return date.toISOString().split('T')[0];
}

// Normalise status from Excel to our enum
function normaliseStatus(excelStatus, expiryDateISO) {
  if (!excelStatus) return 'no-data';

  const status = String(excelStatus).toLowerCase().trim();

  if (status === 'n/a' || status === 'na' || status === 'not applicable') {
    return 'not-applicable';
  }

  if (status.includes('remedial') && status.includes('outstanding')) {
    return 'remedials-required';
  }

  if (status.includes('compliant') || status.includes('present')) {
    // Check if actually overdue based on date
    if (expiryDateISO) {
      const expiry = new Date(expiryDateISO);
      const today = new Date();
      const thirtyDays = new Date();
      thirtyDays.setDate(today.getDate() + 30);

      if (expiry < today) return 'overdue';
      if (expiry <= thirtyDays) return 'due-soon';
    }
    return 'compliant';
  }

  if (status.includes('due') || status.includes('overdue') || status.includes('expired')) {
    return 'overdue';
  }

  return 'no-data';
}

// Column mappings based on actual Excel structure
// Format: { statusCol, nextDueCol, frequencyCol, commentCol }
const COMPLIANCE_COLUMNS = {
  eicr: { status: 17, nextDue: 19, frequency: 18, comment: 20 },
  pat: { status: 22, nextDue: 24, frequency: 23, comment: 25 },
  fra: { status: 27, nextDue: 29, frequency: 28, comment: 30 },
  ffe: { status: 32, nextDue: 34, frequency: 33, comment: 35 },
  fa_el: { status: 37, nextDue: 40, frequency: 38, comment: 41 },
  fire_door: { status: 43, nextDue: 45, frequency: 44, comment: 46 },
  asbestos: { status: 48, nextDue: 50, frequency: 49, comment: 52 },
  heating_hw: { status: 54, nextDue: 57, frequency: 56, comment: 58 },
  gas_safe: { status: 61, nextDue: 63, frequency: 62, comment: 64 },
  lra: { status: 66, nextDue: 68, frequency: 67, comment: 69 },
  water_sample: { status: null, nextDue: 70, frequency: null, comment: null }, // No status column, just due date
  tmv: { status: null, nextDue: 71, frequency: null, comment: null },
  lift: { status: 76, nextDue: 79, frequency: 78, comment: 81 },
  lift_loler: { status: 83, nextDue: 85, frequency: 84, comment: 86 },
  epc: { status: 88, nextDue: 90, frequency: 89, comment: 93 },
  lightning: { status: 95, nextDue: 97, frequency: 96, comment: 98 },
  sprinkler: { status: 100, nextDue: 102, frequency: 101, comment: 103 },
  dry_riser: { status: 105, nextDue: 107, frequency: 106, comment: 108 },
};

// Property ID mapping
const PROPERTY_ID_MAP = {
  '29 Blandford Rd': 'prop-29-blandford',
  '29 Blandford Road': 'prop-29-blandford',
  '31-33 Hill End Lane': 'prop-31-hillend',
  '68 Woodhurst Ave': 'prop-68-woodhurst',
  '68 Woodhurst Avenue': 'prop-68-woodhurst',
  '86-88 Woodhurst Avenue': 'prop-86-woodhurst',
  'Sovereign House': 'prop-sovereign',
};

function main() {
  const inputPath = path.join(__dirname, '..', 'Compliance Data Private Let Only', 'Group_Property_Compliance_private let only.xlsx');
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'compliance-data.json');

  console.log('Reading Excel file:', inputPath);

  if (!fs.existsSync(inputPath)) {
    console.error('Excel file not found at:', inputPath);
    process.exit(1);
  }

  const workbook = XLSX.readFile(inputPath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const range = XLSX.utils.decode_range(sheet['!ref']);

  // Get cell value helper
  const getCell = (r, c) => {
    const cellRef = XLSX.utils.encode_cell({ r, c });
    const cell = sheet[cellRef];
    return cell ? cell.v : null;
  };

  // Property data rows are 3-7 (0-indexed)
  const dataStartRow = 3;
  const dataEndRow = 7;

  const properties = [];
  const allRecords = [];

  for (let row = dataStartRow; row <= dataEndRow; row++) {
    const propertyName = getCell(row, 0);
    if (!propertyName || typeof propertyName !== 'string') continue;

    const propertyId = PROPERTY_ID_MAP[propertyName] || `prop-${row}`;

    const propertyData = {
      propertyId,
      propertyName,
      address: getCell(row, 109) || '',
      region: getCell(row, 2) || '',
      bedCapacity: getCell(row, 3) || 0,
      serviceType: getCell(row, 5) || '',
      ownerType: getCell(row, 7) || '',
      maintenanceResponsibility: getCell(row, 9) || '',
      compliancePercentage: getCell(row, 15) || null,
      records: []
    };

    // Extract compliance records for each category
    Object.entries(COMPLIANCE_COLUMNS).forEach(([category, cols]) => {
      const statusValue = cols.status !== null ? getCell(row, cols.status) : null;
      const nextDueSerial = cols.nextDue !== null ? getCell(row, cols.nextDue) : null;
      const frequency = cols.frequency !== null ? getCell(row, cols.frequency) : null;
      const comment = cols.comment !== null ? getCell(row, cols.comment) : null;

      const nextDueDate = excelDateToISO(nextDueSerial);

      // Determine status
      let status;
      if (cols.status === null && nextDueDate) {
        // For categories with only due date (water_sample, tmv), check if overdue
        const expiry = new Date(nextDueDate);
        const today = new Date();
        const thirtyDays = new Date();
        thirtyDays.setDate(today.getDate() + 30);

        if (expiry < today) status = 'overdue';
        else if (expiry <= thirtyDays) status = 'due-soon';
        else status = 'compliant';
      } else {
        status = normaliseStatus(statusValue, nextDueDate);
      }

      const record = {
        id: `${propertyId}-${category}`,
        propertyId,
        propertyName,
        category,
        status,
        expiryDate: nextDueDate,
        nextDueDate: nextDueDate,
        lastInspectionDate: null, // Would need calculation from expiry and frequency
        frequencyMonths: frequency,
        contractor: null,
        documents: [],
        remedialActions: [],
        notes: comment || null,
        lastUpdated: new Date().toISOString().split('T')[0]
      };

      propertyData.records.push(record);
      allRecords.push(record);
    });

    properties.push(propertyData);
  }

  // Calculate summary
  const summary = {
    totalProperties: properties.length,
    totalRecords: allRecords.length,
    byStatus: {
      compliant: allRecords.filter(r => r.status === 'compliant').length,
      'due-soon': allRecords.filter(r => r.status === 'due-soon').length,
      overdue: allRecords.filter(r => r.status === 'overdue').length,
      'remedials-required': allRecords.filter(r => r.status === 'remedials-required').length,
      'not-applicable': allRecords.filter(r => r.status === 'not-applicable').length,
      'no-data': allRecords.filter(r => r.status === 'no-data').length,
    },
    byCategory: {}
  };

  // Count by category
  Object.keys(COMPLIANCE_COLUMNS).forEach(cat => {
    const catRecords = allRecords.filter(r => r.category === cat);
    summary.byCategory[cat] = {
      total: catRecords.length,
      compliant: catRecords.filter(r => r.status === 'compliant').length,
      issues: catRecords.filter(r => ['due-soon', 'overdue', 'remedials-required'].includes(r.status)).length,
    };
  });

  const output = {
    generatedAt: new Date().toISOString(),
    source: 'Group_Property_Compliance_private let only.xlsx',
    properties,
    records: allRecords,
    summary
  };

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));

  console.log('\n=== Conversion Complete ===');
  console.log(`Output: ${outputPath}`);
  console.log(`Properties: ${output.summary.totalProperties}`);
  console.log(`Records: ${output.summary.totalRecords}`);
  console.log('\nStatus breakdown:');
  Object.entries(summary.byStatus).forEach(([status, count]) => {
    console.log(`  ${status}: ${count}`);
  });
  console.log('\nBy category (with issues):');
  Object.entries(summary.byCategory).forEach(([cat, data]) => {
    if (data.issues > 0) {
      console.log(`  ${cat}: ${data.issues} issues`);
    }
  });
}

main();
