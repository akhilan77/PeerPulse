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

interface MultiDistrictRadarChartProps {
  districts: District[];
}

const DISTRICT_COLORS = [
  { stroke: '#14b8a6', fill: '#14b8a6' }, // Teal
  { stroke: '#f59e0b', fill: '#f59e0b' }, // Amber
  { stroke: '#a855f7', fill: '#a855f7' }, // Purple
  { stroke: '#ec4899', fill: '#ec4899' }, // Pink
];

export default function MultiDistrictRadarChart({ districts }: MultiDistrictRadarChartProps) {
  const transformZ = (z: number) => Math.max(5, Math.min(95, 50 + z * 20));

  const dimensions = [
    { key: 'availability' as const, label: 'Availability' },
    { key: 'collection' as const, label: 'Collection /100' },
    { key: 'voluntary' as const, label: 'Voluntary %' },
  ];

  const radarData = dimensions.map((dim) => {
    const row: any = { dimension: dim.label };
    districts.forEach((d) => {
      row[d.id] = transformZ(d.scaled_metrics[dim.key]);
      row[`raw_${d.id}`] = d.raw_metrics[dim.key];
    });
    return row;
  });

  return (
    <div className="w-full h-88 relative flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
          <PolarGrid stroke="#334155" strokeDasharray="3 3" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{ fill: '#cbd5e1', fontSize: 12, fontWeight: 500 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={false}
            axisLine={false}
          />

          {districts.map((d, index) => {
            const color = DISTRICT_COLORS[index % DISTRICT_COLORS.length];
            return (
              <Radar
                key={d.id}
                name={`${d.district_name} (${d.state_name})`}
                dataKey={d.id}
                stroke={color.stroke}
                fill={color.fill}
                fillOpacity={0.25}
                strokeWidth={2.5}
              />
            );
          })}

          <Legend
            wrapperStyle={{
              paddingTop: '16px',
              fontSize: '12px',
            }}
          />

          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                return (
                  <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-2 min-w-[220px]">
                    <div className="font-semibold text-slate-100 border-b border-slate-800 pb-1">
                      {item.dimension}
                    </div>
                    {districts.map((d, index) => {
                      const color = DISTRICT_COLORS[index % DISTRICT_COLORS.length];
                      const rawVal = item[`raw_${d.id}`];
                      return (
                        <div key={d.id} className="flex justify-between items-center gap-2">
                          <div className="flex items-center gap-1.5 truncate">
                            <span
                              className="w-2 h-2 rounded-full shrink-0"
                              style={{ backgroundColor: color.stroke }}
                            />
                            <span className="text-slate-300 truncate">{d.district_name}:</span>
                          </div>
                          <span className="font-mono font-bold text-white">
                            {rawVal !== undefined ? rawVal.toFixed(2) : '-'}
                          </span>
                        </div>
                      );
                    })}
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
