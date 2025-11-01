'use client';

import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { ScenarioResult } from '@tokicheck/types';
import { formatCurrency } from '@/lib/utils';

interface InstallmentGrowthChartProps {
  result: ScenarioResult;
}

export function InstallmentGrowthChart({ result }: InstallmentGrowthChartProps) {
  // Prepare chart data - sample every 6 months for better visibility
  const chartData = useMemo(() => {
    return result.periodData
      .filter((_, index) => index % 6 === 0 || index === 0) // Every 6 months + first month
      .map((period) => ({
        period: period.period,
        year: Math.ceil(period.period / 12),
        installment: period.installmentAmount / 100, // Convert from kuruş to TL
        isIncrease: period.period > 1 && (period.period - 1) % 6 === 0,
      }));
  }, [result.periodData]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-md p-4 border-2 border-blue-200 rounded-xl shadow-xl">
          <p className="font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span className="text-blue-600">📅</span>
            {data.period}. Ay ({data.year}. Yıl)
          </p>
          <p className="text-blue-600 font-bold text-lg">
            💰 {formatCurrency(data.installment * 100)}
          </p>
          {data.isIncrease && (
            <div className="mt-2 pt-2 border-t border-orange-200">
              <p className="text-orange-600 text-xs font-semibold flex items-center gap-1">
                📈 Artış Ayı
              </p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[350px] sm:h-[400px] md:h-[450px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
        >
          <defs>
            <linearGradient id="colorInstallment" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.5} />
          <XAxis
            dataKey="period"
            label={{ value: 'Ay', position: 'insideBottomRight', offset: -5, style: { fontSize: 12 } }}
            stroke="#9ca3af"
            tick={{ fontSize: 11 }}
          />
          <YAxis
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            label={{ value: 'Taksit (₺)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
            stroke="#9ca3af"
            tick={{ fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 13, paddingTop: 10 }}
            iconType="line"
          />
          <Line
            type="monotone"
            dataKey="installment"
            stroke="#3b82f6"
            strokeWidth={3}
            name="Aylık Taksit"
            fill="url(#colorInstallment)"
            fillOpacity={1}
            dot={(props: any) => {
              const { cx, cy, payload } = props;
              if (payload.isIncrease) {
                return (
                  <circle
                    key={`dot-${payload.period}`}
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill="#f97316"
                    stroke="#fff"
                    strokeWidth={3}
                  />
                );
              }
              return <circle key={`dot-${payload.period}`} cx={cx} cy={cy} r={0} fill="transparent" />;
            }}
            activeDot={{ r: 8, fill: "#3b82f6", stroke: "#fff", strokeWidth: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
