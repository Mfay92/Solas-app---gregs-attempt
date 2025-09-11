
import React, { useState } from 'react';
import Card from '../Card';
import { useTheme } from '../../contexts/ThemeContext';
import { usePersona, Persona } from '../../contexts/PersonaContext';
import * as storage from '../../services/storage';

const TABS = ['Accessibility', 'Theme', 'Developer Options'];

const THEMES = [
  { id: 'default', name: 'Default', colors: ['#025A40', '#008C67', '#f3f4f6'] },
  { id: 'festive', name: 'Festive', colors: ['#881337', '#b91c1c', '#fef2f2'] },
  { id: 'spooky', name: 'Spooky', colors: ['#171717', '#4a044e', '#1e1b4b'] },
  { id: 'summer', name: 'Summer Holiday', colors: ['#06b6d4', '#f97316', '#fffbeb'] },
  { id: 'spring', name: 'Spring', colors: ['#ec4899', '#a3e635', '#f0fdf4'] },
];

const PERSONAS: { id: Persona, name: string, description: string }[] = [
    { id: 'default', name: 'ivolve (Default)', description: 'Standard view for care and support providers.' },
    { id: 'rp', name: 'Registered Provider', description: 'View the app as a housing association or RP.' },
    { id: 'la', name: 'Local Authority', description: 'View the app as a commissioning council.' },
    { id: 'nhs', name: 'NHS Service', description: 'View the app as an NHS commissioning service.' },
];

const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Theme');
  const { theme, setTheme } = useTheme();
  const { persona, setPersona } = usePersona();

  const handleResetState = () => {
    const isConfirmed = window.confirm(
      'Are you sure you want to clear all local data? This action cannot be undone and will require a page refresh.'
    );
    if (isConfirmed) {
        storage.clearState();
        alert('Local data cleared. Please refresh the application to see the effect.');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Accessibility':
        return (
          <Card title="Accessibility Settings" titleClassName="text-solas-dark">
            <div className="space-y-6">
              <div>
                <label htmlFor="font-size" className="block text-sm font-medium text-app-text-gray">Font Size</label>
                <select id="font-size" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                  <option>Small</option>
                  <option selected>Default</option>
                  <option>Large</option>
                  <option>Extra Large</option>
                </select>
              </div>
              <div>
                <label htmlFor="font-type" className="block text-sm font-medium text-app-text-gray">Font Type</label>
                <select id="font-type" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                  <option>System Sans-Serif</option>
                  <option>System Serif</option>
                  <option>Monospace</option>
                  <option>Dyslexia-friendly</option>
                </select>
              </div>
              <div className="relative flex items-start">
                <div className="flex h-5 items-center">
                    <input id="high-contrast" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-ivolve-blue" />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="high-contrast" className="font-medium text-app-text-dark">High Contrast Mode</label>
                    <p className="text-app-text-gray">Increases text contrast throughout the application.</p>
                </div>
              </div>
            </div>
          </Card>
        );
      case 'Theme':
        return (
          <Card title="Application Theme" titleClassName="text-solas-dark">
             <p className="text-sm text-app-text-gray mb-6">Choose a color palette for the application. Note: Logos, status tags, and highlights will not be affected by themes.</p>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {THEMES.map(t => (
                    <div key={t.id} onClick={() => setTheme(t.id as any)} className={`p-4 rounded-lg border-2 cursor-pointer ${theme === t.id ? 'border-ivolve-blue' : 'border-transparent'}`}>
                        <div className="flex space-x-2">
                            {t.colors.map(color => (
                                <div key={color} className="w-1/3 h-16 rounded-md" style={{ backgroundColor: color }}></div>
                            ))}
                        </div>
                        <p className="mt-3 font-semibold text-center text-app-text-dark">{t.name}</p>
                    </div>
                ))}
             </div>
          </Card>
        );
      case 'Developer Options':
        return (
            <Card title="Developer Options" titleClassName="text-solas-dark">
                <fieldset>
                    <legend className="text-lg font-medium text-app-text-dark">View App As</legend>
                    <p className="text-sm text-app-text-gray mt-1 mb-4">Change the application's terminology to match a specific stakeholder's perspective. This is for demonstration purposes.</p>
                    <div className="space-y-4">
                        {PERSONAS.map((p) => (
                        <div key={p.id} className="relative flex items-start">
                            <div className="flex h-5 items-center">
                                <input
                                    id={p.id}
                                    name="persona"
                                    type="radio"
                                    checked={persona === p.id}
                                    onChange={() => setPersona(p.id)}
                                    className="h-4 w-4 border-gray-300 text-ivolve-blue focus:ring-ivolve-blue"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <label htmlFor={p.id} className="font-medium text-app-text-dark">{p.name}</label>
                                <p className="text-app-text-gray">{p.description}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                </fieldset>
                <div className="border-t my-6"></div>
                <div>
                    <h3 className="text-lg font-medium text-app-text-dark">Data Persistence</h3>
                    <p className="text-sm text-app-text-gray mt-1 mb-4">
                        The application state is saved in your browser's local storage. 
                        Resetting will clear all changes and reload the original mock data on the next page load.
                    </p>
                    <button
                        onClick={handleResetState}
                        className="px-4 py-2 rounded-md bg-status-red text-white font-semibold hover:bg-opacity-90"
                    >
                        Reset Application State
                    </button>
                </div>
            </Card>
        )
      default:
        return null;
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-app-text-dark mb-2">Settings</h1>
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-ivolve-blue text-app-text-dark'
                  : 'border-transparent text-app-text-gray hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
      <div>{renderContent()}</div>
    </div>
  );
};

export default SettingsView;
