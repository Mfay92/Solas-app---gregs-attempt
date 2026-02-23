import React, { useState, useMemo } from 'react';
import {
  Zap, Plug, Flame, Bell, DoorOpen, AlertTriangle, Thermometer,
  Droplets, ArrowUpDown, Leaf, CloudLightning, FileText, Calendar,
  ChevronRight, Filter, Eye
} from 'lucide-react';
import { ComplianceStatusBadge } from './ComplianceStatusBadge';
import {
  ComplianceRecord,
  getCategoryInfo,
  getDaysUntilExpiry
} from '../../types/compliance';

// Icon mapping for categories
const categoryIcons: Record<string, React.ReactNode> = {
  eicr: <Zap size={20} />,
  pat: <Plug size={20} />,
  fra: <Flame size={20} />,
  ffe: <Flame size={20} />,
  fa_el: <Bell size={20} />,
  fire_door: <DoorOpen size={20} />,
  asbestos: <AlertTriangle size={20} />,
  heating_hw: <Thermometer size={20} />,
  gas_safe: <Flame size={20} />,
  lra: <Droplets size={20} />,
  water_sample: <Droplets size={20} />,
  tmv: <Droplets size={20} />,
  lift: <ArrowUpDown size={20} />,
  lift_loler: <ArrowUpDown size={20} />,
  epc: <Leaf size={20} />,
  lightning: <CloudLightning size={20} />,
  sprinkler: <Droplets size={20} />,
  dry_riser: <Flame size={20} />,
};

interface PropertyComplianceTabProps {
  propertyId: string;
  propertyName: string;
  records: ComplianceRecord[];
  onViewDocument?: (doc: { fileName: string; filePath: string }) => void;
  onViewRemedials?: (record: ComplianceRecord) => void;
}

type FilterStatus = 'all' | 'issues' | 'compliant';

