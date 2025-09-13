import React, { useMemo, useState, useEffect } from 'react';
import Card from '../Card';
import ContactCard from '../ContactCard';
import StakeholderContactCard from '../StakeholderContactCard';
import { ComplianceIcon, ClipboardIcon, BuildingIcon, PeopleIcon, VoidManagementIcon, CalendarIcon, PlusIcon, StarIconSolid, SparklesIcon } from '../Icons';
import { useData } from '../../contexts/DataContext';
import { useUI } from '../../contexts/UIContext';
import { MaintenanceJob, Property, MaintenanceStatus, UnitStatus, CustomWidget } from '../../types';
import { usePersona } from '../../contexts/PersonaContext';
import * as storage from '../../services/storage';
import AddWidgetModal from '../AddWidgetModal';
import ReportWidget from '../ReportWidget';
import SplitText from '../SplitText';

type DashboardViewProps = {
  currentUserId: string;
};

export const ALL_WIDGETS = [
    { id: 'openActions', title: 'My Open Actions', icon: <ClipboardIcon />, column: 1 },
    { id: 'myProperties', title: 'My Properties', icon: <BuildingIcon />, column: 1 },
    { id: 'voids', title: 'Voids at a Glance', icon: <VoidManagementIcon />, column: 1 },
    { id: 'pinnedContacts', title: 'Pinned Contacts', icon: <StarIconSolid />, column: 2 },
    { id: 'dates', title: 'Upcoming Dates', icon: <CalendarIcon />, column: 2 },
    { id: 'compliance', title: 'Compliance Summary', icon: <ComplianceIcon />, column: 3 },
    { id: 'myPeople', title: 'My People', icon: <PeopleIcon />, column: 3 },
];

const DEFAULT_WIDGET_IDS = ALL_WIDGETS.map(w => w.id);

