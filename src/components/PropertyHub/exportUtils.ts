import { PropertyAsset } from '../../types';
import { ColumnDefinition, ExportFormat } from './types';

// Export to CSV
export const exportToCSV = (
    data: PropertyAsset[],
    columns: ColumnDefinition[],
    fileName: string = 'properties'
) => {
    // Build header row
    const headers = columns.map(col => `"${col.label}"`).join(',');

    // Build data rows
    const rows = data.map(item => {
        return columns.map(col => {
            const value = col.accessor(item);
            // Escape quotes and wrap in quotes
            const stringValue = value !== null && value !== undefined ? String(value) : '';
            return `"${stringValue.replace(/"/g, '""')}"`;
        }).join(',');
    });

    // Combine
    const csv = [headers, ...rows].join('\n');

    // Download
    downloadFile(csv, `${fileName}.csv`, 'text/csv');
};

// Export to JSON
export const exportToJSON = (
    data: PropertyAsset[],
    columns: ColumnDefinition[],
    fileName: string = 'properties'
) => {
    // Transform data to only include selected columns
    const exportData = data.map(item => {
        const obj: Record<string, unknown> = {};
        columns.forEach(col => {
            obj[col.id] = col.accessor(item);
        });
        return obj;
    });

    const json = JSON.stringify(exportData, null, 2);
    downloadFile(json, `${fileName}.json`, 'application/json');
};

// Export to Excel (XLSX) - simplified version using CSV with Excel-compatible format
export const exportToExcel = (
    data: PropertyAsset[],
    columns: ColumnDefinition[],
    fileName: string = 'properties'
) => {
    // Create a more Excel-friendly CSV with BOM for UTF-8
    const BOM = '\uFEFF';

    // Build header row
    const headers = columns.map(col => col.label).join('\t');

    // Build data rows (tab-separated for Excel)
    const rows = data.map(item => {
        return columns.map(col => {
            const value = col.accessor(item);
            return value !== null && value !== undefined ? String(value) : '';
        }).join('\t');
    });

    // Combine with BOM
    const content = BOM + [headers, ...rows].join('\n');

    // Download as .xls (which Excel will open as TSV)
    downloadFile(content, `${fileName}.xls`, 'application/vnd.ms-excel');
};

// Export to PDF - generates a simple HTML table that can be printed to PDF
export const exportToPDF = (
    data: PropertyAsset[],
    columns: ColumnDefinition[],
    fileName: string = 'properties'
) => {
    // Create HTML content
    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>${fileName}</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    padding: 20px;
                    font-size: 12px;
                }
                h1 {
                    font-size: 18px;
                    margin-bottom: 10px;
                    color: #1a1a1a;
                }
                .meta {
                    color: #666;
                    margin-bottom: 20px;
                    font-size: 11px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                th {
                    background-color: #2D5A4C;
                    color: white;
                    font-weight: 600;
                    font-size: 11px;
                }
                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                tr:hover {
                    background-color: #f5f5f5;
                }
                @media print {
                    body { padding: 0; }
                    th { background-color: #2D5A4C !important; -webkit-print-color-adjust: exact; }
                }
            </style>
        </head>
        <body>
            <h1>Property Hub Export</h1>
            <div class="meta">
                Generated on ${new Date().toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })} | ${data.length} properties
            </div>
            <table>
                <thead>
                    <tr>
                        ${columns.map(col => `<th>${col.label}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${data.map(item => `
                        <tr>
                            ${columns.map(col => {
                                const value = col.accessor(item);
                                return `<td>${value !== null && value !== undefined ? String(value) : '-'}</td>`;
                            }).join('')}
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <script>
                window.onload = function() {
                    window.print();
                }
            </script>
        </body>
        </html>
    `;

    // Open in new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
    }
};

// Helper function to download a file
const downloadFile = (content: string, fileName: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

// Main export function
export const exportData = (
    format: ExportFormat,
    data: PropertyAsset[],
    columns: ColumnDefinition[],
    fileName?: string
) => {
    const timestamp = new Date().toISOString().split('T')[0];
    const name = fileName || `properties_${timestamp}`;

    switch (format) {
        case 'csv':
            exportToCSV(data, columns, name);
            break;
        case 'xlsx':
            exportToExcel(data, columns, name);
            break;
        case 'pdf':
            exportToPDF(data, columns, name);
            break;
        case 'json':
            exportToJSON(data, columns, name);
            break;
    }
};

// Format helpers for display
export const formatExportCount = (count: number) => {
    return `${count} ${count === 1 ? 'property' : 'properties'}`;
};
