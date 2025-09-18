import React from 'react';
import { Stakeholder } from '../types';
import { getLogoComponent } from './StakeholderLogos';

type StakeholderCardProps = {
  stakeholder: Stakeholder;
  onClick: () => void;
};

const StakeholderCard: React.FC<StakeholderCardProps> = ({ stakeholder, onClick }) => {
  const Logo = getLogoComponent(stakeholder.logoComponent);

  const cardClasses = `
    h-48 rounded-lg shadow-md border 
    flex flex-col justify-center items-center 
    p-4 text-center cursor-pointer w-full
    transition-transform transform hover:scale-105
    ${stakeholder.branding.cardBg}
    ${stakeholder.branding.cardText}
    ${stakeholder.branding.cardBorder ? `border-2 ${stakeholder.branding.cardBorder}` : 'border-transparent'}
  `;

  return (
    <button type="button" className={cardClasses} onClick={onClick}>
      {Logo ? (
        <Logo />
      ) : (
        <>
            <h3 className="text-lg font-bold">{stakeholder.name}</h3>
            {stakeholder.subName && <p className="text-sm opacity-80">{stakeholder.subName}</p>}
        </>
      )}
    </button>
  );
};

export default StakeholderCard;