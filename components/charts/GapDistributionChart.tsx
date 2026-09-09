'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

interface GapDistributionProps {
  gapCounts: {
    Availability: number;
    Collection: number;
    'Voluntary Donation': number;
  };
  totalDistricts: number;
}

export default function GapDistributionChart({ gapCounts, totalDistricts }: GapDistributionProps) {
  const data = [
    {
      name: 'Availability',
      count: gapCounts.Availability,
      percentage: ((gapCounts.Availability / totalDistricts) * 100).toFixed(1),
      color: '#f43f5e',
    },
    {
      name: 'Collection',
      count: gapCounts.Collection,
      percentage: ((gapCounts.Collection / totalDistricts) * 100).toFixed(1),
      color: '#0ea5e9',
    },
    {
      name: 'Voluntary Donation',
      count: gapCounts['Voluntary Donation'],
      percentage: ((gapCounts['Voluntary Donation'] / totalDistricts) * 100).toFixed(1),
      color: '#10b981',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
      {/* Donut Chart */}
      <div className="h-64 relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={4}
              dataKey="count"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0f172a',
                borderColor: '#334155',
                borderRadius: '8px',
                color: '#f8fafc',
                fontSize: '12px',
              }}
              formatter={(value: any, name: any) => [`${value} districts`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-white">{totalDistricts}</span>
          <span className="text-xs text-slate-400">Total Districts</span>
        </div>
      </div>

      {/* Progress & Metric Legend */}
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.name} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-sm font-medium text-slate-200">{item.name}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-white">{item.count}</span>
                <span className="text-xs text-slate-400 ml-1.5">({item.percentage}%)</span>
              </div>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${item.percentage}%`,
                  backgroundColor: item.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
