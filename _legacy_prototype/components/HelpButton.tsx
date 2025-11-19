import React from 'react';
import { BookOpenIcon } from './Icons';

export type HelpTopic = 'peopleDatabase' | 'notesAndUpdates' | 'propertyDatabase';

type HelpButtonProps = {
  onClick: () => void;
  variant?: 'header' | 'modal';
};

const HelpButton: React.FC<HelpButtonProps> = ({ onClick, variant = 'header' }) => {
    const buttonClasses = variant === 'header'
        ? "flex items-center space-x-2 bg-white/20 hover:bg-white/30 font-semibold py-2 px-4 rounded-md transition-colors text-white"
        : "flex items-center space-x-1 text-xs font-bold bg-ivolve-blue/10 text-ivolve-blue px-3 py-1.5 rounded-md hover:bg-ivolve-blue/20 shadow-sm";

    return (
        <button
            onClick={onClick}
            className={buttonClasses}
            aria-label="Open Help Guide"
            title="Help & Guidance"
        >
            <BookOpenIcon />
            {variant === 'header' && <span className="hidden md:inline">Help & Guidance</span>}
            {variant === 'modal' && <span>Help</span>}
        </button>
    );
};

export default HelpButton;
