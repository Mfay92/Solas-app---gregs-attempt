/**
 * Inspect Excel structure to understand the format
 */

const XLSX = require('xlsx');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'Compliance Data Private Let Only', 'Group_Property_Compliance_private let only.xlsx');

const workbook = XLSX.readFile(inputPath);
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Get range
const range = XLSX.utils.decode_range(sheet['!ref']);
console.log('Sheet range:', sheet['!ref']);
console.log('Rows:', range.e.r + 1, 'Cols:', range.e.c + 1);

// Read header row (row 2)
console.log('\n=== All Column Headers (Row 2) ===\n');
const headers = [];
for (let c = 0; c <= range.e.c; c++) {
  const cellRef = XLSX.utils.encode_cell({ r: 2, c });
  const cell = sheet[cellRef];
  const value = cell ? cell.v : '';
  headers.push(value);
  if (value) {
    console.log(`Col ${c}: ${value}`);
  }
}

// Find all "Status" columns
console.log('\n=== Status Columns ===\n');
headers.forEach((h, idx) => {
  if (h && typeof h === 'string' && h.toLowerCase().includes('status')) {
    console.log(`Col ${idx}: ${h}`);
  }
});

// Read first property row (row 3) with all columns
console.log('\n=== First Property Data (Row 3 - 29 Blandford Rd) ===\n');
for (let c = 0; c <= range.e.c; c++) {
  const headerCell = sheet[XLSX.utils.encode_cell({ r: 2, c })];
  const dataCell = sheet[XLSX.utils.encode_cell({ r: 3, c })];
  const header = headerCell ? headerCell.v : `Col${c}`;
  const value = dataCell ? dataCell.v : '';
  if (value !== '' && value !== null && value !== undefined) {
    console.log(`${header}: ${value}`);
  }
}
