const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const filePath = path.join(process.cwd(), 'data folder2', 'ivolve monday.com data 19th November 2025 - Private.xlsx');
const outputPath = path.join(process.cwd(), 'src', 'data', 'properties.json');

try {
    console.log(`Reading file: ${filePath}`);
    const workbook = XLSX.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1, range: 1 }); // Start from Row 1 (headers)

    const properties = [];

    // Column Mappings (based on inspection)
    // 0: Region (North)
    // 1: ?
    // 2: Address Line 1
    // 5: Name (Harbour Light)
    // 6: ID? (44147)
    // 11: Service Type? (Yes/No?) -> Need to verify
    // 31: Landlord (Civitas)
    // 53: Total Units? (3)

    // We need to be careful with indices. Let's iterate and try to map safely.

    data.forEach((row, index) => {
        if (!row[2] || !row[5]) return; // Skip empty rows

        const propertyId = row[6] ? String(row[6]) : `prop_${index}`;
        const propertyName = row[5];
        const addressLine1 = row[2];
        const postcode = row[51] || ""; // Found WF2 9JF at index 51 in sample
        const region = row[0] || "Unknown";
        const landlord = row[31] || "Unknown";

        // Service Type inference
        let serviceType = 'Supported Living';
        if (String(row[1]).includes('Resi')) serviceType = 'Residential';

        const totalUnits = parseInt(row[53]) || 0;

        const units = [];

        // 1. Create MASTER Unit
        units.push({
            id: `${propertyId}_master`,
            name: "Master Unit",
            type: 'Master',
            isMaster: true,
            status: 'Occupied', // Default for Master
            beds: totalUnits
        });

        // 2. Create Sub-units (Bedrooms)
        for (let i = 1; i <= totalUnits; i++) {
            units.push({
                id: `${propertyId}_unit_${i}`,
                name: `Bedroom ${i}`,
                type: 'Bedroom',
                isMaster: false,
                status: 'Occupied', // Default, would need real data to know void status
                beds: 1
            });
        }

        const property = {
            id: propertyId,
            name: propertyName,
            serviceType: serviceType,
            address: {
                line1: addressLine1,
                city: "", // Extract from address if possible
                postcode: postcode
            },
            region: region,
            totalUnits: totalUnits,
            units: units,
            landlord: landlord,
            raw_data: {
                row_index: index,
                original_row: row
            }
        };

        properties.push(property);
    });

    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(properties, null, 2));
    console.log(`Successfully generated ${properties.length} properties to ${outputPath}`);

} catch (error) {
    console.error("Error processing data:", error);
}
