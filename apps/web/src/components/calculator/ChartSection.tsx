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
    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b bg-gray-50">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Grafikler ve Analizler</h2>
        </div>
        <button
          onClick={() => setShowCharts(!showCharts)}
          className="text-brand-teal hover:text-teal-700 font-medium flex items-center gap-2 transition-colors"
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
        <div className="p-6">
          {/* Chart Tabs - Card Style */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {charts.map((chart) => (
              <button
                key={chart.id}
                onClick={() => setActiveChart(chart.id)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  activeChart === chart.id
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{chart.icon}</span>
                  <span className={`font-semibold text-sm ${
                    activeChart === chart.id ? 'text-blue-700' : 'text-gray-700'
                  }`}>
                    {chart.label}
                  </span>
                </div>
                <p className={`text-xs ${
                  activeChart === chart.id ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {chart.description}
                </p>
              </button>
            ))}
          </div>

          {/* Active Chart Container */}
          <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
            {activeChartData?.component}
          </div>
        </div>
      )}
    </div>
  );
}
