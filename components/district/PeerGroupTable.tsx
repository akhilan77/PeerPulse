'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PeerInfo, District } from '@/types/district';
import { Search, ExternalLink, ArrowUpDown } from 'lucide-react';

interface PeerGroupTableProps {
  district: District;
}

export default function PeerGroupTable({ district }: PeerGroupTableProps) {
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState<'rank' | 'distance' | 'availability' | 'collection' | 'voluntary'>('rank');
  const [sortAsc, setSortAsc] = useState(true);

  const peers = district.peers;

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(column);
      setSortAsc(true);
    }
  };

  const filteredPeers = peers.filter((p) =>
    p.district_name.toLowerCase().includes(filter.toLowerCase()) ||
    p.state_name.toLowerCase().includes(filter.toLowerCase())
  );

  const sortedPeers = [...filteredPeers].sort((a, b) => {
    let valA = a.rank;
    let valB = b.rank;

    if (sortBy === 'distance') {
      valA = a.distance;
      valB = b.distance;
    } else if (sortBy === 'availability') {
      valA = a.raw_metrics.availability;
      valB = b.raw_metrics.availability;
    } else if (sortBy === 'collection') {
      valA = a.raw_metrics.collection;
      valB = b.raw_metrics.collection;
    } else if (sortBy === 'voluntary') {
      valA = a.raw_metrics.voluntary;
      valB = b.raw_metrics.voluntary;
    }

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  return (
    <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden">
      {/* Header bar */}
      <div className="p-5 border-b border-slate-800 bg-slate-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            20 Nearest Statistical Peer Districts
            <span className="px-2 py-0.5 text-xs bg-slate-800 text-teal-400 rounded-full border border-slate-700">
              K = 20 Euclidean
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Districts determined to have the most similar multidimensional blood-banking baseline.
          </p>
        </div>

        {/* Filter */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Filter peer districts..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-teal-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/60 text-[11px] text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('rank')}>
                <div className="flex items-center gap-1">
                  Rank
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-4">Peer District</th>
              <th className="py-3 px-4">State</th>
              <th className="py-3 px-4 cursor-pointer hover:text-white" onClick={() => handleSort('distance')}>
                <div className="flex items-center gap-1">
                  Euclidean Dist
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
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {sortedPeers.map((peer) => (
              <tr key={peer.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-teal-400">
                  #{peer.rank}
                </td>
                <td className="py-3 px-4 font-semibold text-slate-100">
                  <Link href={`/districts/${peer.id}`} className="hover:text-teal-300 transition-colors">
                    {peer.district_name}
                  </Link>
                </td>
                <td className="py-3 px-4 text-slate-400">
                  {peer.state_name}
                </td>
                <td className="py-3 px-4 font-mono text-slate-400">
                  {peer.distance.toFixed(3)}
                </td>
                <td className="py-3 px-4 font-mono text-right text-slate-200">
                  {peer.raw_metrics.availability.toFixed(2)}
                </td>
                <td className="py-3 px-4 font-mono text-right text-slate-200">
                  {peer.raw_metrics.collection.toFixed(2)}
                </td>
                <td className="py-3 px-4 font-mono text-right text-slate-200">
                  {peer.raw_metrics.voluntary.toFixed(1)}%
                </td>
                <td className="py-3 px-4 text-center">
                  <Link
                    href={`/districts/${peer.id}`}
                    className="inline-flex items-center justify-center p-1.5 rounded-md bg-slate-800 hover:bg-teal-500/20 hover:text-teal-300 text-slate-400 transition-colors"
                    title={`View profile for ${peer.district_name}`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
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
