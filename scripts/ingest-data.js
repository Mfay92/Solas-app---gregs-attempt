import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const DATA_DIR = 'c:\\Users\\Matt\\OneDrive\\Desktop\\Solas-app---gregs-attempt\\Data Sample 1';
const OUTPUT_FILE = path.join(__dirname, '../src/data/properties.json');

const PROPERTY_CSV = path.join(DATA_DIR, 'ivolve property board - monday.com - private let properties only.csv');

function ingestData() {
    console.log('Starting data ingestion...');

    if (!fs.existsSync(PROPERTY_CSV)) {
        console.error(`File not found: ${PROPERTY_CSV}`);
        return;
    }

    const workbook = XLSX.readFile(PROPERTY_CSV);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Read as array of arrays to find the header row
    const rawRows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    let headerRowIndex = 0;

    for (let i = 0; i < Math.min(rawRows.length, 20); i++) {
        const row = rawRows[i];
        if (row && (row.includes('Name') || row.includes('Property Address') || row.includes('Address'))) {
            headerRowIndex = i;
            console.log(`Found headers at row ${i}:`, row);
            break;
        }
    }

    // Re-parse with correct range
    const rawData = XLSX.utils.sheet_to_json(sheet, { range: headerRowIndex });
    console.log(`Loaded ${rawData.length} rows from property board.`);

    // Scan for Document Folders
    const dataDirContents = fs.readdirSync(DATA_DIR);
    const docFolders = dataDirContents.filter(item =>
        fs.statSync(path.join(DATA_DIR, item)).isDirectory() && item.includes('DOCS')
    );

    let allAssets = [];

    // Helper to format phone numbers
    const formatPhone = (val) => {
        if (!val) return '';
        const strVal = String(val);
        // If it's a pure number like 1727519277, it might be 01727519277
        if (!strVal.startsWith('0') && strVal.length > 5 && /^\d+$/.test(strVal)) {
            return '0' + strVal;
        }
        return strVal;
    };

    // Transform Data
    rawData.forEach((row, index) => {
        const address = row['Name'] || row['Property Address'] || row['Address'] || 'Unknown Address';

        if (address === 'Unknown Address') return;

        const id = `prop_${index}_${Date.now()}`;

        // Find matching docs folder
        const addressPart = address.split(',')[0].trim().toUpperCase();
        const docFolder = docFolders.find(f => f.toUpperCase().includes(addressPart.replace(' ROAD', '').replace(' STREET', '').replace(' AVE', '')));

        let documents = [];
        if (docFolder) {
            const docPath = path.join(DATA_DIR, docFolder);
            try {
                const files = fs.readdirSync(docPath);
                documents = files.map((f, i) => ({
                    id: `doc_${index}_${i}`,
                    name: f,
                    type: f.toLowerCase().includes('lease') ? 'Lease' : f.toLowerCase().includes('compliance') ? 'Compliance' : 'Other',
                    url: '#',
                    date: new Date().toISOString()
                }));
            } catch (e) {
                console.warn(`Could not read doc folder: ${docFolder}`);
            }
        }

        const totalUnits = parseInt(row['Units (beds)'] || row['Units'] || '0') || 1;
        const serviceType = row['Service type'] || 'Residential';
        const documentsCount = documents.length;

        // Master Property
        const masterProperty = {
            id,
            type: 'Master',
            parentId: null,
            address: address,
            postcode: row['Postcode'] || '',
            region: row['Region'] || 'Unknown',
            registeredProvider: row['Provider'] || row['RP'] || 'New Directions',
            housingManager: row['Housing Manager'] || row['Manager'] || 'Unassigned',
            serviceType: serviceType,
            status: row['Status'] || 'In Management',
            totalUnits: totalUnits,
            occupiedUnits: row['Status'] === 'Occupied' ? totalUnits : 0, // Simplified logic
            statusDate: new Date().toISOString(),
            documents,
            complianceStatus: 'Pending',
            missingDocs: documentsCount === 0,

            // New Fields
            buildingPhone: formatPhone(row['Building Phone Number']),
            areaManager: row['Area Manager'] || '',
            opsDirector: row['Ops Director'] || '',
            fieldplay: row['Fieldplay'] || '',
            responsibleIndividual: row['Responsible Individual'] || row['Resident/Responsible individual'] || '',
            riaEntity: row['RIA Business Entity'] || '',
            ivolveEntity: row['ivolve Entity'] || '',
            landlord: row['Landlord'] || '',
            owner: row['Owner'] || '',
            propertyType: row['Property Type'] || '',
            regionalFacilitiesManager: row['Regional Facilities Manager'] || '',
            facilitiesCoordinator: row['Facilities Coordinator'] || '',
            maintenanceResponsibility: 'ivolve', // Forced
            gardeningResponsibility: 'ivolve', // Forced
            unitType: 'Shared Living' // Default as per user request
        };

        allAssets.push(masterProperty);

        // Generate Units (Bedrooms)
        for (let i = 1; i <= totalUnits; i++) {
            const unitId = `${id}_unit_${i}`;
            const unit = {
                id: unitId,
                type: 'Unit',
                parentId: id,
                address: `Bedroom ${i}`, // Naming convention as requested
                postcode: masterProperty.postcode,
                region: masterProperty.region,
                registeredProvider: masterProperty.registeredProvider,
                housingManager: masterProperty.housingManager,
                serviceType: masterProperty.serviceType,
                status: masterProperty.status === 'Occupied' ? 'Occupied' : 'Void', // Inherit status for now
                totalUnits: 1,
                occupiedUnits: masterProperty.status === 'Occupied' ? 1 : 0,
                statusDate: new Date().toISOString(),
                documents: [], // Units might have specific docs later
                complianceStatus: 'Pending',
                unitType: 'Shared Living'
            };
            allAssets.push(unit);
        }
    });

    // Write to file
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allAssets, null, 2));
    console.log(`Successfully wrote ${allAssets.length} assets to ${OUTPUT_FILE}`);
}

ingestData();
