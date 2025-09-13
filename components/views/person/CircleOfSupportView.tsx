
import React from 'react';
import { PersonContact } from '../../../types';
import Card from '../../Card';
import { UserIcon, BuildingIcon, PhoneIcon, EmailIcon } from '../../Icons';

type CircleOfSupportViewProps = {
  contacts: PersonContact[];
};

const ContactDisplayCard: React.FC<{ contact: PersonContact }> = ({ contact }) => {
    const isOrg = contact.isOrganisation;
    const title = isOrg ? contact.organisationName : contact.name;
    const subtitle = isOrg ? contact.name : contact.relationship;

    return (
        <div className="p-4 bg-white border rounded-lg shadow-sm flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                {isOrg ? <BuildingIcon /> : <UserIcon />}
            </div>
            <div className="flex-grow">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-bold text-solas-dark">{title}</p>
                        <p className="text-sm text-solas-gray">{subtitle}</p>
                    </div>
                    <p className="text-xs font-semibold bg-ivolve-blue/10 text-ivolve-blue px-2 py-0.5 rounded-full">{contact.relationship}</p>
                </div>
                <div className="mt-3 pt-3 border-t space-y-2 text-sm">
                    {contact.phone && (
                        <div className="flex items-center space-x-2 text-solas-gray">
                            <PhoneIcon /> <span>{contact.phone}</span>
                        </div>
                    )}
                     {contact.email && (
                        <div className="flex items-center space-x-2 text-ivolve-blue">
                            <EmailIcon /> <span>{contact.email}</span>
                        </div>
                    )}
                </div>
                 {contact.notes && (
                    <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded-md border">
                        <p className="font-semibold">Notes:</p>
                        <p>{contact.notes}</p>
                    </div>
                )}
            </div>
        </div>
    )
}

const CircleOfSupportView: React.FC<CircleOfSupportViewProps> = ({ contacts }) => {
  return (
    <Card title="Circle of Support" titleClassName="text-solas-dark">
      <p className="text-sm text-solas-gray mb-4">
        This is a private contact list for this individual only. These contacts will not appear in the main Contact Hub.
      </p>
      {contacts.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {contacts.map((contact) => (
            <ContactDisplayCard key={contact.id} contact={contact} />
          ))}
        </div>
      ) : (
        <p className="text-solas-gray text-center py-8">No contacts have been added to this person's circle of support yet.</p>
      )}
    </Card>
  );
};

export default CircleOfSupportView;
