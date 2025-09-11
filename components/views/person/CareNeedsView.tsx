
import React from 'react';
import { CareNeed } from '../../../types';
import Card from '../../Card';
import { usePersona } from '../../../contexts/PersonaContext';

type CareNeedsViewProps = {
  careNeeds: CareNeed[];
};

const CareNeedsView: React.FC<CareNeedsViewProps> = ({ careNeeds }) => {
  const { t } = usePersona();
  return (
    <Card title={`${t('care')} Needs`} titleClassName="text-solas-dark">
      {careNeeds.length > 0 ? (
        <div className="space-y-4">
          {careNeeds.map((need) => (
            <div key={need.id} className="p-4 bg-gray-50 border rounded-md">
              <h4 className="font-bold text-solas-dark">{need.category}</h4>
              <p className="text-sm text-solas-gray mt-1">{need.detail}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-solas-gray">No specific care needs have been documented for this person.</p>
      )}
    </Card>
  );
};

export default CareNeedsView;
