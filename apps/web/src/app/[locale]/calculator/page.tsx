'use client';

import { useState } from 'react';
import { calculateScenario } from '@tokicheck/engine';
import type { ScenarioConfig } from '@tokicheck/types';
import { formatCurrency, formatPercentage } from '@/lib/utils';

export default function CalculatorPage() {
  const [result, setResult] = useState<ReturnType<typeof calculateScenario> | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = () => {
    setIsCalculating(true);

    try {
      // Example scenario configuration
      const config: ScenarioConfig = {
        name: 'Örnek Senaryo',
        installmentConfig: {
          initialAmount: 5000_00, // 5,000 TRY
          totalInstallments: 240, // 20 years
          downPayment: 50000_00, // 50,000 TRY
          increaseConfig: {
            method: 'fixed-percentage',
            percentagePerPeriod: 7.5, // 7.5% every 6 months
            increasePeriod: 6,
            increasePeriodUnit: 'month',
          },
        },
        incomeConfig: {
          householdMembers: [
            {
              id: 'member1',
              monthlyGrossIncome: 20000_00,
              monthlyNetIncome: 17000_00,
              employmentStatus: 'employed',
              increaseMethod: 'fixed-percentage',
              annualIncreasePercentage: 15,
            },
          ],
          defaultIncreaseMethod: 'fixed-percentage',
          defaultAnnualIncreasePercentage: 15,
          projectionPeriods: 240,
          projectionPeriodUnit: 'month',
        },
        rentConfig: {
          monthlyRent: 8000_00, // 8,000 TRY
          annualIncreasePercentage: 25,
          deliveryDelayMonths: 24,
        },
      };

      const scenarioResult = calculateScenario(config);
      setResult(scenarioResult);
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">TOKİ Taksit Hesaplayıcı</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Taksit Bilgileri</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  İlk Taksit Tutarı (₺)
                </label>
                <input
                  type="number"
                  defaultValue="5000"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Peşinat (₺)
                </label>
                <input
                  type="number"
                  defaultValue="50000"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  6 Ayda Bir Artış Oranı (%)
                </label>
                <input
                  type="number"
                  defaultValue="7.5"
                  step="0.1"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Gelir Bilgileri</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Aylık Net Gelir (₺)
                </label>
                <input
                  type="number"
                  defaultValue="17000"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Yıllık Gelir Artışı (%)
                </label>
                <input
                  type="number"
                  defaultValue="15"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          <div className="p-6 border rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Kira Bilgileri</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Aylık Kira (₺)
                </label>
                <input
                  type="number"
                  defaultValue="8000"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Teslimat Gecikmesi (Ay)
                </label>
                <input
                  type="number"
                  defaultValue="24"
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={isCalculating}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            {isCalculating ? 'Hesaplanıyor...' : 'Hesapla'}
          </button>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {result ? (
            <>
              <div className="p-6 border rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Özet</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Toplam Taksit:</span>
                    <span className="font-semibold">
                      {formatCurrency(result.summary.totalInstallmentPayment)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Toplam Kira:</span>
                    <span className="font-semibold">
                      {formatCurrency(result.summary.totalRentPayment)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Peşinat:</span>
                    <span className="font-semibold">
                      {formatCurrency(result.summary.downPayment)}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg">
                      <span className="font-semibold">Toplam Maliyet:</span>
                      <span className="font-bold text-primary">
                        {formatCurrency(result.summary.totalOutOfPocket)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Sürdürülebilirlik</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Ortalama Ödeme/Gelir:</span>
                    <span className="font-semibold">
                      {formatPercentage(result.summary.averagePaymentToIncomeRatio)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Maksimum Ödeme/Gelir:</span>
                    <span className="font-semibold">
                      {formatPercentage(result.summary.maxPaymentToIncomeRatio)}
                    </span>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Güvenli:</span>
                      <span className="text-sm font-medium text-sustainability-safe">
                        {result.summary.sustainabilityBreakdown.safe} ay
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Dikkat:</span>
                      <span className="text-sm font-medium text-sustainability-warning">
                        {result.summary.sustainabilityBreakdown.warning} ay
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Riskli:</span>
                      <span className="text-sm font-medium text-sustainability-critical">
                        {result.summary.sustainabilityBreakdown.critical} ay
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border rounded-lg">
                <h2 className="text-xl font-semibold mb-4">Kira-Taksit Çakışması</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Çakışma Süresi:</span>
                    <span className="font-semibold">{result.summary.overlapMonths} ay</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Çakışma Maliyeti:</span>
                    <span className="font-semibold">
                      {formatCurrency(result.summary.overlapCost)}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="p-6 border rounded-lg text-center text-muted-foreground">
              <p>Hesaplama yapmak için sol taraftaki formu doldurun ve "Hesapla" butonuna tıklayın.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
