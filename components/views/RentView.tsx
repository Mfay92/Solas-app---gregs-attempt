import React from 'react';
import { RentData } from '../../types';
import Card from '../Card';

type RentViewProps = {
  rentData: RentData;
};

const RentView: React.FC<RentViewProps> = ({ rentData }) => {
  const cardHoverClass = "hover:shadow-xl hover:-translate-y-0.5";
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card title={`Rent Schedule: ${rentData.currentSchedule.year}`} titleClassName="bg-ivolve-dark-green text-white" className={cardHoverClass}>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-ivolve-dark-green uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-ivolve-dark-green uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-right text-sm font-bold text-ivolve-dark-green uppercase tracking-wider">Amount (£)</th>
                  <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-ivolve-dark-green uppercase tracking-wider">Period</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rentData.currentSchedule.lines.map((line, index) => (
                  <tr key={index} className={line.rechargedToIvolve ? 'bg-green-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{line.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{line.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">{line.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{line.period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      <div className="space-y-6">
        <Card title="Void Terms" titleClassName="bg-ivolve-dark-green text-white" className={cardHoverClass}>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm text-gray-700">Initial (Development)</h4>
              <p className="text-sm text-gray-600">{rentData.voidTerms.initial}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-gray-700">Subsequent (Operational)</h4>
              <p className="text-sm text-gray-600">{rentData.voidTerms.subsequent}</p>
            </div>
          </div>
        </Card>
        <Card title="Files" titleClassName="bg-ivolve-dark-green text-white" className={cardHoverClass}>
          <ul className="space-y-2">
            <li><a href={rentData.currentSchedule.documentUrl} className="text-sm text-ivolve-blue hover:underline">Rent Schedule {rentData.currentSchedule.year}</a></li>
            {rentData.previousSchedules.map(schedule => (
              <li key={schedule.year}>
                <a href={schedule.documentUrl} className="text-sm text-ivolve-blue hover:underline">Rent Schedule {schedule.year}</a>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default RentView;