import React from 'react';
import { MaintenanceJob, MaintenanceStatus } from '../types';
import { ChevronRightIcon } from './Icons';

type MaintenanceJobCardProps = {
    job: MaintenanceJob;
    onSelect: () => void;
    onUpdateStatus: (job: MaintenanceJob, newStatus: MaintenanceStatus) => void;
    statusOrder: MaintenanceStatus[];
};

const MaintenanceJobCard: React.FC<MaintenanceJobCardProps> = ({ job, onSelect, onUpdateStatus, statusOrder }) => {
    const priorityStyles = {
        High: 'bg-status-red',
        Medium: 'bg-status-orange',
        Low: 'bg-ivolve-yellow',
    };

    const currentStatusIndex = statusOrder.indexOf(job.status);
    const nextStatus = currentStatusIndex < statusOrder.length - 1 ? statusOrder[currentStatusIndex + 1] : null;

    const handleMove = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (nextStatus) {
            onUpdateStatus(job, nextStatus);
        }
    }

    return (
        <button
            type="button" 
            onClick={onSelect}
            className="w-full text-left bg-white rounded-md shadow border border-gray-200 cursor-pointer hover:border-ivolve-blue transition-all duration-200"
        >
            <div className={`h-1.5 w-full rounded-t-md ${priorityStyles[job.priority]}`}></div>
            <div className="p-3">
                <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-ivolve-blue">{job.ref}</span>
                    <span className="text-xs text-gray-500">{job.nominalCode}</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-solas-dark leading-tight">{job.category}</p>
                <p className="text-xs text-solas-gray">{job.propertyAddress}</p>
                <div className="mt-3 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                        Due: {new Date(job.slaDueDate).toLocaleDateString('en-GB', {day:'2-digit', month: 'short'})}
                    </div>
                    {nextStatus && (
                         <button 
                            onClick={handleMove}
                            title={`Move to ${nextStatus}`}
                            className="flex items-center text-xs font-semibold text-ivolve-blue bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-md"
                        >
                           <span>Move</span> <ChevronRightIcon />
                         </button>
                    )}
                </div>
            </div>
        </button>
    );
};

export default MaintenanceJobCard;