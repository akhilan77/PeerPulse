import { getSummaryStats } from '@/lib/data/districts';
import {
  BookOpen,
  Sliders,
  ShieldCheck,
  Cpu,
  Database,
  Info,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';

export default function MethodologyPage() {
  const summary = getSummaryStats();
  const val = summary.validation_stats;

  return (
    <div className="space-y-10 pb-16 max-w-5xl mx-auto">
      {/* Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/30">
          <BookOpen className="w-3.5 h-3.5 text-teal-400" />
          Rigorous Analytical Foundations
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Methodology, Model Architecture & Validation
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
          Full documentation of the PeerPulse AI data pipeline, KNN peer matching algorithm, stability telemetry, and empirical validation.
        </p>
      </div>

      {/* 1. Core Model Pipeline */}
      <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Cpu className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">1. Analytical Pipeline Architecture</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-teal-400 font-bold uppercase">Step 01</span>
            <h3 className="font-bold text-white text-sm">Preprocessing & Standardization</h3>
            <p className="text-slate-400 leading-relaxed">
              Missing values across 616 district records are audited (1 row excluded due to missing feature vector &rarr; 615 usable districts). Each feature is standardized with z-score scaling:
            </p>
            <div className="p-2 bg-slate-950 rounded-lg text-center font-mono text-teal-300 text-xs">
              z = (x - &mu;) / &sigma;
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Step 02</span>
            <h3 className="font-bold text-white text-sm">Frozen KNN Peer Matching (K=20)</h3>
            <p className="text-slate-400 leading-relaxed">
              For every district $i$, its 20 nearest neighbors are discovered in the 3D standardized feature space using Euclidean distance, strictly excluding the district itself.
            </p>
            <div className="p-2 bg-slate-950 rounded-lg text-center font-mono text-cyan-300 text-xs">
              d(u,v) = &radic;&sum;(u_k - v_k)&sup2;
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">Step 03</span>
            <h3 className="font-bold text-white text-sm">Gap Detection & Primary Signal</h3>
            <p className="text-slate-400 leading-relaxed">
              Relative gap is calculated against the 20-peer mean vector. The dimension with the most severe relative shortfall (most negative $z$-score) is identified.
            </p>
            <div className="p-2 bg-slate-950 rounded-lg text-center font-mono text-emerald-300 text-xs">
              Gap = X_i - &mu;_(Peers(i))
            </div>
          </div>
        </div>
      </div>

      {/* 2. The 3 Frozen Features */}
      <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Database className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">2. The Three Frozen Evaluation Dimensions</h2>
        </div>

        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <h3 className="font-bold text-white text-sm">Blood Bank Availability (`bb_availaibility`)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Structural indicator of blood-banking facility coverage and access density relative to district population.
              </p>
            </div>
            <div className="text-right text-xs font-mono text-slate-300 bg-slate-950 px-3 py-2 rounded-xl shrink-0">
              Mean: {summary.national_stats.availability.mean.toFixed(2)} • &sigma;: {summary.national_stats.availability.std.toFixed(2)}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <h3 className="font-bold text-white text-sm">Annual Collection (`district_annual_per100`)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Volume of blood units collected annually normalized per 100 population in the district.
              </p>
            </div>
            <div className="text-right text-xs font-mono text-slate-300 bg-slate-950 px-3 py-2 rounded-xl shrink-0">
              Mean: {summary.national_stats.collection.mean.toFixed(2)} • &sigma;: {summary.national_stats.collection.std.toFixed(2)}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <h3 className="font-bold text-white text-sm">Voluntary Donation % (`percentage_voluntary_district`)</h3>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Proportion of non-replacement, voluntary donations, reflecting public health engagement and safe blood stewardship.
              </p>
            </div>
            <div className="text-right text-xs font-mono text-slate-300 bg-slate-950 px-3 py-2 rounded-xl shrink-0">
              Mean: {summary.national_stats.voluntary.mean.toFixed(1)}% • &sigma;: {summary.national_stats.voluntary.std.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* 3. Validation & Stability Telemetry */}
      <div className="glass-card p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-white">3. Model Validation & Robustness Telemetry</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Resampling Stability */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Bootstrap Resampling Stability
            </div>
            <div className="text-3xl font-black text-emerald-400">
              {val.resampling_stability.mean_stability}%
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Mean gap-type distribution agreement across 300 bootstrap resampling iterations with replacement (Min: {val.resampling_stability.min_stability}%, Max: {val.resampling_stability.max_stability}%).
            </p>
          </div>

          {/* K Sensitivity */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              K-Sensitivity Agreement
            </div>
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">K=10 vs K=20:</span>
                <span className="font-mono font-bold text-teal-400">{val.k_sensitivity.k10_vs_k20}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">K=30 vs K=20:</span>
                <span className="font-mono font-bold text-teal-400">{val.k_sensitivity.k30_vs_k20}%</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Confirming that K=20 serves as a stable, representative baseline for peer neighborhood definitions.
            </p>
          </div>

          {/* Distance Sensitivity */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Distance Metric Sensitivity
            </div>
            <div className="text-3xl font-black text-cyan-400">
              {val.distance_sensitivity.euclidean_vs_mahalanobis}%
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Agreement between Euclidean distance and covariance-adjusted Mahalanobis distance metric.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Limitations & Non-Causality Disclaimers */}
      <div className="p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-amber-500/5 backdrop-blur-sm space-y-4">
        <div className="flex items-center gap-2.5 text-amber-400">
          <AlertTriangle className="w-5 h-5" />
          <h2 className="text-base font-bold text-amber-300">Scientific Scope & Limitations</h2>
        </div>

        <ul className="space-y-2 text-xs sm:text-sm text-slate-300 leading-relaxed list-disc list-inside">
          <li><strong>Dataset Year:</strong> Analysis is grounded in the ASAR/NACO 2016 cross-sectional blood-banking survey.</li>
          <li><strong>Non-Causality:</strong> Peer-relative gap signals show empirical deviations from similar districts but do <em>not</em> prove causality or structural root causes.</li>
          <li><strong>Decision Support:</strong> Gaps highlight priority dimensions for targeted public health investigation, not automated policy mandates.</li>
          <li><strong>Hyperparameter Choice:</strong> K=20 is the selected stable configuration, evaluated through sensitivity analyses.</li>
        </ul>
      </div>
    </div>
  );
}
