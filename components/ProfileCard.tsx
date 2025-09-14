import React from 'react';
import { IvolveStaff } from '../types';
import { EmailIcon, MessageIcon, ExternalLinkIcon, PhoneIcon, DECORATIVE_ICON_MAP, MaintenanceIcon, UserIcon } from './Icons';
import { getDepartmentStyles } from './ContactCard';
import { IvolveCareAndSupportLogo } from './IvolveLogos';

type ProfileCardProps = {
  person: IvolveStaff;
  manager: IvolveStaff | null;
  directReports: IvolveStaff[];
};

const MiniProfile: React.FC<{person: IvolveStaff}> = ({ person }) => (
    <div className="bg-gray-50 p-3 rounded-md border flex items-center space-x-3 hover:bg-gray-100 transition-colors">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 flex-shrink-0">
            <UserIcon />
        </div>
        <div>
            <p className="font-medium text-sm text-solas-dark">{person.name}</p>
            <p className="text-xs text-solas-gray">{person.role}</p>
        </div>
    </div>
);


const ProfileCard: React.FC<ProfileCardProps> = ({ person, manager, directReports }) => {
    const departmentStyles = getDepartmentStyles(person.team);
    const isPropertyTeam = person.team === 'Property Team';

    const repairEmailLink = `mailto:${person.email}?subject=New%20Repair%20Request&body=Hi%20${person.name.split(' ')[0]}%2C%0A%0AI'd%20like%20to%20report%20a%20new%20repair.%0A%0AProperty%20ID%2FAddress%3A%20%5BPlease%20fill%20in%5D%0AUnit%3A%20%5BPlease%20fill%20in%5D%0AIssue%3A%20%5BPlease%20describe%20the%20issue%5D%0A%0AThanks%2C`;

    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
            {/* Header Section */}
            <div className="p-6 flex flex-col items-center text-center relative">
                 <div className="absolute top-0 left-0 right-0 h-24" style={{ backgroundColor: 'var(--app-sidebar)' }}></div>
                 <div className="absolute top-4 right-4 w-48 text-white/90">
                    <IvolveCareAndSupportLogo />
                 </div>
                 <div className="relative mt-8">
                    <div 
                        className={`w-32 h-32 rounded-full border-4 shadow-lg ring-4 ring-white ${departmentStyles.border} bg-gray-200 flex items-center justify-center text-gray-400`}
                    >
                        <UserIcon />
                    </div>
                    {person.personalizationIcons && person.personalizationIcons.length > 0 && (
                        <div className="absolute -bottom-2 -right-2 flex space-x-1">
                            {person.personalizationIcons.slice(0, 3).map(icon => {
                                const IconComponent = DECORATIVE_ICON_MAP[icon.name];
                                return IconComponent ? (
                                    <div key={icon.id} className="w-8 h-8 p-1.5 bg-white rounded-full shadow border" style={{ color: icon.color }}>
                                        <IconComponent />
                                    </div>
                                ) : null;
                            })}
                        </div>
                    )}
                 </div>
                <h2 className="mt-4 text-2xl font-bold text-solas-dark">{person.name}</h2>
                <p className="text-md text-solas-gray max-w-xs">{person.role}</p>
                <div className={`mt-2 px-4 py-1 text-sm font-semibold rounded-full shadow-sm ${departmentStyles.bg} ${departmentStyles.text}`}>
                    {person.team}
                </div>
            </div>

            {/* Contact Actions */}
            <div className="pb-4 flex justify-center space-x-4 border-b mx-6">
                 <a href={`mailto:${person.email}`} className="p-3 bg-gray-100 border rounded-full text-solas-gray hover:bg-ivolve-blue hover:text-white transition-colors" title="Send Email"><EmailIcon /></a>
                 <a href={`msteams:/l/chat/0/0?users=${person.email}`} className="p-3 bg-gray-100 border rounded-full text-solas-gray hover:bg-ivolve-blue hover:text-white transition-colors" title="Send Teams Message"><MessageIcon /></a>
                 <button className="p-3 bg-gray-100 border rounded-full text-gray-300 cursor-not-allowed" title="Open Connect Profile (coming soon)" disabled><ExternalLinkIcon /></button>
            </div>
            
             <div className="p-6 space-y-6">
                {isPropertyTeam && (
                    <div>
                         <h4 className="font-semibold text-solas-dark mb-3 text-sm uppercase tracking-wider">Quick Actions</h4>
                         <a 
                            href={repairEmailLink}
                            className="w-full flex items-center justify-center space-x-2 bg-ivolve-dark-green text-white font-semibold py-2.5 px-4 rounded-md transition-colors hover:bg-opacity-90"
                        >
                            <MaintenanceIcon />
                            <span>Raise a Repair</span>
                        </a>
                    </div>
                )}


                {/* Contact Info */}
                 <div>
                    <h4 className="font-semibold text-solas-dark mb-3 text-sm uppercase tracking-wider">Contact Information</h4>
                     <div className="space-y-2">
                        <div className="flex items-center text-sm">
                            <EmailIcon />
                            <span className="ml-3 text-ivolve-blue">{person.email}</span>
                        </div>
                         <div className="flex items-center text-sm">
                            <PhoneIcon />
                            <span className="ml-3 text-solas-gray">{person.phone}</span>
                        </div>
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <h4 className="font-semibold text-solas-dark mb-3 text-sm uppercase tracking-wider">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                         {person.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded-full">{tag}</span>
                        ))}
                    </div>
                </div>

                {/* Hierarchy */}
                {manager && (
                     <div>
                        <h4 className="font-semibold text-solas-dark mb-2 text-sm uppercase tracking-wider">Reports to</h4>
                        <MiniProfile person={manager} />
                    </div>
                )}
               
                {directReports.length > 0 && (
                     <div>
                        <h4 className="font-semibold text-solas-dark mb-2 text-sm uppercase tracking-wider">Direct Reports</h4>
                        <div className="space-y-2">
                            {directReports.map(report => (
                                <MiniProfile key={report.id} person={report} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfileCard;