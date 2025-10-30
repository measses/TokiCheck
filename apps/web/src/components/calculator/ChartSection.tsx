'use client';

import { useState } from 'react';
import type { ScenarioResult } from '@tokicheck/types';
import { InstallmentGrowthChart } from './charts/InstallmentGrowthChart';
import { IncomeVsPaymentChart } from './charts/IncomeVsPaymentChart';
import { SustainabilityChart } from './charts/SustainabilityChart';

interface ChartSectionProps {
  result: ScenarioResult;
}

type ChartType = 'installment' | 'income-vs-payment' | 'sustainability';

export function ChartSection({ result }: ChartSectionProps) {
  const [activeChart, setActiveChart] = useState<ChartType>('installment');
  const [showCharts, setShowCharts] = useState(true);

  const charts = [
    {
      id: 'installment' as ChartType,
      label: 'Taksit Artışı',
      icon: '📈',
      description: 'Taksit miktarının zaman içindeki değişimi',
      component: <InstallmentGrowthChart result={result} />,
    },
    {
      id: 'income-vs-payment' as ChartType,
      label: 'Gelir vs Ödeme',
      icon: '💰',
      description: 'Gelir ve ödeme karşılaştırması',
      component: <IncomeVsPaymentChart result={result} />,
    },
    {
      id: 'sustainability' as ChartType,
      label: 'Sürdürülebilirlik',
      icon: '🎯',
      description: 'Ödeme/gelir oranı zaman çizgisi',
      component: <SustainabilityChart result={result} />,
    },
  ];

  const activeChartData = charts.find((c) => c.id === activeChart);

  return (
    <div className="space-y-4">
      {/* Toggle Charts Visibility */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Grafikler</h2>
        <button
          onClick={() => setShowCharts(!showCharts)}
          className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
        >
          {showCharts ? (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Gizle
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Göster
            </>
          )}
        </button>
      </div>

      {showCharts && (
        <div className="border rounded-lg p-6 bg-white">
          {/* Chart Tabs */}
          <div className="flex gap-2 mb-6 border-b overflow-x-auto">
            {charts.map((chart) => (
              <button
                key={chart.id}
                onClick={() => setActiveChart(chart.id)}
                className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
                  activeChart === chart.id
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">{chart.icon}</span>
                {chart.label}
              </button>
            ))}
          </div>

          {/* Chart Description */}
          {activeChartData && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">{activeChartData.icon} {activeChartData.label}:</span>{' '}
                {activeChartData.description}
              </p>
            </div>
          )}

          {/* Active Chart */}
          <div className="mt-6">
            {activeChartData?.component}
          </div>
        </div>
      )}
    </div>
  );
}
