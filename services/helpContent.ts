
import React from 'react';

export type HelpContent = {
    title: string;
    content: React.ReactNode;
};

export const HELP_CONTENT: Record<string, HelpContent> = {
    propertyDatabase: {
        title: 'Help: Property Database',
        content: React.createElement('div', { className: "space-y-2 text-sm text-solas-gray" },
            React.createElement('p', null, 'This page provides a comprehensive list of all properties and their individual units. You can search, filter, and sort to find exactly what you need.'),
            React.createElement('h4', { className: "font-bold text-solas-dark pt-2" }, 'Key Features:'),
            React.createElement('ul', { className: "list-disc list-inside space-y-1" },
                React.createElement('li', null, React.createElement('b', null, 'Smart Search:'), ' Use natural language like "voids in the north" to automatically filter the list.'),
                React.createElement('li', null, React.createElement('b', null, 'View Settings:'), ' Customize columns, row highlights, and tag styles.'),
                React.createElement('li', null, React.createElement('b', null, 'Admin Tools:'), ' Add new properties and units to the database.'),
                React.createElement('li', null, React.createElement('b', null, 'Clicking a row:'), ' Opens the detailed profile for that property/unit.')
            )
        )
    },
    notesAndUpdates: {
        title: 'Help: Notes & Updates',
        content: React.createElement('div', { className: "space-y-2 text-sm text-solas-gray" },
            React.createElement('p', null, "This is the central log for all communications, events, and updates for an individual. It's crucial for maintaining a clear and auditable record."),
            React.createElement('h4', { className: "font-bold text-solas-dark pt-2" }, 'Best Practices:'),
            React.createElement('ul', { className: "list-disc list-inside space-y-1" },
                React.createElement('li', null, React.createElement('b', null, 'Be Objective:'), ' Record facts, not opinions. State what was said or observed.'),
                React.createElement('li', null, React.createElement('b', null, 'Be Timely:'), ' Log notes as soon as possible after an event occurs.'),
                React.createElement('li', null, React.createElement('b', null, 'Use Categories:'), ' Assign the correct category and sub-category to make information easy to find.'),
                React.createElement('li', null, React.createElement('b', null, 'Mark Sensitivity:'), " Use the 'Mark as Sensitive' toggle for confidential information, such as safeguarding concerns or incidents.")
            )
        )
    },
    // Add other topics as needed
};
