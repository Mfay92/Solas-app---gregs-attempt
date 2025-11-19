
import React from 'react';
import * as Icons from '../Icons';
import * as StakeholderLogos from '../StakeholderLogos';
import { IvolveCareAndSupportLogo, IvolveCareAndSupportLogoTag } from '../IvolveLogos';
import * as GeneratedAssets from '../../services/generatedAssets';

const AssetLibraryTab: React.FC = () => {
    // A bit of filtering to get only the icon components by checking their names
    const allIcons = Object.entries(Icons).filter(([name, val]) => 
        typeof val === 'function' && /^[A-Z]/.test(name) && !name.endsWith('Map')
    );

    const allStakeholderLogos = Object.entries(StakeholderLogos).filter(([name, val]) => 
        typeof val === 'function' && /^[A-Z]/.test(name) && name.endsWith('Logo')
    ) as [string, React.FC][];

    const allProjectAssets = Object.entries(GeneratedAssets);

    const IconCard: React.FC<{ name: string; Component: React.FC }> = ({ name, Component }) => (
        <div className="flex flex-col items-center text-center p-2 rounded-md bg-gray-50 border hover:bg-ivolve-blue/10">
            <div className="w-10 h-10 flex items-center justify-center text-ivolve-dark-green text-2xl">
                <Component />
            </div>
            <p className="text-xs mt-2 text-solas-gray break-words font-sans">{name}</p>
        </div>
    );
    
    const AssetCard: React.FC<{ name: string; src: string }> = ({ name, src }) => (
        <div className="flex flex-col items-center text-center p-2 rounded-md bg-gray-50 border hover:bg-ivolve-blue/10">
            <div className="w-full h-16 flex items-center justify-center p-1">
                <img src={src} alt={name} className="max-w-full max-h-full object-contain"/>
            </div>
             <p className="text-xs mt-2 text-solas-gray break-words font-mono">{name}</p>
        </div>
    );

    return (
        <div>
            <h2 className="text-2xl font-bold text-solas-dark pb-2 border-b-2 border-devhub-orange">Asset Library</h2>
            <p className="text-solas-gray mt-1">A complete inventory of all visual assets used in the project.</p>

            <section className="mt-6">
                <h3 className="text-xl font-semibold text-solas-dark pb-2 border-b-2 border-devhub-orange">Project Assets</h3>
                <p className="text-xs text-solas-gray mt-1">These assets are permanently saved in `services/generatedAssets.ts`.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-4">
                     {allProjectAssets.map(([name, src]) => (
                       <AssetCard key={name} name={name} src={src} />
                    ))}
                </div>
            </section>
            
            <section className="mt-8">
                <h3 className="text-xl font-semibold text-solas-dark pb-2 border-b-2 border-devhub-orange">Application Icons</h3>
                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4 mt-4">
                    {allIcons.map(([name, Component]) => (
                       <IconCard key={name} name={name} Component={Component as React.FC} />
                    ))}
                </div>
            </section>

            <section className="mt-8">
                <h3 className="text-xl font-semibold text-solas-dark pb-2 border-b-2 border-devhub-orange">Logos</h3>
                 <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <div className="p-4 bg-ivolve-dark-green rounded-lg flex items-center justify-center">
                        <IvolveCareAndSupportLogo />
                    </div>
                    <div className="p-4 bg-white border rounded-lg flex items-center justify-center">
                        <IvolveCareAndSupportLogoTag />
                    </div>
                    {allStakeholderLogos.map(([name, Component]) => (
                        <div key={name} className="p-4 bg-white border rounded-lg flex items-center justify-center">
                            <Component />
                        </div>
                    ))}
                 </div>
            </section>
        </div>
    );
};

export default AssetLibraryTab;
