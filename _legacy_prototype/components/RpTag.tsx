import React, { memo } from 'react';
import { TagStyle } from '../types';

interface RpBranding {
    style: 'component' | 'classes';
    component?: React.FC;
    classes?: string;
}

// Centralized branding configuration for Registered Providers
const RP_BRANDING_MAP: Record<string, RpBranding> = {
    'Inclusion Housing': {
        style: 'component',
        component: () => (
            <div className="flex items-center justify-center font-bold">
                <span className="text-black tracking-wide">INCLUSION</span>
                <span className="text-status-danger ml-1 tracking-wide">HOUSING</span>
            </div>
        ),
    },
    'Harbour Light': {
        style: 'classes',
        classes: 'bg-rp-harbour-bg border-rp-harbour-text text-rp-harbour-text text-center font-serif font-bold',
    },
    'Bespoke Supportive Tenancies': {
        style: 'classes',
        classes: 'bg-be-st-bg border-be-st-border text-white text-center font-sans tracking-widest',
    },
    'Auckland Home Solutions': {
        style: 'classes',
        classes: 'bg-gray-700 text-white border-transparent'
    }
};

const DEFAULT_BRANDING_CLASSES = 'bg-gray-100 text-gray-800 border-gray-300';

type RpTagProps = {
  name: string;
  styleType?: TagStyle;
};

// Exporting the map so the UI Library can use it
export const getRpBrandingMap = () => RP_BRANDING_MAP;

const RpTag: React.FC<RpTagProps> = ({ name, styleType = 'default' }) => {
  const baseClasses = "inline-block w-full text-center px-2 py-1 text-xs font-semibold rounded-md border";

  if (styleType === 'text') {
    return <span className="text-xs font-medium text-black">{name}</span>;
  }

  if (styleType === 'outline') {
    const typeClasses = 'bg-transparent text-gray-700 border-gray-400';
    return <span className={`${baseClasses} ${typeClasses}`}>{name}</span>;
  }
  
  // Default (full color) style
  const branding = RP_BRANDING_MAP[name];

  if (branding?.style === 'component' && branding.component) {
      const Component = branding.component;
      return <div className={`${baseClasses} bg-white border-gray-300`}><Component /></div>;
  }

  const nameToRender = name === 'Bespoke Supportive Tenancies' ? 'BeST' : name;
  const brandingClasses = branding?.classes || DEFAULT_BRANDING_CLASSES;

  return <span className={`${baseClasses} ${brandingClasses}`}>{nameToRender}</span>;
};

export default memo(RpTag);