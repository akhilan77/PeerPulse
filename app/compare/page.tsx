'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAllDistricts, getDistrictById } from '@/lib/data/districts';
import { District } from '@/types/district';
import { getGapTheme, formatMetric } from '@/lib/utils';
import MultiDistrictRadarChart from '@/components/charts/MultiDistrictRadarChart';
import {
  GitCompare,
  Plus,
  X,
  Search,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  Download,
  Layers,
  ArrowRight,
} from 'lucide-react';

const DISTRICT_COLORS = [
  'border-teal-500 text-teal-400 bg-teal-500/10',
  'border-amber-500 text-amber-400 bg-amber-500/10',
  'border-purple-500 text-purple-400 bg-purple-500/10',
  'border-pink-500 text-pink-400 bg-pink-500/10',
];

function CompareContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const allDistricts = getAllDistricts();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [addSearchQuery, setAddSearchQuery] = useState('');
  const [isAddDropdownOpen, setIsAddDropdownOpen] = useState(false);

  // Initialize selected districts from URL params
  useEffect(() => {
    const idsParam = searchParams.get('ids');
    if (idsParam) {
      const parsedIds = idsParam
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      setSelectedIds(parsedIds.slice(0, 4));
    } else {
      // Default initial comparison
      setSelectedIds(['ajmer-rajasthan', 'sirsa-haryana', 'jalpaiguri-west-bengal']);
    }
  }, [searchParams]);

  const selectedDistricts: District[] = useMemo(() => {
    return selectedIds
      .map((id) => getDistrictById(id))
      .filter((d): d is District => d !== undefined);
  }, [selectedIds]);

  const handleRemove = (id: string) => {
    const nextIds = selectedIds.filter((item) => item !== id);
    setSelectedIds(nextIds);
    router.replace(`/compare?ids=${nextIds.join(',')}`);
  };

  const handleAdd = (district: District) => {
    if (selectedIds.includes(district.id)) return;
    if (selectedIds.length >= 4) {
      alert('Maximum 4 districts can be compared simultaneously.');
      return;
    }
    const nextIds = [...selectedIds, district.id];
    setSelectedIds(nextIds);
    setAddSearchQuery('');
    setIsAddDropdownOpen(false);
    router.replace(`/compare?ids=${nextIds.join(',')}`);
  };

  // Peer overlap analysis: Find common peers among selected districts
  const peerOverlap = useMemo(() => {
    if (selectedDistricts.length < 2) return [];

    const peerSets = selectedDistricts.map(
      (d) => new Set(d.peers.map((p) => p.id))
    );

    // Find intersection of all peer sets or pairwise
    const firstSet = peerSets[0];
    const shared = Array.from(firstSet).filter((peerId) =>
      peerSets.every((set) => set.has(peerId))
    );

    return shared.map((id) => getDistrictById(id)).filter(Boolean);
  }, [selectedDistricts]);

  const filteredAddDistricts = useMemo(() => {
    if (!addSearchQuery.trim()) return allDistricts.slice(0, 6);
    const q = addSearchQuery.toLowerCase();
    return allDistricts
      .filter(
        (d) =>
          !selectedIds.includes(d.id) &&
          (d.district_name.toLowerCase().includes(q) ||
            d.state_name.toLowerCase().includes(q))
      )
      .slice(0, 8);
  }, [allDistricts, addSearchQuery, selectedIds]);

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-teal-400 uppercase tracking-wider mb-1">
            <GitCompare className="w-4 h-4" />
            Cross-District Benchmarking Matrix
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Multi-District Comparative Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Side-by-side evaluation of up to 4 districts across service dimensions and peer shortfalls.
          </p>
        </div>

        {/* Add District Dropdown Trigger */}
        <div className="relative">
          {selectedDistricts.length < 4 && (
            <div className="relative">
              <button
                onClick={() => setIsAddDropdownOpen(!isAddDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 shadow-lg shadow-teal-500/20 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Add District to Compare
              </button>

              {isAddDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3 z-30 space-y-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Type district name..."
                      value={addSearchQuery}
                      onChange={(e) => setAddSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-teal-500"
                    />
                  </div>

                  <div className="max-h-60 overflow-y-auto divide-y divide-slate-800/40">
                    {filteredAddDistricts.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => handleAdd(d)}
                        className="p-2 hover:bg-slate-800/60 rounded-lg cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-semibold text-white">
                            {d.district_name}
                          </span>
                          <span className="text-slate-400 ml-1">
                            • {d.state_name}
                          </span>
                        </div>
                        <span className="text-[10px] text-teal-400 font-mono">
                          {d.primary_gap}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Selected Districts Badges */}
      <div className="flex flex-wrap items-center gap-3">
        {selectedDistricts.map((d, idx) => (
          <div
            key={d.id}
            className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-semibold ${
              DISTRICT_COLORS[idx % DISTRICT_COLORS.length]
            }`}
          >
            <span>
              {d.district_name} ({d.state_name})
            </span>
            <button
              onClick={() => handleRemove(d.id)}
              className="p-0.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"
              title="Remove district"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {selectedDistricts.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-3xl border border-slate-800 space-y-3">
          <p className="text-slate-400 text-sm">No districts selected for comparison.</p>
          <button
            onClick={() => setSelectedIds(['ajmer-rajasthan', 'sirsa-haryana', 'jalpaiguri-west-bengal'])}
            className="px-4 py-2 bg-teal-500 text-slate-950 font-bold text-xs rounded-xl"
          >
            Load Example Comparison
          </button>
        </div>
      ) : (
        <>
          {/* Visual Radar Overlay */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">
                  Overlaid Performance Radar Footprints
                </h2>
                <p className="text-xs text-slate-400">
                  Normalized multidimensional footprints across Availability, Collection, and Voluntary Donation.
                </p>
              </div>
            </div>

            <MultiDistrictRadarChart districts={selectedDistricts} />
          </div>

          {/* Side-by-Side Metric Comparison Table */}
          <div className="glass-card rounded-3xl border border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-800 bg-slate-950/40">
              <h2 className="text-base font-bold text-white">Side-by-Side Metric Matrix</h2>
              <p className="text-xs text-slate-400">
                Detailed comparison of raw metrics, peer group baselines, and primary shortfall signals.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/70 text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4 w-48">Metric / Dimension</th>
                    {selectedDistricts.map((d, idx) => (
                      <th
                        key={d.id}
                        className="py-3.5 px-4 text-center font-bold text-slate-100"
                      >
                        <Link
                          href={`/districts/${d.id}`}
                          className="hover:text-teal-300 inline-flex items-center gap-1"
                        >
                          {d.district_name}
                          <ExternalLink className="w-3 h-3 text-slate-500" />
                        </Link>
                        <div className="text-[10px] text-slate-400 font-normal">
                          {d.state_name}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/60">
                  {/* Primary Gap */}
                  <tr className="bg-slate-950/30">
                    <td className="py-3.5 px-4 font-bold text-slate-200">
                      Primary Relative Gap
                    </td>
                    {selectedDistricts.map((d) => {
                      const theme = getGapTheme(d.primary_gap);
                      return (
                        <td key={d.id} className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 text-xs font-bold rounded-full border ${theme.pill}`}
                          >
                            {d.primary_gap}
                          </span>
                        </td>
                      );
                    })}
                  </tr>

                  {/* Shortfall Score */}
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-slate-300">
                      Primary Gap Z-Score
                    </td>
                    {selectedDistricts.map((d) => (
                      <td
                        key={d.id}
                        className="py-3.5 px-4 text-center font-mono font-bold text-rose-400"
                      >
                        {d.primary_gap_z.toFixed(2)}σ
                      </td>
                    ))}
                  </tr>

                  {/* Availability */}
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-slate-300">
                      Blood Bank Availability
                      <div className="text-[10px] text-slate-400">Raw Value / Peer Mean</div>
                    </td>
                    {selectedDistricts.map((d) => (
                      <td key={d.id} className="py-3.5 px-4 text-center font-mono">
                        <span className="font-bold text-white">
                          {d.raw_metrics.availability.toFixed(2)}
                        </span>
                        <span className="text-slate-400 ml-1.5">
                          (peer: {d.peer_means_raw.availability.toFixed(2)})
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Collection */}
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-slate-300">
                      Annual Collection /100
                      <div className="text-[10px] text-slate-400">Raw Value / Peer Mean</div>
                    </td>
                    {selectedDistricts.map((d) => (
                      <td key={d.id} className="py-3.5 px-4 text-center font-mono">
                        <span className="font-bold text-white">
                          {d.raw_metrics.collection.toFixed(2)}
                        </span>
                        <span className="text-slate-400 ml-1.5">
                          (peer: {d.peer_means_raw.collection.toFixed(2)})
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Voluntary % */}
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-slate-300">
                      Voluntary Donation %
                      <div className="text-[10px] text-slate-400">Raw Value / Peer Mean</div>
                    </td>
                    {selectedDistricts.map((d) => (
                      <td key={d.id} className="py-3.5 px-4 text-center font-mono">
                        <span className="font-bold text-white">
                          {d.raw_metrics.voluntary.toFixed(1)}%
                        </span>
                        <span className="text-slate-400 ml-1.5">
                          (peer: {d.peer_means_raw.voluntary.toFixed(1)}%)
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Robustness */}
                  <tr>
                    <td className="py-3.5 px-4 font-medium text-slate-300">
                      K-Sensitivity Robustness
                      <div className="text-[10px] text-slate-400">K=10 / K=30 stability</div>
                    </td>
                    {selectedDistricts.map((d) => (
                      <td key={d.id} className="py-3.5 px-4 text-center">
                        {d.robustness.is_stable_k10 && d.robustness.is_stable_k30 ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5" /> High
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                            <AlertCircle className="w-3.5 h-3.5" /> Sensitive
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Peer Overlap Analysis */}
          <div className="glass-card p-6 rounded-3xl border border-slate-800 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-teal-400" />
              Statistical Peer Overlap Analysis
            </h3>
            <p className="text-xs text-slate-400">
              Examining if the compared districts share common neighbors in their 20-peer groups.
            </p>

            {peerOverlap.length > 0 ? (
              <div className="flex flex-wrap gap-2 pt-2">
                {peerOverlap.map((p) => (
                  <Link
                    key={p!.id}
                    href={`/districts/${p!.id}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-medium text-teal-300 hover:border-teal-500 transition-colors"
                  >
                    {p!.district_name} ({p!.state_name})
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400">
                No mutual 20-peer overlap identified across all {selectedDistricts.length} selected districts. Each district occupies a distinct neighborhood in the 3D standardized feature space.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-400">Loading comparison...</div>}>
      <CompareContent />
    </Suspense>
  );
}
