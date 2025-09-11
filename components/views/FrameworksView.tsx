import React from 'react';
import { CommissioningInfo } from '../../types';
import Card from '../Card';
import { DocumentsIcon, UserIcon } from '../Icons';

type FrameworksViewProps = {
  commissioning: CommissioningInfo;
};

const FrameworksView: React.FC<FrameworksViewProps> = ({ commissioning }) => {
  const cardHoverClass = "hover:shadow-xl hover:-translate-y-0.5";
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left Column: Commissioner and Status */}
      <div className="md:col-span-1 space-y-6">
        <Card title="Lead Commissioner" titleClassName="bg-ivolve-dark-green text-white" className={cardHoverClass}>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400"><UserIcon /></span>
            <div>
              <p className="font-bold text-lg text-solas-dark">{commissioning.commissioner.name}</p>
              <p className="text-sm text-solas-gray">{commissioning.commissioner.role}</p>
              <p className="text-sm text-ivolve-blue mt-1">{commissioning.commissioner.email}</p>
              <p className="text-sm text-solas-gray">{commissioning.commissioner.phone}</p>
            </div>
          </div>
        </Card>
        <Card title="Status" titleClassName="bg-ivolve-dark-green text-white" className={cardHoverClass}>
          <div className="flex items-center">
            <input
              id="written-support"
              type="checkbox"
              className="h-5 w-5 rounded border-gray-300 text-ivolve-blue focus:ring-ivolve-blue"
              checked={commissioning.hasWrittenSupport}
              readOnly
            />
            <label htmlFor="written-support" className="ml-3 text-md font-medium text-app-text-dark">
              Written Support Received
            </label>
          </div>
        </Card>
      </div>
      
      {/* Right Column: Documents */}
      <div className="md:col-span-2">
        <Card title="Framework Documents" titleClassName="bg-ivolve-dark-green text-white" className={cardHoverClass}>
          {commissioning.documents.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {commissioning.documents.map(doc => (
                <li key={doc.id} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400"><DocumentsIcon /></span>
                    <p className="font-medium text-solas-dark">{doc.name}</p>
                  </div>
                  <a href={doc.url} className="px-3 py-1 text-sm bg-ivolve-blue text-white rounded-md hover:bg-opacity-80">
                    View
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-solas-gray text-center py-4">No documents uploaded for this framework.</p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default FrameworksView;