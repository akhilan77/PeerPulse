'use client';

import { District } from '@/types/district';
import { formatMetric, getGapTheme } from '@/lib/utils';
import { AlertCircle, CheckCircle2, TrendingDown, TrendingUp } from 'lucide-react';

interface GapDeltaBarChartProps {
  district: District;
}

export default function GapDeltaBarChart({ district }: GapDeltaBarChartProps) {
  const dimensions = [
    {
      key: 'availability' as const,
      label: 'Blood Bank Availability',
      gapZ: district.gaps_z.availability,
      rawGap: district.raw_gaps.availability,
      districtVal: district.raw_metrics.availability,
      peerVal: district.peer_means_raw.availability,
      unit: '',
      isPrimary: district.primary_gap === 'Availability',
    },
    {
      key: 'collection' as const,
      label: 'Annual Collection per 100 Pop',
      gapZ: district.gaps_z.collection,
      rawGap: district.raw_gaps.collection,
      districtVal: district.raw_metrics.collection,
      peerVal: district.peer_means_raw.collection,
      unit: '/100',
      isPrimary: district.primary_gap === 'Collection',
    },
    {
      key: 'voluntary' as const,
      label: 'Voluntary Donation %',
      gapZ: district.gaps_z.voluntary,
      rawGap: district.raw_gaps.voluntary,
      districtVal: district.raw_metrics.voluntary,
      peerVal: district.peer_means_raw.voluntary,
      unit: '%',
      isPrimary: district.primary_gap === 'Voluntary Donation',
    },
  ];

  return (
    <div className="space-y-4">
      {dimensions.map((dim) => {
        const isNegative = dim.gapZ < 0;
        // Calculate a visual bar percentage bounded between -100% and +100%
        // Normalized with 2 std deviations
        const barWidthPct = Math.min(100, Math.abs(dim.gapZ / 2) * 100);

        return (
          <div
            key={dim.key}
            className={`p-4 rounded-xl border transition-all ${
              dim.isPrimary
                ? 'bg-slate-900/90 border-rose-500/40 shadow-lg shadow-rose-950/20 ring-1 ring-rose-500/20'
                : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                {dim.isPrimary ? (
                  <span className="p-1 rounded-md bg-rose-500/20 text-rose-400">
                    <AlertCircle className="w-4 h-4" />
                  </span>
                ) : isNegative ? (
                  <span className="p-1 rounded-md bg-slate-800 text-slate-400">
                    <TrendingDown className="w-4 h-4" />
                  </span>
                ) : (
                  <span className="p-1 rounded-md bg-emerald-500/20 text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </span>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-100 text-sm">{dim.label}</span>
                    {dim.isPrimary && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 rounded-full">
                        Primary Gap
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">
                    District: <strong className="text-slate-200">{formatMetric(dim.districtVal, dim.key)}</strong> vs Peer Mean: <strong className="text-slate-300">{formatMetric(dim.peerVal, dim.key)}</strong>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`text-sm font-bold font-mono ${
                    isNegative ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {isNegative ? '' : '+'}{dim.gapZ.toFixed(2)}σ
                </span>
                <span className="text-xs text-slate-400 ml-1.5 font-mono">
                  ({isNegative ? '' : '+'}{dim.rawGap > 0 ? `+${dim.rawGap.toFixed(2)}` : dim.rawGap.toFixed(2)}{dim.unit})
                </span>
              </div>
            </div>

            {/* Split Diverging Delta Bar */}
            <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 flex">
              {/* Center Line marker at 50% */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-600 z-10" />

              {/* Negative side (Left half: 0% to 50%) */}
              <div className="w-1/2 h-full flex justify-end">
                {isNegative && (
                  <div
                    className={`h-full rounded-l-full transition-all duration-500 ${
                      dim.isPrimary ? 'bg-rose-500' : 'bg-rose-400/80'
                    }`}
                    style={{ width: `${barWidthPct}%` }}
                  />
                )}
              </div>

              {/* Positive side (Right half: 50% to 100%) */}
              <div className="w-1/2 h-full flex justify-start">
                {!isNegative && (
                  <div
                    className="h-full bg-emerald-500 rounded-r-full transition-all duration-500"
                    style={{ width: `${barWidthPct}%` }}
                  />
                )}
              </div>
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 mt-1 px-1">
              <span>← Lags Peers (-2σ)</span>
              <span className="text-slate-400">Peer Parity (0)</span>
              <span>Leads Peers (+2σ) →</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
