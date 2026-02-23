import React from 'react';
import { Calendar, Building2, Users, CheckCircle, AlertCircle, ChevronDown, ChevronRight, Eye, FileText } from 'lucide-react';
import { RentScheduleDocument, RentLineItem } from '../types';
import { useDocumentViewer } from '../DocumentViewerContext';

interface TwoColumnLayoutProps {
  document: RentScheduleDocument;
}

// Group items for Simple View mode
interface GroupedItem {
  id: string;
  label: string;
  amount: number;
  description?: string;
  easyReadDescription?: string;
  isGrouped?: boolean;
  groupedFrom?: string[];
}

// Group related items together for Simple View
const groupItemsForSimpleView = (items: RentLineItem[]): GroupedItem[] => {
  // Define grouping rules
  const groupRules: Record<string, { label: string; easyReadLabel: string; categories: string[] }> = {
    // Core Rent groupings
    'repairs-all': {
      label: 'Repairs & Maintenance',
      easyReadLabel: 'Fixing Things',
      categories: ['repairs-maintenance'],
    },
    // Service Charge groupings
    'safety-compliance': {
      label: 'Safety & Compliance',
      easyReadLabel: 'Safety Checks',
      categories: ['fire-safety', 'equipment'],
    },
    'cleaning-grounds': {
      label: 'Cleaning & Grounds',
      easyReadLabel: 'Keeping Things Clean',
      categories: ['cleaning', 'gardening', 'pest-control'],
    },
  };

  const grouped: GroupedItem[] = [];
  const usedItems = new Set<string>();

  // First, try to group items
  Object.entries(groupRules).forEach(([groupId, rule]) => {
    const matchingItems = items.filter(
      item => rule.categories.includes(item.category || '') && !usedItems.has(item.id)
    );

    if (matchingItems.length > 1) {
      const totalAmount = matchingItems.reduce((sum, item) => sum + item.amount, 0);
      grouped.push({
        id: `grouped_${groupId}`,
        label: rule.label,
        amount: totalAmount,
        description: `Includes: ${matchingItems.map(i => i.label).join(', ')}`,
        easyReadDescription: rule.easyReadLabel,
        isGrouped: true,
        groupedFrom: matchingItems.map(i => i.label),
      });
      matchingItems.forEach(item => usedItems.add(item.id));
    }
  });

  // Add remaining ungrouped items
  items.forEach(item => {
    if (!usedItems.has(item.id)) {
      grouped.push({
        id: item.id,
        label: item.label,
        amount: item.amount,
        description: item.description,
        easyReadDescription: item.easyReadDescription,
      });
    }
  });

  return grouped;
};

// Simple line item
const LineItem: React.FC<{
  label: string;
  amount: number;
  description?: string;
  showDescription?: boolean;
  isGrouped?: boolean;
}> = ({ label, amount, description, showDescription, isGrouped }) => (
  <div className={`py-2 px-3 hover:bg-gray-50/50 border-b border-gray-100 last:border-0 ${isGrouped ? 'bg-gray-50/30' : ''}`}>
    <div className="flex justify-between items-center">
      <span className="text-sm text-gray-700">
        {label}
        {isGrouped && <span className="ml-1 text-xs text-gray-400">(combined)</span>}
      </span>
      <span className="text-sm font-semibold text-ivolve-mid">£{amount.toFixed(2)}</span>
    </div>
    {showDescription && description && (
      <p className="text-xs text-gray-500 mt-1">{description}</p>
    )}
  </div>
);

