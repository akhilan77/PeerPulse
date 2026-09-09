import { District } from '@/types/district';
import { getGapTheme, formatMetric } from '@/lib/utils';
import { AlertTriangle, Info, HelpCircle } from 'lucide-react';

interface PrimaryGapCalloutProps {
  district: District;
}

export default function PrimaryGapCallout({ district }: PrimaryGapCalloutProps) {
  const theme = getGapTheme(district.primary_gap);
  
  let keyMetricName = "Availability";
  let dimKey: "availability" | "collection" | "voluntary" = "availability";
  if (district.primary_gap === "Collection") {
    keyMetricName = "Annual Collection /100 Pop";
    dimKey = "collection";
  } else if (district.primary_gap === "Voluntary Donation") {
    keyMetricName = "Voluntary Donation %";
    dimKey = "voluntary";
  }

  const distVal = district.raw_metrics[dimKey];
  const peerVal = district.peer_means_raw[dimKey];
  const zScore = district.gaps_z[dimKey];

  return (
    <div className={`p-6 rounded-2xl border ${theme.border} ${theme.bg} backdrop-blur-sm relative overflow-hidden`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${theme.pill}`}>
              {district.primary_gap}
            </span>
            <span className="text-xs text-slate-400">
              Primary Relative Gap Signal
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Strongest Relative Shortfall in {keyMetricName}
          </h2>
          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            Comparing <strong className="text-white">{district.district_name}</strong> against its <strong>20 most comparable peer districts</strong> across India, performance shows the greatest negative deviation in {keyMetricName.toLowerCase()} (
            <span className="text-rose-400 font-mono font-semibold">{zScore.toFixed(2)}σ</span> from peer average).
          </p>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 shrink-0 text-center md:text-right">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
            Peer Deviation Score
          </div>
          <div className={`text-2xl font-black font-mono mt-0.5 ${zScore < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {zScore.toFixed(2)}σ
          </div>
          <div className="text-xs text-slate-400 mt-1">
            District: {formatMetric(distVal, dimKey)} <br />
            Peer Mean: {formatMetric(peerVal, dimKey)}
          </div>
        </div>
      </div>

      {/* Non-causality & analytical signal note */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-start gap-2 text-xs text-slate-400">
        <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
        <span>
          <strong>Methodological note:</strong> This primary gap is an empirical peer-relative signal identifying where the district deviates most from its 20 nearest statistical peers. It does not prove causal roots or substitute for local clinical evaluations.
        </span>
      </div>
    </div>
  );
}
