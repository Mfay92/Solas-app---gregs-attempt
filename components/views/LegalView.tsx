
import React, { useState } from 'react';
import { LegalAgreement, Clause } from '../../types';
import Card from '../Card';

type ClauseViewMode = 'Original' | 'Plain' | 'Extra-plain';

const ClauseViewer: React.FC<{ clause: Clause }> = ({ clause }) => {
  const [viewMode, setViewMode] = useState<ClauseViewMode>('Plain');

  const getClauseText = () => {
    switch (viewMode) {
      case 'Original':
        return clause.originalText;
      case 'Plain':
        return clause.plainText;
      case 'Extra-plain':
        return clause.extraPlainText;
    }
  };

  return (
    <div className="p-4 border-t">
      <h5 className="font-semibold text-gray-800">{clause.topic}</h5>
      <div className="my-2 space-x-2">
        {(['Original', 'Plain', 'Extra-plain'] as ClauseViewMode[]).map(mode => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-2 py-1 text-xs rounded-md ${viewMode === mode ? 'bg-ivolve-blue text-white' : 'bg-gray-200'}`}
          >
            {mode}
          </button>
        ))}
      </div>
      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md border">{getClauseText()}</p>
    </div>
  );
};

type LegalViewProps = {
  agreements: LegalAgreement[];
};

const LegalView: React.FC<LegalViewProps> = ({ agreements }) => {
  return (
    <div className="space-y-6">
      {agreements.map(agreement => (
        <Card 
            key={agreement.id} 
            title={`${agreement.type}: ${agreement.title}`} 
            className="overflow-hidden hover:shadow-xl hover:-translate-y-0.5" 
            bodyClassName="p-0"
            titleClassName="bg-ivolve-dark-green text-white"
        >
            <div className="px-6 pb-4 pt-6">
                <p className="text-sm text-gray-500">Dated: {new Date(agreement.date).toLocaleDateString()}</p>
                <a href={agreement.documentUrl} className="text-sm text-ivolve-blue hover:underline">View Original Document</a>
            </div>
          <div className="divide-y">
            {agreement.clauses.map(clause => (
              <ClauseViewer key={clause.id} clause={clause} />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default LegalView;
