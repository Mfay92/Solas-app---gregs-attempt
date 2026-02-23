import React from 'react';
import { Calendar, Building2, Users, CheckCircle, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { RentScheduleDocument } from '../types';
import { useDocumentViewer } from '../DocumentViewerContext';

interface ThreeColumnLayoutProps {
  document: RentScheduleDocument;
}

// Compact line item for dense display
const CompactLineItem: React.FC<{
  label: string;
  amount: number;
  description?: string;
  showDescription?: boolean;
}> = ({ label, amount, description, showDescription }) => (
  <div className="py-1.5 px-2 hover:bg-gray-50 rounded transition-colors">
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-700">{label}</span>
      <span className="text-sm font-semibold text-gray-900">£{amount.toFixed(2)}</span>
    </div>
    {showDescription && description && (
      <p className="text-xs text-gray-500 mt-0.5 italic">{description}</p>
    )}
  </div>
);

// Collapsible section for the columns
const CollapsibleSection: React.FC<{
  id: string;
  title: string;
  subtitle?: string;
  items: Array<{ id: string; label: string; amount: number; description?: string; easyReadDescription?: string }>;
  total: number;
  color: 'green' | 'teal' | 'amber';
  icon: React.ReactNode;
}> = ({ id, title, subtitle, items, total, color, icon }) => {
  const { state, toggleSection, isEasyRead } = useDocumentViewer();
  const isExpanded = state.expandedSections.has(id);

  const colorClasses = {
    green: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      text: 'text-emerald-700',
      icon: 'text-emerald-500',
    },
    teal: {
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      text: 'text-teal-700',
      icon: 'text-teal-500',
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      text: 'text-amber-700',
      icon: 'text-amber-500',
    },
  };

  const colors = colorClasses[color];

  return (
    <div className={`rounded-lg border ${colors.border} overflow-hidden`}>
      <button
        onClick={() => toggleSection(id)}
        className={`w-full flex items-center justify-between px-3 py-2 ${colors.bg} hover:brightness-95 transition-all`}
      >
        <div className="flex items-center gap-2">
          <span className={colors.icon}>{icon}</span>
          <div className="text-left">
            <h4 className={`font-bold text-sm ${colors.text}`}>{title}</h4>
            {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`font-bold ${colors.text}`}>£{total.toFixed(2)}</span>
          <span className="text-gray-400">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className="bg-white divide-y divide-gray-50 max-h-64 overflow-y-auto">
          {items.map((item) => (
            <CompactLineItem
              key={item.id}
              label={item.label}
              amount={item.amount}
              description={isEasyRead ? item.easyReadDescription : item.description}
              showDescription={isEasyRead}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Three Column Layout
 *
 * | Property Info Sidebar | HB Eligible (Core + Services) | Ineligible |
 * |       Fixed width     |         Scrollable            | Scrollable |
 */
const ThreeColumnLayout: React.FC<ThreeColumnLayoutProps> = ({ document }) => {
  const { isEasyRead } = useDocumentViewer();

  // Combine core rent and eligible services for "HB Eligible" column
  const hbEligibleTotal = document.totals.coreRentWeekly + document.totals.serviceChargesWeekly;

  return (
    <div className="flex gap-4 min-h-[500px]">
      {/* LEFT SIDEBAR - Property Info */}
      <div className="w-64 flex-shrink-0 space-y-4">
        {/* Property Card */}
        <div className="bg-gradient-to-br from-ivolve-dark to-ivolve-mid rounded-xl p-4 text-white">
          <h2 className="font-bold text-lg leading-tight">{document.header.address}</h2>
          <p className="text-white/70 text-sm mt-2">{document.rpName}</p>

          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar size={14} className="text-white/60" />
              <span>{document.financialYear}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Users size={14} className="text-white/60" />
              <span>{document.header.occupancyLevel} Units</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Building2 size={14} className="text-white/60" />
              <span className="text-xs">{document.header.localAuthority}</span>
            </div>
          </div>
        </div>

        {/* Totals Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
          <h3 className="font-bold text-gray-700 text-sm">Weekly Summary</h3>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">HB Eligible</span>
              <span className="font-bold text-emerald-600">£{hbEligibleTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Your Bills</span>
              <span className="font-bold text-amber-600">£{document.totals.ineligibleWeekly.toFixed(2)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Total</span>
                <span className="font-black text-xl text-ivolve-dark">£{document.totals.grossWeeklyRent.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* HB Explanation */}
        <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
          <div className="flex items-start gap-2">
            <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-emerald-700">
              {isEasyRead
                ? 'Housing Benefit can help pay for the green items'
                : 'HB/UC may cover eligible charges shown in green'}
            </p>
          </div>
        </div>
      </div>

      {/* MIDDLE COLUMN - HB Eligible */}
      <div className="flex-1 space-y-3 overflow-y-auto">
        <div className="sticky top-0 bg-ivolve-paper py-2 z-10">
          <h3 className="font-bold text-emerald-700 flex items-center gap-2">
            <CheckCircle size={16} />
            {isEasyRead ? 'What Housing Benefit Covers' : 'HB Eligible Charges'}
            <span className="ml-auto text-lg">£{hbEligibleTotal.toFixed(2)}/wk</span>
          </h3>
        </div>

        <CollapsibleSection
          id="coreRent"
          title={isEasyRead ? document.coreRent.easyReadTitle || 'Main Rent' : 'Core Rent'}
          subtitle={isEasyRead ? 'The main costs for your home' : 'Housing Benefit eligible rent'}
          items={document.coreRent.items}
          total={document.coreRent.subtotal}
          color="green"
          icon={<CheckCircle size={14} />}
        />

        <CollapsibleSection
          id="eligibleServiceCharges"
          title={isEasyRead ? document.eligibleServiceCharges.easyReadTitle || 'Extra Services' : 'Service Charges'}
          subtitle={isEasyRead ? 'Shared area services' : 'Communal services covered by HB'}
          items={document.eligibleServiceCharges.items}
          total={document.eligibleServiceCharges.subtotal}
          color="teal"
          icon={<CheckCircle size={14} />}
        />
      </div>

      {/* RIGHT COLUMN - Ineligible */}
      <div className="w-72 flex-shrink-0 space-y-3 overflow-y-auto">
        <div className="sticky top-0 bg-ivolve-paper py-2 z-10">
          <h3 className="font-bold text-amber-700 flex items-center gap-2">
            <AlertCircle size={16} />
            {isEasyRead ? 'What You Pay Yourself' : 'Ineligible Charges'}
            <span className="ml-auto text-lg">£{document.totals.ineligibleWeekly.toFixed(2)}/wk</span>
          </h3>
        </div>

        <CollapsibleSection
          id="ineligibleServices"
          title={isEasyRead ? 'Your Personal Bills' : 'Personal Utilities'}
          subtitle={isEasyRead ? 'You need to pay these yourself' : 'Not covered by Housing Benefit'}
          items={document.ineligibleServices.items}
          total={document.ineligibleServices.subtotal}
          color="amber"
          icon={<AlertCircle size={14} />}
        />

        {/* Payment Info Card */}
        <div className="bg-amber-50 rounded-lg p-3 border border-amber-100">
          <p className="text-xs text-amber-800">
            {isEasyRead
              ? 'You pay these bills directly to your landlord or utility company. They are not covered by Housing Benefit.'
              : 'Ineligible charges are tenant responsibility and should be paid directly to the landlord or relevant provider.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThreeColumnLayout;
