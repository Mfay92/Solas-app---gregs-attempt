import React from 'react';
import { Person } from '../../types';
import { useUI } from '../../contexts/UIContext';

type ApplicantCardProps = {
  person: Person;
};

const ApplicantCard: React.FC<ApplicantCardProps> = ({ person }) => {
    const { selectPerson } = useUI();
    const primaryNeed = person.careNeeds.find(cn => cn.category === 'Primary Need')?.detail || person.careNeeds[0]?.detail || 'N/A';
    
    return (
        <div 
            onClick={() => selectPerson(person.id)}
            className="bg-white rounded-md shadow border border-gray-200 cursor-pointer hover:border-ivolve-blue transition-all duration-200 p-3"
        >
            <div className="flex items-center space-x-3">
                <img src={person.photoUrl} alt={person.preferredFirstName} className="w-10 h-10 rounded-full" />
                <div>
                    <p className="font-bold text-sm text-solas-dark leading-tight">{person.preferredFirstName} {person.surname}</p>
                    <p className="text-xs text-ivolve-blue font-semibold">{primaryNeed}</p>
                </div>
            </div>
            <div className="text-xs text-solas-gray space-y-1 pt-2 border-t mt-2">
                <p><strong>Ref Source:</strong> {person.referralSource || 'N/A'}</p>
                <p><strong>Ref Date:</strong> {person.referralDate ? new Date(person.referralDate).toLocaleDateString('en-GB') : 'N/A'}</p>
            </div>
        </div>
    );
};

export default ApplicantCard;
