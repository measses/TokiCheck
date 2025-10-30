'use client';

import { useState } from 'react';
import { calculateScenario } from '@tokicheck/engine';
import type { ScenarioConfig, HousingPrice } from '@tokicheck/types';
import { DEFAULT_PRESETS } from '@tokicheck/types';
import { HousingSelector } from '@/components/calculator/HousingSelector';
import { SummaryCards } from '@/components/calculator/SummaryCards';
import { InstallmentTable } from '@/components/calculator/InstallmentTable';
import { formatCurrency } from '@/lib/utils';

type Step = 'housing' | 'details' | 'results';

export default function CalculatorPage() {
  const [currentStep, setCurrentStep] = useState<Step>('housing');
  const [selectedHousing, setSelectedHousing] = useState<HousingPrice | null>(null);
  const [result, setResult] = useState<ReturnType<typeof calculateScenario> | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Form states
  const [monthlyIncome, setMonthlyIncome] = useState(100_000); // 100,000 TL (as TL, not kuruş)
  const [incomeIncrease, setIncomeIncrease] = useState(15);
  const [monthlyRent, setMonthlyRent] = useState(15_000);
  const [rentIncrease, setRentIncrease] = useState(25);
  const [deliveryDelay, setDeliveryDelay] = useState(24);
  const [installmentIncrease, setInstallmentIncrease] = useState(7.5);
  const [selectedPreset, setSelectedPreset] = useState<'optimistic' | 'moderate' | 'pessimistic'>('moderate');

  const handleHousingSelect = (housing: HousingPrice) => {
    setSelectedHousing(housing);
    setCurrentStep('details');
  };

  const handlePresetSelect = (preset: typeof selectedPreset) => {
    setSelectedPreset(preset);
    const presetData = DEFAULT_PRESETS[preset];
    setInstallmentIncrease(presetData.installmentIncreasePercentage);
    setIncomeIncrease(presetData.incomeIncreasePercentage);
    setRentIncrease(presetData.rentIncreasePercentage);
    setDeliveryDelay(presetData.deliveryDelayMonths);
  };

  const handleCalculate = () => {
    if (!selectedHousing) return;
    setIsCalculating(true);

    try {
      const config: ScenarioConfig = {
        name: 'TOKİ Hesaplama',
        installmentConfig: {
          initialAmount: selectedHousing.monthlyInstallment,
          totalInstallments: 240,
          downPayment: selectedHousing.downPayment,
          increaseConfig: {
            method: 'fixed-percentage',
            percentagePerPeriod: installmentIncrease,
            increasePeriod: 6,
            increasePeriodUnit: 'month',
          },
        },
        incomeConfig: {
          householdMembers: [
            {
              id: 'member1',
              monthlyGrossIncome: monthlyIncome * 100,
              monthlyNetIncome: monthlyIncome * 100,
              employmentStatus: 'employed',
              increaseMethod: 'fixed-percentage',
              annualIncreasePercentage: incomeIncrease,
            },
          ],
          defaultIncreaseMethod: 'fixed-percentage',
          defaultAnnualIncreasePercentage: incomeIncrease,
          projectionPeriods: 240,
          projectionPeriodUnit: 'month',
        },
        rentConfig: {
          monthlyRent: monthlyRent * 100,
          annualIncreasePercentage: rentIncrease,
          deliveryDelayMonths: deliveryDelay,
        },
      };

      const scenarioResult = calculateScenario(config);
      setResult(scenarioResult);
      setCurrentStep('results');
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const presetOptions = [
    { value: 'optimistic', label: 'İyimser', description: 'Düşük artış oranları', emoji: '😊' },
    { value: 'moderate', label: 'Gerçekçi', description: 'Orta seviye artışlar', emoji: '😐' },
    { value: 'pessimistic', label: 'Kötümser', description: 'Yüksek artış oranları', emoji: '😟' },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Progress Steps */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">TOKİ Taksit Hesaplayıcı</h1>
        <div className="flex items-center gap-2 mb-2">
          <StepIndicator step={1} current={currentStep === 'housing'} completed={currentStep !== 'housing'} label="Konut" />
          <ProgressLine completed={currentStep !== 'housing'} />
          <StepIndicator step={2} current={currentStep === 'details'} completed={currentStep === 'results'} label="Bilgiler" />
          <ProgressLine completed={currentStep === 'results'} />
          <StepIndicator step={3} current={currentStep === 'results'} completed={false} label="Sonuçlar" />
        </div>
      </div>

      {/* Step 1: Housing Selection */}
      {currentStep === 'housing' && (
        <div className="max-w-4xl mx-auto">
          <HousingSelector onSelect={handleHousingSelect} />
        </div>
      )}

      {/* Step 2: Details Form */}
      {currentStep === 'details' && selectedHousing && (
        <div className="max-w-5xl mx-auto space-y-6">
          <button onClick={() => setCurrentStep('housing')} className="text-blue-600 hover:text-blue-800 flex items-center gap-2 font-medium">
            ← Konut Değiştir
          </button>

          {/* Preset Scenarios */}
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Senaryo Seçin</h2>
            <div className="grid md:grid-cols-3 gap-3">
              {presetOptions.map((preset) => (
                <button
                  key={preset.value}
                  onClick={() => handlePresetSelect(preset.value as any)}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    selectedPreset === preset.value ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{preset.emoji}</div>
                  <div className="font-semibold">{preset.label}</div>
                  <div className="text-sm text-gray-500 mt-1">{preset.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Form Inputs */}
            <div className="space-y-6">
              <FormSection title="Gelir Bilgileri">
                <FormInput
                  label="Aylık Net Gelir (₺)"
                  value={monthlyIncome}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  type="number"
                  step="1000"
                />
                <FormInput
                  label="Yıllık Gelir Artışı (%)"
                  value={incomeIncrease}
                  onChange={(e) => setIncomeIncrease(Number(e.target.value))}
                  type="number"
                  step="1"
                />
              </FormSection>

              <FormSection title="Kira Bilgileri">
                <FormInput
                  label="Aylık Kira (₺)"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  type="number"
                  step="1000"
                />
                <FormInput
                  label="Yıllık Kira Artışı (%)"
                  value={rentIncrease}
                  onChange={(e) => setRentIncrease(Number(e.target.value))}
                  type="number"
                  step="1"
                />
                <FormInput
                  label="Teslimat Gecikmesi (Ay)"
                  value={deliveryDelay}
                  onChange={(e) => setDeliveryDelay(Number(e.target.value))}
                  type="number"
                  step="6"
                />
              </FormSection>

              <FormSection title="Taksit Artış Oranı">
                <FormInput
                  label="6 Aylık Artış (%)"
                  value={installmentIncrease}
                  onChange={(e) => setInstallmentIncrease(Number(e.target.value))}
                  type="number"
                  step="0.5"
                />
                <div className="text-sm text-gray-500 mt-2">
                  💡 TOKİ resmi artış: Memur maaş artış oranı (yaklaşık %7.5)
                </div>
              </FormSection>
            </div>

            {/* Selected Housing Summary */}
            <div className="bg-gradient-to-br from-gray-50 to-white border rounded-lg p-6 h-fit">
              <h3 className="text-lg font-semibold mb-4">Seçili Konut</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600">Konut Tipi</div>
                  <div className="text-xl font-bold">{selectedHousing.housingType.replace('_', ' • ')} m²</div>
                  <div className="text-sm text-gray-600">{selectedHousing.region === 'istanbul' ? 'İstanbul' : 'Anadolu İlleri'}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="text-xs text-gray-600">Peşinat</div>
                    <div className="text-lg font-bold text-blue-600">{formatCurrency(selectedHousing.downPayment)}</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border">
                    <div className="text-xs text-gray-600">İlk Taksit</div>
                    <div className="text-lg font-bold text-purple-600">{formatCurrency(selectedHousing.monthlyInstallment)}</div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="text-xs text-blue-600">Toplam Fiyat</div>
                  <div className="text-2xl font-bold text-blue-700">{formatCurrency(selectedHousing.totalPrice)}</div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleCalculate}
            disabled={isCalculating}
            className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors text-lg"
          >
            {isCalculating ? 'Hesaplanıyor...' : 'Hesapla ve Sonuçları Gör →'}
          </button>
        </div>
      )}

      {/* Step 3: Results */}
      {currentStep === 'results' && result && (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <button onClick={() => setCurrentStep('details')} className="text-blue-600 hover:text-blue-800 flex items-center gap-2 font-medium">
              ← Ayarları Değiştir
            </button>
            <div className="flex gap-2">
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Excel İndir
              </button>
              <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Paylaş
              </button>
            </div>
          </div>

          <SummaryCards result={result} />
          <InstallmentTable result={result} />
        </div>
      )}
    </div>
  );
}

// Helper Components
function StepIndicator({ step, current, completed, label }: { step: number; current: boolean; completed: boolean; label: string }) {
  return (
    <div className={`flex items-center gap-2 ${current ? 'text-blue-600 font-semibold' : completed ? 'text-green-600' : 'text-gray-400'}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${current ? 'bg-blue-600 text-white' : completed ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>
        {completed ? '✓' : step}
      </div>
      <span className="hidden sm:inline">{label}</span>
    </div>
  );
}

function ProgressLine({ completed }: { completed: boolean }) {
  return (
    <div className="flex-1 h-1 bg-gray-200 rounded mx-2">
      <div className={`h-full rounded transition-all duration-300 ${completed ? 'bg-green-600 w-full' : 'w-0'}`}></div>
    </div>
  );
}

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function FormInput({ label, value, onChange, type = 'text', step }: { label: string; value: any; onChange: any; type?: string; step?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        step={step}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
      />
    </div>
  );
}
