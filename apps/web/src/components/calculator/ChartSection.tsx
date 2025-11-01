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

  const charts = [
    {
      id: 'installment' as ChartType,
      label: 'Taksit Artışı',
      icon: '📈',
      description: 'Taksit miktarının zaman içindeki değişimi',
      component: <InstallmentGrowthChart result={result} />,
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      id: 'income-vs-payment' as ChartType,
      label: 'Gelir vs Ödeme',
      icon: '💰',
      description: 'Gelir ve ödeme karşılaştırması',
      component: <IncomeVsPaymentChart result={result} />,
      gradient: 'from-green-500 to-emerald-600',
    },
    {
      id: 'sustainability' as ChartType,
      label: 'Sürdürülebilirlik',
      icon: '🎯',
      description: 'Ödeme/gelir oranı zaman çizgisi',
      component: <SustainabilityChart result={result} />,
      gradient: 'from-purple-500 to-purple-600',
    },
  ];

  const activeChartData = charts.find((c) => c.id === activeChart);

  return (
    <div className="relative">
      {/* Backdrop Gradient Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 rounded-2xl blur-3xl opacity-50"></div>

      <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
        {/* Modern Header with Gradient */}
        <div className={`bg-gradient-to-r ${activeChartData?.gradient || 'from-blue-500 to-blue-600'} p-6 transition-all duration-500`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-xl border border-white/30">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Grafikler ve Analizler</h2>
                <p className="text-white/80 text-sm mt-1">{activeChartData?.description}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* Modern Tab Pills */}
          <div className="flex flex-wrap gap-3 mb-8">
            {charts.map((chart) => {
              const isActive = activeChart === chart.id;
              return (
                <button
                  key={chart.id}
                  onClick={() => setActiveChart(chart.id)}
                  className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                    isActive
                      ? 'text-white shadow-lg scale-105'
                      : 'text-gray-700 bg-gray-100 hover:bg-gray-200 hover:scale-102'
                  }`}
                  style={isActive ? {
                    background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                  } : {}}
                >
                  {isActive && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${chart.gradient} rounded-xl`}></div>
                  )}
                  <div className="relative flex items-center gap-2">
                    <span className="text-xl">{chart.icon}</span>
                    <span className="hidden sm:inline">{chart.label}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Chart Container with Glass Effect */}
          <div className="relative bg-gradient-to-br from-white to-gray-50/50 rounded-xl p-6 border border-gray-200/50 shadow-inner">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-20"></div>
            {activeChartData?.component}
          </div>
        </div>
      </div>
    </div>
  );
}
