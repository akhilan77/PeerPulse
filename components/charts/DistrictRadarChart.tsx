'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import { District } from '@/types/district';

interface DistrictRadarChartProps {
  district: District;
}

export default function DistrictRadarChart({ district }: DistrictRadarChartProps) {
  // We use the scaled z-scores normalized for radar readability (mapped to 0-100 base scale)
  // Base 50 = National Average (z=0)
  // z=+1 -> 70, z=+2 -> 90, z=-1 -> 30, z=-2 -> 10
  const transformZ = (z: number) => Math.max(5, Math.min(95, 50 + z * 20));

  const radarData = [
    {
      dimension: 'Availability',
      districtVal: transformZ(district.scaled_metrics.availability),
      peerVal: transformZ(district.peer_means_scaled.availability),
      nationalVal: 50,
      rawDistrict: district.raw_metrics.availability.toFixed(2),
      rawPeer: district.peer_means_raw.availability.toFixed(2),
      gapZ: district.gaps_z.availability.toFixed(2),
    },
    {
      dimension: 'Collection /100',
      districtVal: transformZ(district.scaled_metrics.collection),
      peerVal: transformZ(district.peer_means_scaled.collection),
      nationalVal: 50,
      rawDistrict: district.raw_metrics.collection.toFixed(2),
      rawPeer: district.peer_means_raw.collection.toFixed(2),
      gapZ: district.gaps_z.collection.toFixed(2),
    },
    {
      dimension: 'Voluntary %',
      districtVal: transformZ(district.scaled_metrics.voluntary),
      peerVal: transformZ(district.peer_means_scaled.voluntary),
      nationalVal: 50,
      rawDistrict: `${district.raw_metrics.voluntary.toFixed(1)}%`,
      rawPeer: `${district.peer_means_raw.voluntary.toFixed(1)}%`,
      gapZ: district.gaps_z.voluntary.toFixed(2),
    },
  ];

  return (
    <div className="w-full h-80 relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="72%" data={radarData}>
          <PolarGrid stroke="#334155" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />

          {/* National Baseline */}
          <Radar
            name="National Benchmark"
            dataKey="nationalVal"
            stroke="#64748b"
            fill="#64748b"
            fillOpacity={0.1}
            strokeDasharray="4 4"
          />

          {/* 20 Peer Group Mean */}
          <Radar
            name="20-Peer Mean"
            dataKey="peerVal"
            stroke="#0ea5e9"
            fill="#0ea5e9"
            fillOpacity={0.25}
            strokeWidth={2}
          />

          {/* Target District */}
          <Radar
            name={`${district.district_name} (Target)`}
            dataKey="districtVal"
            stroke="#14b8a6"
            fill="#14b8a6"
            fillOpacity={0.4}
            strokeWidth={2.5}
          />

          <Legend
            wrapperStyle={{
              paddingTop: '10px',
              fontSize: '12px',
            }}
          />

          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1.5 min-w-[200px]">
                    <div className="font-semibold text-slate-100 border-b border-slate-800 pb-1">
                      {item.dimension}
                    </div>
                    <div className="flex justify-between text-teal-300">
                      <span>{district.district_name}:</span>
                      <span className="font-mono font-bold">{item.rawDistrict}</span>
                    </div>
                    <div className="flex justify-between text-sky-300">
                      <span>20-Peer Mean:</span>
                      <span className="font-mono">{item.rawPeer}</span>
                    </div>
                    <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800/80">
                      <span>Peer Gap (z-score):</span>
                      <span
                        className={`font-mono font-semibold ${
                          Number(item.gapZ) < 0 ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {item.gapZ}σ
                      </span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
