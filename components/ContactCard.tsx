import React from 'react';
import { IvolveStaff, PersonalizationIcon } from '../types';
import { BuildingIcon, DECORATIVE_ICON_MAP, TrashIcon, UserIcon } from './Icons';
import { IvolveCareAndSupportLogoTag } from './IvolveLogos';

type ContactCardProps = {
  person: IvolveStaff;
  onClick?: () => void;
  isEditing?: boolean;
  onIconSelect?: (icon: PersonalizationIcon) => void;
  onIconDelete?: (iconId: string) => void;
  selectedIconId?: string | null;
  isPinned?: boolean;
  onTogglePin?: () => void;
};

export const getDepartmentStyles = (team: string) => {
    const defaultStyles = {
        border: 'border-dept-default-border',
        bg: 'bg-dept-default-bg',
        text: 'text-dept-default-text',
        ring: 'ring-dept-default-border',
    };

    const teamStyles: Record<string, { border: string, bg: string, text: string, ring: string }> = {
        'Board of Directors': { border: 'border-dept-board', bg: 'bg-dept-board', text: 'text-white', ring: 'ring-dept-board' },
        'Executive Team': { border: 'border-dept-exec', bg: 'bg-dept-exec', text: 'text-white', ring: 'ring-dept-exec' },
        'Property Team': { border: 'border-dept-property', bg: 'bg-dept-property', text: 'text-white', ring: 'ring-dept-property' },
        'Operational Team': { border: 'border-dept-ops', bg: 'bg-dept-ops', text: 'text-white', ring: 'ring-dept-ops' },
        'Finance Team': { border: 'border-dept-finance', bg: 'bg-dept-finance', text: 'text-white', ring: 'ring-dept-finance' },
        'Commercial Team': { border: 'border-dept-commercial', bg: 'bg-dept-commercial', text: 'text-white', ring: 'ring-dept-commercial' },
        'Business Development Team': { border: 'border-dept-bizdev', bg: 'bg-dept-bizdev', text: 'text-white', ring: 'ring-dept-bizdev' },
        'People Team': { border: 'border-dept-people', bg: 'bg-dept-people', text: 'text-white', ring: 'ring-dept-people' },
        'Quality Team': { border: 'border-dept-quality', bg: 'bg-dept-quality', text: 'text-white', ring: 'ring-dept-quality' },
        'IT Team': { border: 'border-dept-it', bg: 'bg-dept-it', text: 'text-white', ring: 'ring-dept-it' },
        'Learning and Development Team': { border: 'border-dept-landd', bg: 'bg-dept-landd', text: 'text-white', ring: 'ring-dept-landd' },
    };

    return teamStyles[team] || defaultStyles;
};

const ICON_POSITIONS = [
    { top: '8%', left: '8%', transform: 'rotate(-15deg)' },
    { top: '8%', right: '8%', transform: 'rotate(15deg)' },
    { bottom: '28%', left: '5%', transform: 'rotate(5deg)' },
    { bottom: '28%', right: '5%', transform: 'rotate(-5deg)' },
    { top: '40%', left: '2%', transform: 'rotate(-10deg)' },
];


const ContactCard: React.FC<ContactCardProps> = ({ person, onClick, isEditing = false, onIconSelect, onIconDelete, selectedIconId, isPinned, onTogglePin }) => {
    const departmentStyles = getDepartmentStyles(person.team);
    const isSolidTemplate = person.cardTemplate === 'solid';

    const cardBgClass = isSolidTemplate ? departmentStyles.bg : 'bg-white';
    const nameTextClass = isSolidTemplate ? departmentStyles.text : 'text-solas-dark';
    const roleTextClass = isSolidTemplate ? departmentStyles.text : 'text-solas-gray';
    
    const handleIconClick = (e: React.MouseEvent, icon: PersonalizationIcon) => {
        if (!isEditing || !onIconSelect) return;
        e.stopPropagation(); // Prevent card's onClick from firing
        onIconSelect(icon);
    }
    
    const handleIconDelete = (e: React.MouseEvent, iconId: string) => {
        if (!isEditing || !onIconDelete) return;
        e.stopPropagation();
        onIconDelete(iconId);
    }

    const handlePinClick = (e: React.MouseEvent) => {
        if (onTogglePin) {
            e.stopPropagation();
            onTogglePin();
        }
    };

    return (
        <button
            type="button" 
            onClick={onClick}
            className={`relative rounded-2xl shadow-md cursor-pointer transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1 p-4 border-4 ${departmentStyles.border} overflow-hidden flex flex-col items-center w-full ${cardBgClass}`}
            style={{ minHeight: '280px' }}
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

            {/* Decorative Icons */}
            {person.personalizationIcons && person.personalizationIcons.map((icon, index) => {
                const IconComponent = DECORATIVE_ICON_MAP[icon.name];
                const position = ICON_POSITIONS[index % ICON_POSITIONS.length];
                if (!IconComponent) return null;
                
                const isSelected = isEditing && selectedIconId === icon.id;

                return (
                    <div 
                        key={icon.id} 
                        className={`absolute text-2xl z-0 transition-all duration-300 ${isEditing ? 'opacity-80' : 'opacity-10'} ${isSelected ? `ring-2 ring-offset-2 ${departmentStyles.ring}` : ''}`}
                        style={{ ...position, color: icon.color }}
                        onClick={(e) => handleIconClick(e, icon)}
                    >
                        {isSelected && (
                            <button
                                onClick={(e) => handleIconDelete(e, icon.id)}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-status-red text-white rounded-full flex items-center justify-center text-xs z-10 border-2 border-white"
                            >
                                <TrashIcon className="w-3 h-3" />
                            </button>
                        )}
                        <IconComponent />
                    </div>
                )
            })}

            <div className="relative z-10 flex flex-col items-center text-center flex-grow justify-center">
                {person.isVacancy || person.isJoiningSoon ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white flex items-center justify-center text-gray-400">
                            <BuildingIcon />
                        </div>
                        <p className={`mt-3 font-bold text-xl ${nameTextClass}`}>{person.isVacancy ? 'Vacancy' : 'Joining Soon'}</p>
                        <p className={`text-sm ${roleTextClass}`}>{person.role}</p>
                    </div>
                ) : (
                    <>
                        <div className="w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-md flex items-center justify-center text-gray-400">
                            <UserIcon />
                        </div>
                        <p className={`mt-3 font-bold text-xl ${nameTextClass}`}>{person.name}</p>
                        <p className={`text-sm ${roleTextClass}`}>{person.role}</p>
                        <div className="mt-2 flex justify-center items-center space-x-2">
                            <IvolveCareAndSupportLogoTag />
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full shadow-sm ${departmentStyles.bg} ${departmentStyles.text}`}>
                                {person.team.replace(' Team', '')}
                            </span>
                        </div>
                    </>
                )}
            </div>
        </button>
    );
};

export default ContactCard;