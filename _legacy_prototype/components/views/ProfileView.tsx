import React, { useState } from 'react';
import { IvolveStaff } from '../../types';
import Card from '../Card';
import ProfileCard from '../ProfileCard';
import CardEditorModal from '../CardEditorModal';
import ProfileEditorModal from '../ProfileEditorModal';
import { EditIcon } from '../Icons';

type ProfileViewProps = {
  user: IvolveStaff | null;
  allStaff: IvolveStaff[];
};

const ProfileView: React.FC<ProfileViewProps> = ({ user, allStaff }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isCardEditorOpen, setIsCardEditorOpen] = useState(false);
  const [isProfileEditorOpen, setIsProfileEditorOpen] = useState(false);

  if (!user) {
    return <div className="p-8">Loading profile...</div>;
  }

  const manager = allStaff.find(s => s.id === user.managerId) || null;
  const directReports = allStaff.filter(s => s.managerId === user.id);

  return (
    <div className="p-8">
      {isCardEditorOpen && (
        <CardEditorModal 
          user={user}
          onClose={() => setIsCardEditorOpen(false)}
        />
      )}
      {isProfileEditorOpen && (
        <ProfileEditorModal
            user={user}
            onClose={() => setIsProfileEditorOpen(false)}
        />
      )}
      <header className="bg-ivolve-mid-green text-white p-4 shadow-md rounded-lg mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => setIsCardEditorOpen(true)}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 font-semibold py-2 px-4 rounded-md transition-colors"
            >
              <EditIcon />
              <span>Edit my card</span>
            </button>
            <button
              onClick={() => setIsProfileEditorOpen(true)}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 font-semibold py-2 px-4 rounded-md transition-colors"
            >
              <EditIcon />
              <span>Edit my profile</span>
            </button>
          </div>
        </div>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card Preview */}
        <div className="lg:col-span-1">
           <h2 className="text-xl font-bold text-app-text-dark mb-4">My Card Preview</h2>
           <ProfileCard 
              person={user}
              manager={manager}
              directReports={directReports}
           />
        </div>

        {/* Right Column: Account Details */}
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-app-text-dark mb-4">Account Details</h2>
          <Card>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-app-text-gray">Full Name</label>
                <input type="text" value={user.name} disabled className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-app-text-gray">Email Address</label>
                <input type="email" value={user.email} disabled className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-app-text-gray">Role</label>
                <input type="text" value={user.role} disabled className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-app-text-gray">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} value="••••••••••" disabled className="mt-1 block w-full bg-gray-100 border-gray-300 rounded-md shadow-sm" />
                  <button onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 text-gray-500">
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
              <div className="pt-4">
                <button className="w-full sm:w-auto bg-ivolve-mid-green text-white font-bold py-2 px-6 rounded hover:bg-opacity-90">
                  Change Password
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;