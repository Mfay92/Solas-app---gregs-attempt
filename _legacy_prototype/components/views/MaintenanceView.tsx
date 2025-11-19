import React, { useState } from 'react';
import { MaintenanceJob, MaintenanceStatus, Stakeholder, IvolveStaff } from '../../types';
import Card from '../Card';
import MaintenanceDetailDrawer from '../MaintenanceDetailDrawer';

type MaintenanceViewProps = {
  jobs: MaintenanceJob[];
  contractors: Stakeholder[];
  onUpdateJob: (job: MaintenanceJob) => void;
  onCompleteComplianceJob: (jobId: string, newCertificateName: string) => void;
  currentUser?: IvolveStaff | null;
};

const statusStyles: Record<MaintenanceStatus, string> = {
  [MaintenanceStatus.Open]: 'bg-blue-100 text-ivolve-blue',
  [MaintenanceStatus.Assigned]: 'bg-purple-100 text-ivolve-purple',
  [MaintenanceStatus.InProgress]: 'bg-yellow-100 text-ivolve-yellow',
  [MaintenanceStatus.AwaitingInvoice]: 'bg-orange-100 text-status-orange',
  [MaintenanceStatus.Completed]: 'bg-green-100 text-ivolve-mid-green',
  [MaintenanceStatus.Closed]: 'bg-gray-200 text-gray-800',
};

const MaintenanceView: React.FC<MaintenanceViewProps> = ({ jobs, contractors, onUpdateJob, onCompleteComplianceJob, currentUser }) => {
  const [selectedJob, setSelectedJob] = useState<MaintenanceJob | null>(null);

  return (
    <Card title="Maintenance Jobs" titleClassName="bg-ivolve-dark-green text-white" className="hover:shadow-xl hover:-translate-y-0.5">
       {selectedJob && (
          <MaintenanceDetailDrawer 
            job={selectedJob} 
            contractors={contractors}
            onClose={() => setSelectedJob(null)}
            onUpdateJob={(updatedJob) => {
                onUpdateJob(updatedJob);
                setSelectedJob(updatedJob); // Keep drawer open with updated info
            }}
            onCompleteComplianceJob={onCompleteComplianceJob}
            currentUser={currentUser}
          />
        )}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Ref', 'Unit', 'Category', 'Type', 'Status', 'Reported', 'SLA Due', 'Assigned To'].map(header => (
                <th key={header} scope="col" className="px-4 py-3 text-left text-sm font-bold text-ivolve-dark-green uppercase tracking-wider">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobs.map(job => (
              <tr key={job.id} onClick={() => setSelectedJob(job)} className="hover:bg-gray-50 cursor-pointer">
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-ivolve-blue">{job.ref}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{job.unit}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{job.category}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{job.jobType}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[job.status]}`}>{job.status}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(job.reportedDate).toLocaleDateString()}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(job.slaDueDate).toLocaleDateString()}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{job.assignedTo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default MaintenanceView;