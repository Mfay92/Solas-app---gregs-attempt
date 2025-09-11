import React, { useState, useEffect, useMemo } from 'react';
import Card from '../Card';
import RpTag, { getRpBrandingMap } from '../RpTag';
import StatusChip from '../StatusChip';
import UnitStatusTag from '../UnitStatusTag';
import ToggleSwitch from '../ToggleSwitch';
import { ServiceType, UnitStatus, LegalEntity, TagStyle } from '../../types';
import { AddIcon, ChevronDownIcon, ChevronRightIcon, UploadIcon, TrashIcon, SparklesIcon, TemplateIcon } from '../Icons';
import * as Icons from '../Icons';
import ScrollStack from '../ScrollStack';

// --- Interfaces for assets ---
interface SessionAsset {
  id: number;
  name: string;
  src: string;
  note: string;
}

interface PromotedAsset extends SessionAsset {
    variableName: string;
    type: 'image' | 'icon';
}

// --- Local Modal Component for Promoting ---
const PromoteModal: React.FC<{ asset: SessionAsset, onClose: () => void, onConfirm: (variableName: string) => void }> = ({ asset, onClose, onConfirm }) => {
    const [variableName, setVariableName] = useState('');

    const generateDefaultName = (fileName: string) => {
        return fileName
            .split('.')[0] // remove extension
            .replace(/[^a-zA-Z0-9_]/g, '_') // replace invalid chars with underscore
            .replace(/^(\d)/, '_$1') // prefix with underscore if starts with number
            .split('_')
            .map((word, index) => index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join('');
    };
    
    useEffect(() => {
        setVariableName(generateDefaultName(asset.name));
    }, [asset.name]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (variableName.trim()) {
            onConfirm(variableName.trim());
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[100] flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <header className="p-4 border-b">
                        <h3 className="text-lg font-bold text-solas-dark">Promote Asset</h3>
                    </header>
                    <main className="p-4 space-y-3">
                        <p className="text-sm text-solas-gray">Give this asset a permanent, descriptive variable name to be used in the code.</p>
                        <div>
                            <label htmlFor="variableName" className="block text-sm font-medium text-gray-700">Variable Name</label>
                            <input
                                type="text"
                                id="variableName"
                                value={variableName}
                                onChange={(e) => setVariableName(e.target.value)}
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-ivolve-blue focus:border-ivolve-blue"
                                required
                                autoFocus
                            />
                             <p className="text-xs text-gray-500 mt-1">Use camelCase or PascalCase. E.g., `propertyLivingRoom`.</p>
                        </div>
                    </main>
                    <footer className="p-4 bg-gray-50 border-t flex justify-end space-x-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-semibold">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-ivolve-blue text-white rounded-md font-semibold">Confirm & Promote</button>
                    </footer>
                </form>
            </div>
        </div>
    );
};


const UILibraryTab: React.FC = () => {
    // --- State for Assets ---
    const [sessionImages, setSessionImages] = useState<SessionAsset[]>([]);
    const [sessionIcons, setSessionIcons] = useState<SessionAsset[]>([]);
    const [promotedAssets, setPromotedAssets] = useState<PromotedAsset[]>([]);
    
    const [expandedAsset, setExpandedAsset] = useState<{type: string, id: number} | null>(null);
    const [promoteModalAsset, setPromoteModalAsset] = useState<{type: 'image' | 'icon', asset: SessionAsset} | null>(null);

    // --- Local Storage Hooks ---
    useEffect(() => {
        const savedImages = localStorage.getItem('devhub_session_images');
        if (savedImages) setSessionImages(JSON.parse(savedImages));

        const savedIcons = localStorage.getItem('devhub_session_icons');
        if (savedIcons) setSessionIcons(JSON.parse(savedIcons));
        
        const savedPromoted = localStorage.getItem('devhub_promoted_assets');
        if (savedPromoted) setPromotedAssets(JSON.parse(savedPromoted));
    }, []);

    useEffect(() => { localStorage.setItem('devhub_session_images', JSON.stringify(sessionImages)); }, [sessionImages]);
    useEffect(() => { localStorage.setItem('devhub_session_icons', JSON.stringify(sessionIcons)); }, [sessionIcons]);
    useEffect(() => { localStorage.setItem('devhub_promoted_assets', JSON.stringify(promotedAssets)); }, [promotedAssets]);

    // --- Asset Handlers ---
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'icon') => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach(file => {
                const reader = new FileReader();
                reader.onload = (loadEvent) => {
                    const newAsset: SessionAsset = {
                        id: Date.now() + Math.random(),
                        name: file.name,
                        src: loadEvent.target?.result as string,
                        note: '',
                    };
                    if (type === 'image') setSessionImages(prev => [...prev, newAsset]);
                    else setSessionIcons(prev => [...prev, newAsset]);
                };
                reader.readAsDataURL(file);
            });
        }
        e.target.value = '';
    };

    const handleNoteChange = (id: number, note: string) => {
        setSessionImages(images => images.map(img => img.id === id ? { ...img, note } : img));
    };
    
    const removeSessionAsset = (id: number, type: 'image' | 'icon') => {
        if (type === 'image') setSessionImages(prev => prev.filter(a => a.id !== id));
        else setSessionIcons(prev => prev.filter(a => a.id !== id));
    };
    
    const removePromotedAsset = (id: number) => {
        setPromotedAssets(prev => prev.filter(a => a.id !== id));
    };

    const handlePromote = (variableName: string) => {
        if (!promoteModalAsset) return;
        const { type, asset } = promoteModalAsset;

        const newPromotedAsset: PromotedAsset = {
            ...asset,
            variableName,
            type,
        };
        
        setPromotedAssets(prev => [...prev, newPromotedAsset]);
        removeSessionAsset(asset.id, type);
        setPromoteModalAsset(null);
    };
    
    const AssetItem: React.FC<{
        asset: SessionAsset | PromotedAsset;
        assetType: 'session-image' | 'session-icon' | 'promoted';
        isExpanded: boolean;
        onToggle: () => void;
    }> = ({ asset, assetType, isExpanded, onToggle }) => (
        <div className="bg-white border rounded-md">
            <div className="flex items-center justify-between p-2 border-b">
                <button onClick={onToggle} className="flex-grow flex items-center space-x-2 text-left text-sm font-medium text-solas-dark">
                    {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                    <img src={asset.src} alt={asset.name} className="w-5 h-5 object-contain" />
                    <span>{'variableName' in asset ? asset.variableName : asset.name}</span>
                </button>
                <div className="flex items-center space-x-2">
                    {assetType.startsWith('session') && (
                        <button onClick={() => setPromoteModalAsset({ type: assetType.split('-')[1] as 'image'|'icon', asset })} className="px-2 py-1 text-xs font-semibold text-white bg-ivolve-blue rounded-md">Promote</button>
                    )}
                    <button onClick={() => assetType === 'promoted' ? removePromotedAsset(asset.id) : removeSessionAsset(asset.id, assetType.split('-')[1] as 'image'|'icon')} className="p-1 text-gray-400 hover:text-status-red" title="Remove">
                        <TrashIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>
            {isExpanded && (
                <div className="p-3">
                    {'variableName' in asset ? (
                        <div>
                            <p className="text-xs text-solas-gray mb-2">To use this asset, tell me to use the variable <strong className="text-solas-dark">{asset.variableName}</strong>. I will add the following code to `services/generatedAssets.ts`.</p>
                            <textarea
                                readOnly
                                value={`export const ${asset.variableName} = '${asset.src}';`}
                                className="w-full h-24 p-2 font-mono text-xs bg-gray-100 border rounded-md"
                            />
                        </div>
                    ) : (
                        <textarea
                            value={asset.note}
                            onChange={(e) => handleNoteChange(asset.id, e.target.value)}
                            placeholder="Add a note about where to use this asset..."
                            className="w-full p-2 border rounded-md text-sm"
                            rows={3}
                        />
                    )}
                </div>
            )}
        </div>
    );
    
    // --- Existing Component Library state & data ---
    const [toggleState, setToggleState] = useState(true);
    const rpBrandingMap = getRpBrandingMap();
    const allRpNames = [...Object.keys(rpBrandingMap), "A Generic RP"];
    const entityStyles: Record<LegalEntity, string> = {
        [LegalEntity.Heathcotes]: 'bg-entity-heathcotes-bg text-entity-heathcotes-text',
        [LegalEntity.HeathcotesM]: 'bg-entity-heathcotes-bg text-entity-heathcotes-text',
        [LegalEntity.HeathcotesS]: 'bg-entity-heathcotes-bg text-entity-heathcotes-text',
        [LegalEntity.Gresham]: 'bg-entity-gresham-bg text-entity-gresham-text',
        [LegalEntity.TLC]: 'bg-entity-tlc-bg text-entity-tlc-text',
        [LegalEntity.NewDirections]: 'bg-entity-newdirections-bg text-entity-newdirections-text',
        [LegalEntity.Fieldbay]: 'bg-entity-fieldbay-bg text-entity-fieldbay-text',
    };
    
    const renderTagVariations = (Component: React.FC<{ name?: any; status?: any; entity?: any; styleType: TagStyle }>, items: any[], itemKey: 'name' | 'status' | 'entity' = 'status') => {
        const styles: TagStyle[] = ['text', 'outline', 'default'];
        return (
            <div className="p-4 bg-white border rounded-md grid grid-cols-4 gap-4">
                <div className="font-bold text-xs text-gray-500">Item</div>
                {styles.map(s => <div key={s} className="font-bold text-xs text-gray-500 capitalize">{s}</div>)}
                
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        <div className="font-semibold text-sm flex items-center">{item.label || item}</div>
                        {styles.map(style => (
                            <div key={style}><Component {...{ [itemKey]: item, styleType: style }} /></div>
                        ))}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    return (
        <div>
            {promoteModalAsset && <PromoteModal asset={promoteModalAsset.asset} onClose={() => setPromoteModalAsset(null)} onConfirm={handlePromote} />}

            <h2 className="text-2xl font-bold text-solas-dark pb-2 border-b-2 border-devhub-orange">Asset Management & UI Library</h2>
            <p className="text-solas-gray mt-1">Manage development assets and preview UI components.</p>
            
            {/* Asset Management Section */}
            <section className="mt-8">
                <h3 className="text-xl font-semibold text-solas-dark pb-2 border-b-2 border-devhub-orange">Development Asset Manager</h3>
                <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Session Uploader */}
                    <div className="p-4 bg-gray-50 border rounded-md">
                        <h4 className="font-bold text-solas-dark mb-2">Session Uploader</h4>
                        <p className="text-xs text-solas-gray mb-3">Assets here are auto-saved to your browser's session storage.</p>
                        
                        <div className="mb-4">
                            <label htmlFor="image-upload" className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-devhub-orange rounded-md cursor-pointer hover:bg-opacity-90">
                                <UploadIcon /> <span>Upload Image(s)</span>
                            </label>
                            <input id="image-upload" type="file" accept="image/*" multiple onChange={(e) => handleFileUpload(e, 'image')} className="hidden"/>
                        </div>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                           {sessionImages.map(asset => (
                               <AssetItem key={asset.id} asset={asset} assetType="session-image" isExpanded={expandedAsset?.type === 'image' && expandedAsset.id === asset.id} onToggle={() => setExpandedAsset(prev => (prev?.id === asset.id && prev.type === 'image') ? null : { type: 'image', id: asset.id })} />
                           ))}
                        </div>
                        
                        <div className="mt-4">
                             <label htmlFor="icon-upload" className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-devhub-orange rounded-md cursor-pointer hover:bg-opacity-90">
                                <UploadIcon /> <span>Upload Icon(s)</span>
                            </label>
                            <input id="icon-upload" type="file" accept="image/*" multiple onChange={(e) => handleFileUpload(e, 'icon')} className="hidden"/>
                        </div>
                         <div className="space-y-2 max-h-60 overflow-y-auto pr-2 mt-4">
                           {sessionIcons.map(asset => (
                               <AssetItem key={asset.id} asset={asset} assetType="session-icon" isExpanded={expandedAsset?.type === 'icon' && expandedAsset.id === asset.id} onToggle={() => setExpandedAsset(prev => (prev?.id === asset.id && prev.type === 'icon') ? null : { type: 'icon', id: asset.id })} />
                           ))}
                        </div>
                    </div>

                    {/* Promoted Assets */}
                    <div className="p-4 bg-blue-50 border border-ivolve-blue rounded-md">
                        <h4 className="font-bold text-solas-dark mb-2 flex items-center space-x-2"><SparklesIcon /><span>Promoted Assets</span></h4>
                        <p className="text-xs text-solas-gray mb-3">These are ready to be used in the code. Tell me which one to use by its variable name.</p>
                        <div className="space-y-2 max-h-[29rem] overflow-y-auto pr-2">
                           {promotedAssets.map(asset => (
                               <AssetItem key={asset.id} asset={asset} assetType="promoted" isExpanded={expandedAsset?.type === 'promoted' && expandedAsset.id === asset.id} onToggle={() => setExpandedAsset(prev => (prev?.id === asset.id && prev.type === 'promoted') ? null : { type: 'promoted', id: asset.id })} />
                           ))}
                           {promotedAssets.length === 0 && <p className="text-center text-sm text-gray-500 py-4">No assets promoted yet.</p>}
                        </div>
                    </div>
                </div>
            </section>
            
            {/* UI Library Section */}
            <section className="mt-8">
                <h3 className="text-xl font-semibold text-solas-dark pb-2 border-b-2 border-devhub-orange flex items-center space-x-2"><TemplateIcon /><span>Component Library</span></h3>
                
                <h4 className="font-bold text-solas-dark mt-4 mb-2">Tags & Chips</h4>
                {renderTagVariations(RpTag as any, allRpNames, 'name')}
                <div className="mt-4">{renderTagVariations(StatusChip, Object.values(ServiceType), 'status')}</div>
                <div className="mt-4">{renderTagVariations(UnitStatusTag, Object.values(UnitStatus), 'status')}</div>
                <h4 className="font-bold text-solas-dark mt-4 mb-2">Entity Tags</h4>
                 <div className="p-4 bg-white border rounded-md grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(entityStyles).map(([entity, classes]) => (
                        <div key={entity} className={`px-2 py-1 text-sm font-semibold rounded-md text-center ${classes}`}>
                            {entity}
                        </div>
                    ))}
                </div>
            </section>

            <section className="mt-8">
                <h3 className="text-xl font-semibold text-solas-dark pb-2 border-b-2 border-devhub-orange">Scroll Stack Container</h3>
                <p className="text-solas-gray mt-1">A container that stacks cards on scroll. From <a href="https://reactbits.dev/components/scroll-stack" target="_blank" rel="noopener noreferrer" className="text-ivolve-blue underline">reactbits.dev</a>.</p>
                <div className="mt-4 p-4 bg-gray-200 rounded-md">
                    <div className="h-[85vh] w-full max-w-lg mx-auto overflow-y-auto border-4 border-gray-400 rounded-lg bg-gray-300 p-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
                        <ScrollStack cardHeight="70vh">
                            <Card title="Card 1" className="h-full" bodyClassName="flex items-center justify-center">
                                <p className="text-lg">This is the first card. Scroll down to see the effect.</p>
                            </Card>
                             <Card title="Card 2" className="h-full" bodyClassName="flex items-center justify-center">
                                <p className="text-lg">This is the second card.</p>
                            </Card>
                             <Card title="Card 3" className="h-full" bodyClassName="flex items-center justify-center">
                                <p className="text-lg">This is the third card.</p>
                            </Card>
                             <Card title="Card 4" className="h-full" bodyClassName="flex items-center justify-center">
                                <p className="text-lg">This is the final card in the stack.</p>
                            </Card>
                        </ScrollStack>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default UILibraryTab;