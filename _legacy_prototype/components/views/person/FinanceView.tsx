import React from 'react';
import { Person, PersonStatus } from '../../../types';
import Card from '../../Card';
import { useData } from '../../../contexts/DataContext';

type FinanceViewProps = {
    person: Person;
}

const InfoItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <h4 className="text-sm font-bold text-ivolve-dark-green">{label}</h4>
        <p className="mt-1 text-md text-gray-900">{value ?? <span className="text-gray-400 italic">Not provided</span>}</p>
    </div>
);


const FinanceView: React.FC<FinanceViewProps> = ({ person }) => {
    const { properties } = useData();
    const property = properties.find(p => p.id === person.propertyId);
    
    // Assuming the rent is the sum of all lines not recharged to ivolve
    const personRent = property?.rentData.currentSchedule.lines
        .filter(line => !line.rechargedToIvolve)
        .reduce((sum, line) => sum + line.amount, 0) || 0;

    const hbAmount = person.housingBenefitAmount || 0;
    const difference = hbAmount - personRent;
    const differenceText = difference >= 0 
        ? `£${difference.toFixed(2)} surplus` 
        : `£${Math.abs(difference).toFixed(2)} shortfall`;
    const differenceColor = difference >= 0 ? 'text-green-600' : 'text-red-600';

    const isFormer = person.status === PersonStatus.Former;
    const cardTitleClass = isFormer ? 'bg-solas-gray text-white' : 'bg-ivolve-dark-green text-white';

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Housing Benefit" titleClassName={cardTitleClass}>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-bold text-sm text-ivolve-dark-green">Reference Number</h4>
                            <p className="text-md text-gray-900">{person.housingBenefitRefNumber || 'N/A'}</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-sm text-ivolve-dark-green">Awarding Council</h4>
                            <p className="text-md text-gray-900">{person.housingBenefitCouncil || 'N/A'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                            <div>
                                <h4 className="font-bold text-sm text-ivolve-dark-green">Awarded (weekly)</h4>
                                <p className="text-lg font-bold text-gray-900">£{hbAmount.toFixed(2)}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm text-ivolve-dark-green">Rent vs. Award</h4>
                                <p className={`text-lg font-bold ${differenceColor}`}>{differenceText}</p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card title="Rent Contribution" titleClassName={cardTitleClass}>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-bold text-sm text-ivolve-dark-green">Weekly Rent Liability</h4>
                            <p className="text-3xl font-bold text-gray-900">£{personRent.toFixed(2)}</p>
                            <p className="text-xs text-gray-500">This is the personal contribution required.</p>
                        </div>
                        <div className="pt-4 border-t">
                            <button
                                disabled
                                className="w-full bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded-md cursor-not-allowed"
                            >
                                View Full Rent Breakdown
                            </button>
                        </div>
                    </div>
                </Card>
            </div>
            
            <Card title="Personal Benefits" titleClassName={cardTitleClass}>
                 <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-3 text-left text-sm font-bold text-ivolve-dark-green uppercase tracking-wider">Benefit Type</th>
                                <th scope="col" className="px-4 py-3 text-right text-sm font-bold text-ivolve-dark-green uppercase tracking-wider">Amount (£)</th>
                                <th scope="col" className="px-4 py-3 text-left text-sm font-bold text-ivolve-dark-green uppercase tracking-wider">Frequency</th>
                                <th scope="col" className="px-4 py-3 text-left text-sm font-bold text-ivolve-dark-green uppercase tracking-wider">Start Date</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {person.benefits && person.benefits.length > 0 ? (
                                person.benefits.map((benefit, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{benefit.type}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">{benefit.amount.toFixed(2)}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{benefit.frequency}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{new Date(benefit.startDate).toLocaleDateString('en-GB')}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center py-6 text-sm text-gray-500">No personal benefits have been recorded.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Card title="Other Financial Information" titleClassName={cardTitleClass}>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     <InfoItem label="Council Tax SMI Exemption" value={typeof person.hasSmiExemption === 'boolean' ? (person.hasSmiExemption ? 'Yes' : 'No') : undefined} />
                     <InfoItem label="Manages Own Money" value={typeof person.managesOwnMoney === 'boolean' ? (person.managesOwnMoney ? 'Yes' : 'No') : undefined} />
                     <InfoItem label="Has Mobility Vehicle" value={typeof person.hasMobilityVehicle === 'boolean' ? (person.hasMobilityVehicle ? 'Yes' : 'No') : undefined} />
                     <div className="lg:col-span-3">
                         <InfoItem label="Savings & Assets Details" value={person.savingsInfo} />
                     </div>
                 </div>
            </Card>

        </div>
    );
};

export default FinanceView;
