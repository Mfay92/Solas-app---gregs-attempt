

import React, { useState } from 'react';
import { TimelineEvent, TimelineEventType, KeyDates, ServiceType } from '../../types';
import Card from '../Card';

type TimelineViewProps = {
  events: TimelineEvent[];
  handoverDate?: string;
  handbackDate?: string | null;
  keyDates?: KeyDates;
  moveInDate?: string;
  moveOutDate?: string | null;
  serviceType?: ServiceType;
};

const eventTypeColors: Record<TimelineEventType, string> = {
  [TimelineEventType.Repairs]: 'bg-red-100 text-status-red',
  [TimelineEventType.Compliance]: 'bg-blue-100 text-ivolve-blue',
  [TimelineEventType.Finance]: 'bg-green-100 text-ivolve-mid-green',
  [TimelineEventType.Moves]: 'bg-purple-100 text-ivolve-purple',
  [TimelineEventType.Notes]: 'bg-gray-100 text-gray-800',
  [TimelineEventType.Care]: 'bg-pink-100 text-pink-800',
  [TimelineEventType.Tenancy]: 'bg-orange-100 text-orange-800',
  [TimelineEventType.System]: 'bg-gray-100 text-gray-800',
};

const KeyDateItem: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => {
    const isDate = value && !isNaN(Date.parse(value));
    const displayValue = isDate ? new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : value;
    return (
        <div className="flex justify-between py-1.5 border-b last:border-b-0">
            <dt className={`text-sm font-bold ${value ? 'text-ivolve-dark-green' : 'text-gray-400'}`}>{label}</dt>
            <dd className={`text-sm ${value ? 'text-gray-900' : 'text-gray-400'}`}>{displayValue || '—'}</dd>
        </div>
    );
};

const TimelineView: React.FC<TimelineViewProps> = ({ events, handoverDate, handbackDate, keyDates, moveInDate, moveOutDate, serviceType }) => {
  const [activeFilters, setActiveFilters] = useState<TimelineEventType[]>([]);

  const toggleFilter = (filter: TimelineEventType) => {
    setActiveFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const filteredEvents = activeFilters.length > 0 
    ? events.filter(event => activeFilters.includes(event.type))
    : events;
    
  const cardHoverClass = "hover:shadow-xl hover:-translate-y-0.5";
  const isFormer = !!moveOutDate;
  const cardTitleClass = isFormer ? 'bg-solas-gray text-white' : 'bg-ivolve-dark-green text-white';

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {handoverDate && (
                <Card title="Property Dates" className={cardHoverClass} titleClassName={cardTitleClass} bodyClassName="p-4">
                     <dl>
                        <KeyDateItem label="Handover Date" value={handoverDate} />
                        <KeyDateItem label="Handback Date" value={handbackDate} />
                    </dl>
                </Card>
            )}
            {moveInDate && (
                <Card title="Key Dates" className={cardHoverClass} titleClassName={cardTitleClass} bodyClassName="p-4">
                    <dl>
                        <KeyDateItem label="Move-in Date" value={moveInDate} />
                        <KeyDateItem label="Move-out Date" value={moveOutDate} />
                    </dl>
                </Card>
            )}
             {keyDates?.lease && (serviceType === ServiceType.Residential || serviceType === ServiceType.NursingCare) && (
                <Card title="Lease Dates" className={cardHoverClass} titleClassName={cardTitleClass} bodyClassName="p-4">
                    <dl>
                        <KeyDateItem label="Start Date" value={keyDates.lease.startDate} />
                        <KeyDateItem label="End Date" value={keyDates.lease.endDate} />
                        <KeyDateItem label="Term" value={keyDates.lease.term} />
                        <KeyDateItem label="Break Date" value={keyDates.lease.breakDate} />
                    </dl>
                </Card>
            )}
             {keyDates?.sla && serviceType === ServiceType.SupportedLiving && (
                <Card title="SLA Dates" className={cardHoverClass} titleClassName={cardTitleClass} bodyClassName="p-4">
                    <dl>
                        <KeyDateItem label="Start Date" value={keyDates.sla.startDate} />
                        <KeyDateItem label="End Date" value={keyDates.sla.endDate} />
                        <KeyDateItem label="Term" value={keyDates.sla.term} />
                        <KeyDateItem label="Renewal Date" value={keyDates.sla.renewalDate} />
                    </dl>
                </Card>
            )}
        </div>
        <Card title="Event Timeline" titleClassName={cardTitleClass} className={cardHoverClass}>
        <div className="flex space-x-2 mb-6 border-b pb-4">
            {Object.values(TimelineEventType).map(type => (
            <button
                key={type}
                onClick={() => toggleFilter(type)}
                className={`px-3 py-1 text-sm font-medium rounded-full transition-colors ${
                activeFilters.includes(type)
                    ? 'bg-ivolve-blue text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
            >
                {type}
            </button>
            ))}
        </div>
        <div className="space-y-6">
            {filteredEvents.map(event => (
            <div key={event.id} className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-24 text-right">
                <p className="text-sm font-semibold text-solas-dark">{new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                <p className="text-xs text-solas-gray">{event.actor}</p>
                </div>
                <div className="relative w-full">
                <span className="absolute top-1/2 -left-6 -translate-y-1/2 h-3 w-3 bg-gray-300 rounded-full border-2 border-white"></span>
                <div className="ml-2 pl-6 border-l-2 border-gray-200">
                    <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-md ${eventTypeColors[event.type]}`}>{event.type}</span>
                    <p className="mt-1 text-sm text-solas-gray">{event.description}</p>
                </div>
                </div>
            </div>
            ))}
            {filteredEvents.length === 0 && <p className="text-solas-gray text-center py-4">No timeline events match the selected filters.</p>}
        </div>
        </Card>
        <div className="pt-2">
            <button
                disabled
                className="bg-gray-300 text-gray-500 font-bold py-2 px-4 rounded-md cursor-not-allowed flex items-center space-x-2"
                title="This feature is coming soon"
            >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>Add Key Date Card</span>
            </button>
        </div>
    </div>
  );
};

export default TimelineView;