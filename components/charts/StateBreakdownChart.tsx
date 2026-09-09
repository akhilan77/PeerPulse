'use client';

import { StateBreakdown } from '@/types/district';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface StateBreakdownChartProps {
  states: StateBreakdown[];
}

export default function StateBreakdownChart({ states }: StateBreakdownChartProps) {
  // Sort by district count descending and take top 10 states
  const topStates = [...states]
    .sort((a, b) => b.district_count - a.district_count)
    .slice(0, 10)
    .map((s) => ({
      state: s.state_name.length > 14 ? s.state_name.substring(0, 12) + '...' : s.state_name,
      fullName: s.state_name,
      total: s.district_count,
      Availability: s.gap_counts.Availability,
      Collection: s.gap_counts.Collection,
      'Voluntary Donation': s.gap_counts['Voluntary Donation'],
    }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={topStates}
          layout="vertical"
          margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
        >
          <XAxis type="number" stroke="#64748b" fontSize={11} />
          <YAxis
            type="category"
            dataKey="state"
            stroke="#94a3b8"
            fontSize={11}
            width={90}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(val: any, name: any) => [`${val} districts`, name]}
            labelFormatter={(label, payload) => {
              if (payload && payload.length) {
                return payload[0].payload.fullName;
              }
              return label;
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
          <Bar
            dataKey="Availability"
            stackId="a"
            fill="#f43f5e"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="Collection"
            stackId="a"
            fill="#0ea5e9"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="Voluntary Donation"
            stackId="a"
            fill="#10b981"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
