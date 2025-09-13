

import React from 'react';
import { TenancyDetails } from '../../../types';
import Card from '../../Card';
import { usePersona } from '../../../contexts/PersonaContext';
import DocumentsView from '../DocumentsView';

type TenancyViewProps = {
  tenancy: TenancyDetails;
};

const TenancyView: React.FC<TenancyViewProps> = ({ tenancy }) => {
  const { t } = usePersona();
  return (
    <div className="space-y-6">
        <Card title={`${t('tenancy')} Details`} titleClassName="text-solas-dark">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 className="font-semibold text-sm text-gray-700">Agreement Type</h4>
                    <p className="text-md text-gray-900">{tenancy.type}</p>
                </div>
                <div>
                    <h4 className="font-semibold text-sm text-gray-700">Start Date</h4>
                    <p className="text-md text-gray-900">{new Date(tenancy.startDate).toLocaleDateString('en-GB')}</p>
                </div>
                 <div>
                    <h4 className="font-semibold text-sm text-gray-700">End Date</h4>
                    <p className="text-md text-gray-900">{tenancy.endDate ? new Date(tenancy.endDate).toLocaleDateString('en-GB') : 'N/A'}</p>
                </div>
                 <div>
                    <h4 className="font-semibold text-sm text-gray-700">Notice Period</h4>
                    <p className="text-md text-gray-900">{tenancy.noticePeriod || 'N/A'}</p>
                </div>
            </div>
        </Card>
        {tenancy.documents.length > 0 && (
            <DocumentsView documents={tenancy.documents} />
        )}
    </div>
  );
};

export default TenancyView;
