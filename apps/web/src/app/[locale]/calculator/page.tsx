'use client';

import { useState, useEffect } from 'react';
import { calculateScenario } from '@tokicheck/engine';
import type { ScenarioConfig, HousingPrice } from '@tokicheck/types';
import { DEFAULT_PRESETS } from '@tokicheck/types';
import { HousingSelector } from '@/components/calculator/HousingSelector';
import { SummaryCards } from '@/components/calculator/SummaryCards';
import { InstallmentTable } from '@/components/calculator/InstallmentTable';
import { ChartSection } from '@/components/calculator/ChartSection';
import { formatCurrency } from '@/lib/utils';
import { exportToExcel } from '@/lib/exportToExcel';
import { exportToPDF } from '@/lib/exportToPDF';

type Step = 'housing' | 'details' | 'results';

export default function CalculatorPage() {
  const [currentStep, setCurrentStep] = useState<Step>('housing');
  const [selectedHousing, setSelectedHousing] = useState<HousingPrice | null>(null);
  const [result, setResult] = useState<ReturnType<typeof calculateScenario> | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Form states
  const [monthlyIncome, setMonthlyIncome] = useState(100_000); // 100,000 TL (as TL, not kuruş)
  const [incomeIncrease, setIncomeIncrease] = useState(15);
  const [isRenting, setIsRenting] = useState(true); // Yeni: Kiracı mı?
  const [monthlyRent, setMonthlyRent] = useState(15_000);
  const [rentIncrease, setRentIncrease] = useState(25);
  const [deliveryDelay, setDeliveryDelay] = useState(24);
  const [installmentIncrease, setInstallmentIncrease] = useState(7.5);
  const [selectedPreset, setSelectedPreset] = useState<'optimistic' | 'moderate' | 'pessimistic'>('moderate');

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

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
          monthlyRent: isRenting ? monthlyRent * 100 : 0,
          annualIncreasePercentage: isRenting ? rentIncrease : 0,
          deliveryDelayMonths: isRenting ? deliveryDelay : 0,
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
    {
      value: 'optimistic',
      label: 'İyimser',
      description: 'Düşük artış oranları',
      emoji: '😊',
      details: DEFAULT_PRESETS.optimistic
    },
    {
      value: 'moderate',
      label: 'Gerçekçi',
      description: 'Orta seviye artışlar',
      emoji: '😐',
      details: DEFAULT_PRESETS.moderate
    },
    {
      value: 'pessimistic',
      label: 'Kötümser',
      description: 'Yüksek artış oranları',
      emoji: '😟',
      details: DEFAULT_PRESETS.pessimistic
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Progress Steps */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Sosyal Konut Taksit Hesaplayıcı</h1>
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
                  className={`p-4 border-2 rounded-lg transition-all text-left ${
                    selectedPreset === preset.value ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{preset.emoji}</div>
                  <div className="font-semibold">{preset.label}</div>
                  <div className="text-sm text-gray-500 mt-1 mb-3">{preset.description}</div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600">Taksit Artışı:</span>
                      <span className="font-semibold text-blue-600">%{preset.details.installmentIncreasePercentage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gelir Artışı:</span>
                      <span className="font-semibold text-green-600">%{preset.details.incomeIncreasePercentage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Kira Artışı:</span>
                      <span className="font-semibold text-orange-600">%{preset.details.rentIncreasePercentage}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Teslimat:</span>
                      <span className="font-semibold text-purple-600">{preset.details.deliveryDelayMonths} ay</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border text-sm text-gray-700">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <strong>Senaryo seçimi</strong> taksit artışı, gelir artışı, kira artışı ve teslimat süresini otomatik ayarlar.
                  Daha sonra bu değerleri özelleştirebilirsiniz.
                </div>
              </div>
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
                {/* Kiracı mı? Checkbox */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <input
                    type="checkbox"
                    id="isRenting"
                    checked={isRenting}
                    onChange={(e) => setIsRenting(e.target.checked)}
                    className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-600"
                  />
                  <div className="flex-1">
                    <label htmlFor="isRenting" className="font-medium text-gray-900 cursor-pointer flex items-center gap-2">
                      Şu an kiracıyım
                      <InfoTooltip />
                    </label>
                    <p className="text-sm text-gray-600 mt-1">
                      TOKİ konutu teslim edilene kadar kira ödemesi yapıyorum
                    </p>
                  </div>
                </div>

                {/* Kira detayları - Sadece kiracı ise göster */}
                {isRenting && (
                  <div className="space-y-4 pt-2">
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
                      label="Tahmini Teslimat Gecikmesi (Ay)"
                      value={deliveryDelay}
                      onChange={(e) => setDeliveryDelay(Number(e.target.value))}
                      type="number"
                      step="6"
                    />
                    <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded border">
                      <strong>💡 Not:</strong> TOKİ projelerinde teslimat gecikmesi yaşanabilir.
                      Bu sürede hem kira hem taksit ödemesi yaparsınız.
                    </div>
                  </div>
                )}
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <button onClick={() => setCurrentStep('details')} className="text-blue-600 hover:text-blue-800 flex items-center gap-2 font-medium">
              ← Ayarları Değiştir
            </button>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const housingInfo = selectedHousing
                    ? `${selectedHousing.housingType.replace('_', ' • ')} - ${selectedHousing.region === 'istanbul' ? 'İstanbul' : 'Anadolu'}`
                    : undefined;
                  exportToExcel(result, housingInfo);
                }}
                className="px-4 py-2 border rounded-lg hover:bg-green-50 hover:border-green-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Excel İndir
              </button>
              <button
                onClick={() => {
                  const housingInfo = selectedHousing
                    ? `${selectedHousing.housingType.replace('_', ' • ')} - ${selectedHousing.region === 'istanbul' ? 'İstanbul' : 'Anadolu'}`
                    : undefined;
                  exportToPDF(result, housingInfo);
                }}
                className="px-4 py-2 border rounded-lg hover:bg-red-50 hover:border-red-600 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                PDF İndir
              </button>
            </div>
          </div>

          <SummaryCards result={result} />
          <ChartSection result={result} />
          <InstallmentTable result={result} isRenting={isRenting} />
        </div>
      )}
    </div>
  );
}

// Helper Components
function InfoTooltip() {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className="w-5 h-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center hover:bg-blue-600 transition-colors"
      >
        i
      </button>
      {showTooltip && (
        <div className="absolute left-0 top-6 z-50 w-80 p-4 bg-gray-900 text-white text-sm rounded-lg shadow-xl">
          <div className="font-semibold mb-2">🏠 Kira-Taksit Çakışması Nedir?</div>
          <div className="space-y-2 text-xs leading-relaxed">
            <p>
              <strong>Durum:</strong> TOKİ sözleşmesi imzaladığınızda taksitler başlar,
              ancak konut teslimi 18-36 ay sonra olabilir.
            </p>
            <p>
              <strong>Sonuç:</strong> Bu sürede hem <span className="text-orange-300">kira</span> hem de{' '}
              <span className="text-blue-300">taksit</span> ödersiniz.
            </p>
            <p>
              <strong>Örnek:</strong> İlk 24 ay → 15.000₺ kira + 8.250₺ taksit =
              <span className="text-red-300 font-bold"> 23.250₺/ay</span>
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-700 text-xs text-gray-400">
            💡 Bu maliyet hesaplamaya otomatik dahil edilir
          </div>
        </div>
      )}
    </div>
  );
}

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

function FormInput({
  label,
  value,
  onChange,
  type = 'text',
  step
}: {
  label: string;
  value: number | string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  step?: string;
}) {
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