export const PropertyComplianceTab: React.FC<PropertyComplianceTabProps> = ({
  propertyId: _propertyId,
  propertyName: _propertyName,
  records,
  onViewDocument,
  onViewRemedials,
}) => {
  // Note: propertyId and propertyName available for future use
  void _propertyId;
  void _propertyName;
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Calculate summary stats
  const stats = useMemo(() => {
    const compliant = records.filter(r => r.status === 'compliant').length;
    const dueSoon = records.filter(r => r.status === 'due-soon').length;
    const overdue = records.filter(r => r.status === 'overdue').length;
    const remedials = records.filter(r => r.status === 'remedials-required').length;
    const notApplicable = records.filter(r => r.status === 'not-applicable').length;
    const applicable = records.length - notApplicable;

    return {
      compliant,
      dueSoon,
      overdue,
      remedials,
      notApplicable,
      applicable,
      issues: dueSoon + overdue + remedials,
      complianceRate: applicable > 0 ? Math.round((compliant / applicable) * 100) : 100,
    };
  }, [records]);

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      if (record.status === 'not-applicable') return false;
      if (filterStatus === 'all') return true;
      if (filterStatus === 'issues') {
        return ['due-soon', 'overdue', 'remedials-required'].includes(record.status);
      }
      if (filterStatus === 'compliant') {
        return record.status === 'compliant';
      }
      return true;
    });
  }, [records, filterStatus]);

  // Format date for display
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Not set';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-500">Compliance Rate</span>
            <div className={`text-2xl font-bold ${
              stats.complianceRate >= 90 ? 'text-green-600' :
              stats.complianceRate >= 70 ? 'text-amber-600' : 'text-red-600'
            }`}>
              {stats.complianceRate}%
            </div>
          </div>
          <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                stats.complianceRate >= 90 ? 'bg-green-500' :
                stats.complianceRate >= 70 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${stats.complianceRate}%` }}
            />
          </div>
        </div>

        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <div className="text-sm font-medium text-green-700">Compliant</div>
          <div className="text-2xl font-bold text-green-800">{stats.compliant}</div>
        </div>

        <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
          <div className="text-sm font-medium text-amber-700">Due Soon</div>
          <div className="text-2xl font-bold text-amber-800">{stats.dueSoon}</div>
        </div>

        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <div className="text-sm font-medium text-red-700">Issues</div>
          <div className="text-2xl font-bold text-red-800">{stats.overdue + stats.remedials}</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2">
        <Filter size={16} className="text-slate-400" />
        <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              filterStatus === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({filteredRecords.length})
          </button>
          <button
            onClick={() => setFilterStatus('issues')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              filterStatus === 'issues'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Issues ({stats.issues})
          </button>
          <button
            onClick={() => setFilterStatus('compliant')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              filterStatus === 'compliant'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Compliant ({stats.compliant})
          </button>
        </div>
      </div>

      {/* Compliance Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRecords.map((record) => {
          const categoryInfo = getCategoryInfo(record.category);
          const daysUntil = getDaysUntilExpiry(record.expiryDate);
          const isExpanded = expandedCard === record.id;

          return (
            <div
              key={record.id}
              className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                record.status === 'overdue' ? 'border-red-200 bg-red-50/30' :
                record.status === 'due-soon' ? 'border-amber-200 bg-amber-50/30' :
                record.status === 'remedials-required' ? 'border-orange-200 bg-orange-50/30' :
                'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }`}
            >
              {/* Card Header */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => setExpandedCard(isExpanded ? null : record.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      record.status === 'compliant' ? 'bg-green-100 text-green-600' :
                      record.status === 'overdue' ? 'bg-red-100 text-red-600' :
                      record.status === 'due-soon' ? 'bg-amber-100 text-amber-600' :
                      record.status === 'remedials-required' ? 'bg-orange-100 text-orange-600' :
                      'bg-slate-100 text-slate-500'
                    }`}>
                      {categoryIcons[record.category] || <FileText size={20} />}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {categoryInfo?.shortName || record.category.toUpperCase()}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {categoryInfo?.name || record.category}
                      </p>
                    </div>
                  </div>
                  <ComplianceStatusBadge status={record.status} size="sm" />
                </div>

                {/* Quick Info */}
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <Calendar size={14} />
                    <span>{formatDate(record.nextDueDate)}</span>
                  </div>
                  {daysUntil !== null && daysUntil <= 30 && daysUntil >= 0 && (
                    <span className="text-amber-600 font-medium">
                      {daysUntil === 0 ? 'Due today' : `${daysUntil} days`}
                    </span>
                  )}
                  {daysUntil !== null && daysUntil < 0 && (
                    <span className="text-red-600 font-medium">
                      {Math.abs(daysUntil)} days overdue
                    </span>
                  )}
                </div>

                {/* Expand indicator */}
                <div className="flex items-center justify-center mt-2">
                  <ChevronRight
                    size={16}
                    className={`text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  />
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-slate-100 pt-3 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-slate-500">Frequency</span>
                      <p className="font-medium">{record.frequencyMonths ? `${record.frequencyMonths} months` : 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-slate-500">Last Updated</span>
                      <p className="font-medium">{formatDate(record.lastUpdated)}</p>
                    </div>
                  </div>

                  {record.notes && (
                    <div className="text-sm">
                      <span className="text-slate-500">Notes</span>
                      <p className="font-medium text-slate-700">{record.notes}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {record.documents.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDocument?.(record.documents[0]);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-ivolve-mid hover:bg-ivolve-mid/10 rounded-lg transition-colors"
                      >
                        <Eye size={14} />
                        View Document
                      </button>
                    )}
                    {record.remedialActions.length > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewRemedials?.(record);
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                      >
                        <AlertTriangle size={14} />
                        {record.remedialActions.length} Remedials
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredRecords.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={24} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-700 mb-1">No records found</h3>
          <p className="text-slate-500">
            {filterStatus === 'issues'
              ? 'Great news! No compliance issues for this property.'
              : 'No compliance records match your filter.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertyComplianceTab;
