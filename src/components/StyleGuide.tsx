import React from 'react';
import { ArrowRight, AlertTriangle, Info } from 'lucide-react';

const StyleGuide: React.FC = () => {
    return (
        <div className="p-8 space-y-12 bg-gray-50 min-h-screen">

            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-4xl font-black text-ivolve-dark font-rounded">UI/UX Style Guide</h1>
                <p className="text-gray-600">A playground for testing our design system components and tokens.</p>
            </div>

            {/* Typography Section */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-ivolve-mid border-b border-ivolve-mid/20 pb-2 font-rounded">Typography</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <p className="text-sm text-gray-400 uppercase tracking-wider font-bold">Headings (M PLUS Rounded 1c)</p>
                        <h1 className="text-5xl font-black text-ivolve-dark font-rounded">Heading 1 (5xl Black)</h1>
                        <h2 className="text-4xl font-extrabold text-ivolve-dark font-rounded">Heading 2 (4xl ExtraBold)</h2>
                        <h3 className="text-3xl font-bold text-ivolve-dark font-rounded">Heading 3 (3xl Bold)</h3>
                        <h4 className="text-2xl font-bold text-ivolve-dark font-rounded">Heading 4 (2xl Bold)</h4>
                    </div>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-400 uppercase tracking-wider font-bold">Body (Inter)</p>
                        <p className="text-base text-gray-800">
                            <strong>Body Base:</strong> The quick brown fox jumps over the lazy dog. Used for standard text, descriptions, and general content.
                        </p>
                        <p className="text-sm text-gray-600">
                            <strong>Body Small:</strong> The quick brown fox jumps over the lazy dog. Used for secondary text, metadata, and hints.
                        </p>
                        <p className="text-xs text-gray-500">
                            <strong>Body XS:</strong> The quick brown fox jumps over the lazy dog. Used for timestamps and footnotes.
                        </p>
                    </div>
                </div>
            </section>

            {/* Colors Section */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-ivolve-mid border-b border-ivolve-mid/20 pb-2 font-rounded">Color Palette</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {[
                        { name: 'Dark', class: 'bg-ivolve-dark', hex: '#025A40' },
                        { name: 'Mid', class: 'bg-ivolve-mid', hex: '#008C67' },
                        { name: 'Bright', class: 'bg-ivolve-bright', hex: '#6BD052' },
                        { name: 'Blue', class: 'bg-ivolve-blue', hex: '#009EA5' },
                        { name: 'Paper', class: 'bg-ivolve-paper', hex: '#FFF6F1', text: 'text-gray-800' },
                        { name: 'Amber', class: 'bg-ivolve-amber', hex: '#F59E0B' },
                        { name: 'Rouge', class: 'bg-ivolve-rouge', hex: '#C0392B' },
                    ].map((color) => (
                        <div key={color.name} className="space-y-2">
                            <div className={`h-24 rounded-xl shadow-sm flex items-center justify-center ${color.class}`}>
                                <span className={`font-bold ${color.text || 'text-white'}`}>{color.name}</span>
                            </div>
                            <div className="text-xs text-gray-500 font-mono text-center">{color.hex}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Buttons Section */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-ivolve-mid border-b border-ivolve-mid/20 pb-2 font-rounded">Buttons</h2>
                <div className="flex flex-wrap gap-4 items-center">
                    <button className="px-6 py-2.5 bg-ivolve-mid text-white rounded-lg font-bold hover:bg-ivolve-dark transition-colors shadow-sm flex items-center space-x-2">
                        <span>Primary Action</span>
                        <ArrowRight size={18} />
                    </button>

                    <button className="px-6 py-2.5 bg-ivolve-paper text-ivolve-dark rounded-lg font-bold hover:bg-green-100 transition-colors border border-ivolve-mid/20 flex items-center space-x-2">
                        <span>Secondary Action</span>
                    </button>

                    <button className="px-6 py-2.5 text-ivolve-mid font-bold hover:text-ivolve-dark transition-colors flex items-center space-x-2">
                        <span>Ghost Button</span>
                    </button>

                    <button className="px-4 py-2 bg-ivolve-rouge text-white rounded-lg font-bold hover:bg-red-700 transition-colors shadow-sm flex items-center space-x-2">
                        <AlertTriangle size={18} />
                        <span>Danger</span>
                    </button>
                </div>
            </section>

            {/* Cards Section */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-ivolve-mid border-b border-ivolve-mid/20 pb-2 font-rounded">Cards (New Style)</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    {/* Standard Card */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                        <div className="bg-ivolve-dark p-4">
                            <h3 className="text-white font-bold text-lg font-rounded flex items-center space-x-2">
                                <Info size={20} className="text-ivolve-bright" />
                                <span>Standard Card</span>
                            </h3>
                        </div>
                        <div className="p-6">
                            <p className="text-gray-600">This is the new standard card style with a solid header. It pops more and clearly separates the title from the content.</p>
                        </div>
                    </div>

                    {/* Highlight Card */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                        <div className="bg-ivolve-blue p-4">
                            <h3 className="text-white font-bold text-lg font-rounded">Blue Highlight</h3>
                        </div>
                        <div className="p-6">
                            <div className="flex items-baseline space-x-2">
                                <span className="text-4xl font-black text-ivolve-blue font-rounded">856</span>
                                <span className="text-gray-500 font-medium">Units</span>
                            </div>
                        </div>
                    </div>

                    {/* Alert Card */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
                        <div className="bg-ivolve-rouge p-4 flex justify-between items-center">
                            <h3 className="text-white font-bold text-lg font-rounded">Critical Alerts</h3>
                            <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-bold">3 New</span>
                        </div>
                        <div className="p-6">
                            <ul className="space-y-3">
                                <li className="flex items-center text-sm text-gray-700">
                                    <AlertTriangle size={16} className="text-ivolve-rouge mr-2" />
                                    <span>Fire Risk Assessment Overdue</span>
                                </li>
                                <li className="flex items-center text-sm text-gray-700">
                                    <AlertTriangle size={16} className="text-ivolve-rouge mr-2" />
                                    <span>Gas Safety Certificate Expiring</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                </div>
            </section>

        </div>
    );
};

export default StyleGuide;
