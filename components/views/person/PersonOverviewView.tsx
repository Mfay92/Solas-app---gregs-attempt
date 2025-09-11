
import React from 'react';
import { Person } from '../../../types';
import Card from '../../Card';

type PersonOverviewViewProps = {
  person: Person;
};

const InfoItem: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div>
        <h4 className="text-sm font-medium text-gray-500">{label}</h4>
        <p className="mt-1 text-md text-gray-900">{value || <span className="text-gray-400 italic">Not provided</span>}</p>
    </div>
);

const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const PersonOverviewView: React.FC<PersonOverviewViewProps> = ({ person }) => {
    const age = calculateAge(person.dob);

    return (
        <Card title="About Me" titleClassName="text-solas-dark">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8">
                <InfoItem label="Legal First Name" value={person.legalFirstName} />
                <InfoItem label="Preferred First Name" value={person.preferredFirstName} />
                <InfoItem label="Surname" value={person.surname} />
                <InfoItem label="Title" value={person.title} />
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
                <InfoItem label="Marital Status" value={person.maritalStatus} />
                <InfoItem label="Ethnicity" value={person.ethnicity} />
                <InfoItem label="Nationality" value={person.nationality} />
                <InfoItem 
                    label="Date of Birth" 
                    value={`${new Date(person.dob).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} (Age ${age})`}
                />
                <InfoItem label="National Insurance No." value={person.nationalInsuranceNumber} />
            </div>
        </Card>
    );
};

export default PersonOverviewView;
