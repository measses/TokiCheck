'use client';

import { useState } from 'react';
import { TOKI_HOUSING_PRICES, type RegionType, type HousingType } from '@tokicheck/types';
import { formatCurrency } from '@/lib/utils';

interface HousingSelectorProps {
  onSelect: (housing: typeof TOKI_HOUSING_PRICES[keyof typeof TOKI_HOUSING_PRICES]) => void;
}

export function HousingSelector({ onSelect }: HousingSelectorProps) {
  const [selectedRegion, setSelectedRegion] = useState<RegionType>('anadolu');
  const [selectedHousing, setSelectedHousing] = useState<HousingType>('2+1_65');

  const regionOptions = [
    { value: 'anadolu', label: 'Anadolu İlleri', description: 'İstanbul dışındaki tüm iller' },
    { value: 'istanbul', label: 'İstanbul', description: 'Sadece İstanbul için' },
  ];

  const housingOptions = [
    { value: '1+1_55', label: '1+1', sqm: '55 m²', icon: '🏠' },
    { value: '2+1_65', label: '2+1', sqm: '65 m²', icon: '🏡' },
    { value: '2+1_80', label: '2+1', sqm: '80 m²', icon: '🏘️' },
  ];

  const currentHousing = TOKI_HOUSING_PRICES[`${selectedRegion}_${selectedHousing}`];

  const handleSelection = () => {
    if (currentHousing) {
      onSelect(currentHousing);
    }
  };

  return (
    <div className="space-y-6">
      {/* Region Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Bölge Seçin</label>
        <div className="grid md:grid-cols-2 gap-3">
          {regionOptions.map((region) => (
            <button
              key={region.value}
              onClick={() => setSelectedRegion(region.value as RegionType)}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                selectedRegion === region.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold text-gray-900">{region.label}</div>
              <div className="text-sm text-gray-500 mt-1">{region.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Housing Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Konut Tipi Seçin</label>
        <div className="grid md:grid-cols-3 gap-3">
          {housingOptions.map((housing) => (
            <button
              key={housing.value}
              onClick={() => setSelectedHousing(housing.value as HousingType)}
              className={`p-4 border-2 rounded-lg text-center transition-all ${
                selectedHousing === housing.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-3xl mb-2">{housing.icon}</div>
              <div className="font-semibold text-gray-900">{housing.label}</div>
              <div className="text-sm text-gray-500">{housing.sqm}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Housing Details */}
      {currentHousing && (
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-sm opacity-90">Seçtiğiniz Konut</div>
              <div className="text-2xl font-bold mt-1">
                {housingOptions.find(h => h.value === selectedHousing)?.label} • {currentHousing.squareMeters} m²
              </div>
              <div className="text-sm opacity-90 mt-1">
                {selectedRegion === 'istanbul' ? 'İstanbul' : 'Anadolu İlleri'}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-sm opacity-90 mb-1">Peşinat (%10)</div>
              <div className="text-2xl font-bold">{formatCurrency(currentHousing.downPayment)}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-sm opacity-90 mb-1">İlk Taksit</div>
              <div className="text-2xl font-bold">{formatCurrency(currentHousing.monthlyInstallment)}</div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-sm opacity-90 mb-1">Toplam Fiyat</div>
              <div className="text-2xl font-bold">{formatCurrency(currentHousing.totalPrice)}</div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 text-sm opacity-90">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>240 ay vade • Her 6 ayda bir memur maaş artışı</span>
          </div>

          <button
            onClick={handleSelection}
            className="w-full mt-6 bg-white text-blue-600 font-semibold py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Bu Konutla Devam Et →
          </button>
        </div>
      )}
    </div>
  );
}
