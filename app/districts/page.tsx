'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAllDistricts, getAllStates } from '@/lib/data/districts';
import { District } from '@/types/district';
import { getGapTheme, formatMetric } from '@/lib/utils';
import {
  Search,
  Filter,
  Download,
  GitCompare,
  ArrowUpDown,
  ExternalLink,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';

export default function DistrictExplorerPage() {
  const router = useRouter();
  const allDistricts = getAllDistricts();
  const allStates = getAllStates();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [selectedGap, setSelectedGap] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'state' | 'availability' | 'collection' | 'voluntary' | 'gap_z'>('gap_z');
  const [sortAsc, setSortAsc] = useState(true); // Default true so lowest (most negative gap_z) comes first
  const [selectedForCompare, setSelectedForCompare] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  // Toggle selection for comparison
  const toggleSelectDistrict = (id: string) => {
    setSelectedForCompare((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (prev.length >= 4) {
        alert('You can compare a maximum of 4 districts simultaneously.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(column);
      setSortAsc(column === 'name' || column === 'state' ? true : true);
    }
  };

  // Filtered & Sorted Districts
  const filteredDistricts = useMemo(() => {
    return allDistricts.filter((d) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = d.district_name.toLowerCase().includes(q);
        const matchState = d.state_name.toLowerCase().includes(q);
        if (!matchName && !matchState) return false;
      }

      // State
      if (selectedState !== 'all' && d.state_name !== selectedState) {
        return false;
      }

      // Gap
      if (selectedGap !== 'all' && d.primary_gap !== selectedGap) {
        return false;
      }

      return true;
    });
  }, [allDistricts, searchQuery, selectedState, selectedGap]);

  const sortedDistricts = useMemo(() => {
    return [...filteredDistricts].sort((a, b) => {
      let valA: any = a.district_name;
      let valB: any = b.district_name;

      if (sortBy === 'state') {
        valA = a.state_name;
        valB = b.state_name;
      } else if (sortBy === 'availability') {
        valA = a.raw_metrics.availability;
        valB = b.raw_metrics.availability;
      } else if (sortBy === 'collection') {
        valA = a.raw_metrics.collection;
        valB = b.raw_metrics.collection;
      } else if (sortBy === 'voluntary') {
        valA = a.raw_metrics.voluntary;
        valB = b.raw_metrics.voluntary;
      } else if (sortBy === 'gap_z') {
        valA = a.primary_gap_z;
        valB = b.primary_gap_z;
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredDistricts, sortBy, sortAsc]);

  // Pagination
  const totalPages = Math.ceil(sortedDistricts.length / pageSize) || 1;
  const paginatedDistricts = sortedDistricts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // CSV Export
  const exportCSV = () => {
    const headers = [
      'District ID',
      'District Name',
      'State Name',
      'Availability',
      'Collection /100',
      'Voluntary %',
      'Primary Gap',
      'Primary Gap Z-Score',
      'Peer Mean Availability',
      'Peer Mean Collection',
      'Peer Mean Voluntary',
    ];

    const rows = sortedDistricts.map((d) => [
      d.id,
      `"${d.district_name}"`,
      `"${d.state_name}"`,
      d.raw_metrics.availability,
      d.raw_metrics.collection,
      d.raw_metrics.voluntary,
      `"${d.primary_gap}"`,
      d.primary_gap_z,
      d.peer_means_raw.availability,
      d.peer_means_raw.collection,
      d.peer_means_raw.voluntary,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `peerpulse_districts_${selectedGap}_${selectedState}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCompareTrigger = () => {
    if (selectedForCompare.length < 2) {
      alert('Please select at least 2 districts to compare.');
      return;
    }
    router.push(`/compare?ids=${selectedForCompare.join(',')}`);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider mb-1">
            <Layers className="w-4 h-4" />
            Comprehensive National Dataset
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            District Explorer & Performance Directory
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Explore and filter all 615 districts across India with standardized KNN peer-relative metrics.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-teal-400" />
            Export CSV ({sortedDistricts.length})
          </button>

          {selectedForCompare.length > 0 && (
            <button
              onClick={handleCompareTrigger}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20 transition-all animate-bounce"
            >
              <GitCompare className="w-3.5 h-3.5" />
              Compare ({selectedForCompare.length}) Districts
            </button>
          )}
        </div>
      </div>

      {/* Filter Controls Bar */}
      <div className="glass-card p-4 rounded-2xl border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search district or state..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* State Dropdown */}
          <div className="relative">
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-teal-500 cursor-pointer"
            >
              <option value="all">All States & UTs (35)</option>
              {allStates.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Primary Gap Buttons */}
          <div className="sm:col-span-2 flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { key: 'all', label: 'All Gaps' },
              { key: 'Availability', label: 'Availability', color: 'text-rose-400' },
              { key: 'Collection', label: 'Collection', color: 'text-sky-400' },
              { key: 'Voluntary Donation', label: 'Voluntary %', color: 'text-emerald-400' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setSelectedGap(tab.key);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedGap === tab.key
                    ? 'bg-slate-800 text-white border border-teal-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filter Summary */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
          <div>
            Showing <strong className="text-white">{sortedDistricts.length}</strong> of{' '}
            {allDistricts.length} districts
            {selectedForCompare.length > 0 && (
              <span className="ml-3 text-teal-400 font-semibold">
                • {selectedForCompare.length} selected for comparison
              </span>
            )}
          </div>
          {selectedForCompare.length > 0 && (
            <button
              onClick={() => setSelectedForCompare([])}
              className="text-[11px] text-slate-400 hover:text-slate-200 underline"
            >
              Clear selection
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 w-10 text-center">
                  <span className="sr-only">Compare</span>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('name')}>
                  <div className="flex items-center gap-1">
                    District
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('state')}>
                  <div className="flex items-center gap-1">
                    State / UT
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-white text-right" onClick={() => handleSort('availability')}>
                  <div className="flex items-center justify-end gap-1">
                    Availability
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-white text-right" onClick={() => handleSort('collection')}>
                  <div className="flex items-center justify-end gap-1">
                    Collection /100
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 cursor-pointer hover:text-white text-right" onClick={() => handleSort('voluntary')}>
                  <div className="flex items-center justify-end gap-1">
                    Voluntary %
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Primary Gap</th>
                <th className="py-3 px-4 cursor-pointer hover:text-white text-right" onClick={() => handleSort('gap_z')}>
                  <div className="flex items-center justify-end gap-1">
                    Relative Shortfall
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginatedDistricts.map((d) => {
                const gapTheme = getGapTheme(d.primary_gap);
                const isSelected = selectedForCompare.includes(d.id);
                return (
                  <tr
                    key={d.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isSelected ? 'bg-teal-500/10' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleSelectDistrict(d.id)}
                        className="p-1 text-slate-400 hover:text-teal-400 transition-colors"
                        title={isSelected ? 'Deselect district' : 'Select for comparison'}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-teal-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-600" />
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-100">
                      <Link
                        href={`/districts/${d.id}`}
                        className="hover:text-teal-300 transition-colors"
                      >
                        {d.district_name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{d.state_name}</td>
                    <td className="py-3 px-4 font-mono text-right text-slate-200">
                      {d.raw_metrics.availability.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-mono text-right text-slate-200">
                      {d.raw_metrics.collection.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-mono text-right text-slate-200">
                      {d.raw_metrics.voluntary.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${gapTheme.pill}`}>
                        {d.primary_gap}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-right text-rose-400">
                      {d.primary_gap_z.toFixed(2)}σ
                    </td>
                    <td className="py-3 px-4 text-center">
                      <Link
                        href={`/districts/${d.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-teal-500/20 hover:text-teal-300 text-slate-300 transition-colors text-[11px]"
                      >
                        Profile <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, sortedDistricts.length)} of{' '}
            {sortedDistricts.length} districts
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-slate-300 font-medium">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
