/**
 * Example usage of AddPersonModal
 *
 * This file demonstrates how to integrate the AddPersonModal component
 * into your application. You can copy this pattern into any component
 * where you need to add new people.
 */

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import AddPersonModal from './AddPersonModal';
import { Person } from '../../types';
import { Button } from '../shared/Button';

export default function AddPersonModalExample() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [people, setPeople] = useState<Person[]>([]);

    // Example properties data (you would typically load this from your app state/context)
    const properties = [
        { id: 'prop_1', address: '86-88 Woodhurst Avenue', postcode: 'WD24 5PN' },
        { id: 'prop_2', address: '42 Station Road', postcode: 'AL1 5HE' },
        { id: 'prop_3', address: '15 Park Lane', postcode: 'MK9 3XY' }
    ];

    const handleSavePerson = (newPerson: Person) => {
        console.log('New person created:', newPerson);

        // Add to local state
        setPeople([...people, newPerson]);

        // In a real app, you would also:
        // 1. Save to localStorage
        const existingPeople = localStorage.getItem('people');
        const peopleArray = existingPeople ? JSON.parse(existingPeople) : [];
        peopleArray.push(newPerson);
        localStorage.setItem('people', JSON.stringify(peopleArray));

        // 2. Or send to API
        // await fetch('/api/people', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(newPerson)
        // });

        // 3. Or update app context
        // updateAppContext({ people: [...people, newPerson] });

        // Show success message
        alert(`Successfully added ${newPerson.personal.firstName} ${newPerson.personal.lastName}`);
    };

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">People We Support</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            {people.length} {people.length === 1 ? 'person' : 'people'} in the system
                        </p>
                    </div>
                    <Button
                        variant="primary"
                        leftIcon={<UserPlus size={18} />}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Add Person
                    </Button>
                </div>

                {/* People List */}
                {people.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {people.map(person => (
                            <div
                                key={person.id}
                                className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-12 h-12 rounded-full bg-ivolve-mid/10 flex items-center justify-center">
                                        <span className="text-lg font-semibold text-ivolve-mid">
                                            {person.personal.firstName[0]}
                                            {person.personal.lastName[0]}
                                        </span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">
                                            {person.personal.firstName} {person.personal.lastName}
                                        </h3>
                                        {person.personal.preferredName && (
                                            <p className="text-xs text-gray-500">
                                                "{person.personal.preferredName}"
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p>
                                        <span className="text-gray-500">Property:</span>{' '}
                                        {person.tenancy.propertyAddress}
                                    </p>
                                    {person.tenancy.room && (
                                        <p>
                                            <span className="text-gray-500">Room:</span> {person.tenancy.room}
                                        </p>
                                    )}
                                    {person.support.supportLevel && (
                                        <p>
                                            <span className="text-gray-500">Support Level:</span>{' '}
                                            {person.support.supportLevel}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <UserPlus size={48} className="text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            No people added yet
                        </h3>
                        <p className="text-gray-500 mb-6">
                            Get started by adding your first person to the system
                        </p>
                        <Button
                            variant="primary"
                            leftIcon={<UserPlus size={18} />}
                            onClick={() => setIsModalOpen(true)}
                        >
                            Add First Person
                        </Button>
                    </div>
                )}
            </div>

            {/* Modal */}
            <AddPersonModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSavePerson}
                properties={properties}
            />
        </div>
    );
}
