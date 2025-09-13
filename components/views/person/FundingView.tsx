

import React from 'react';
import { FundingDetails } from '../../../types';
import Card from '../../Card';

type FundingViewProps = {
  funding: FundingDetails[];
};

const FundingView: React.FC<FundingViewProps> = ({ funding }) => {
  return (
     <div className="space-y-6">
        {funding.map((fund, index) => (
             <Card key={index} title={`Funding Source ${index + 1}`} titleClassName="text-solas-dark">
                <div className="space-y-4">
                    <div>
                    <h4 className="font-semibold text-sm text-gray-700">Funding Source</h4>
                    <p className="text-md text-gray-900">{fund.source}</p>
                    </div>
                    <div>
                    <h4 className="font-semibold text-sm text-gray-700">Weekly Amount</h4>
                    <p className="text-md text-gray-900">£{fund.weeklyAmount.toFixed(2)}</p>
                    </div>
                    <div>
                    <h4 className="font-semibold text-sm text-gray-700">Details</h4>
                    <p className="text-md text-gray-900">{fund.details || 'No additional details provided.'}</p>
                    </div>
                </div>
            </Card>
        ))}
         {funding.length === 0 && (
            <Card title="Funding Details" titleClassName="text-solas-dark">
                <p className="text-solas-gray">No funding details have been documented.</p>
            </Card>
        )}
     </div>
  );
};

export default FundingView;
