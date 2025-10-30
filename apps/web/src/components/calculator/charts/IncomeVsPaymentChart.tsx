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
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">
            {data.period}. Ay ({data.year}. Yıl)
          </p>
          <div className="space-y-1 text-sm">
            <p className="text-green-600 font-semibold">
              💰 Gelir: {formatCurrency(data.income * 100)}
            </p>
            <p className="text-blue-600 font-semibold">
              📊 Toplam Ödeme: {formatCurrency(data.payment * 100)}
            </p>
            {data.rent > 0 && (
              <p className="text-orange-600">
                🏠 Kira: {formatCurrency(data.rent * 100)}
              </p>
            )}
            <p className="text-gray-700 font-bold border-t pt-1 mt-1">
              Oran: {formatPercentage(data.ratio)}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
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
            label={{ value: 'Miktar (₺)', angle: -90, position: 'insideLeft' }}
            stroke="#6b7280"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />

          {/* Gap area between income and payment */}
          <Area
            type="monotone"
            dataKey="income"
            fill="#22c55e"
            fillOpacity={0.1}
            stroke="none"
          />

          <Line
            type="monotone"
            dataKey="income"
            stroke="#22c55e"
            strokeWidth={2}
            name="Aylık Gelir"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="payment"
            stroke="#3b82f6"
            strokeWidth={2}
            name="Toplam Ödeme"
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
