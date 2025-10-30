import * as XLSX from 'xlsx';
import type { ScenarioResult } from '@tokicheck/types';
import { formatCurrency, formatPercentage } from './utils';

export function exportToExcel(result: ScenarioResult, housingInfo?: string) {
  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // Sheet 1: Özet (Summary)
  const ws1 = XLSX.utils.aoa_to_sheet([
    ['TOKİ Hesaplama Raporu'],
    [''],
    ['Tarih', new Date().toLocaleDateString('tr-TR')],
    ['Konut', housingInfo || '-'],
    [''],
    ['ÖZET BİLGİLER', ''],
    ['Peşinat', formatCurrency(result.summary.downPayment)],
    ['Toplam Taksit Ödemesi (20 yıl)', formatCurrency(result.summary.totalInstallmentPayment)],
    ['Toplam Kira Ödemesi', formatCurrency(result.summary.totalRentPayment)],
    ['Genel Toplam Maliyet', formatCurrency(result.summary.totalOutOfPocket)],
    [''],
    ['ÖDEME/GELİR ORANLARI', ''],
    ['Başlangıç Oranı', formatPercentage(result.periodData[0]?.paymentToIncomeRatio || 0)],
    ['Ortalama Oran', formatPercentage(result.summary.averagePaymentToIncomeRatio)],
    ['Maksimum Oran', formatPercentage(result.summary.maxPaymentToIncomeRatio)],
    ['Maksimum Oran Ayı', `${result.summary.maxRatioPeriod}. Ay`],
    [''],
    ['SÜRDÜRÜLEBİLİRLİK ANALİZİ', ''],
    ['Güvenli Aylar (≤30%)', `${result.summary.sustainabilityBreakdown.safe} ay`],
    ['Dikkat Ayları (30-35%)', `${result.summary.sustainabilityBreakdown.warning} ay`],
    ['Riskli Aylar (>35%)', `${result.summary.sustainabilityBreakdown.critical} ay`],
  ]);

  // Set column widths
  ws1['!cols'] = [{ wch: 35 }, { wch: 25 }];

  // Merge title cell
  ws1['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } }];

  XLSX.utils.book_append_sheet(wb, ws1, 'Özet');

  // Sheet 2: Aylık Detay (Monthly Detail)
  const monthlyHeaders = [
    'Ay',
    'Yıl',
    'Taksit (₺)',
    'Kira (₺)',
    'Toplam Ödeme (₺)',
    'Hane Geliri (₺)',
    'Ödeme/Gelir (%)',
    'Durum',
  ];

  const monthlyData = result.periodData.map((period) => [
    period.period,
    Math.ceil(period.period / 12),
    period.installmentAmount / 100,
    period.isRentingPeriod ? period.rentAmount / 100 : 0,
    period.totalMonthlyPayment / 100,
    period.householdIncome / 100,
    parseFloat(period.paymentToIncomeRatio.toFixed(2)),
    period.sustainabilityStatus === 'safe'
      ? 'Güvenli'
      : period.sustainabilityStatus === 'warning'
      ? 'Dikkat'
      : 'Riskli',
  ]);

  const ws2 = XLSX.utils.aoa_to_sheet([monthlyHeaders, ...monthlyData]);

  // Set column widths
  ws2['!cols'] = [
    { wch: 8 },
    { wch: 8 },
    { wch: 15 },
    { wch: 15 },
    { wch: 18 },
    { wch: 18 },
    { wch: 15 },
    { wch: 12 },
  ];

  // Add auto filter to header row
  ws2['!autofilter'] = { ref: `A1:H${monthlyData.length + 1}` };

  XLSX.utils.book_append_sheet(wb, ws2, 'Aylık Detay');

  // Sheet 3: Yıllık Özet (Yearly Summary)
  const yearlyHeaders = ['Yıl', 'Toplam Taksit (₺)', 'Toplam Kira (₺)', 'Toplam Ödeme (₺)', 'Ort. Gelir (₺)', 'Ort. Oran (%)'];

  const yearlyData = [];
  for (let year = 1; year <= 20; year++) {
    const startPeriod = (year - 1) * 12;
    const endPeriod = year * 12;
    const yearPeriods = result.periodData.slice(startPeriod, endPeriod);

    if (yearPeriods.length === 0) continue;

    const totalInstallment = yearPeriods.reduce((sum, p) => sum + p.installmentAmount, 0) / 100;
    const totalRent = yearPeriods.reduce((sum, p) => sum + p.rentAmount, 0) / 100;
    const totalPayment = yearPeriods.reduce((sum, p) => sum + p.totalMonthlyPayment, 0) / 100;
    const avgIncome = yearPeriods.reduce((sum, p) => sum + p.householdIncome, 0) / yearPeriods.length / 100;
    const avgRatio = yearPeriods.reduce((sum, p) => sum + p.paymentToIncomeRatio, 0) / yearPeriods.length;

    yearlyData.push([
      year,
      totalInstallment.toFixed(2),
      totalRent.toFixed(2),
      totalPayment.toFixed(2),
      avgIncome.toFixed(2),
      avgRatio.toFixed(2),
    ]);
  }

  const ws3 = XLSX.utils.aoa_to_sheet([yearlyHeaders, ...yearlyData]);

  // Set column widths
  ws3['!cols'] = [
    { wch: 8 },
    { wch: 20 },
    { wch: 18 },
    { wch: 20 },
    { wch: 18 },
    { wch: 15 },
  ];

  // Add auto filter to header row
  ws3['!autofilter'] = { ref: `A1:F${yearlyData.length + 1}` };

  XLSX.utils.book_append_sheet(wb, ws3, 'Yıllık Özet');

  // Generate filename with date
  const filename = `TOKI_Hesaplama_${new Date().toISOString().split('T')[0]}.xlsx`;

  // Write the file
  XLSX.writeFile(wb, filename);
}
