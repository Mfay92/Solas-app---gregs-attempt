
import React from 'react';
import Card from '../../Card';
import { FundingDetails } from '../../../types';

// This is a temporary placeholder. It will be replaced by the standalone FundingView.
// For now, this just illustrates the tab structure.
type FinanceViewProps = {
    funding: FundingDetails[];
}

const FinanceView: React.FC<FinanceViewProps> = ({ funding }) => {
  return (
    <Card title="Finance & Benefits" titleClassName="text-solas-dark">
      <p className="text-solas-gray">
        This section is under construction. It will contain details about all funding sources, benefits claims (e.g., PIP, ESA), and information about financial appointees or deputies.
      </p>
    </Card>
  );
};

export default FinanceView;
