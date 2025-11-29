import React, { useState } from 'react';
import { PropertyAsset } from '../types';
import { formatDate } from '../utils';
import {
    ArrowLeft, Home, Phone, FileText, AlertCircle,
    CheckCircle, Clock, Users, Briefcase, MapPin,
    BedDouble, ShieldCheck, Wrench, Flower, ChevronRight, Info
} from 'lucide-react';

interface PropertyProfileProps {
    asset: PropertyAsset;
    onBack: () => void;
    units: PropertyAsset[];
}

const PropertyProfile: React.FC<PropertyProfileProps> = ({ asset, onBack, units }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'units' | 'documents'>('overview');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Occupied': return 'bg-green-100 text-green-700';
            case 'Void': return 'bg-purple-100 text-purple-700';
            default: return 'bg-gray-100 text-gray-500';
        }
    };

    return (
        <div className="bg-ivolve-paper min-h-screen p-8">
            {/* Header */}
            {/* Header */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md text-ivolve-slate hover:text-ivolve-dark transition-all duration-200 mb-4"
            >
                <ArrowLeft size={18} />
                <span>Back to Hub</span>
            </button>

            <nav className="flex items-center gap-2 text-sm text-ivolve-slate/60 mb-4">
                <span>Properties</span>
                <ChevronRight size={14} />
                <span className="text-ivolve-mid font-medium">{asset.address}</span>
            </nav>

            <div className="bg-gradient-to-br from-white to-ivolve-paper rounded-2xl shadow-sm border border-ivolve-slate/10 p-8 mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <h1 className="text-3xl font-black text-ivolve-dark font-rounded">{asset.address}</h1>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${asset.serviceType === 'Supported Living' ? 'bg-ivolve-mid/10 text-ivolve-mid' : 'bg-blue-100 text-blue-700'}`}>
                                {asset.serviceType}
                            </span>
                        </div>
                        <div className="flex items-center text-gray-500 space-x-4">
                            <span className="flex items-center"><MapPin size={16} className="mr-1" /> {asset.postcode}</span>
                            <span className="flex items-center"><Home size={16} className="mr-1" /> {asset.totalUnits} Units</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="relative w-16 h-16">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="transparent"
                                    className="text-gray-100"
                                />
                                <circle
                                    cx="32"
                                    cy="32"
                                    r="28"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="transparent"
                                    strokeDasharray={175.9}
                                    strokeDashoffset={175.9 - (175.9 * (((asset.totalUnits || 0) > 0 ? (asset.occupiedUnits || 0) / (asset.totalUnits || 1) : 0) * 100) / 100)}
                                    className={`${((asset.totalUnits || 0) > 0 ? (asset.occupiedUnits || 0) / (asset.totalUnits || 1) : 0) >= 0.5
                                        ? 'text-ivolve-mid'
                                        : ((asset.totalUnits || 0) > 0 ? (asset.occupiedUnits || 0) / (asset.totalUnits || 1) : 0) > 0
                                            ? 'text-amber-500'
                                            : 'text-red-500'
                                        } transition-all duration-1000 ease-out`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-ivolve-dark">
                                {asset.occupiedUnits}/{asset.totalUnits}
                            </div>
                        </div>
                        <span className="text-xs text-ivolve-slate mt-1">units occupied</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            {/* Tabs */}
            <div className="flex space-x-1 bg-white p-1 rounded-xl shadow-sm border border-gray-200 mb-6 w-fit">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'overview'
                        ? 'bg-ivolve-mid text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-b-2 hover:border-ivolve-mid/50'
                        }`}
                >
                    <Info size={16} />
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('units')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'units'
                        ? 'bg-ivolve-mid text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-b-2 hover:border-ivolve-mid/50'
                        }`}
                >
                    <BedDouble size={16} />
                    Units
                </button>
                <button
                    onClick={() => setActiveTab('documents')}
                    className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'documents'
                        ? 'bg-ivolve-mid text-white shadow-sm'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50 hover:border-b-2 hover:border-ivolve-mid/50'
                        }`}
                >
                    <FileText size={16} />
                    Documents
                </button>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">

                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Key People */}
                            <div className="bg-gradient-to-br from-white to-ivolve-paper rounded-xl shadow-sm border border-ivolve-slate/20 p-6">
                                <h3 className="text-lg font-bold text-ivolve-dark mb-4 flex items-center">
                                    <Users size={20} className="mr-2 text-ivolve-mid" /> Key People
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-ivolve-slate/60 uppercase">Housing Manager</label>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-ivolve-mid/20 flex items-center justify-center text-ivolve-mid text-xs font-bold">
                                                {asset.housingManager?.charAt(0) || '?'}
                                            </div>
                                            <p className="font-medium text-ivolve-dark">{asset.housingManager || <span className="text-amber-600 text-sm">Unassigned</span>}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-ivolve-slate/60 uppercase">Area Manager</label>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-ivolve-mid/20 flex items-center justify-center text-ivolve-mid text-xs font-bold">
                                                {asset.areaManager?.charAt(0) || '?'}
                                            </div>
                                            <p className="font-medium text-ivolve-dark">{asset.areaManager || <span className="text-amber-600 text-sm">Unassigned</span>}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-ivolve-slate/60 uppercase">Ops Director</label>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-ivolve-mid/20 flex items-center justify-center text-ivolve-mid text-xs font-bold">
                                                {asset.opsDirector?.charAt(0) || '?'}
                                            </div>
                                            <p className="font-medium text-ivolve-dark">{asset.opsDirector || <span className="text-amber-600 text-sm">Unassigned</span>}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-ivolve-slate/60 uppercase">Building Phone</label>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-ivolve-mid/20 flex items-center justify-center text-ivolve-mid text-xs font-bold">
                                                <Phone size={14} />
                                            </div>
                                            <p className="font-medium text-ivolve-dark flex items-center">
                                                {asset.buildingPhone || <span className="text-amber-600 text-sm">Unassigned</span>}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Responsibilities */}
                            <div className="bg-gradient-to-br from-white to-ivolve-paper rounded-xl shadow-sm border border-ivolve-slate/20 p-6">
                                <h3 className="text-lg font-bold text-ivolve-dark mb-4 flex items-center">
                                    <Briefcase size={20} className="mr-2 text-ivolve-mid" /> Responsibilities
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex items-center justify-between p-3 bg-ivolve-paper rounded-lg hover:bg-ivolve-mid/10 hover:shadow-sm transition-all duration-200">
                                        <div className="flex items-center">
                                            <Wrench size={18} className="mr-3 text-ivolve-mid" />
                                            <span className="font-medium text-ivolve-dark">Maintenance</span>
                                        </div>
                                        <span className="font-bold text-ivolve-dark">{asset.maintenanceResponsibility}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-ivolve-paper rounded-lg hover:bg-ivolve-mid/10 hover:shadow-sm transition-all duration-200">
                                        <div className="flex items-center">
                                            <Flower size={18} className="mr-3 text-ivolve-mid" />
                                            <span className="font-medium text-ivolve-dark">Gardening</span>
                                        </div>
                                        <span className="font-bold text-ivolve-dark">{asset.gardeningResponsibility}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'units' && (
                        <div className="bg-white rounded-xl shadow-sm border border-ivolve-slate/20 overflow-hidden shadow-sm">
                            <table className="w-full text-left">
                                <thead className="bg-gradient-to-r from-ivolve-dark to-ivolve-mid shadow-sm">
                                    <tr>
                                        <th className="p-4 text-white font-bold text-xs uppercase tracking-wider">Unit</th>
                                        <th className="p-4 text-white font-bold text-xs uppercase tracking-wider">Status</th>
                                        <th className="p-4 text-white font-bold text-xs uppercase tracking-wider">Type</th>
                                        <th className="p-4 text-white font-bold text-xs uppercase tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {units.map(unit => (
                                        <tr key={unit.id} className="hover:bg-ivolve-mid/5 transition-colors duration-200">
                                            <td className="p-4 font-medium text-ivolve-dark flex items-center">
                                                <BedDouble size={16} className="mr-2 text-ivolve-slate/60" />
                                                {unit.address}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(unit.status)}`}>
                                                    {unit.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-ivolve-slate">{unit.unitType}</td>
                                            <td className="p-4 text-right">
                                                <button className="px-3 py-1.5 bg-ivolve-mid hover:bg-ivolve-dark text-white text-sm font-bold rounded-lg transition-all duration-200">Manage</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div className="space-y-4">
                            {asset.documents && asset.documents.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {asset.documents.map(doc => (
                                        <div key={doc.id} className="bg-white p-4 rounded-xl border border-ivolve-slate/10 flex items-start hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer hover:scale-[1.02]">
                                            <div className={`p-3 rounded-lg mr-4 ${doc.type === 'Compliance' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                                                <FileText size={24} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-ivolve-dark truncate text-sm mb-1">{doc.name}</h4>
                                                <p className="text-xs text-ivolve-slate">{formatDate(doc.date)}</p>
                                                <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded bg-ivolve-paper text-ivolve-slate">
                                                    {doc.type}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-8 text-center">
                                    <AlertCircle size={48} className="mx-auto text-amber-400 mb-4" />
                                    <h3 className="text-lg font-bold text-amber-900 mb-2">No Documents Found</h3>
                                    <p className="text-amber-700">Please upload compliance documents for this property.</p>
                                    <button className="mt-4 px-6 py-2 bg-ivolve-mid hover:bg-ivolve-dark text-white font-bold rounded-xl transition-all duration-200">
                                        Upload Documents
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    {/* Compliance Status */}
                    <div className="bg-gradient-to-br from-white to-ivolve-paper rounded-xl shadow-sm border border-ivolve-slate/20 p-6">
                        <h3 className="text-sm font-bold text-ivolve-slate/60 uppercase mb-4">Compliance Status</h3>
                        <div className="flex items-center space-x-3 mb-4">
                            {asset.complianceStatus === 'Compliant' && <CheckCircle size={32} className="text-green-500" />}
                            {asset.complianceStatus === 'Pending' && <Clock size={32} className="text-orange-500 animate-pulse" />}
                            {asset.complianceStatus === 'Non-Compliant' && <AlertCircle size={32} className="text-red-500" />}
                            <div>
                                <div className="font-bold text-xl text-ivolve-dark">{asset.complianceStatus}</div>
                                <div className="text-xs text-ivolve-slate">Last checked today</div>
                            </div>
                        </div>
                        <button className="w-full py-3 bg-ivolve-mid hover:bg-ivolve-dark text-white font-bold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md">
                            Run Compliance Check
                        </button>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-gradient-to-br from-white to-ivolve-paper rounded-xl shadow-sm border border-ivolve-slate/20 p-6">
                        <h3 className="text-sm font-bold text-ivolve-slate/60 uppercase mb-4">Quick Actions</h3>
                        <div className="space-y-2">
                            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-ivolve-mid/10 text-sm font-medium text-ivolve-slate hover:text-ivolve-dark flex items-center border-l-4 border-transparent hover:border-ivolve-mid transition-all duration-200">
                                <FileText size={16} className="mr-3 text-ivolve-mid" /> Generate Rent Schedule
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-ivolve-mid/10 text-sm font-medium text-ivolve-slate hover:text-ivolve-dark flex items-center border-l-4 border-transparent hover:border-ivolve-mid transition-all duration-200">
                                <ShieldCheck size={16} className="mr-3 text-ivolve-mid" /> View Lease Agreement
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyProfile;
