import React, { useState } from 'react';
import { MaintenanceJob, MaintenanceStatus, Stakeholder, IvolveStaff } from '../../types';
import { ComplianceIcon } from './Icons';

type MaintenanceDetailDrawerProps = {
    job: MaintenanceJob;
    contractors: Stakeholder[];
    onClose: () => void;
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

const MaintenanceDetailDrawer: React.FC<MaintenanceDetailDrawerProps> = ({ job, contractors, onClose, onUpdateJob, onCompleteComplianceJob, currentUser }) => {
    const [newNote, setNewNote] = useState('');
    const [assignee, setAssignee] = useState(job.assignedTo);
    
    const isComplianceJob = job.jobType === 'PPM' && job.linkedComplianceId;

    const handleAddNote = () => {
        if (!newNote.trim()) return;
        const updatedJob = {
            ...job,
            activityLog: [
                ...job.activityLog,
                { date: new Date().toISOString(), actor: currentUser?.name || 'System', action: `Note added: ${newNote}` }
            ]
        };
        onUpdateJob(updatedJob);
        setNewNote('');
    };
    
    const handleAssignContractor = (contractorName: string) => {
        setAssignee(contractorName);
        const newStatus = contractorName ? MaintenanceStatus.Assigned : MaintenanceStatus.Open;
        const updatedJob = {
            ...job,
            assignedTo: contractorName,
            status: newStatus,
            activityLog: [
                ...job.activityLog,
                { date: new Date().toISOString(), actor: currentUser?.name || 'System', action: `Assigned to ${contractorName || 'Unassigned'}.` }
            ]
        };
        onUpdateJob(updatedJob);
    };

    const handleComplete = () => {
        if (!isComplianceJob) return;
        // In a real app, this would open a file dialog. Here we just simulate.
        const newCertName = `${job.category} Cert ${new Date().getFullYear()}`;
        onCompleteComplianceJob(job.id, newCertName);
        onClose(); // Close the drawer after completion
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose}>
            <div className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-xl z-50 flex flex-col" onClick={e => e.stopPropagation()}>
                <header className="flex-shrink-0 flex justify-between items-center border-b p-4">
                    <h3 className="text-xl font-bold text-ivolve-dark-green">Job Ref: {job.ref}</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-3xl">&times;</button>
                </header>
                
                <main className="flex-grow p-4 overflow-y-auto space-y-4 text-sm">
                    {isComplianceJob && (
                        <div className="p-3 rounded-md bg-blue-50 text-ivolve-blue border border-ivolve-blue flex items-center space-x-3">
                            <ComplianceIcon />
                            <p className="font-semibold">This is a compliance job for a {job.category}.</p>
                        </div>
                    )}
                    <div className="bg-gray-50 p-3 rounded-md border space-y-2">
                        <p><strong>Property:</strong> {job.propertyAddress} ({job.unit})</p>
                        <p><strong>Status:</strong> <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[job.status]}`}>{job.status}</span></p>
                        <p><strong>Category:</strong> {job.category} ({job.jobType})</p>
                        <p><strong>Reported:</strong> {new Date(job.reportedDate).toLocaleDateString()} by {job.details.reportedBy}</p>
                        <p><strong>SLA Due:</strong> <span className={new Date(job.slaDueDate) < new Date() ? 'text-status-red font-bold' : ''}>{new Date(job.slaDueDate).toLocaleDateString()}</span></p>
                    </div>
                    
                    <div className="pt-2">
                        <h4 className="font-semibold text-gray-800 mb-1">Summary</h4>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded-md border">{job.details.summary}</p>
                    </div>

                    <div className="pt-2">
                        <h4 className="font-semibold text-gray-800 mb-1">Assign Contractor</h4>
                        <select 
                            value={assignee}
                            onChange={(e) => handleAssignContractor(e.target.value)}
                            className="w-full p-2 border rounded-md"
                        >
                            <option value="">-- Unassigned --</option>
                            {contractors.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                        </select>
                    </div>
                     
                     <div className="pt-2">
                        <h4 className="font-semibold text-gray-800 mb-1">Cost</h4>
                        <div className="text-gray-600 bg-gray-50 p-3 rounded-md border">
                            Net: £{job.details.cost.net.toFixed(2)}, VAT: £{job.details.cost.vat.toFixed(2)}, Gross: £{job.details.cost.gross.toFixed(2)}
                        </div>
                    </div>

                    <div className="pt-2">
                         <h4 className="font-semibold text-gray-800 mb-2">Activity Log</h4>
                         <div className="space-y-3">
                             {job.activityLog.map((log, index) => (
                                <div key={index} className="flex text-xs">
                                    <div className="w-24 text-gray-500 flex-shrink-0">{new Date(log.date).toLocaleString('en-GB')}</div>
                                    <div className="pl-2 border-l ml-2">
                                        <p className="font-semibold text-gray-700">{log.actor}</p>
                                        <p className="text-gray-600">{log.action}</p>
                                    </div>
                                </div>
                             ))}
                         </div>
                    </div>
                </main>
                <footer className="flex-shrink-0 p-4 border-t bg-white space-y-3">
                    {isComplianceJob && job.status !== 'Completed' && job.status !== 'Closed' &&(
                        <button
                            onClick={handleComplete}
                            className="w-full bg-ivolve-mid-green text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-90 flex items-center justify-center space-x-2"
                        >
                            <ComplianceIcon />
                            <span>Complete Compliance Job & Upload Certificate</span>
                        </button>
                    )}
                    <div className="flex space-x-2">
                        <textarea 
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            placeholder="Add a new note or update..."
                            rows={2}
                            className="flex-grow p-2 border rounded-md text-sm"
                        ></textarea>
                         <button 
                            onClick={handleAddNote}
                            className="bg-ivolve-blue text-white font-semibold px-4 rounded-md hover:bg-opacity-90 disabled:bg-gray-400"
                            disabled={!newNote.trim()}
                        >
                            Add Note
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default MaintenanceDetailDrawer;