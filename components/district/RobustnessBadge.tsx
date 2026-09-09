import { RobustnessMetrics } from '@/types/district';
import { ShieldCheck, ShieldAlert, CheckCircle2, AlertCircle } from 'lucide-react';

interface RobustnessBadgeProps {
  robustness: RobustnessMetrics;
  primaryGap: string;
}

export default function RobustnessBadge({ robustness, primaryGap }: RobustnessBadgeProps) {
  const testsPassed = [
    robustness.is_stable_k10,
    robustness.is_stable_k30,
    robustness.is_stable_mahalanobis,
  ].filter(Boolean).length;

  let stabilityRating = 'High Robustness';
  let ratingColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  if (testsPassed === 2) {
    stabilityRating = 'Moderate Robustness';
    ratingColor = 'text-teal-400 bg-teal-500/10 border-teal-500/30';
  } else if (testsPassed <= 1) {
    stabilityRating = 'Sensitive to Hyperparameters';
    ratingColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  }

  return (
    <div className="glass-card rounded-2xl border border-slate-800 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-teal-400" />
          <h3 className="text-sm font-bold text-white">Model Stability & Robustness</h3>
        </div>
        <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${ratingColor}`}>
          {stabilityRating}
        </span>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        Sensitivity analysis evaluating whether this district&apos;s primary gap ({primaryGap}) remains consistent under altered neighborhood sizes and distance formulations.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        {/* K=10 */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">K = 10 Peers</span>
            {robustness.is_stable_k10 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400" />
            )}
          </div>
          <div className="text-slate-200 font-semibold text-[11px]">
            {robustness.is_stable_k10 ? 'Invariant' : `Shifts to ${robustness.k10_primary_gap}`}
          </div>
        </div>

        {/* K=30 */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">K = 30 Peers</span>
            {robustness.is_stable_k30 ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400" />
            )}
          </div>
          <div className="text-slate-200 font-semibold text-[11px]">
            {robustness.is_stable_k30 ? 'Invariant' : `Shifts to ${robustness.k30_primary_gap}`}
          </div>
        </div>

        {/* Mahalanobis */}
        <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Mahalanobis</span>
            {robustness.is_stable_mahalanobis ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400" />
            )}
          </div>
          <div className="text-slate-200 font-semibold text-[11px]">
            {robustness.is_stable_mahalanobis ? 'Invariant' : `Shifts to ${robustness.mahalanobis_primary_gap}`}
          </div>
        </div>
      </div>
    </div>
  );
}