// Section with expandable items - now with bold header
const Section: React.FC<{
  id: string;
  title: string;
  items: GroupedItem[];
  total: number;
  variant: 'eligible' | 'ineligible';
}> = ({ id, title, items, total, variant }) => {
  const { state, toggleSection, isEasyRead } = useDocumentViewer();
  const isExpanded = state.expandedSections.has(id);
  const isEligible = variant === 'eligible';

  return (
    <div className="rounded-lg overflow-hidden shadow-sm">
      {/* Bold header with coloured background */}
      <button
        onClick={() => toggleSection(id)}
        className={`w-full flex items-center justify-between px-4 py-3 ${
          isEligible
            ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
            : 'bg-gradient-to-r from-amber-500 to-amber-600'
        } hover:brightness-105 transition-all`}
      >
        <div className="flex items-center gap-2">
          {isEligible ? (
            <CheckCircle size={16} className="text-white/80" />
          ) : (
            <AlertCircle size={16} className="text-white/80" />
          )}
          <span className="font-bold text-white">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">£{total.toFixed(2)}</span>
          <span className="text-white/70">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        </div>
      </button>

      {isExpanded && (
        <div className={`bg-white border-x border-b max-h-52 overflow-y-auto ${
          isEligible ? 'border-emerald-200' : 'border-amber-200'
        }`}>
          {items.map((item) => (
            <LineItem
              key={item.id}
              label={item.label}
              amount={item.amount}
              description={isEasyRead ? item.easyReadDescription : item.description}
              showDescription={isEasyRead}
              isGrouped={item.isGrouped}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Two Column Layout - Refined Version
 * - Toolbar integrated into header
 * - Bold section headers
 * - Grand total tucked under ineligible column
 * - Simple View grouping
 */
const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({ document }) => {
  const { state, setViewMode, isEasyRead } = useDocumentViewer();

  const hbEligibleTotal = document.totals.coreRentWeekly + document.totals.serviceChargesWeekly;

  // Get items - grouped if Simple View is on
  const coreRentItems = isEasyRead
    ? groupItemsForSimpleView(document.coreRent.items)
    : document.coreRent.items;

  const serviceChargeItems = isEasyRead
    ? groupItemsForSimpleView(document.eligibleServiceCharges.items)
    : document.eligibleServiceCharges.items;

  const ineligibleItems = isEasyRead
    ? groupItemsForSimpleView(document.ineligibleServices.items)
    : document.ineligibleServices.items;

  return (
    <div className="space-y-4">
      {/* INTEGRATED HEADER BAR */}
      <div className="bg-gradient-to-r from-ivolve-dark to-ivolve-mid rounded-xl overflow-hidden">
        {/* Top row - View toggle integrated */}
        <div className="flex items-center justify-between px-4 py-2 bg-black/10 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-xs font-medium">View:</span>
            <div className="inline-flex rounded-md bg-white/10 p-0.5">
              <button
                onClick={() => setViewMode('normal')}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all ${
                  state.viewMode === 'normal'
                    ? 'bg-white text-ivolve-dark shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Eye size={12} />
                <span>Standard</span>
              </button>
              <button
                onClick={() => setViewMode('easyRead')}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-all ${
                  state.viewMode === 'easyRead'
                    ? 'bg-white text-ivolve-dark shadow-sm'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <FileText size={12} />
                <span>Simple</span>
              </button>
            </div>
          </div>

          {/* Summary totals in header bar */}
          <div className="flex items-center gap-3 text-white text-xs">
            <span className="flex items-center gap-1">
              <CheckCircle size={12} className="text-emerald-300" />
              <span className="text-white/60">HB:</span>
              <span className="font-bold">£{hbEligibleTotal.toFixed(2)}</span>
            </span>
            <span className="text-white/30">|</span>
            <span className="flex items-center gap-1">
              <AlertCircle size={12} className="text-amber-300" />
              <span className="text-white/60">Bills:</span>
              <span className="font-bold">£{document.totals.ineligibleWeekly.toFixed(2)}</span>
            </span>
            <span className="text-white/30">|</span>
            <span className="font-black text-sm">
              Total: £{document.totals.grossWeeklyRent.toFixed(2)}/wk
            </span>
          </div>
        </div>

        {/* Property Info */}
        <div className="px-4 py-3 text-white">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-lg truncate">{document.header.address}</h2>
              <div className="flex items-center gap-3 mt-1 text-white/70 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar size={12} />
                  {document.financialYear}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={12} />
                  {document.header.occupancyLevel} Units
                </span>
                <span className="flex items-center gap-1">
                  <Building2 size={12} />
                  {document.rpName}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Simple View indicator */}
      {isEasyRead && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 flex items-center gap-2">
          <FileText size={14} className="text-blue-500" />
          <span className="text-xs text-blue-700 font-medium">
            Simple View - Related items are grouped together for easier reading
          </span>
        </div>
      )}

      {/* TWO COLUMN CONTENT */}
      <div className="grid grid-cols-5 gap-4">
        {/* LEFT - HB ELIGIBLE (wider column - 3/5) */}
        <div className="col-span-3 space-y-3">
          {/* Section Title - Bold with background */}
          <div className="bg-emerald-600 rounded-lg px-4 py-2">
            <h3 className="font-bold text-white flex items-center gap-2">
              <CheckCircle size={18} />
              {isEasyRead ? 'What Housing Benefit Covers' : 'Housing Benefit Eligible'}
            </h3>
          </div>

          <Section
            id="coreRent"
            title={isEasyRead ? 'Main Rent' : 'Core Rent'}
            items={coreRentItems}
            total={document.coreRent.subtotal}
            variant="eligible"
          />

          <Section
            id="eligibleServiceCharges"
            title={isEasyRead ? 'Extra Services' : 'Service Charges'}
            items={serviceChargeItems}
            total={document.eligibleServiceCharges.subtotal}
            variant="eligible"
          />

          {/* Eligible Summary */}
          <div className="bg-emerald-100 rounded-lg p-3 border border-emerald-300 flex justify-between items-center">
            <span className="font-bold text-emerald-800">Total HB Eligible</span>
            <span className="font-black text-xl text-emerald-700">£{hbEligibleTotal.toFixed(2)}/wk</span>
          </div>
        </div>

        {/* RIGHT - INELIGIBLE + GRAND TOTAL (narrower column - 2/5) */}
        <div className="col-span-2 space-y-3">
          {/* Section Title - Bold with background */}
          <div className="bg-amber-600 rounded-lg px-4 py-2">
            <h3 className="font-bold text-white flex items-center gap-2">
              <AlertCircle size={18} />
              {isEasyRead ? 'What You Pay Yourself' : 'Your Responsibility'}
            </h3>
          </div>

          <Section
            id="ineligibleServices"
            title={isEasyRead ? 'Personal Bills' : 'Personal Utilities'}
            items={ineligibleItems}
            total={document.ineligibleServices.subtotal}
            variant="ineligible"
          />

          {/* Ineligible Summary */}
          <div className="bg-amber-100 rounded-lg p-3 border border-amber-300">
            <div className="flex justify-between items-center">
              <span className="font-bold text-amber-800">Total Your Bills</span>
              <span className="font-black text-xl text-amber-700">£{document.totals.ineligibleWeekly.toFixed(2)}/wk</span>
            </div>
            <p className="text-xs text-amber-700 mt-2">
              {isEasyRead
                ? 'Pay these directly to your landlord or utility company'
                : 'Not covered by HB - tenant responsibility'}
            </p>
          </div>

          {/* GRAND TOTAL - Tucked in this column */}
          <div className="bg-gradient-to-br from-ivolve-dark to-ivolve-mid rounded-xl p-4 text-white mt-4">
            <h4 className="text-sm text-white/70 font-medium">
              {isEasyRead ? 'Total Each Week' : 'Gross Weekly Rent'}
            </h4>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-black text-3xl">£{document.totals.grossWeeklyRent.toFixed(2)}</span>
              <span className="text-white/60 text-sm">/week</span>
            </div>
            <p className="text-xs text-white/50 mt-2">
              {isEasyRead
                ? 'Everything added together'
                : 'Core rent + services + utilities'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoColumnLayout;