const DashboardView: React.FC<DashboardViewProps> = ({ currentUserId }) => {
    const { ivolveStaff, stakeholders, properties, pinnedContactIds, handleTogglePin, people } = useData();
    const { selectIvolveContact, selectStakeholderContact, setActiveMainView, selectProperty, selectPerson } = useUI();
    const { t } = usePersona();
    
    const [isAddWidgetModalOpen, setIsAddWidgetModalOpen] = useState(false);
    const [visibleWidgetIds, setVisibleWidgetIds] = useState<string[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [customWidgets, setCustomWidgets] = useState<CustomWidget[]>([]);

    useEffect(() => {
        const savedSettings = storage.loadDashboardSettings();
        if (savedSettings) {
            setVisibleWidgetIds(savedSettings.visibleWidgetIds);
        } else {
            setVisibleWidgetIds(DEFAULT_WIDGET_IDS);
        }
        setCustomWidgets(storage.loadCustomWidgets());
        setIsInitialLoad(false);
    }, []);

    useEffect(() => {
        if (!isInitialLoad) {
            storage.saveDashboardSettings({ visibleWidgetIds });
        }
    }, [visibleWidgetIds, isInitialLoad]);

    const handleRemoveWidget = (widgetId: string) => {
        setVisibleWidgetIds(prev => prev.filter(id => id !== widgetId));
        if (widgetId.startsWith('custom-')) {
            const updatedCustomWidgets = customWidgets.filter(w => w.id !== widgetId);
            setCustomWidgets(updatedCustomWidgets);
            storage.saveCustomWidgets(updatedCustomWidgets);
        }
    };

    const [collapsedWidgets, setCollapsedWidgets] = useState<Record<string, boolean>>({
        openActions: false,
        myProperties: false,
        pinnedContacts: false,
        compliance: false,
        myPeople: false,
        voids: false,
        dates: false,
    });

    const toggleWidget = (widgetId: string) => {
        setCollapsedWidgets(prev => ({ ...prev, [widgetId]: !prev[widgetId] }));
    };

    const currentUser = ivolveStaff.find(s => s.id === currentUserId);
    
    const pinnedIvolveStaff = ivolveStaff.filter(s => pinnedContactIds.has(s.id));
    const pinnedStakeholderContacts = stakeholders.flatMap(s => 
        s.contacts
         .filter(c => pinnedContactIds.has(c.id))
         .map(c => ({ ...c, stakeholder: s }))
    );

    const hasPinnedContacts = pinnedIvolveStaff.length > 0 || pinnedStakeholderContacts.length > 0;

    const complianceStats = useMemo(() => {
        const allItems = properties.flatMap(p => p.complianceItems);
        const total = allItems.length;
        if (total === 0) return { total: 0, compliant: 0, dueSoon: 0, expired: 0, complianceRate: 100 };

        const now = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(now.getDate() + 30);

        let compliantCount = 0;
        let dueSoonCount = 0;
        let expiredCount = 0;

        allItems.forEach(item => {
            const nextCheck = new Date(item.nextCheck);
            if (item.status === 'Expired' || nextCheck < now) {
                expiredCount++;
            } else if (nextCheck <= thirtyDaysFromNow) {
                dueSoonCount++;
                compliantCount++;
            } else if (item.status === 'Compliant') {
                compliantCount++;
            }
        });
        
        return {
            total,
            compliant: compliantCount,
            dueSoon: dueSoonCount,
            expired: expiredCount,
            complianceRate: total > 0 ? Math.round((compliantCount / total) * 100) : 100,
        };

    }, [properties]);
    
    const myOpenActions = useMemo(() => {
        if (!currentUser) return [];
        const actions: (MaintenanceJob & { property: Property })[] = [];
        properties.forEach(p => {
            p.maintenanceJobs.forEach(job => {
                const isOpen = job.status !== MaintenanceStatus.Completed && job.status !== MaintenanceStatus.Closed;
                const isLinked = job.details.reportedBy === currentUser.name || job.activityLog.some(a => a.actor === currentUser.name) || job.assignedTo === currentUser.name;
                if (isOpen && isLinked) {
                    actions.push({ ...job, property: p });
                }
            });
        });
        return actions.sort((a,b) => new Date(a.slaDueDate).getTime() - new Date(b.slaDueDate).getTime());
    }, [properties, currentUser]);

    const myProperties = useMemo(() => {
        if (!currentUser) return [];
        return properties.filter(p => 
            p.linkedContacts?.some(c => c.contactId === currentUser.id)
        );
    }, [properties, currentUser]);

    const myPeople = useMemo(() => {
        if (!currentUser) return [];
        return people.filter(p => p.keyWorkerId === currentUser.id);
    }, [people, currentUser]);
    
    const allVoids = useMemo(() => {
        return properties.flatMap(p => p.units.filter(u => u.status === UnitStatus.Void).map(u => ({ ...u, property: p })))
    }, [properties]);

    const upcomingDates = useMemo(() => {
        const dates: { date: Date; text: string; property: Property; unitId: string | null }[] = [];
        const now = new Date();
        const futureCutoff = new Date();
        futureCutoff.setDate(now.getDate() + 90);

        properties.forEach(p => {
            const masterUnitId = p.units.find(u => u.status === UnitStatus.Master)?.id || p.units[0]?.id || null;

            p.complianceItems.forEach(item => {
                const nextCheck = new Date(item.nextCheck);
                if (nextCheck > now && nextCheck <= futureCutoff) {
                    dates.push({ date: nextCheck, text: `${item.type} Due`, property: p, unitId: masterUnitId });
                }
            });

            if (p.keyDates) {
                const { lease, sla, refurbishments } = p.keyDates;
                if (lease?.breakDate) {
                    const d = new Date(lease.breakDate);
                    if (d > now && d <= futureCutoff) dates.push({ date: d, text: 'Lease Break Date', property: p, unitId: masterUnitId });
                }
                if (lease?.renewalDate) {
                    const d = new Date(lease.renewalDate);
                    if (d > now && d <= futureCutoff) dates.push({ date: d, text: 'Lease Renewal', property: p, unitId: masterUnitId });
                }
                if (sla?.renewalDate) {
                    const d = new Date(sla.renewalDate);
                    if (d > now && d <= futureCutoff) dates.push({ date: d, text: 'SLA Renewal', property: p, unitId: masterUnitId });
                }
                if (refurbishments) {
                    refurbishments.forEach(r => {
                        const d = new Date(r.date);
                        if (d > now && d <= futureCutoff) dates.push({ date: d, text: `${r.name} Refurb`, property: p, unitId: masterUnitId });
                    });
                }
            }
        });
        return dates.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 5);
    }, [properties]);
    
    const visibleCustomWidgets = customWidgets.filter(w => visibleWidgetIds.includes(w.id));
    
  return (
    <div className="p-8">
        {isAddWidgetModalOpen && (
            <AddWidgetModal
                isOpen={isAddWidgetModalOpen}
                onClose={() => setIsAddWidgetModalOpen(false)}
                visibleWidgetIds={visibleWidgetIds}
                onSave={setVisibleWidgetIds}
            />
        )}
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-4xl font-bold text-app-text-dark animated-heading" aria-label={`Welcome, ${currentUser ? currentUser.name.split(' ')[0] : 'User'}`}>
              <SplitText>{`Welcome, ${currentUser ? currentUser.name.split(' ')[0] : 'User'}`}</SplitText>
            </h1>
            <p className="mt-2 text-lg text-app-text-gray">Your dashboard is ready. Here are your key contacts and updates.</p>
        </div>
        <button
            onClick={() => setIsAddWidgetModalOpen(true)}
            className="flex items-center space-x-2 bg-ivolve-blue text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-colors"
        >
            <PlusIcon />
            <span>Add Widget</span>
        </button>
      </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* COLUMN 1 */}
            <div className="space-y-8">
                {visibleWidgetIds.includes('openActions') && <Card 
                    title={
                        <div className="flex items-center space-x-2">
                            <span className="text-ivolve-blue"><ClipboardIcon /></span>
                            <h3 className="text-xl font-semibold">My Open Actions</h3>
                        </div>
                    } 
                    titleClassName="text-solas-dark"
                    isCollapsible
                    isCollapsed={collapsedWidgets.openActions}
                    onToggleCollapse={() => toggleWidget('openActions')}
                    onRemove={() => handleRemoveWidget('openActions')}
                    bodyClassName="max-h-96 overflow-y-auto"
                >
                    {myOpenActions.length > 0 ? (
                        <div className="space-y-3">
                            {myOpenActions.map(job => {
                                const isOverdue = new Date(job.slaDueDate) < new Date();
                                return (
                                <button 
                                    key={job.id} 
                                    onClick={() => selectProperty(job.property.id, job.unit)}
                                    className="w-full text-left p-3 bg-gray-50 rounded-md border hover:bg-ivolve-blue/10 hover:border-ivolve-blue transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <p className="font-bold text-sm text-ivolve-blue">{job.ref}</p>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${isOverdue ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'}`}>
                                            Due: {new Date(job.slaDueDate).toLocaleDateString('en-GB')}
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-solas-dark mt-1">{job.category}</p>
                                    <p className="text-xs text-solas-gray">{job.property.address.line1}</p>
                                </button>
                            )})}
                        </div>
                    ) : (
                        <p className="text-app-text-gray text-sm">You have no open maintenance actions assigned to you.</p>
                    )}
                </Card>}

                {visibleWidgetIds.includes('myProperties') && <Card 
                    title={
                        <div className="flex items-center space-x-2">
                            <span className="text-ivolve-blue"><BuildingIcon /></span>
                            <h3 className="text-xl font-semibold">My Properties</h3>
                        </div>
                    } 
                    titleClassName="text-solas-dark"
                    isCollapsible
                    isCollapsed={collapsedWidgets.myProperties}
                    onToggleCollapse={() => toggleWidget('myProperties')}
                    onRemove={() => handleRemoveWidget('myProperties')}
                    bodyClassName="max-h-80 overflow-y-auto"
                 >
                    {myProperties.length > 0 ? (
                        <ul className="space-y-2">
                            {myProperties.map(prop => {
                                const masterUnitId = prop.units.find(u => u.status === UnitStatus.Master)?.id || prop.units[0].id;
                                return (
                                <li key={prop.id}>
                                    <button 
                                        onClick={() => selectProperty(prop.id, masterUnitId)}
                                        className="w-full text-left text-sm text-ivolve-blue hover:underline p-1 rounded"
                                    >
                                        {prop.address.line1}, {prop.address.city}
                                    </button>
                                </li>
                            )})}
                        </ul>
                    ) : (
                         <p className="text-app-text-gray text-sm">You are not linked as a key contact to any properties yet.</p>
                    )}
                </Card>}

                {visibleWidgetIds.includes('voids') && <Card 
                    title={
                        <div className="flex items-center space-x-2">
                            <span className="text-ivolve-blue"><VoidManagementIcon /></span>
                            <h3 className="text-xl font-semibold">Voids at a Glance</h3>
                        </div>
                    } 
                    titleClassName="text-solas-dark"
                    isCollapsible
                    isCollapsed={collapsedWidgets.voids}
                    onToggleCollapse={() => toggleWidget('voids')}
                    onRemove={() => handleRemoveWidget('voids')}
                    bodyClassName="max-h-80 overflow-y-auto"
                >
                    {allVoids.length > 0 ? (
                        <div className="space-y-3">
                            <div className="flex justify-between items-baseline pb-2 border-b">
                                <p className="font-bold text-solas-dark">Total Voids: {allVoids.length}</p>
                                <button onClick={() => setActiveMainView('Void Management')} className="text-sm text-ivolve-blue hover:underline">View all &rarr;</button>
                            </div>
                            {allVoids.slice(0, 5).map(unit => (
                                <button 
                                    key={unit.id}
                                    onClick={() => selectProperty(unit.property.id, unit.id)}
                                    className="w-full text-left p-2 bg-gray-50 rounded-md border hover:bg-ivolve-blue/10 hover:border-ivolve-blue transition-colors"
                                >
                                    <p className="font-bold text-sm text-ivolve-blue">{unit.id}</p>
                                    <p className="text-xs text-solas-gray">{unit.property.address.line1}</p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-app-text-gray text-sm">There are currently no void units.</p>
                    )}
                </Card>}
            </div>

            {/* COLUMN 2 */}
            <div className="space-y-8">
                 {visibleWidgetIds.includes('pinnedContacts') && <Card 
                    title="My Pinned Contacts" 
                    titleClassName="text-solas-dark"
                    isCollapsible
                    isCollapsed={collapsedWidgets.pinnedContacts}
                    onToggleCollapse={() => toggleWidget('pinnedContacts')}
                    onRemove={() => handleRemoveWidget('pinnedContacts')}
                >
                    {!hasPinnedContacts ? (
                         <p className="text-app-text-gray">You haven't pinned any contacts yet. Click the star icon on a contact card in the Contact Hub to add them here for quick access.</p>
                    ) : (
                        <div className="space-y-6">
                            {pinnedIvolveStaff.map(person => (
                                <ContactCard 
                                    key={person.id} 
                                    person={person} 
                                    onClick={() => selectIvolveContact(person.id)}
                                    isPinned={true}
                                    onTogglePin={person.id !== currentUserId ? () => handleTogglePin(person.id) : undefined}
                                />
                            ))}
                             {pinnedStakeholderContacts.map(contact => (
                                <StakeholderContactCard
                                    key={contact.id}
                                    contact={contact}
                                    stakeholder={contact.stakeholder}
                                    onClick={() => selectStakeholderContact(contact.stakeholder.id, contact.id)}
                                    isPinned={true}
                                    onTogglePin={() => handleTogglePin(contact.id)}
                                />
                            ))}
                        </div>
                    )}
                </Card>}
                 {visibleWidgetIds.includes('dates') && <Card 
                    title={
                        <div className="flex items-center space-x-2">
                            <span className="text-ivolve-blue"><CalendarIcon /></span>
                            <h3 className="text-xl font-semibold">Upcoming Dates (90d)</h3>
                        </div>
                    } 
                    titleClassName="text-solas-dark"
                    isCollapsible
                    isCollapsed={collapsedWidgets.dates}
                    onToggleCollapse={() => toggleWidget('dates')}
                    onRemove={() => handleRemoveWidget('dates')}
                    bodyClassName="max-h-80 overflow-y-auto"
                >
                    {upcomingDates.length > 0 ? (
                        <div className="space-y-3">
                            {upcomingDates.map((item, index) => (
                                <button 
                                    key={index}
                                    onClick={() => item.unitId && selectProperty(item.property.id, item.unitId)}
                                    className="w-full text-left p-3 bg-gray-50 rounded-md border hover:bg-ivolve-blue/10 hover:border-ivolve-blue transition-colors"
                                >
                                    <div className="flex justify-between items-start">
                                        <p className="font-bold text-sm text-ivolve-blue">{item.text}</p>
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                                            {item.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                        </span>
                                    </div>
                                    <p className="text-xs text-solas-gray mt-1">{item.property.address.line1}</p>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <p className="text-app-text-gray text-sm">No key dates in the next 90 days.</p>
                    )}
                </Card>}
            </div>

             {/* COLUMN 3 */}
            <div className="space-y-8">
                {visibleWidgetIds.includes('compliance') && <Card 
                    title={
                        <div className="flex items-center space-x-2">
                            <span className="text-ivolve-blue"><ComplianceIcon /></span>
                            <h3 className="text-xl font-semibold">Compliance Summary</h3>
                        </div>
                    } 
                    titleClassName="text-solas-dark"
                    isCollapsible
                    isCollapsed={collapsedWidgets.compliance}
                    onToggleCollapse={() => toggleWidget('compliance')}
                    onRemove={() => handleRemoveWidget('compliance')}
                >
                    <div className="text-center">
                        <p className="text-6xl font-bold text-ivolve-mid-green">{complianceStats.complianceRate}%</p>
                        <p className="text-sm text-solas-gray font-semibold">Portfolio Compliant</p>
                    </div>
                    <div className="mt-6 space-y-3">
                        <div className="flex justify-between items-center p-3 bg-yellow-100 rounded-md">
                            <span className="font-semibold text-ivolve-yellow">Due Soon (30d)</span>
                            <span className="font-bold text-lg text-ivolve-yellow">{complianceStats.dueSoon}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-red-100 rounded-md">
                            <span className="font-semibold text-status-red">Expired / Overdue</span>
                            <span className="font-bold text-lg text-status-red">{complianceStats.expired}</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => setActiveMainView('Compliance & PPM')}
                        className="mt-6 w-full bg-ivolve-blue text-white font-bold py-2 px-4 rounded-md hover:bg-opacity-90"
                    >
                        View Full Report
                    </button>
                 </Card>}

                {visibleWidgetIds.includes('myPeople') && <Card 
                    title={
                        <div className="flex items-center space-x-2">
                            <span className="text-ivolve-blue"><PeopleIcon /></span>
                            <h3 className="text-xl font-semibold">My {t('people_plural_capitalized')}</h3>
                        </div>
                    } 
                    titleClassName="text-solas-dark"
                    isCollapsible
                    isCollapsed={collapsedWidgets.myPeople}
                    onToggleCollapse={() => toggleWidget('myPeople')}
                    onRemove={() => handleRemoveWidget('myPeople')}
                    bodyClassName="max-h-80 overflow-y-auto"
                >
                     {myPeople.length > 0 ? (
                        <div className="space-y-3">
                            {myPeople.map(person => {
                                const property = properties.find(p => p.id === person.propertyId);
                                return (
                                <button 
                                    key={person.id} 
                                    onClick={() => selectPerson(person.id)}
                                    className="w-full text-left p-2 flex items-center space-x-3 bg-gray-50 rounded-md border hover:bg-ivolve-blue/10 hover:border-ivolve-blue transition-colors"
                                >
                                    <img src={person.photoUrl} alt={person.preferredFirstName} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-semibold text-sm text-solas-dark">{person.preferredFirstName} {person.surname}</p>
                                        <p className="text-xs text-solas-gray">{property?.address.line1}</p>
                                    </div>
                                </button>
                            )})}
                        </div>
                    ) : (
                         <p className="text-app-text-gray text-sm">You are not assigned as a Key Worker to any {t('people_plural_lowercase')}.</p>
                    )}
                 </Card>}
                 {/* Custom Report Widgets */}
                 {visibleCustomWidgets.map(widget => (
                    <ReportWidget
                        key={widget.id}
                        widget={widget}
                        isCollapsed={!!collapsedWidgets[widget.id]}
                        onToggleCollapse={() => toggleWidget(widget.id)}
                        onRemove={() => handleRemoveWidget(widget.id)}
                    />
                 ))}
            </div>
        </div>
    </div>
  );
};

export default DashboardView;