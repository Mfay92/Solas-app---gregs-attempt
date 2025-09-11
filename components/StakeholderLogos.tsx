import React from 'react';

export const NorthYorkshireLogo = () => (
    <div className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center">
            {/* Simplified White Rose */}
            <svg viewBox="0 0 100 100" className="w-8 h-8 text-white" fill="currentColor">
                <path d="M50 0 L61 39 L100 39 L69 61 L79 100 L50 75 L21 100 L31 61 L0 39 L39 39 Z" />
            </svg>
        </div>
        <div className="text-xs font-bold leading-tight">
            <div>NORTH</div>
            <div>YORKSHIRE</div>
            <div>COUNCIL</div>
        </div>
    </div>
);

export const NottinghamLogo = () => (
    <div className="flex items-center space-x-2 text-white">
        <div className="w-10 h-10 flex-shrink-0">
            {/* Simplified Crest */}
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7v nødvendig 10c0 5.55 4.45 10 10 10s10-4.45 10-10V7l-10-5zm0 2.9l6 3.33V12c0 3.52-2.83 6.42-6.34 6.92L11 13h2v-2h-2v-2h2V7h-2V5h2v2h-2v2h2v2h-2v6.92C7.83 18.42 5 15.52 5 12V8.23l7-3.33z"/></svg>
        </div>
        <div className="text-sm font-semibold leading-tight">
            <div>Nottingham</div>
            <div className="border-t border-white/50 mt-1 pt-1">City Council</div>
        </div>
    </div>
);

export const NewportLogo = () => (
    <div className="flex items-center space-x-3">
        <div className="w-8 text-newport-gold">
            {/* Simplified Griffin */}
            <svg viewBox="0 0 50 50" fill="currentColor"><path d="M25,2C12.3,2,2,12.3,2,25s10.3,23,23,23s23-10.3,23-23S37.7,2,25,2z M32.5,25c0,4.1-3.4,7.5-7.5,7.5 S17.5,29.1,17.5,25S20.9,17.5,25,17.5S32.5,20.9,32.5,25z"/></svg>
        </div>
        <div className="text-sm font-bold leading-tight text-newport-green">
            <div>NEWPORT</div>
            <div className="text-xs">CITY COUNCIL</div>
            <div className="border-t border-newport-green/50 my-1"></div>
            <div className="text-xs">CYNGOR DINAS</div>
            <div className="text-sm">CASNEWYDD</div>
        </div>
    </div>
);

export const InclusionLogo = () => (
    <div className="flex items-center text-sm">
        <span className="text-black tracking-wide font-bold">INCLUSION</span>
        <span className="text-status-red ml-1 tracking-wide font-bold">HOUSING</span>
    </div>
);

export const HarbourLightLogo = () => (
     <div className="text-center font-serif text-rp-harbour-text font-bold text-sm">
        HARBOUR LIGHT
    </div>
);

export const BeSTLogo = () => (
    <div className="text-center">
        <div className="relative inline-block">
             <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-6 bg-best-green" style={{clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'}}></div>
             <span className="text-2xl font-bold italic" style={{fontFamily: 'cursive'}}>BeST</span>
        </div>
        <div className="text-xs mt-1 border-t border-white/50 pt-1">Bespoke Supportive Tenancies</div>
    </div>
);

const LOGO_MAP: Record<string, React.FC> = {
    NorthYorkshireLogo,
    NottinghamLogo,
    NewportLogo,
    InclusionLogo,
    HarbourLightLogo,
    BeSTLogo
};

export const getLogoComponent = (name?: string): React.FC | null => {
    if (!name || !LOGO_MAP[name]) return null;
    return LOGO_MAP[name];
}
