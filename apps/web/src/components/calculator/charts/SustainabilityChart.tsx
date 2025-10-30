'use client';

import { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { ScenarioResult } from '@tokicheck/types';
import { formatPercentage } from '@/lib/utils';

interface SustainabilityChartProps {
  result: ScenarioResult;
}

export function SustainabilityChart({ result }: SustainabilityChartProps) {
  // Prepare chart data - sample every 3 months for smoother visualization
  const chartData = useMemo(() => {
    return result.periodData
      .filter((_, index) => index % 3 === 0 || index === 0)
      .map((period) => ({
        period: period.period,
        year: Math.ceil(period.period / 12),
        ratio: period.paymentToIncomeRatio,
        status: period.sustainabilityStatus,
      }));
  }, [result.periodData]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'safe':
        return '#22c55e'; // green
      case 'warning':
        return '#eab308'; // yellow
      case 'critical':
        return '#ef4444'; // red
      default:
        return '#6b7280'; // gray
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const statusLabels = {
        safe: 'Güvenli',
        warning: 'Dikkat',
        critical: 'Riskli',
      };
      const statusColors = {
        safe: 'text-green-600',
        warning: 'text-yellow-600',
        critical: 'text-red-600',
      };

      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">
            {data.period}. Ay ({data.year}. Yıl)
          </p>
          <p className="text-lg font-bold text-blue-600">
            Oran: {formatPercentage(data.ratio)}
          </p>
          <p className={`text-sm font-semibold mt-1 ${statusColors[data.status as keyof typeof statusColors]}`}>
            Durum: {statusLabels[data.status as keyof typeof statusLabels]}
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom dot to show different colors based on sustainability status
  const CustomDot = (props: any) => {
    const { cx, cy, payload } = props;
    const color = getStatusColor(payload.status);

    return (
      <circle
        cx={cx}
        cy={cy}
        r={3}
        fill={color}
        stroke="#fff"
        strokeWidth={1}
      />
    );
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <defs>
            <linearGradient id="colorRatio" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="period"
            label={{ value: 'Ay', position: 'insideBottomRight', offset: -5 }}
            stroke="#6b7280"
          />
          <YAxis
            domain={[0, 50]}
            tickFormatter={(value) => `${value}%`}
            label={{ value: 'Ödeme/Gelir Oranı', angle: -90, position: 'insideLeft' }}
            stroke="#6b7280"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* Reference lines for sustainability thresholds */}
          <ReferenceLine
            y={30}
            stroke="#22c55e"
            strokeDasharray="3 3"
            label={{ value: 'Güvenli (%30)', position: 'right', fill: '#22c55e', fontSize: 12 }}
          />
          <ReferenceLine
            y={35}
            stroke="#eab308"
            strokeDasharray="3 3"
            label={{ value: 'Dikkat (%35)', position: 'right', fill: '#eab308', fontSize: 12 }}
          />

          <Area
            type="monotone"
            dataKey="ratio"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#colorRatio)"
            name="Ödeme/Gelir Oranı"
            dot={<CustomDot />}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Legend for sustainability status */}
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Güvenli (≤30%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span>Dikkat (30-35%)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Riskli (&gt;35%)</span>
        </div>
      </div>
    </div>
  );
}
