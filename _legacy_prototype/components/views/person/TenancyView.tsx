



import React from 'react';
import { Person, PersonStatus } from '../../../types';
import Card from '../../Card';
import { usePersona } from '../../../contexts/PersonaContext';
import DocumentsView from '../DocumentsView';
import { useData } from '../../../contexts/DataContext';
import { useUI } from '../../../contexts/UIContext';
import { BuildingIcon, UserCircleIcon } from '../../Icons';

type TenancyViewProps = {
  person: Person;
};

const InfoItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <h4 className="text-sm font-bold text-ivolve-dark-green">{label}</h4>
        <p className="mt-1 text-md text-gray-900">{value ?? <span className="text-gray-400 italic">Not provided</span>}</p>
    </div>
);

const TenancyView: React.FC<TenancyViewProps> = ({ person }) => {
  const { tenancy } = person;
  const { t } = usePersona();
  const { properties, stakeholders } = useData();
  const { selectStakeholder, selectStakeholderContact } = useUI();

  const property = properties.find(p => p.id === person.propertyId);
  const rpStakeholder = stakeholders.find(s => s.name === property?.tags.rp);
  
  const hoLink = property?.linkedContacts?.find(lc => lc.role.toLowerCase().includes('housing officer'));
  const hoStakeholder = hoLink?.stakeholderId ? stakeholders.find(s => s.id === hoLink.stakeholderId) : null;
  const hoContact = hoStakeholder?.contacts.find(c => c.id === hoLink?.contactId);

  const isFormer = person.status === PersonStatus.Former;
  const cardTitleClass = isFormer ? 'bg-solas-gray text-white' : 'bg-ivolve-dark-green text-white';

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title={`${t('tenancy')} Details`} titleClassName={cardTitleClass}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-bold text-sm text-ivolve-dark-green">Agreement Type</h4>
                        <p className="text-md text-gray-900">{tenancy.type}</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-ivolve-dark-green">Start Date</h4>
                        <p className="text-md text-gray-900">{new Date(tenancy.startDate).toLocaleDateString('en-GB')}</p>
                    </div>
                     <div>
                        <h4 className="font-bold text-sm text-ivolve-dark-green">End Date</h4>
                        <p className="text-md text-gray-900">{tenancy.endDate ? new Date(tenancy.endDate).toLocaleDateString('en-GB') : 'N/A'}</p>
                    </div>
                     <div>
                        <h4 className="font-bold text-sm text-ivolve-dark-green">Notice Period</h4>
                        <p className="text-md text-gray-900">{tenancy.noticePeriod || 'N/A'}</p>
                    </div>
                </div>
            </Card>

            <Card title="Housing Management" titleClassName={cardTitleClass}>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-bold text-sm text-ivolve-dark-green flex items-center space-x-2"><BuildingIcon/> <span>Registered Provider</span></h4>
                        {rpStakeholder ? (
                             <button onClick={() => selectStakeholder(rpStakeholder.id)} className="text-md text-ivolve-blue hover:underline">{property?.tags.rp}</button>
                        ) : (
                             <p className="text-md text-gray-900">{property?.tags.rp}</p>
                        )}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm text-ivolve-dark-green flex items-center space-x-2"><UserCircleIcon/> <span>Housing Officer / Managing Agent</span></h4>
                        {hoContact && hoStakeholder ? (
                            <button onClick={() => selectStakeholderContact(hoStakeholder.id, hoContact.id)} className="text-md text-ivolve-blue hover:underline">{hoContact.name}</button>
                        ) : (
                            <p className="text-md text-gray-500 italic">Not assigned</p>
                        )}
                    </div>
                </div>
            </Card>

            <Card title="Tenancy Status & Background" titleClassName={cardTitleClass}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoItem label="Capacity to Consent" value={typeof person.hasCapacityToConsent === 'boolean' ? (person.hasCapacityToConsent ? 'Yes' : 'No') : undefined} />
                    <InfoItem label="Under Section 117" value={typeof person.isOnS117 === 'boolean' ? (person.isOnS117 ? 'Yes' : 'No') : undefined} />
                    <InfoItem label="Right to Reside Status" value={person.rightToResideStatus} />
                    <InfoItem label="Previous Accommodation" value={person.previousAccommodationType} />
                </div>
            </Card>
        </div>

        {tenancy.documents.length > 0 && (
            <DocumentsView documents={tenancy.documents} isFormer={isFormer} />
        )}
    </div>
  );
};

export default TenancyView;
