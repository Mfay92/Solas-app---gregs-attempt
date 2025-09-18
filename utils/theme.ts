
export const getRegionTagStyle = (region: string): string => {
    switch(region) {
        case 'North': return 'bg-region-north text-white';
        case 'Midlands': return 'bg-region-midlands text-white';
        case 'South': return 'bg-region-south text-white';
        case 'South West': return 'bg-region-south-west text-white';
        case 'Wales': return 'bg-region-wales-bg text-region-wales-text font-bold';
        default: return 'bg-gray-200 text-gray-700';
    }
}
