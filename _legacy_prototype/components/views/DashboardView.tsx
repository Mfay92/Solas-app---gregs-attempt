

import React, { useMemo, useState, useEffect } from 'react';
import Card from '../Card';
import ContactCard from '../ContactCard';
import StakeholderContactCard from '../StakeholderContactCard';
import { ComplianceIcon, ClipboardIcon, BuildingIcon, PeopleIcon, VoidManagementIcon, CalendarIcon, PlusIcon, StarIconSolid, SparklesIcon, UserIcon } from '../Icons';
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
        return dates.sort((a,b) => a.date.getTime() - b.date.getTime());
    }, [properties]);


    const renderWidget = (widgetId: string) => {
        switch (widgetId) {
             case 'openActions': return (
                <Card title="My Open Actions" isCollapsible isCollapsed={collapsedWidgets.openActions} onToggleCollapse={() => toggleWidget('openActions')} onRemove={() => handleRemoveWidget('openActions')} className="border-2 border-brand-dark-green" titleClassName="bg-brand-dark-green text-white">
                    {myOpenActions.length > 0 ? (
                        <ul className="space-y-3">
                            {myOpenActions.slice(0, 5).map(job => (
                                <li key={job.id} className="text-sm p-2 bg-gray-50 rounded-md border">
                                    <p><span className="font-bold text-ivolve-blue">{job.ref}</span>: {job.category} at {job.property.address.line1}</p>
                                    <p className="text-xs text-gray-500">Due: {new Date(job.slaDueDate).toLocaleDateString()}</p>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-sm text-gray-500">You have no open actions.</p>}
                </Card>
            );
            case 'myProperties': return (
                 <Card title="My Properties" isCollapsible isCollapsed={collapsedWidgets.myProperties} onToggleCollapse={() => toggleWidget('myProperties')} onRemove={() => handleRemoveWidget('myProperties')} className="border-2 border-brand-dark-green" titleClassName="bg-brand-dark-green text-white">
                    {myProperties.length > 0 ? (
                         <ul className="space-y-2">
                            {myProperties.map(p => (
                                <li key={p.id} onClick={() => selectProperty(p.id, p.units.find(u=>u.status === UnitStatus.Master)?.id || p.units[0].id)} className="text-sm p-2 bg-gray-50 rounded-md border cursor-pointer hover:bg-ivolve-blue/10">
                                    <p className="font-semibold">{p.address.line1}</p>
                                    <p className="text-xs text-gray-500">{p.address.city}</p>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-sm text-gray-500">No properties are specifically assigned to you.</p>}
                </Card>
            );
            case 'voids': return (
                 <Card title="Voids at a Glance" isCollapsible isCollapsed={collapsedWidgets.voids} onToggleCollapse={() => toggleWidget('voids')} onRemove={() => handleRemoveWidget('voids')} className="border-2 border-brand-dark-green" titleClassName="bg-brand-dark-green text-white">
                     {allVoids.length > 0 ? (
                        <ul className="space-y-2">
                            {allVoids.map(v => (
                                <li key={v.id} onClick={() => selectProperty(v.property.id, v.id)} className="text-sm p-2 bg-gray-50 rounded-md border cursor-pointer hover:bg-ivolve-blue/10">
                                    <p className="font-semibold">{v.property.address.line1} ({v.name})</p>
                                </li>
                            ))}
                        </ul>
                     ) : <p className="text-sm text-gray-500">There are currently no void properties.</p>}
                </Card>
            );
            case 'pinnedContacts': return (
                <Card title="Pinned Contacts" isCollapsible isCollapsed={collapsedWidgets.pinnedContacts} onToggleCollapse={() => toggleWidget('pinnedContacts')} onRemove={() => handleRemoveWidget('pinnedContacts')} className="border-2 border-brand-dark-green" titleClassName="bg-brand-dark-green text-white">
                    {hasPinnedContacts ? (
                        <div className="space-y-3">
                            {pinnedIvolveStaff.map(s => <ContactCard key={s.id} person={s} onClick={() => selectIvolveContact(s.id)} isPinned={true} onTogglePin={() => handleTogglePin(s.id)} />)}
                            {pinnedStakeholderContacts.map(c => <StakeholderContactCard key={c.id} contact={c} stakeholder={c.stakeholder} onClick={() => selectStakeholderContact(c.stakeholder.id, c.id)} isPinned={true} onTogglePin={() => handleTogglePin(c.id)} />)}
                        </div>
                    ) : <p className="text-sm text-gray-500">You haven't pinned any contacts yet. Pin contacts from the <a href="#" onClick={(e)=>{e.preventDefault(); setActiveMainView('Contact Hub')}} className="text-ivolve-blue underline">Contact Hub</a>.</p>}
                </Card>
            );
            case 'dates': return (
                <Card title="Upcoming Dates (Next 90 Days)" isCollapsible isCollapsed={collapsedWidgets.dates} onToggleCollapse={() => toggleWidget('dates')} onRemove={() => handleRemoveWidget('dates')} className="border-2 border-brand-dark-green" titleClassName="bg-brand-dark-green text-white">
                    {upcomingDates.length > 0 ? (
                        <ul className="space-y-2">
                           {upcomingDates.map((item, index) => (
                               <li key={index} onClick={() => selectProperty(item.property.id, item.unitId || '')} className="text-sm p-2 bg-gray-50 rounded-md border cursor-pointer hover:bg-ivolve-blue/10">
                                   <p><span className="font-bold">{item.date.toLocaleDateString('en-GB', {day: '2-digit', month: 'short'})}:</span> {item.text}</p>
                                   <p className="text-xs text-gray-500">{item.property.address.line1}</p>
                               </li>
                           ))}
                        </ul>
                    ) : <p className="text-sm text-gray-500">No key dates in the next 90 days.</p>}
                </Card>
            )
            case 'compliance': return (
                <Card title="Compliance Summary" isCollapsible isCollapsed={collapsedWidgets.compliance} onToggleCollapse={() => toggleWidget('compliance')} onRemove={() => handleRemoveWidget('compliance')} className="border-2 border-brand-dark-green" titleClassName="bg-brand-dark-green text-white">
                    <div className="text-center">
                        <p className="text-5xl font-bold text-ivolve-mid-green">{complianceStats.complianceRate}%</p>
                        <p className="text-sm font-semibold text-gray-600">Portfolio Compliant</p>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-center text-sm">
                        <div className="p-2 bg-yellow-100 rounded-md"><p className="font-bold text-yellow-800">{complianceStats.dueSoon}</p><p>Due Soon</p></div>
                        <div className="p-2 bg-red-100 rounded-md"><p className="font-bold text-red-800">{complianceStats.expired}</p><p>Expired</p></div>
                    </div>
                </Card>
            );
            case 'myPeople': return (
                <Card title={`My ${t('people_plural_capitalized')}`} isCollapsible isCollapsed={collapsedWidgets.myPeople} onToggleCollapse={() => toggleWidget('myPeople')} onRemove={() => handleRemoveWidget('myPeople')} className="border-2 border-brand-dark-green" titleClassName="bg-brand-dark-green text-white">
                     {myPeople.length > 0 ? (
                        <ul className="space-y-2">
                            {myPeople.map(p => (
                                <li key={p.id} onClick={() => selectPerson(p.id)} className="text-sm p-2 bg-gray-50 rounded-md border cursor-pointer hover:bg-ivolve-blue/10 flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-500"><UserIcon /></div>
                                    <p className="font-semibold">{p.preferredFirstName} {p.surname}</p>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-sm text-gray-500">You are not assigned as a key worker to anyone.</p>}
                </Card>
            );
            default:
                const customWidget = customWidgets.find(w => w.id === widgetId);
                if (customWidget) {
                    return (
                        <ReportWidget
                            widget={customWidget}
                            isCollapsed={!!collapsedWidgets[widgetId]}
                            onToggleCollapse={() => toggleWidget(widgetId)}
                            onRemove={() => handleRemoveWidget(widgetId)}
                        />
                    );
                }
                return null;
        }
    };

    const columns = [1, 2, 3];
    const allAvailableWidgets = [...ALL_WIDGETS, ...customWidgets.map(w => ({ id: w.id, title: w.title, icon: <SparklesIcon />, column: 2 }))];

    return (
        <div className="h-full flex flex-col">
            <AddWidgetModal
                isOpen={isAddWidgetModalOpen}
                onClose={() => setIsAddWidgetModalOpen(false)}
                visibleWidgetIds={visibleWidgetIds}
                onSave={setVisibleWidgetIds}
            />
            <div className="flex-grow overflow-y-auto p-8">
                 <div className="bg-brand-mid-green text-white p-6 rounded-lg shadow-lg mb-8">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight animated-heading" aria-label={`Welcome, ${currentUser?.name || 'User'}`}>
                                {/* FIX: Combine children into a single string for the SplitText component */}
                                <SplitText>{`Welcome, ${currentUser?.name || 'User'}`}</SplitText>
                            </h1>
                            <p className="text-lg opacity-80">Here's what's happening today.</p>
                        </div>
                        <button
                            onClick={() => setIsAddWidgetModalOpen(true)}
                            className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 font-semibold py-2 px-4 rounded-md transition-colors"
                        >
                            <PlusIcon />
                            <span>Add Widget</span>
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {columns.map(colNum => (
                        <div key={colNum} className="space-y-8">
                            {allAvailableWidgets
                                .filter(w => w.column === colNum && visibleWidgetIds.includes(w.id))
                                .map(w => renderWidget(w.id))
                            }
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardView;