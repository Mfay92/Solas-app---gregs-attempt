import React, { useState } from 'react';
import { ApplicationsIcon, AddIcon } from '../Icons';
import { usePersona } from '../../contexts/PersonaContext';
import AddPersonModal from '../AddPersonModal';
import SplitText from '../SplitText';


const ApplicationsView: React.FC = () => {
    const { t } = usePersona();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    return (
        <div className="h-full flex flex-col">
            {isAddModalOpen && <AddPersonModal onClose={() => setIsAddModalOpen(false)} />}

            <header className="bg-app-header text-app-header-text p-4 shadow-md z-10">
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

            <main className="flex-grow overflow-y-auto p-6 text-center">
                <h2 className="text-2xl font-bold text-solas-dark">Referral Management Dashboard</h2>
                <p className="mt-2 text-solas-gray">
                    This area is under construction. Soon, you will be able to view and manage all incoming referrals and applications in a Kanban-style board here.
                </p>
                <div className="mt-8 p-16 bg-gray-200/50 border-2 border-dashed border-gray-300 rounded-lg text-gray-400">
                    Kanban Board / Referrals List Coming Soon
                </div>
            </main>
        </div>
    );
};

export default ApplicationsView;