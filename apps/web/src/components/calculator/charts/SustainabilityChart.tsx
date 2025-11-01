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
      const statusIcons = {
        safe: '✅',
        warning: '⚠️',
        critical: '❌',
      };
      const statusBg = {
        safe: 'bg-green-50 border-green-200',
        warning: 'bg-yellow-50 border-yellow-200',
        critical: 'bg-red-50 border-red-200',
      };
      const statusText = {
        safe: 'text-green-700',
        warning: 'text-yellow-700',
        critical: 'text-red-700',
      };

      return (
        <div className={`backdrop-blur-md p-4 border-2 rounded-xl shadow-xl ${statusBg[data.status as keyof typeof statusBg]}`}>
          <p className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-purple-600">📅</span>
            {data.period}. Ay ({data.year}. Yıl)
          </p>
          <div className="space-y-2">
            <div className="p-2 bg-white/80 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Ödeme/Gelir Oranı</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatPercentage(data.ratio)}
              </p>
            </div>
            <div className={`p-2 rounded-lg flex items-center gap-2 ${statusBg[data.status as keyof typeof statusBg]}`}>
              <span className="text-xl">{statusIcons[data.status as keyof typeof statusIcons]}</span>
              <span className={`font-bold ${statusText[data.status as keyof typeof statusText]}`}>
                {statusLabels[data.status as keyof typeof statusLabels]}
              </span>
            </div>
          </div>
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
        r={4}
        fill={color}
        stroke="#fff"
        strokeWidth={2}
      />
    );
  };

  return (
    <div className="w-full">
      <div className="w-full h-[350px] sm:h-[400px] md:h-[450px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorRatio" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#a855f7" stopOpacity={0.05} />
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
              domain={[0, 50]}
              tickFormatter={(value) => `${value}%`}
              label={{ value: 'Ödeme/Gelir Oranı', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
              stroke="#9ca3af"
              tick={{ fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: 13, paddingTop: 10 }}
              iconType="line"
            />

            {/* Reference lines for sustainability thresholds */}
            <ReferenceLine
              y={30}
              stroke="#22c55e"
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{ value: 'Güvenli (%30)', position: 'right', fill: '#22c55e', fontSize: 11, fontWeight: 600 }}
            />
            <ReferenceLine
              y={35}
              stroke="#eab308"
              strokeWidth={2}
              strokeDasharray="5 5"
              label={{ value: 'Dikkat (%35)', position: 'right', fill: '#eab308', fontSize: 11, fontWeight: 600 }}
            />

            <Area
              type="monotone"
              dataKey="ratio"
              stroke="#a855f7"
              strokeWidth={3}
              fill="url(#colorRatio)"
              name="Ödeme/Gelir Oranı"
              dot={<CustomDot />}
              activeDot={{ r: 8, fill: "#a855f7", stroke: "#fff", strokeWidth: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Modern Legend for sustainability status */}
      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-6 text-xs sm:text-sm">
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
          <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
          <span className="font-semibold text-green-700">Güvenli (≤30%)</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-sm"></div>
          <span className="font-semibold text-yellow-700">Dikkat (30-35%)</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg border border-red-200">
          <div className="w-3 h-3 rounded-full bg-red-500 shadow-sm"></div>
          <span className="font-semibold text-red-700">Riskli (&gt;35%)</span>
        </div>
      </div>
    </div>
  );
}
