import React from 'react';
import { Person } from '../types';
import { useUI } from '../contexts/UIContext';
import StatusChip from './StatusChip';
import RpTag from './RpTag';

type ApplicantCardProps = {
  person: Person;
};

const getRegionTagStyle = (region: string): string => {
    switch(region) {
        case 'North': return 'bg-region-north text-white';
        case 'Midlands': return 'bg-region-midlands text-white';
        case 'South': return 'bg-region-south text-white';
        case 'South West': return 'bg-region-south-west text-white';
        case 'Wales': return 'bg-white text-region-wales-text border-2 border-region-wales-border font-bold';
        default: return 'bg-gray-200 text-gray-700';
    }
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({ person }) => {
    const { selectPerson } = useUI();
    const primaryNeed = person.careNeeds.find(cn => cn.category === 'Primary Need')?.detail || person.careNeeds[0]?.detail || 'N/A';
    const regionStyle = person.preferredRegion ? getRegionTagStyle(person.preferredRegion) : '';
    
    return (
        <div 
            onClick={() => selectPerson(person.id)}
            className="bg-white rounded-md shadow border border-gray-200 cursor-pointer hover:border-ivolve-blue transition-all duration-200 p-3 flex flex-col space-y-3"
        >
            {/* Tags Section */}
            {(person.preferredRegion || person.preferredServiceType || person.potentialRp) && (
                <div className="flex items-center space-x-1.5 flex-wrap">
                    {person.preferredRegion && (
                        <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${regionStyle}`}>
                            {person.preferredRegion}
                        </span>
                    )}
                    {person.preferredServiceType && (
                        <StatusChip status={person.preferredServiceType} styleType="default" />
                    )}
                    {person.potentialRp && (
                        <div className="inline-block"><RpTag name={person.potentialRp} styleType="default" /></div>
                    )}
                </div>
            )}
            
            {/* Main Info */}
            <div className="flex-grow flex items-center space-x-3">
                <img src={person.photoUrl} alt={person.preferredFirstName} className="w-10 h-10 rounded-full" />
                <div>
                    <p className="font-bold text-sm text-solas-dark leading-tight">{person.preferredFirstName} {person.surname}</p>
                    <p className="text-xs text-ivolve-blue font-semibold">{primaryNeed}</p>
                </div>
            </div>

            {/* Referral Info */}
            <div className="text-xs text-solas-gray space-y-1 pt-2 border-t">
                <p><strong>Ref Source:</strong> {person.referralSource || 'N/A'}</p>
                <p><strong>Ref Date:</strong> {person.referralDate ? new Date(person.referralDate).toLocaleDateString('en-GB') : 'N/A'}</p>
            </div>
        </div>
    );
};

export default ApplicantCard;