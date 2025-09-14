import React from 'react';
import { Document } from '../../types';
import Card from '../Card';
import { DocumentsIcon } from '../Icons';

type DocumentsViewProps = {
  documents: Document[];
  isFormer?: boolean;
};

const DocumentsView: React.FC<DocumentsViewProps> = ({ documents, isFormer = false }) => {
  const groupedByYear = documents.reduce((acc, doc) => {
    (acc[doc.year] = acc[doc.year] || []).push(doc);
    return acc;
  }, {} as Record<number, Document[]>);

  const sortedYears = Object.keys(groupedByYear).map(Number).sort((a, b) => b - a);

  const cardTitleClass = isFormer ? 'bg-solas-gray text-white' : 'bg-ivolve-dark-green text-white';

  return (
    <Card title="Documents" titleClassName={cardTitleClass} className="hover:shadow-xl hover:-translate-y-0.5">
      <div className="space-y-6">
        {sortedYears.map(year => (
          <div key={year}>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">{year}</h4>
            <ul className="divide-y divide-gray-200 border rounded-md">
              {groupedByYear[year].map(doc => (
                <li key={doc.id} className="p-3 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400"><DocumentsIcon /></span>
                    <div>
                      <p className="font-medium text-solas-dark">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.type} - {new Date(doc.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <a href={doc.url} className="px-3 py-1 text-sm bg-ivolve-blue text-white rounded-md hover:bg-opacity-80">
                    Open
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default DocumentsView;
