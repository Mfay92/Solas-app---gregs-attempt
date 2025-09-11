import React from 'react';
import { ComplianceItem, MaintenanceJob } from '../../types';
import Card from '../Card';
import { ComplianceIcon } from '../Icons';

type ComplianceViewProps = {
  items: ComplianceItem[];
  maintenanceJobs: MaintenanceJob[];
};

const getStatusColor = (status: string) => {
    switch(status) {
        case 'Compliant': return 'text-ivolve-mid-green';
        case 'Action Required': return 'text-status-orange';
        case 'Expired': return 'text-status-red';
        default: return 'text-gray-600';
    }
}

const ComplianceView: React.FC<ComplianceViewProps> = ({ items, maintenanceJobs }) => {
  
  const hasOpenJob = (itemId: string) => {
    return maintenanceJobs.some(job => job.linkedComplianceId === itemId && job.status !== 'Completed' && job.status !== 'Closed');
  };

  return (
    <Card title="Compliance Status" titleClassName="bg-ivolve-dark-green text-white" className="hover:shadow-xl hover:-translate-y-0.5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-ivolve-blue"><ComplianceIcon /></span>
              <h4 className="font-semibold text-lg text-ivolve-dark-green">{item.type}</h4>
            </div>
            <div className="space-y-2 text-sm">
                <p><strong>Last Check:</strong> {new Date(item.lastCheck).toLocaleDateString()}</p>
                <p><strong>Next Due:</strong> {new Date(item.nextCheck).toLocaleDateString()}</p>
                <div className="flex justify-between items-center">
                    <p><strong>Status:</strong> <span className={`font-bold ${getStatusColor(item.status)}`}>{item.status}</span></p>
                    {hasOpenJob(item.id) && <span className="text-xs font-bold bg-ivolve-blue text-white px-2 py-1 rounded-full">Job Raised</span>}
                </div>
                <a href={item.reportUrl} className="text-ivolve-blue hover:underline text-sm font-medium">View Report</a>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ComplianceView;