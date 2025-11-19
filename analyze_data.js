const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(process.cwd(), 'data folder2', 'ivolve monday.com data 19th November 2025 - Private.xlsx');

try {
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 0 });

    const headerRow = data[1]; // Row 1 is headers
    const sampleRow = data[9]; // Row 9 (Flanshaw) seemed to have data

    console.log(`Header Length: ${headerRow.length}`);
    console.log(`Sample Row Length: ${sampleRow.length}`);

    console.log("\n--- KNOWN HEADERS ---");
    headerRow.forEach((h, i) => console.log(`${i}: ${h}`));

    if (sampleRow.length > headerRow.length) {
        console.log("\n--- EXTRA COLUMNS (POTENTIAL UNITS) ---");
        for (let i = headerRow.length; i < sampleRow.length; i++) {
            console.log(`Index ${i}: ${sampleRow[i]}`);
        }
    }

} catch (error) {
    console.error("Error:", error);
}
