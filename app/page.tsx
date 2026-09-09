'use client';

import Link from 'next/link';
import { getSummaryStats } from '@/lib/data/districts';
import GapDistributionChart from '@/components/charts/GapDistributionChart';
import StateBreakdownChart from '@/components/charts/StateBreakdownChart';
import TopShortfallsLeaderboard from '@/components/district/TopShortfallsLeaderboard';
import {
  Activity,
  Layers,
  ShieldCheck,
  Search,
  ArrowRight,
  TrendingUp,
  GitCompare,
  Database,
  Sliders,
} from 'lucide-react';

export default function HomePage() {
  const summary = getSummaryStats();

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl glass-card border border-slate-800 p-8 sm:p-10">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/30 mb-4">
            <Activity className="w-3.5 h-3.5 text-teal-400" />
            Empirical Peer-Relative Healthcare Intelligence
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            How does each district perform compared with <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-cyan-300 to-emerald-400">statistically similar peers</span>?
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed">
            PeerPulse AI moves beyond crude national averages by matching each of India&apos;s <strong>615 districts</strong> to its <strong>20 most comparable peer districts</strong>, diagnosing empirical service shortfalls in <em>Availability</em>, <em>Collection</em>, and <em>Voluntary Donation</em>.
          </p>

          {/* Search Trigger & Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-search-modal'));
              }}
              className="flex items-center gap-3 px-5 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-teal-500 to-cyan-500 text-slate-950 font-semibold shadow-lg shadow-teal-500/25 hover:from-teal-400 hover:to-cyan-400 transition-all cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-950" />
              <span>Search District (Ctrl + K)</span>
            </button>

            <Link
              href="/districts"
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all"
            >
              <Layers className="w-4 h-4 text-teal-400" />
              <span>Explore All 615 Districts</span>
            </Link>

            <Link
              href="/methodology"
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              <span>Methodology & Lab</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Usable Districts */}
        <div className="glass-card-interactive p-5 rounded-2xl border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Total Districts</span>
            <Layers className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-black text-white">{summary.total_districts}</div>
          <div className="text-xs text-slate-400">Cleaned & preprocessed from ASAR 2016</div>
        </div>

        {/* States/UTs */}
        <div className="glass-card-interactive p-5 rounded-2xl border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">States & UTs</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white">{summary.total_states}</div>
          <div className="text-xs text-slate-400">Pan-India geographic coverage</div>
        </div>

        {/* Model Configuration */}
        <div className="glass-card-interactive p-5 rounded-2xl border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Frozen Model</span>
            <Sliders className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-black text-white">K = 20</div>
          <div className="text-xs text-slate-400">Euclidean metric on 3 standardized features</div>
        </div>

        {/* Resampling Stability */}
        <div className="glass-card-interactive p-5 rounded-2xl border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Resampling Stability</span>
            <ShieldCheck className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400">
            {summary.validation_stats.resampling_stability.mean_stability}%
          </div>
          <div className="text-xs text-slate-400">300-iteration bootstrap stability</div>
        </div>
      </div>

      {/* Visual Analytics Grid: Gap Distribution & State Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Primary Gap Distribution */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">National Primary Gap Distribution</h2>
              <p className="text-xs text-slate-400">
                Proportion of districts categorized by their strongest peer-relative shortfall.
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 bg-slate-800 text-teal-300 rounded-full border border-slate-700">
              615 Districts
            </span>
          </div>

          <GapDistributionChart
            gapCounts={summary.gap_counts}
            totalDistricts={summary.total_districts}
          />
        </div>

        {/* Right: State-Level Gap Composition */}
        <div className="glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Top States by Gap Breakdown</h2>
              <p className="text-xs text-slate-400">
                Primary gap composition across the 10 largest states by district count.
              </p>
            </div>
            <Link
              href="/districts"
              className="text-xs text-teal-400 hover:text-teal-300 transition-colors"
            >
              View all states →
            </Link>
          </div>

          <StateBreakdownChart states={summary.state_breakdown} />
        </div>
      </div>

      {/* Top Shortfalls Leaderboard */}
      <TopShortfallsLeaderboard topShortfalls={summary.top_shortfalls} />

      {/* Quick Compare Callout banner */}
      <div className="glass-card p-8 rounded-3xl border border-teal-500/30 bg-gradient-to-r from-slate-900 via-slate-900 to-teal-950/30 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
            <GitCompare className="w-4 h-4" />
            Comparative Decision Support
          </div>
          <h3 className="text-2xl font-bold text-white">Compare Multiple Districts Head-to-Head</h3>
          <p className="text-sm text-slate-300 max-w-2xl">
            Examine performance fingerprints, radar overlays, and peer baselines across 2 to 4 districts simultaneously.
          </p>
        </div>
        <Link
          href="/compare?ids=ajmer-rajasthan,sirsa-haryana,jalpaiguri-west-bengal"
          className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 whitespace-nowrap transition-all"
        >
          Try Sample Comparison →
        </Link>
      </div>
    </div>
  );
}
