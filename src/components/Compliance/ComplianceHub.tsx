import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, AlertTriangle, XCircle, Wrench, Check,
  Filter, Download, Building2, ChevronRight
} from 'lucide-react';
import { ComplianceStatusIcon } from './ComplianceStatusBadge';
import complianceData from '../../data/compliance-data.json';
import {
  ComplianceRecord,
  ComplianceStatus,
  COMPLIANCE_CATEGORIES,
  getDaysUntilExpiry
} from '../../types/compliance';

type StatusFilter = 'all' | 'issues' | 'compliant';

// Summary card component
const SummaryCard: React.FC<{
  label: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  textColor: string;
  onClick?: () => void;
  isActive?: boolean;
}> = ({ label, value, icon, bgColor, textColor, onClick, isActive }) => (
  <button
    onClick={onClick}
    className={`p-4 rounded-xl border-2 transition-all text-left ${bgColor} ${
      isActive ? 'border-slate-400 shadow-lg scale-[1.02]' : 'border-transparent hover:border-slate-200'
    }`}
  >
    <div className="flex items-center justify-between mb-2">
      <span className={`text-sm font-medium ${textColor}`}>{label}</span>
      <span className={textColor}>{icon}</span>
    </div>
    <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
  </button>
);

// Matrix cell component
const MatrixCell: React.FC<{
  record: ComplianceRecord | undefined;
  onClick?: () => void;
}> = ({ record, onClick }) => {
  if (!record) {
    return (
      <td className="px-2 py-3 text-center">
        <span className="text-slate-300">—</span>
      </td>
    );
  }

  const daysUntil = getDaysUntilExpiry(record.expiryDate);
  const status = record.status as ComplianceStatus;

  return (
    <td className="px-2 py-3 text-center">
      <button
        onClick={onClick}
        className="inline-flex flex-col items-center gap-1 hover:scale-110 transition-transform"
        title={`${record.category.toUpperCase()}: ${record.status}${daysUntil !== null ? ` (${daysUntil} days)` : ''}`}
      >
        <ComplianceStatusIcon status={status} />
        {daysUntil !== null && daysUntil <= 30 && daysUntil >= 0 && (
          <span className="text-[10px] font-medium text-amber-600">{daysUntil}d</span>
        )}
        {daysUntil !== null && daysUntil < 0 && (
          <span className="text-[10px] font-medium text-red-600">{Math.abs(daysUntil)}d</span>
        )}
      </button>
    </td>
  );
};

