import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getAllDistricts, getDistrictById } from '@/lib/data/districts';
import PrimaryGapCallout from '@/components/district/PrimaryGapCallout';
import DistrictRadarChart from '@/components/charts/DistrictRadarChart';
import GapDeltaBarChart from '@/components/charts/GapDeltaBarChart';
import PeerGroupTable from '@/components/district/PeerGroupTable';
import RobustnessBadge from '@/components/district/RobustnessBadge';
import {
  MapPin,
  GitCompare,
  ArrowLeft,
  Share2,
  Printer,
  Activity,
  Layers,
  BarChart3,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';

import type { Metadata } from 'next';

interface DistrictProfileProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: DistrictProfileProps): Promise<Metadata> {
  const resolvedParams = await params;
  const district = getDistrictById(resolvedParams.id);
  if (!district) {
    return {
      title: 'District Not Found | PeerPulse AI',
    };
  }

  const title = `${district.district_name}, ${district.state_name} — Blood-Banking Peer Assessment`;
  const description = `Peer-relative blood bank assessment for ${district.district_name} (${district.state_name}). Identified primary gap: ${district.primary_gap} (${district.primary_gap_z.toFixed(2)}σ) relative to 20 nearest statistical peers.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `https://peerpulse.ai/districts/${district.id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export async function generateStaticParams() {
  const districts = getAllDistricts();
  return districts.map((d) => ({
    id: d.id,
  }));
}

export default async function DistrictProfilePage({ params }: DistrictProfileProps) {
  const resolvedParams = await params;
  const district = getDistrictById(resolvedParams.id);

  if (!district) {
    notFound();
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Navigation Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/districts"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-teal-400 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to District Explorer
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href={`/compare?ids=${district.id}`}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-teal-300 border border-teal-500/30 transition-colors"
          >
            <GitCompare className="w-3.5 h-3.5 text-teal-400" />
            Add to Compare
          </Link>
        </div>
      </div>

      {/* District Header Card */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-teal-400 font-bold uppercase tracking-wider">
              <MapPin className="w-4 h-4" />
              {district.state_name} • India
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {district.district_name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              Performance profile evaluated against <strong>20 statistically similar peer districts</strong> using the standardized Euclidean KNN framework.
            </p>
          </div>

          {/* Quick Stats Pill Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 font-medium">Availability</div>
              <div className="text-lg font-bold text-white mt-0.5">
                {district.raw_metrics.availability.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-400">
                Peers: {district.peer_means_raw.availability.toFixed(2)}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 font-medium">Collection /100</div>
              <div className="text-lg font-bold text-white mt-0.5">
                {district.raw_metrics.collection.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-400">
                Peers: {district.peer_means_raw.collection.toFixed(2)}
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <div className="text-[11px] text-slate-400 font-medium">Voluntary %</div>
              <div className="text-lg font-bold text-white mt-0.5">
                {district.raw_metrics.voluntary.toFixed(1)}%
              </div>
              <div className="text-[10px] text-slate-400">
                Peers: {district.peer_means_raw.voluntary.toFixed(1)}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Gap Diagnostic Banner */}
      <PrimaryGapCallout district={district} />

      {/* Visual Analytics: Radar vs Peer Divergence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Radar Chart (5 cols) */}
        <div className="lg:col-span-5 glass-card p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-400" />
              Multidimensional Radar Footprint
            </h3>
            <span className="text-[11px] text-slate-400">Normalized Scale</span>
          </div>
          <p className="text-xs text-slate-400">
            Comparing {district.district_name}&apos;s profile with its 20-peer mean and national average.
          </p>
          <DistrictRadarChart district={district} />
        </div>

        {/* Gap Delta Bars (7 cols) */}
        <div className="lg:col-span-7 glass-card p-6 rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Peer-Relative Shortfalls by Dimension
            </h3>
            <span className="text-[11px] text-slate-400">Standard Deviation Deltas (σ)</span>
          </div>
          <p className="text-xs text-slate-400">
            Negative deviations indicate service dimensions where the district lags behind its peer group.
          </p>
          <GapDeltaBarChart district={district} />
        </div>
      </div>

      {/* Robustness & Sensitivity Badge */}
      <RobustnessBadge
        robustness={district.robustness}
        primaryGap={district.primary_gap}
      />

      {/* 20 Statistical Peers Table */}
      <PeerGroupTable district={district} />
    </div>
  );
}
