import React, { ReactNode } from 'react';
import { ChevronDownIcon, XMarkIcon } from './Icons';

type CardProps = {
  title?: ReactNode;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  bodyClassName?: string;
  onClick?: () => void;
  isCollapsible?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  onRemove?: () => void;
};

const Card: React.FC<CardProps> = ({ title, children, className = '', titleClassName = '', bodyClassName = '', onClick, isCollapsible, isCollapsed, onToggleCollapse, onRemove }) => {
  const TitleWrapper = isCollapsible ? 'button' : 'div';
  const titleProps = isCollapsible ? { onClick: onToggleCollapse, className: 'w-full text-left' } : {};

  return (
    <div className={`bg-white rounded-lg shadow-md border border-gray-200 transition-all duration-300 overflow-hidden ${className}`} onClick={!isCollapsible ? onClick : undefined}>
      {title && (
        <TitleWrapper {...titleProps}>
          <div className={`px-6 py-4 border-b border-gray-200 flex justify-between items-center ${titleClassName}`}>
            <div className="flex-1 pr-4">
                {typeof title === 'string' ? (
                <h3 className="text-xl font-semibold">{title}</h3>
                ) : (
                title
                )}
            </div>
            <div className="flex items-center space-x-2">
                 {onRemove && (
                    <button 
                        onClick={(e) => { e.stopPropagation(); onRemove(); }} 
                        className="p-1 text-gray-400 rounded-full hover:bg-gray-200 hover:text-gray-800"
                        aria-label="Remove widget"
                    >
                        <XMarkIcon />
                    </button>
                )}
                {isCollapsible && <ChevronDownIcon className={`transition-transform duration-300 ${isCollapsed ? '-rotate-90' : 'rotate-0'}`} />}
            </div>
          </div>
        </TitleWrapper>
      )}
      <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isCollapsed ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'}`}>
          <div className={`overflow-hidden ${bodyClassName}`}>
             <div className="p-6">
                {children}
            </div>
          </div>
      </div>
    </div>
  );
};

export default Card;
