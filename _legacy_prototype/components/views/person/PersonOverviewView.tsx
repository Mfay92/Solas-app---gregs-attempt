import React from 'react';
import { Person, PersonStatus } from '../../../types';
import Card from '../../Card';
import { useData } from '../../../contexts/DataContext';

type PersonOverviewViewProps = {
  person: Person;
};

const InfoItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <h4 className="text-sm font-bold text-ivolve-dark-green">{label}</h4>
        <p className="mt-1 text-md text-gray-900">{value || <span className="text-gray-400 italic">Not provided</span>}</p>
    </div>
);

const PersonOverviewView: React.FC<PersonOverviewViewProps> = ({ person }) => {
    const { properties } = useData();
    const property = properties.find(p => p.id === person.propertyId);

    const isFormer = person.status === PersonStatus.Former;
    const cardTitleClass = isFormer ? 'bg-solas-gray text-white' : 'bg-ivolve-dark-green text-white';

    return (
        <div className="space-y-6">
            {property && (
                 <Card title="Current Housing Snapshot" titleClassName={cardTitleClass}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
                        <InfoItem label="Service Type" value={property.serviceType} />
                        <InfoItem label="Region" value={property.region} />
                        <InfoItem label="Country" value={property.address.country} />
                        <InfoItem label="Legal Entity" value={property.legalEntity} />
                    </div>
                </Card>
            )}

            <Card title="Communication" titleClassName={cardTitleClass}>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                     <InfoItem 
                        label="First Language" 
                        value={
                            <>
                                {person.firstLanguage}
                                {person.isNonVerbal && <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">Non-verbal</span>}
                            </>
                        } 
                    />
                    <InfoItem label="Second Language" value={person.secondLanguage} />
                    <InfoItem label="Preferred Communication Method" value={person.preferredCommunicationMethod} />
                </div>
            </Card>

            <Card title="Official Information" titleClassName={cardTitleClass}>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                    <InfoItem label="National Insurance No." value={person.nationalInsuranceNumber} />
                    <InfoItem label="NHS Number" value={person.nhsNumber} />
                </div>
            </Card>

             <Card title="My Story & Preferences" titleClassName={cardTitleClass}>
                 <div className="space-y-6">
                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">My Story</h4>
                        <p className="text-md text-gray-900 whitespace-pre-wrap">{person.myStory || <span className="text-gray-400 italic">Not provided</span>}</p>
                    </div>
                     <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Things Important to Me</h4>
                        <div className="flex flex-wrap gap-2">
                           {person.importantToMe && person.importantToMe.length > 0 ? person.importantToMe.map(item => (
                                <span key={item} className="px-3 py-1 bg-ivolve-blue/10 text-ivolve-blue text-sm font-semibold rounded-full">{item}</span>
                           )) : <span className="text-gray-400 italic text-sm">Not provided</span>}
                        </div>
                    </div>
                 </div>
            </Card>
        </div>
    );
};

export default PersonOverviewView;