import React from 'react';
import { UnitStatus, TagStyle } from '../types';

const unitStatusStyles: Record<UnitStatus, { default: string; outline: string; text: string; }> = {
    [UnitStatus.Occupied]: { default: 'bg-tag-occupied text-white border-transparent', outline: 'bg-transparent text-green-700 border-green-700', text: 'text-green-700' },
    [UnitStatus.Void]: { default: 'bg-tag-void text-white border-transparent', outline: 'bg-transparent text-cyan-600 border-cyan-600', text: 'text-cyan-600' },
    [UnitStatus.Master]: { default: 'bg-tag-master text-white border-transparent', outline: 'bg-transparent text-amber-600 border-amber-600', text: 'text-amber-600' },
    [UnitStatus.Unavailable]: { default: 'bg-gray-400 text-white border-transparent', outline: 'bg-transparent text-gray-500 border-gray-500', text: 'text-gray-500' },
    [UnitStatus.OutOfManagement]: { default: 'bg-tag-oom text-white border-transparent', outline: 'bg-transparent text-gray-600 border-gray-600', text: 'text-gray-600' },
    [UnitStatus.StaffSpace]: { default: 'bg-indigo-400 text-white border-transparent', outline: 'bg-transparent text-indigo-500 border-indigo-500', text: 'text-indigo-500' },
};

const UnitStatusTag: React.FC<{ status: UnitStatus, styleType: TagStyle }> = ({ status, styleType }) => {
    const styles = unitStatusStyles[status];
    if (!styles) { 
        return <span className="inline-block w-full text-center px-2 py-1 text-xs font-semibold rounded-md border bg-gray-200 text-gray-800">{status}</span>;
    }

    if (styleType === 'text') {
        return <span className={`font-medium text-xs ${styles.text}`}>{status}</span>;
    }
    
    const baseClasses = 'inline-block w-full text-center px-2 py-1 text-xs font-semibold rounded-md border';
    const typeClasses = styleType === 'outline' ? styles.outline : styles.default;

    return <span className={`${baseClasses} ${typeClasses}`}>{status}</span>;
};

export default UnitStatusTag;