export const ComplianceHub: React.FC = () => {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get all records as ComplianceRecord[]
  const allRecords = useMemo(() => {
    return complianceData.records as ComplianceRecord[];
  }, []);

  // Calculate summary stats
  const stats = useMemo(() => {
    const compliant = allRecords.filter(r => r.status === 'compliant').length;
    const dueSoon = allRecords.filter(r => r.status === 'due-soon').length;
    const overdue = allRecords.filter(r => r.status === 'overdue').length;
    const remedials = allRecords.filter(r => r.status === 'remedials-required').length;
    const applicable = allRecords.filter(r => r.status !== 'not-applicable' && r.status !== 'no-data').length;

    return {
      total: allRecords.length,
      compliant,
      dueSoon,
      overdue,
      remedials,
      issues: dueSoon + overdue + remedials,
      complianceRate: applicable > 0 ? Math.round((compliant / applicable) * 100) : 100,
    };
  }, [allRecords]);

  // Get unique categories that have data
  const activeCategories = useMemo(() => {
    const cats = new Set(allRecords.map(r => r.category));
    return COMPLIANCE_CATEGORIES.filter(c => cats.has(c.code));
  }, [allRecords]);

  // Filter properties based on status filter
  const filteredProperties = useMemo(() => {
    return complianceData.properties.filter(prop => {
      if (statusFilter === 'all') return true;

      const records = prop.records as ComplianceRecord[];
      if (statusFilter === 'issues') {
        return records.some(r =>
          r.status === 'overdue' ||
          r.status === 'due-soon' ||
          r.status === 'remedials-required'
        );
      }
      if (statusFilter === 'compliant') {
        const applicable = records.filter(r => r.status !== 'not-applicable' && r.status !== 'no-data');
        return applicable.every(r => r.status === 'compliant');
      }
      return true;
    });
  }, [statusFilter]);

  // Get record for a specific property and category
  const getRecord = (propertyId: string, category: string): ComplianceRecord | undefined => {
    return allRecords.find(r => r.propertyId === propertyId && r.category === category);
  };

  // Handle property click - navigate to property profile compliance tab
  const handlePropertyClick = (propertyId: string) => {
    // Navigate to property profile with compliance tab
    navigate(`/properties/${propertyId}?tab=compliance`);
  };

  return (
    <div className="min-h-screen bg-ivolve-paper p-6 page-enter">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-ivolve-mid/10 rounded-lg">
            <ShieldCheck size={24} className="text-ivolve-mid" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Compliance Hub</h1>
            <p className="text-sm text-slate-500">Portfolio-wide compliance overview</p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <SummaryCard
          label="Compliance Rate"
          value={stats.complianceRate}
          icon={<span className="text-lg">%</span>}
          bgColor={stats.complianceRate >= 90 ? 'bg-green-50' : stats.complianceRate >= 70 ? 'bg-amber-50' : 'bg-red-50'}
          textColor={stats.complianceRate >= 90 ? 'text-green-700' : stats.complianceRate >= 70 ? 'text-amber-700' : 'text-red-700'}
        />
        <SummaryCard
          label="Compliant"
          value={stats.compliant}
          icon={<Check size={20} />}
          bgColor="bg-green-50"
          textColor="text-green-700"
          onClick={() => setStatusFilter(statusFilter === 'compliant' ? 'all' : 'compliant')}
          isActive={statusFilter === 'compliant'}
        />
        <SummaryCard
          label="Due Soon"
          value={stats.dueSoon}
          icon={<AlertTriangle size={20} />}
          bgColor="bg-amber-50"
          textColor="text-amber-700"
          onClick={() => setStatusFilter(statusFilter === 'issues' ? 'all' : 'issues')}
          isActive={statusFilter === 'issues'}
        />
        <SummaryCard
          label="Overdue"
          value={stats.overdue}
          icon={<XCircle size={20} />}
          bgColor="bg-red-50"
          textColor="text-red-700"
          onClick={() => setStatusFilter(statusFilter === 'issues' ? 'all' : 'issues')}
          isActive={statusFilter === 'issues'}
        />
        <SummaryCard
          label="Remedials"
          value={stats.remedials}
          icon={<Wrench size={20} />}
          bgColor="bg-orange-50"
          textColor="text-orange-700"
          onClick={() => setStatusFilter(statusFilter === 'issues' ? 'all' : 'issues')}
          isActive={statusFilter === 'issues'}
        />
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <span className="text-sm font-medium text-slate-600">Category:</span>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-ivolve-mid/20"
          >
            <option value="all">All Categories</option>
            {activeCategories.map(cat => (
              <option key={cat.code} value={cat.code}>{cat.shortName}</option>
            ))}
          </select>

          {statusFilter !== 'all' && (
            <button
              onClick={() => setStatusFilter('all')}
              className="text-sm text-ivolve-mid hover:underline"
            >
              Clear filter
            </button>
          )}
        </div>

        <button
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
        >
          <Download size={16} />
          Export
        </button>
      </div>

      {/* Compliance Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-sm font-semibold text-slate-700 sticky left-0 bg-slate-50 z-10 min-w-[200px]">
                  Property
                </th>
                {(selectedCategory === 'all' ? activeCategories : activeCategories.filter(c => c.code === selectedCategory)).map(cat => (
                  <th
                    key={cat.code}
                    className="px-2 py-3 text-xs font-semibold text-slate-600 text-center min-w-[60px]"
                    title={cat.name}
                  >
                    {cat.shortName}
                  </th>
                ))}
                <th className="px-4 py-3 text-sm font-semibold text-slate-700 text-center min-w-[80px]">
                  Score
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProperties.map((property, idx) => {
                const records = property.records as ComplianceRecord[];
                const applicable = records.filter(r => r.status !== 'not-applicable' && r.status !== 'no-data');
                const compliant = applicable.filter(r => r.status === 'compliant').length;
                const score = applicable.length > 0 ? Math.round((compliant / applicable.length) * 100) : 100;

                return (
                  <tr
                    key={property.propertyId}
                    className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                    }`}
                  >
                    <td className="px-4 py-3 sticky left-0 bg-inherit z-10">
                      <button
                        onClick={() => handlePropertyClick(property.propertyId)}
                        className="flex items-center gap-2 text-left group"
                      >
                        <Building2 size={16} className="text-slate-400" />
                        <span className="font-medium text-slate-800 group-hover:text-ivolve-mid transition-colors">
                          {property.propertyName}
                        </span>
                        <ChevronRight size={14} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </td>
                    {(selectedCategory === 'all' ? activeCategories : activeCategories.filter(c => c.code === selectedCategory)).map(cat => (
                      <MatrixCell
                        key={`${property.propertyId}-${cat.code}`}
                        record={getRecord(property.propertyId, cat.code)}
                        onClick={() => handlePropertyClick(property.propertyId)}
                      />
                    ))}
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-bold ${
                        score >= 90 ? 'bg-green-100 text-green-700' :
                        score >= 70 ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {score}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredProperties.length === 0 && (
          <div className="p-12 text-center">
            <ShieldCheck size={48} className="mx-auto text-slate-300 mb-3" />
            <p className="text-lg font-medium text-slate-500">No properties match your filter</p>
            <button
              onClick={() => setStatusFilter('all')}
              className="mt-3 text-sm text-ivolve-mid hover:underline"
            >
              Clear filter
            </button>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-sm text-slate-500">
        <div className="flex items-center gap-2">
          <ComplianceStatusIcon status="compliant" />
          <span>Compliant</span>
        </div>
        <div className="flex items-center gap-2">
          <ComplianceStatusIcon status="due-soon" />
          <span>Due Soon</span>
        </div>
        <div className="flex items-center gap-2">
          <ComplianceStatusIcon status="overdue" />
          <span>Overdue</span>
        </div>
        <div className="flex items-center gap-2">
          <ComplianceStatusIcon status="remedials-required" />
          <span>Remedials</span>
        </div>
        <div className="flex items-center gap-2">
          <ComplianceStatusIcon status="not-applicable" />
          <span>N/A</span>
        </div>
      </div>
    </div>
  );
};

export default ComplianceHub;
