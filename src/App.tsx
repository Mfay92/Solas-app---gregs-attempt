import React, { useState } from 'react';
import Layout from './components/Layout';
import PropertyHub from './components/PropertyHub';
import RentBreakdownModal from './components/RentBreakdownModal';
import { AlertTriangle, TrendingUp, Home, Users, FileText } from 'lucide-react';

function App() {
    const [activeView, setActiveView] = useState('Dashboard');
    const [isRentModalOpen, setIsRentModalOpen] = useState(false);

    // Mock Data for Demo
    const mockRentItems = [
        { label: 'Lease Cost/Base Rent PA', amount: 228.08, description: 'The base cost of leasing the property from the landlord. This is the core rent amount before any additional charges.' },
        { label: 'Utilities', amount: 68.43, description: 'Covers communal utilities including water rates and any shared energy costs for communal areas.' },
        { label: 'Management Fee', amount: 65.00, description: 'Administrative costs for managing the tenancy, handling queries, coordinating repairs, and general property oversight.' },
        { label: 'Statutory Compliance', amount: 25.08, description: 'Legal safety requirements including fire safety checks, gas safety certificates, electrical testing, and health & safety compliance.' },
        { label: 'Cyclical Works', amount: 21.67, description: 'Planned maintenance and redecoration on a regular cycle (e.g., painting, flooring replacement) to keep the property in good condition.' },
    ];

    const renderContent = () => {
        if (activeView === 'Properties') {
            return <PropertyHub />;
        }

        // Dashboard View
        return (
            <>
                {/* Top Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div
                        className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-ivolve-dark cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setIsRentModalOpen(true)} // Trigger for demo
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Properties</p>
                                <h3 className="text-3xl font-bold text-ivolve-dark mt-1">142</h3>
                                <p className="text-xs text-ivolve-mid mt-2 underline">Click to test Rent Modal</p>
                            </div>
                            <div className="p-2 bg-ivolve-paper rounded-lg text-ivolve-dark">
                                <Home size={24} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-ivolve-mid font-bold flex items-center">
                                <TrendingUp size={16} className="mr-1" /> +3
                            </span>
                            <span className="text-gray-400 ml-2">this month</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-ivolve-blue">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Total Units</p>
                                <h3 className="text-3xl font-bold text-ivolve-dark mt-1">856</h3>
                            </div>
                            <div className="p-2 bg-ivolve-paper rounded-lg text-ivolve-blue">
                                <Users size={24} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm">
                            <span className="text-gray-500">Across 5 Regions</span>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-ivolve-bright">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Occupancy</p>
                                <h3 className="text-3xl font-bold text-ivolve-dark mt-1">94%</h3>
                            </div>
                            <div className="p-2 bg-ivolve-paper rounded-lg text-ivolve-bright">
                                <TrendingUp size={24} />
                            </div>
                        </div>
                        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                            <div className="bg-ivolve-bright h-2 rounded-full" style={{ width: '94%' }}></div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-ivolve-rouge">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Compliance Alerts</p>
                                <h3 className="text-3xl font-bold text-ivolve-rouge mt-1">12</h3>
                            </div>
                            <div className="p-2 bg-ivolve-paper rounded-lg text-ivolve-rouge">
                                <AlertTriangle size={24} />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-sm text-ivolve-rouge font-medium">
                            Action Required
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Quick Actions & Tags */}
                    <div className="space-y-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-ivolve-dark mb-4">Quick Access</h3>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-between p-3 bg-ivolve-paper rounded-lg hover:bg-green-50 transition-colors group">
                                    <span className="font-medium text-ivolve-dark group-hover:text-ivolve-mid">Add New Property</span>
                                    <span className="text-ivolve-mid">→</span>
                                </button>
                                <button className="w-full flex items-center justify-between p-3 bg-ivolve-paper rounded-lg hover:bg-green-50 transition-colors group">
                                    <span className="font-medium text-ivolve-dark group-hover:text-ivolve-mid">Upload SLA Document</span>
                                    <span className="text-ivolve-mid">→</span>
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="text-lg font-bold text-ivolve-dark mb-4">Partner Hubs</h3>
                            <div className="flex flex-wrap gap-3">
                                {/* Mock Logos/Tags */}
                                <button className="px-4 py-2 bg-gray-800 text-white rounded-md font-bold text-sm hover:opacity-90">Inclusion</button>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-md font-bold text-sm hover:opacity-90">Auckland</button>
                                <button className="px-4 py-2 bg-yellow-500 text-white rounded-md font-bold text-sm hover:opacity-90">Golden Lane</button>
                                <button className="px-4 py-2 bg-purple-600 text-white rounded-md font-bold text-sm hover:opacity-90">Civitas</button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Activity Feed */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold text-ivolve-dark mb-6">Recent Activity</h3>
                        <div className="space-y-6">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-start space-x-4 pb-6 border-b border-gray-50 last:border-0 last:pb-0">
                                    <div className="w-10 h-10 rounded-full bg-ivolve-paper flex items-center justify-center text-ivolve-mid font-bold border border-ivolve-mid/20">
                                        <FileText size={18} />
                                    </div>
                                    <div>
                                        <p className="text-gray-800 font-medium">New Lease Agreement Uploaded</p>
                                        <p className="text-sm text-gray-500 mt-1">Added by <span className="text-ivolve-mid font-medium">Sarah Jenkins</span> for <span className="text-gray-900 font-medium">North Lodge</span></p>
                                        <span className="text-xs text-gray-400 mt-2 block">2 hours ago</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </>
        );
    };

    return (
        <Layout onNavigate={setActiveView} activeView={activeView}>
            {renderContent()}

            <RentBreakdownModal
                isOpen={isRentModalOpen}
                onClose={() => setIsRentModalOpen(false)}
                propertyAddress="68 Woodhurst Avenue, Watford WD25 9RW"
                rentItems={mockRentItems}
            />
        </Layout>
    );
}

export default App;
