'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TopShortfallItem } from '@/types/district';
import { ArrowRight, AlertTriangle, ChevronRight } from 'lucide-react';

interface TopShortfallsLeaderboardProps {
  topShortfalls: {
    availability: TopShortfallItem[];
    collection: TopShortfallItem[];
    voluntary: TopShortfallItem[];
  };
}

export default function TopShortfallsLeaderboard({ topShortfalls }: TopShortfallsLeaderboardProps) {
  const [activeTab, setActiveTab] = useState<'availability' | 'collection' | 'voluntary'>('availability');

  const tabs = [
    { key: 'availability' as const, label: 'Availability Shortfalls', color: 'text-rose-400', border: 'border-rose-500' },
    { key: 'collection' as const, label: 'Collection Shortfalls', color: 'text-sky-400', border: 'border-sky-500' },
    { key: 'voluntary' as const, label: 'Voluntary Donation Shortfalls', color: 'text-emerald-400', border: 'border-emerald-500' },
  ];

  const currentList = topShortfalls[activeTab] || [];

  return (
    <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
      {/* Tab Header */}
      <div className="border-b border-slate-800 bg-slate-950/40 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-base font-bold text-white">Top Peer-Relative Service Shortfalls</h3>
            <p className="text-xs text-slate-400">
              Districts with the largest negative deviation from their respective 20-neighbor peer baselines.
            </p>
          </div>
          <Link
            href="/districts"
            className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 font-medium transition-colors"
          >
            Explore all 615 districts <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Tab buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === t.key
                  ? `bg-slate-800 text-white border ${t.border} shadow-sm`
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Shortfalls List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/60 text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-2.5 px-4">#</th>
              <th className="py-2.5 px-4">District</th>
              <th className="py-2.5 px-4">State</th>
              <th className="py-2.5 px-4 text-right">District Value</th>
              <th className="py-2.5 px-4 text-right">Peer Baseline</th>
              <th className="py-2.5 px-4 text-right">Peer Shortfall (z-score)</th>
              <th className="py-2.5 px-4 text-center">Profile</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {currentList.slice(0, 10).map((item, idx) => (
              <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="py-2.5 px-4 font-mono font-bold text-slate-400">
                  {idx + 1}
                </td>
                <td className="py-2.5 px-4 font-semibold text-slate-100">
                  <Link href={`/districts/${item.id}`} className="hover:text-teal-300 transition-colors">
                    {item.district_name}
                  </Link>
                </td>
                <td className="py-2.5 px-4 text-slate-400">
                  {item.state_name}
                </td>
                <td className="py-2.5 px-4 font-mono text-right text-slate-200">
                  {activeTab === 'voluntary' ? `${item.raw_val.toFixed(1)}%` : item.raw_val.toFixed(2)}
                </td>
                <td className="py-2.5 px-4 font-mono text-right text-slate-300">
                  {activeTab === 'voluntary' ? `${item.peer_mean.toFixed(1)}%` : item.peer_mean.toFixed(2)}
                </td>
                <td className="py-2.5 px-4 font-mono font-bold text-right text-rose-400">
                  {item.gap_z.toFixed(2)}σ
                </td>
                <td className="py-2.5 px-4 text-center">
                  <Link
                    href={`/districts/${item.id}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-teal-500/20 hover:text-teal-300 text-slate-300 transition-colors text-[11px]"
                  >
                    View <ChevronRight className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
