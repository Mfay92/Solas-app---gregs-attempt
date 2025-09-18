import React from 'react';
import { Person } from '../types';
import { useUI } from '../contexts/UIContext';
import StatusChip from './StatusChip';
import RpTag from './RpTag';
import { UserIcon } from './Icons';
import { getRegionTagStyle } from '../../utils/theme';

type ApplicantCardProps = {
  person: Person;
};

const ApplicantCard: React.FC<ApplicantCardProps> = ({ person }) => {
    const { selectPerson } = useUI();
    const primaryNeed = person.careNeeds.find(cn => cn.category === 'Primary Need')?.detail || person.careNeeds[0]?.detail || 'N/A';
    const regionStyle = person.preferredRegion ? getRegionTagStyle(person.preferredRegion) : '';

    const handleDragStart = (e: React.DragEvent<HTMLButtonElement>) => {
        e.dataTransfer.setData('personId', person.id);
        e.currentTarget.classList.add('dragging-card');
    };

    const handleDragEnd = (e: React.DragEvent<HTMLButtonElement>) => {
        e.currentTarget.classList.remove('dragging-card');
    };
    
    return (
        <button
            type="button" 
            onClick={() => selectPerson(person.id)}
            draggable={true}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className="w-full text-left bg-white rounded-md shadow border border-gray-200 cursor-pointer hover:border-ivolve-blue hover:shadow-lg hover:-translate-y-1 transition-all duration-200 p-3 flex flex-col space-y-3"
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
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
                    <UserIcon />
                </div>
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
        </button>
    );
};

export default ApplicantCard;