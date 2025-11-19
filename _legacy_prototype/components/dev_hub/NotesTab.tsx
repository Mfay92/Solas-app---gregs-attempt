import React, { useState } from 'react';

const NotesTab: React.FC = () => {
    const [notes, setNotes] = useState('');
    const [actionItems, setActionItems] = useState([
        { id: 1, text: 'Review component consistency for forms.', done: false },
        { id: 2, text: 'Check accessibility standards for color contrast.', done: true },
        { id: 3, text: 'Discuss API structure for saving legal analysis.', done: false },
    ]);

    const toggleActionItem = (id: number) => {
        setActionItems(items => items.map(item => item.id === id ? { ...item, done: !item.done } : item));
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-solas-dark pb-2 border-b-2 border-devhub-orange">Notes & Actions</h2>
            <p className="text-solas-gray mt-1">Your personal scratchpad. Content here is not saved (yet!).</p>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold text-solas-dark mb-2">Development Notes</h3>
                    <textarea 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full h-80 p-3 border border-gray-300 rounded-md focus:ring-ivolve-blue focus:border-ivolve-blue"
                        placeholder="Jot down your thoughts, questions, or ideas here..."
                    ></textarea>
                </div>
                <div>
                    <h3 className="font-semibold text-solas-dark mb-2">Action Items</h3>
                    <div className="bg-white p-4 border rounded-md h-80 overflow-y-auto">
                        <div className="space-y-3">
                            {actionItems.map(item => (
                                <div key={item.id} className="relative flex items-start">
                                    <div className="flex h-5 items-center">
                                        <input 
                                            id={`action-${item.id}`} 
                                            type="checkbox" 
                                            checked={item.done}
                                            onChange={() => toggleActionItem(item.id)}
                                            className="h-4 w-4 rounded border-gray-300 text-ivolve-blue focus:ring-ivolve-blue" 
                                        />
                                    </div>
                                    <div className="ml-3 text-sm">
                                        <label htmlFor={`action-${item.id}`} className={`font-medium ${item.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                                            {item.text}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotesTab;