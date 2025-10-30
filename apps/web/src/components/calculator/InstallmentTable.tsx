'use client';

import { useState, useMemo } from 'react';
import type { ScenarioResult } from '@tokicheck/types';
import { formatCurrency, formatPercentage } from '@/lib/utils';

interface InstallmentTableProps {
  result: ScenarioResult;
}

type ViewMode = 'monthly' | 'yearly' | 'summary';

interface YearlyData {
  year: number;
  totalInstallment: number;
  totalRent: number;
  totalPayment: number;
  avgIncome: number;
  avgRatio: number;
  maxRatio: number;
  sustainabilityBreakdown: { safe: number; warning: number; critical: number };
  hasRent: boolean;
}

export function InstallmentTable({ result }: InstallmentTableProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('yearly');
  const [showFullTable, setShowFullTable] = useState(false);

  // Yearly aggregated data
  const yearlyData = useMemo(() => {
    const years: YearlyData[] = [];
    for (let year = 1; year <= 20; year++) {
      const startPeriod = (year - 1) * 12;
      const endPeriod = year * 12;
      const yearPeriods = result.periodData.slice(startPeriod, endPeriod);

      if (yearPeriods.length === 0) continue;

      const totalInstallment = yearPeriods.reduce((sum, p) => sum + p.installmentAmount, 0);
      const totalRent = yearPeriods.reduce((sum, p) => sum + p.rentAmount, 0);
      const totalPayment = yearPeriods.reduce((sum, p) => sum + p.totalMonthlyPayment, 0);
      const avgIncome = yearPeriods.reduce((sum, p) => sum + p.householdIncome, 0) / yearPeriods.length;
      const avgRatio = yearPeriods.reduce((sum, p) => sum + p.paymentToIncomeRatio, 0) / yearPeriods.length;
      const maxRatio = Math.max(...yearPeriods.map(p => p.paymentToIncomeRatio));

      // Count sustainability status
      const safe = yearPeriods.filter(p => p.sustainabilityStatus === 'safe').length;
      const warning = yearPeriods.filter(p => p.sustainabilityStatus === 'warning').length;
      const critical = yearPeriods.filter(p => p.sustainabilityStatus === 'critical').length;

      years.push({
        year,
        totalInstallment,
        totalRent,
        totalPayment,
        avgIncome,
        avgRatio,
        maxRatio,
        sustainabilityBreakdown: { safe, warning, critical },
        hasRent: totalRent > 0,
      });
    }
    return years;
  }, [result]);

  // Limit display for initial view
  const displayData: (YearlyData | typeof result.periodData[0])[] = useMemo(() => {
    if (viewMode === 'yearly') {
      return showFullTable ? yearlyData : yearlyData.slice(0, 10);
    }
    if (viewMode === 'monthly') {
      return showFullTable ? result.periodData : result.periodData.slice(0, 36);
    }
    return [];
  }, [viewMode, showFullTable, yearlyData, result.periodData]);

  const getSustainabilityColor = (ratio: number) => {
    if (ratio <= 30) return 'text-green-600 bg-green-50';
    if (ratio <= 35) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getSustainabilityBadge = (ratio: number) => {
    if (ratio <= 30) return { text: 'Güvenli', class: 'bg-green-100 text-green-800' };
    if (ratio <= 35) return { text: 'Dikkat', class: 'bg-yellow-100 text-yellow-800' };
    return { text: 'Riskli', class: 'bg-red-100 text-red-800' };
  };

  return (
    <div className="space-y-4">
      {/* View Mode Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setViewMode('yearly')}
          className={`px-4 py-2 font-medium transition-colors ${
            viewMode === 'yearly'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Yıllık Görünüm
        </button>
        <button
          onClick={() => setViewMode('monthly')}
          className={`px-4 py-2 font-medium transition-colors ${
            viewMode === 'monthly'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Aylık Detay
        </button>
        <button
          onClick={() => setViewMode('summary')}
          className={`px-4 py-2 font-medium transition-colors ${
            viewMode === 'summary'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Özet İstatistikler
        </button>
      </div>

      {/* Yearly View */}
      {viewMode === 'yearly' && (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Yıl</th>
                <th className="px-4 py-3 text-right font-semibold">Yıllık Taksit</th>
                <th className="px-4 py-3 text-right font-semibold">Yıllık Kira</th>
                <th className="px-4 py-3 text-right font-semibold">Toplam Ödeme</th>
                <th className="px-4 py-3 text-right font-semibold">Ort. Gelir</th>
                <th className="px-4 py-3 text-right font-semibold">Ödeme/Gelir</th>
                <th className="px-4 py-3 text-center font-semibold">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(displayData as YearlyData[]).map((row) => {
                const badge = getSustainabilityBadge(row.maxRatio);
                return (
                  <tr key={row.year} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium">{row.year}. Yıl</td>
                    <td className="px-4 py-3 text-right">{formatCurrency(row.totalInstallment)}</td>
                    <td className="px-4 py-3 text-right">
                      {row.hasRent ? (
                        <span className="text-orange-600">{formatCurrency(row.totalRent)}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{formatCurrency(row.totalPayment)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(Math.round(row.avgIncome))}</td>
                    <td className={`px-4 py-3 text-right font-medium ${getSustainabilityColor(row.maxRatio)}`}>
                      {formatPercentage(row.maxRatio)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badge.class}`}>
                        {badge.text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {!showFullTable && yearlyData.length > 10 && (
            <div className="p-4 border-t bg-gray-50 text-center">
              <button
                onClick={() => setShowFullTable(true)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Tüm {yearlyData.length} Yılı Göster ↓
              </button>
            </div>
          )}

          {showFullTable && (
            <div className="p-4 border-t bg-gray-50 text-center">
              <button
                onClick={() => setShowFullTable(false)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Daralt ↑
              </button>
            </div>
          )}
        </div>
      )}

      {/* Monthly View */}
      {viewMode === 'monthly' && (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Ay</th>
                <th className="px-4 py-3 text-right font-semibold">Taksit</th>
                <th className="px-4 py-3 text-right font-semibold">Kira</th>
                <th className="px-4 py-3 text-right font-semibold">Toplam</th>
                <th className="px-4 py-3 text-right font-semibold">Gelir</th>
                <th className="px-4 py-3 text-right font-semibold">Oran</th>
                <th className="px-4 py-3 text-center font-semibold">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {(displayData as typeof result.periodData).map((period) => {
                const badge = getSustainabilityBadge(period.paymentToIncomeRatio);
                // Artış ayları: 7, 13, 19, 25, ... (her 6 ayda bir, 1. hariç)
                const isIncreaseMonth = period.period > 1 && (period.period - 1) % 6 === 0;

                return (
                  <tr
                    key={period.period}
                    className={`hover:bg-gray-50 transition-colors ${isIncreaseMonth ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{period.period}. Ay</span>
                        {isIncreaseMonth && (
                          <span className="text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded">
                            Artış
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">{formatCurrency(period.installmentAmount)}</td>
                    <td className="px-4 py-3 text-right">
                      {period.isRentingPeriod ? (
                        <span className="text-orange-600">{formatCurrency(period.rentAmount)}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">{formatCurrency(period.totalMonthlyPayment)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(period.householdIncome)}</td>
                    <td className={`px-4 py-3 text-right font-medium ${getSustainabilityColor(period.paymentToIncomeRatio)}`}>
                      {formatPercentage(period.paymentToIncomeRatio)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${badge.class}`}>
                        {badge.text}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {!showFullTable && result.periodData.length > 36 && (
            <div className="p-4 border-t bg-gray-50 text-center">
              <button
                onClick={() => setShowFullTable(true)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Tüm {result.periodData.length} Ayı Göster ↓
              </button>
            </div>
          )}

          {showFullTable && (
            <div className="p-4 border-t bg-gray-50 text-center">
              <button
                onClick={() => setShowFullTable(false)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Daralt (İlk 36 Ay) ↑
              </button>
            </div>
          )}
        </div>
      )}

      {/* Summary View */}
      {viewMode === 'summary' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Key Milestones */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Önemli Dönüm Noktaları</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">İlk Taksit:</span>
                <span className="font-semibold">{formatCurrency(result.periodData[0].installmentAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">10. Yıl Taksit:</span>
                <span className="font-semibold">{formatCurrency(result.periodData[119].installmentAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Son Taksit:</span>
                <span className="font-semibold">{formatCurrency(result.periodData[239].installmentAmount)}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-600">Artış Oranı (İlk→Son):</span>
                <span className="font-semibold text-orange-600">
                  {formatPercentage(
                    ((result.periodData[239].installmentAmount - result.periodData[0].installmentAmount) /
                    result.periodData[0].installmentAmount) * 100
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Income vs Payment */}
          <div className="border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Gelir-Ödeme Dengesi</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">İlk Gelir:</span>
                <span className="font-semibold">{formatCurrency(result.periodData[0].householdIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Son Gelir:</span>
                <span className="font-semibold">{formatCurrency(result.periodData[239].householdIncome)}</span>
              </div>
              <div className="flex justify-between border-t pt-3">
                <span className="text-gray-600">En Yüksek Oran:</span>
                <span className={`font-semibold ${getSustainabilityColor(result.summary.maxPaymentToIncomeRatio)}`}>
                  {formatPercentage(result.summary.maxPaymentToIncomeRatio)}
                  <span className="text-xs ml-1">({result.summary.maxRatioPeriod}. ay)</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Ortalama Oran:</span>
                <span className={`font-semibold ${getSustainabilityColor(result.summary.averagePaymentToIncomeRatio)}`}>
                  {formatPercentage(result.summary.averagePaymentToIncomeRatio)}
                </span>
              </div>
            </div>
          </div>

          {/* Total Costs */}
          <div className="border rounded-lg p-6 md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">Toplam Maliyetler (20 Yıl)</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Toplam Taksit</div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(result.summary.totalInstallmentPayment)}
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Toplam Kira</div>
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(result.summary.totalRentPayment)}
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Genel Toplam</div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(result.summary.totalOutOfPocket)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
