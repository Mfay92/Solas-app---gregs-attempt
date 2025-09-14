import React from 'react';
import { Contact, Stakeholder } from '../types';
import { UserIcon } from './Icons';

type StakeholderContactCardProps = {
  contact: Contact;
  stakeholder: Stakeholder;
  onClick: () => void;
  isPinned?: boolean;
  onTogglePin?: () => void;
};

const BrandedTag: React.FC<{ stakeholder: Stakeholder }> = ({ stakeholder }) => {
    const { cardBg, cardText } = stakeholder.branding;
    // Special case for Inclusion as its brand color is red text on white
    if (stakeholder.id === 'rp-ih') {
        return (
            <div className="mt-2 px-3 py-1 text-sm font-semibold rounded-full shadow-sm bg-white border border-gray-300 flex items-center justify-center">
                <span className="text-black tracking-wide">INCLUSION</span>
                <span className="text-status-red ml-1 tracking-wide">HOUSING</span>
            </div>
        );
    }
    return (
        <div className={`mt-2 px-3 py-1 text-sm font-semibold rounded-full shadow-sm ${cardBg} ${cardText}`}>
            {stakeholder.name}
        </div>
    );
};

const StakeholderContactCard: React.FC<StakeholderContactCardProps> = ({ contact, stakeholder, onClick, isPinned, onTogglePin }) => {
  const branding = stakeholder.branding;
  const nameColor = branding.cardText.includes('white') ? 'text-solas-dark' : branding.cardText;
  const borderColor = branding.cardBorder || 'border-gray-300';

  const handlePinClick = (e: React.MouseEvent) => {
    if (onTogglePin) {
        e.stopPropagation();
        onTogglePin();
    }
  };

  return (
    <div 
        onClick={onClick}
        className={`relative bg-white rounded-lg shadow-md p-4 border-2 ${borderColor} flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1`}
        style={{ minHeight: '220px' }}
    >
        {onTogglePin && (
            <button 
                onClick={handlePinClick} 
                className="absolute top-2 right-2 p-2 z-20 rounded-full hover:bg-black/10 transition-colors"
                aria-label={isPinned ? 'Unpin contact' : 'Pin contact'}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={isPinned ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            </button>
        )}

      <div className={`w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0 border-4 ${borderColor}`}>
        <UserIcon />
      </div>
      <div className="flex flex-col justify-center items-center mt-3 overflow-hidden">
        <p className={`font-bold truncate text-xl ${nameColor}`}>{contact.name}</p>
        <p className="text-sm text-solas-gray truncate px-2">{contact.role}</p>
        <BrandedTag stakeholder={stakeholder} />
      </div>
    </div>
  );
};

export default StakeholderContactCard;