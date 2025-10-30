'use client';

import type { ScenarioResult } from '@tokicheck/types';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface SummaryCardsProps {
  result: ScenarioResult;
}

export function SummaryCards({ result }: SummaryCardsProps) {
  const getSustainabilityColor = (ratio: number) => {
    if (ratio <= 30) return { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' };
    if (ratio <= 35) return { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' };
    return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
  };

  const avgRatioColors = getSustainabilityColor(result.summary.averagePaymentToIncomeRatio);
  const maxRatioColors = getSustainabilityColor(result.summary.maxPaymentToIncomeRatio);

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Peşinat Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <div className="text-sm font-medium text-gray-600">Peşinat</div>
          <div className="bg-blue-100 p-2 rounded-lg">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {formatCurrency(result.summary.downPayment)}
        </div>
        <div className="text-xs text-gray-500">İlk ödeme</div>
      </div>

      {/* Toplam Taksit Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <div className="text-sm font-medium text-gray-600">Toplam Taksit</div>
          <div className="bg-purple-100 p-2 rounded-lg">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {formatCurrency(result.summary.totalInstallmentPayment)}
        </div>
        <div className="text-xs text-gray-500">240 ay boyunca</div>
      </div>

      {/* Toplam Kira Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <div className="text-sm font-medium text-gray-600">Kira Çakışması</div>
          <div className="bg-orange-100 p-2 rounded-lg">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
        </div>
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {formatCurrency(result.summary.totalRentPayment)}
        </div>
        <div className="text-xs text-gray-500">
          {result.summary.overlapMonths} ay süreyle
        </div>
      </div>

      {/* Genel Toplam Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 border border-blue-700 rounded-lg p-6 hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-3">
        <div className="flex items-start justify-between mb-2">
          <div className="text-sm font-medium text-blue-100">Toplam Maliyet</div>
          <div className="bg-blue-500 p-2 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-4xl font-bold text-white mb-1">
              {formatCurrency(result.summary.totalOutOfPocket)}
            </div>
            <div className="text-sm text-blue-200">Peşinat + Taksit + Kira</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-blue-200 mb-1">Aylık Ortalama</div>
            <div className="text-lg font-semibold text-white">
              {formatCurrency(Math.round(result.summary.totalPayment / 240))}
            </div>
          </div>
        </div>
      </div>

      {/* Ortalama Ödeme/Gelir Oranı */}
      <div className={`border rounded-lg p-6 hover:shadow-lg transition-shadow ${avgRatioColors.bg} ${avgRatioColors.border}`}>
        <div className="flex items-start justify-between mb-2">
          <div className={`text-sm font-medium ${avgRatioColors.text}`}>Ortalama Ödeme/Gelir</div>
          <div className={`${avgRatioColors.bg} p-2 rounded-lg`}>
            <svg className={`w-5 h-5 ${avgRatioColors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
        </div>
        <div className={`text-3xl font-bold mb-1 ${avgRatioColors.text}`}>
          {formatPercentage(result.summary.averagePaymentToIncomeRatio)}
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white/50 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${avgRatioColors.text.replace('text-', 'bg-')}`}
              style={{ width: `${Math.min(result.summary.averagePaymentToIncomeRatio, 100)}%` }}
            />
          </div>
          <span className={`text-xs font-medium ${avgRatioColors.text}`}>
            {result.summary.averagePaymentToIncomeRatio <= 30 ? '✓ İdeal' : result.summary.averagePaymentToIncomeRatio <= 35 ? '⚠ Dikkat' : '✗ Risk'}
          </span>
        </div>
      </div>

      {/* Maksimum Ödeme/Gelir Oranı */}
      <div className={`border rounded-lg p-6 hover:shadow-lg transition-shadow ${maxRatioColors.bg} ${maxRatioColors.border}`}>
        <div className="flex items-start justify-between mb-2">
          <div className={`text-sm font-medium ${maxRatioColors.text}`}>Maksimum Ödeme/Gelir</div>
          <div className={`${maxRatioColors.bg} p-2 rounded-lg`}>
            <svg className={`w-5 h-5 ${maxRatioColors.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </div>
        <div className={`text-3xl font-bold mb-1 ${maxRatioColors.text}`}>
          {formatPercentage(result.summary.maxPaymentToIncomeRatio)}
        </div>
        <div className={`text-xs ${maxRatioColors.text}`}>
          {result.summary.maxRatioPeriod}. ayda gerçekleşir
        </div>
      </div>

      {/* Sürdürülebilirlik Breakdown */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="text-sm font-medium text-gray-600">Sürdürülebilirlik Dağılımı</div>
          <div className="bg-gray-100 p-2 rounded-lg">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
            </svg>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Güvenli</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {result.summary.sustainabilityBreakdown.safe} ay
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Dikkat</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {result.summary.sustainabilityBreakdown.warning} ay
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Riskli</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {result.summary.sustainabilityBreakdown.critical} ay
            </span>
          </div>
          <div className="pt-2 border-t">
            <div className="flex gap-1 h-2 rounded-full overflow-hidden">
              <div
                className="bg-green-500"
                style={{
                  width: `${(result.summary.sustainabilityBreakdown.safe / 240) * 100}%`,
                }}
              />
              <div
                className="bg-yellow-500"
                style={{
                  width: `${(result.summary.sustainabilityBreakdown.warning / 240) * 100}%`,
                }}
              />
              <div
                className="bg-red-500"
                style={{
                  width: `${(result.summary.sustainabilityBreakdown.critical / 240) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
