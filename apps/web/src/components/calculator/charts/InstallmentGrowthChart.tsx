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
  ReferenceDot,
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

  // Find increase points for highlighting
  const increasePoints = useMemo(() => {
    return chartData.filter((data) => data.isIncrease);
  }, [chartData]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">
            {data.period}. Ay ({data.year}. Yıl)
          </p>
          <p className="text-blue-600 font-bold">
            Taksit: {formatCurrency(data.installment * 100)}
          </p>
          {data.isIncrease && (
            <p className="text-orange-600 text-xs mt-1">📈 Artış Ayı</p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="period"
            label={{ value: 'Ay', position: 'insideBottomRight', offset: -5 }}
            stroke="#6b7280"
          />
          <YAxis
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            label={{ value: 'Taksit (₺)', angle: -90, position: 'insideLeft' }}
            stroke="#6b7280"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="installment"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Aylık Taksit"
            dot={(props: any) => {
              const { cx, cy, payload } = props;
              if (payload.isIncrease) {
                return (
                  <circle
                    key={`dot-${payload.period}`}
                    cx={cx}
                    cy={cy}
                    r={5}
                    fill="#f97316"
                    stroke="#fff"
                    strokeWidth={2}
                  />
                );
              }
              return <circle key={`dot-${payload.period}`} cx={cx} cy={cy} r={0} fill="transparent" />;
            }}
          />
          {/* Highlight increase points */}
          {increasePoints.map((point) => (
            <ReferenceDot
              key={point.period}
              x={point.period}
              y={point.installment}
              r={0}
              fill="transparent"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
