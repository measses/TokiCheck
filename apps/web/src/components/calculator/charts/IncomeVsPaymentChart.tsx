'use client';

import { useMemo } from 'react';
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from 'recharts';
import type { ScenarioResult } from '@tokicheck/types';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface IncomeVsPaymentChartProps {
  result: ScenarioResult;
}

export function IncomeVsPaymentChart({ result }: IncomeVsPaymentChartProps) {
  // Prepare chart data - sample every 6 months
  const chartData = useMemo(() => {
    return result.periodData
      .filter((_, index) => index % 6 === 0 || index === 0)
      .map((period) => ({
        period: period.period,
        year: Math.ceil(period.period / 12),
        income: period.householdIncome / 100, // Convert to TL
        payment: period.totalMonthlyPayment / 100,
        ratio: period.paymentToIncomeRatio,
        rent: period.isRentingPeriod ? period.rentAmount / 100 : 0,
      }));
  }, [result.periodData]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-md p-4 border-2 border-green-200 rounded-xl shadow-xl min-w-[200px]">
          <p className="font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span className="text-green-600">📅</span>
            {data.period}. Ay ({data.year}. Yıl)
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4 p-2 bg-green-50 rounded-lg">
              <span className="text-green-700 font-semibold text-sm">💰 Gelir:</span>
              <span className="text-green-600 font-bold">{formatCurrency(data.income * 100)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 p-2 bg-blue-50 rounded-lg">
              <span className="text-blue-700 font-semibold text-sm">📊 Ödeme:</span>
              <span className="text-blue-600 font-bold">{formatCurrency(data.payment * 100)}</span>
            </div>
            {data.rent > 0 && (
              <div className="flex items-center justify-between gap-4 p-2 bg-orange-50 rounded-lg">
                <span className="text-orange-700 font-semibold text-sm">🏠 Kira:</span>
                <span className="text-orange-600 font-bold">{formatCurrency(data.rent * 100)}</span>
              </div>
            )}
            <div className="pt-2 border-t-2 border-gray-200 mt-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-semibold text-sm">Oran:</span>
                <span className="text-gray-900 font-bold text-lg">{formatPercentage(data.ratio)}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[350px] sm:h-[400px] md:h-[450px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
        >
          <defs>
            <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPayment" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
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
            label={{ value: 'Miktar (₺)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
            stroke="#9ca3af"
            tick={{ fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 13, paddingTop: 10 }}
            iconType="line"
          />

          {/* Income area with gradient */}
          <Area
            type="monotone"
            dataKey="income"
            fill="url(#colorIncome)"
            fillOpacity={1}
            stroke="none"
          />

          <Line
            type="monotone"
            dataKey="income"
            stroke="#22c55e"
            strokeWidth={3}
            name="Aylık Gelir"
            dot={false}
            activeDot={{ r: 8, fill: "#22c55e", stroke: "#fff", strokeWidth: 3 }}
          />
          <Line
            type="monotone"
            dataKey="payment"
            stroke="#3b82f6"
            strokeWidth={3}
            name="Toplam Ödeme"
            dot={false}
            strokeDasharray="5 5"
            activeDot={{ r: 8, fill: "#3b82f6", stroke: "#fff", strokeWidth: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
