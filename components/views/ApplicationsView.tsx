import React, { useState, useMemo } from 'react';
import { ApplicationsIcon, AddIcon } from '../Icons';
import { usePersona } from '../../contexts/PersonaContext';
import AddPersonModal from '../AddPersonModal';
import SplitText from '../SplitText';
import { useData } from '../../contexts/DataContext';
import { ApplicationStage, Person, PersonStatus } from '../../types';
import ApplicantCard from '../ApplicantCard';

const KANBAN_COLUMNS: ApplicationStage[] = [
    ApplicationStage.Referral,
    ApplicationStage.Application,
    ApplicationStage.AwaitingProperty,
    ApplicationStage.PropertyMatched,
    ApplicationStage.TenancyOffered,
    ApplicationStage.Completed,
];

const stageColors: Record<ApplicationStage, { bg: string, text: string, border: string }> = {
    [ApplicationStage.Referral]: { bg: 'bg-gray-200', text: 'text-gray-800', border: 'border-gray-400' },
    [ApplicationStage.Application]: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-400' },
    [ApplicationStage.AwaitingProperty]: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-400' },
    [ApplicationStage.PropertyMatched]: { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-400' },
    [ApplicationStage.TenancyOffered]: { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-400' },
    [ApplicationStage.Completed]: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-400' },
};

const ApplicationsView: React.FC = () => {
    const { t } = usePersona();
    const { people } = useData();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const applicants = useMemo(() =>
        people.filter(p => p.status === PersonStatus.Applicant),
        [people]
    );

    const applicantsByStage = useMemo(() => {
        return applicants.reduce((acc, applicant) => {
            const stage = applicant.applicationStage || ApplicationStage.Referral;
            if (!acc[stage]) acc[stage] = [];
            acc[stage].push(applicant);
            return acc;
        }, {} as Record<ApplicationStage, Person[]>);
    }, [applicants]);


    return (
        <div className="h-full flex flex-col bg-gray-50">
            {isAddModalOpen && <AddPersonModal onClose={() => setIsAddModalOpen(false)} />}

            <header className="flex-shrink-0 bg-app-header text-app-header-text p-4 shadow-md z-10">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <ApplicationsIcon />
                        <h1 className="text-3xl font-bold tracking-wider animated-heading" aria-label="APPLICATIONS & REFERRALS"><SplitText>{`APPLICATIONS & REFERRALS`}</SplitText></h1>
                    </div>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center space-x-2 bg-ivolve-bright-green text-ivolve-dark-green font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity"
                    >
                        <AddIcon />
                        <span>Add New Person</span>
                    </button>
                </div>
            </header>

            <main className="flex-grow p-4 overflow-x-auto">
                <div className="flex space-x-4 h-full">
                    {KANBAN_COLUMNS.map(stage => {
                        const applicantsInStage = applicantsByStage[stage] || [];
                        const stageColor = stageColors[stage];
                        return (
                            <div key={stage} className="w-80 bg-gray-100 rounded-lg shadow-sm flex flex-col flex-shrink-0">
                                <div className={`p-3 rounded-t-lg border-b-4 ${stageColor.border} ${stageColor.bg}`}>
                                    <h3 className={`font-bold text-sm ${stageColor.text}`}>{stage.replace(/^\d+\.\s/, '')} ({applicantsInStage.length})</h3>
                                </div>
                                <div className="p-2 space-y-3 overflow-y-auto flex-grow">
                                    {applicantsInStage.map(applicant => (
                                        <ApplicantCard key={applicant.id} person={applicant} />
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </main>
        </div>
    );
};

export default ApplicationsView;