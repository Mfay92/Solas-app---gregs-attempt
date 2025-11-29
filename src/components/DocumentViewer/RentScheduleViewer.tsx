import React from 'react';
import { Calendar, Building2, Users } from 'lucide-react';
import { useDocumentViewer } from './DocumentViewerContext';
import { RentScheduleViewerProps } from './types';
import DocumentSection from './components/DocumentSection';
import { GrandTotalCard } from './components/SummaryCard';

const RentScheduleViewer: React.FC<RentScheduleViewerProps> = ({ document }) => {
  const { state, isEasyRead } = useDocumentViewer();

  // Filter sections based on showFilter state
  const shouldShowSection = (sectionType: 'coreRent' | 'eligibleServiceCharges' | 'ineligibleServices') => {
    if (state.showFilter === 'all') return true;
    if (state.showFilter === 'core') return sectionType === 'coreRent';
    if (state.showFilter === 'bills') return sectionType === 'ineligibleServices';
    return true;
  };

  return (
    <div className="space-y-4">
      {/* Hero Banner Header - Green background like property page */}
      <div className="bg-gradient-to-r from-ivolve-dark to-ivolve-mid rounded-xl p-5 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Left: Key Property Info */}
          <div className="space-y-2">
            {/* Address - Most Prominent */}
            <h2 className="text-xl md:text-2xl font-black tracking-tight">
              {document.header.address}
            </h2>

            {/* Financial Year & Units - Secondary but still prominent */}
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-white/20 backdrop-blur-sm">
                <Calendar size={14} className="mr-1.5" />
                {document.financialYear}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-bold bg-white/20 backdrop-blur-sm">
                <Users size={14} className="mr-1.5" />
                {document.header.occupancyLevel} Units
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-400/30">
                v{document.version}
              </span>
            </div>
          </div>

          {/* Right: RP & Local Authority */}
          <div className="text-right space-y-1">
            <p className="font-semibold text-white/90">{document.rpName}</p>
            <div className="flex items-center justify-end text-white/70 text-sm">
              <Building2 size={14} className="mr-1.5" />
              {document.header.localAuthority}
            </div>
          </div>
        </div>
      </div>

      {/* Centralised Summary Totals */}
      <div className="flex justify-center">
        <div className="grid grid-cols-3 gap-3 max-w-xl w-full">
          <div className="text-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-500 block">Core Rent</span>
            <span className="text-lg font-black text-ivolve-dark">
              £{document.totals.coreRentWeekly.toFixed(2)}
            </span>
            <span className="text-xs text-gray-400">/week</span>
          </div>
          <div className="text-center p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-500 block">Services</span>
            <span className="text-lg font-black text-ivolve-teal">
              £{document.totals.serviceChargesWeekly.toFixed(2)}
            </span>
            <span className="text-xs text-gray-400">/week</span>
          </div>
          <div className="text-center p-3 bg-gradient-to-br from-ivolve-mid/10 to-ivolve-teal/10 rounded-xl border border-ivolve-mid/20 shadow-sm">
            <span className="text-xs text-ivolve-dark/70 block">Total</span>
            <span className="text-lg font-black text-ivolve-mid">
              £{document.totals.grossWeeklyRent.toFixed(2)}
            </span>
            <span className="text-xs text-gray-400">/week</span>
          </div>
        </div>
      </div>

      {/* Rent Sections - More compact spacing */}
      <div className="space-y-3">
        {shouldShowSection('coreRent') && (
          <DocumentSection section={document.coreRent} />
        )}

        {shouldShowSection('eligibleServiceCharges') && (
          <DocumentSection section={document.eligibleServiceCharges} />
        )}

        {shouldShowSection('ineligibleServices') && (
          <DocumentSection section={document.ineligibleServices} />
        )}
      </div>

      {/* Grand Total Card */}
      <GrandTotalCard
        grossWeeklyRent={document.totals.grossWeeklyRent}
        eligibleForHB={document.totals.eligibleForHB}
        ineligibleForHB={document.totals.ineligibleForHB}
      />

      {/* HB Explanation Footer - More compact */}
      <div className="bg-ivolve-paper rounded-lg p-3 border border-ivolve-mid/10">
        <h4 className="font-bold text-ivolve-dark text-sm">
          {isEasyRead ? 'What does Housing Benefit pay for?' : 'Housing Benefit Eligibility'}
        </h4>
        <p className="text-gray-600 mt-1 text-xs leading-relaxed">
          {isEasyRead
            ? 'Housing Benefit can help pay for your main rent and some services like cleaning and gardening. But it does not cover personal bills like your gas, electric, and water - you will need to pay these yourself.'
            : 'Core rent and eligible service charges may be covered by Housing Benefit. Ineligible services (personal utilities) are the tenant\'s responsibility and are not covered by HB.'}
        </p>
      </div>
    </div>
  );
};

export default RentScheduleViewer;
