import React, { useState, useMemo } from 'react';
import { MaintenanceJob, MaintenanceStatus, Stakeholder, IvolveStaff } from '../types';
import { MaintenanceIcon, SearchIcon } from './Icons';
import MaintenanceJobCard from './MaintenanceJobCard';
import MaintenanceDetailDrawer from './MaintenanceDetailDrawer';
import SplitText from './SplitText';

type MaintenanceKanbanViewProps = {
  jobs: MaintenanceJob[];
  contractors: Stakeholder[];
  onUpdateJob: (job: MaintenanceJob) => void;
  onCompleteComplianceJob: (jobId: string, newCertificateName: string) => void;
  currentUser?: IvolveStaff | null;
};

const STATUS_ORDER: MaintenanceStatus[] = [
    MaintenanceStatus.Open,
    MaintenanceStatus.Assigned,
    MaintenanceStatus.InProgress,
    MaintenanceStatus.AwaitingInvoice,
    MaintenanceStatus.Completed,
];

const MaintenanceKanbanView: React.FC<MaintenanceKanbanViewProps> = ({ jobs, contractors, onUpdateJob, onCompleteComplianceJob, currentUser }) => {
    const [selectedJob, setSelectedJob] = useState<MaintenanceJob | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredJobs = useMemo(() => {
        const lowercasedQuery = searchQuery.toLowerCase();
        if (!lowercasedQuery) return jobs;
        return jobs.filter(job => 
            job.ref.toLowerCase().includes(lowercasedQuery) ||
            job.propertyAddress.toLowerCase().includes(lowercasedQuery) ||
            job.category.toLowerCase().includes(lowercasedQuery) ||
            job.assignedTo.toLowerCase().includes(lowercasedQuery)
        );
    }, [jobs, searchQuery]);

    const jobsByStatus = useMemo(() => {
        return filteredJobs.reduce((acc, job) => {
            const status = job.status;
            if (!acc[status]) {
                acc[status] = [];
            }
            acc[status].push(job);
            return acc;
        }, {} as Record<MaintenanceStatus, MaintenanceJob[]>);
    }, [filteredJobs]);

    const handleUpdateStatus = (job: MaintenanceJob, newStatus: MaintenanceStatus) => {
        const updatedJob = {
            ...job,
            status: newStatus,
            activityLog: [
                ...job.activityLog,
                {
                    date: new Date().toISOString(),
                    actor: currentUser?.name || 'System',
                    action: `Status changed to "${newStatus}".`
                }
            ]
        };
        onUpdateJob(updatedJob);
    };

    return (
        <div className="h-full flex flex-col bg-gray-50">
            {/* Header */}
            <header className="flex-shrink-0 bg-app-header text-app-header-text p-4 shadow-md z-10">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <MaintenanceIcon />
                        <h1 className="text-3xl font-bold tracking-wider animated-heading" aria-label="MAINTENANCE HUB"><SplitText>MAINTENANCE HUB</SplitText></h1>
                    </div>
                     <button className="bg-ivolve-bright-green text-white font-bold py-2 px-4 rounded-md hover:opacity-90">
                        Log New Job
                    </button>
                </div>
                <div className="mt-4">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <SearchIcon />
                        </span>
                        <input
                            type="search"
                            placeholder="Search by Ref, Address, Category, or Contractor..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-md bg-white/20 text-white placeholder-white/70 focus:outline-none focus:bg-white/30"
                        />
                    </div>
                </div>
            </header>

            {/* Kanban Board */}
            <main className="flex-grow p-4 overflow-x-auto">
                <div className="flex space-x-4 h-full">
                    {STATUS_ORDER.map(status => (
                        <div key={status} className="w-72 bg-gray-100 rounded-lg shadow-sm flex flex-col flex-shrink-0">
                            <h3 className="p-3 text-sm font-semibold text-gray-700 border-b bg-white rounded-t-lg">{status} ({jobsByStatus[status]?.length || 0})</h3>
                            <div className="p-2 space-y-3 overflow-y-auto">
                                {jobsByStatus[status]?.sort((a,b) => new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime()).map(job => (
                                    <MaintenanceJobCard 
                                        key={job.id} 
                                        job={job}
                                        onSelect={() => setSelectedJob(job)}
                                        onUpdateStatus={handleUpdateStatus}
                                        statusOrder={STATUS_ORDER}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            
            {selectedJob && (
                <MaintenanceDetailDrawer
                    job={selectedJob}
                    contractors={contractors}
                    onClose={() => setSelectedJob(null)}
                    onUpdateJob={(updatedJob) => {
                        onUpdateJob(updatedJob);
                        setSelectedJob(updatedJob);
                    }}
                    onCompleteComplianceJob={onCompleteComplianceJob}
                    currentUser={currentUser}
                />
            )}
        </div>
    );
};

export default MaintenanceKanbanView;
