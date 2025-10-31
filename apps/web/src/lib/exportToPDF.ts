import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ScenarioResult } from '@tokicheck/types';
import { formatCurrency, formatPercentage } from './utils';

export function exportToPDF(result: ScenarioResult, housingInfo?: string) {
  const doc = new jsPDF();

  // Helper function to convert Turkish characters
  const turkishToLatin = (text: string): string => {
    const map: { [key: string]: string } = {
      'ç': 'c', 'Ç': 'C',
      'ğ': 'g', 'Ğ': 'G',
      'ı': 'i', 'İ': 'I',
      'ö': 'o', 'Ö': 'O',
      'ş': 's', 'Ş': 'S',
      'ü': 'u', 'Ü': 'U',
      '₺': 'TL'
    };
    return text.replace(/[çÇğĞıİöÖşŞüÜ₺]/g, char => map[char] || char);
  };

  doc.setFont('helvetica');

  // Title
  doc.setFontSize(20);
  doc.setTextColor(90, 140, 140); // teal from logo
  doc.text(turkishToLatin('Sosyal Konut Hesaplama Raporu'), 105, 20, { align: 'center' });

  // Date and Housing Info
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(turkishToLatin(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`), 14, 35);
  if (housingInfo) {
    doc.text(turkishToLatin(`Konut: ${housingInfo}`), 14, 42);
  }

  // Summary Section
  let yPosition = housingInfo ? 55 : 48;

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(turkishToLatin('Ozet Bilgiler'), 14, yPosition);

  yPosition += 8;
  doc.setFontSize(10);

  const summaryData = [
    [turkishToLatin('Pesinat'), turkishToLatin(formatCurrency(result.summary.downPayment))],
    [turkishToLatin('Toplam Taksit Odemesi (20 yil)'), turkishToLatin(formatCurrency(result.summary.totalInstallmentPayment))],
    [turkishToLatin('Toplam Kira Odemesi'), turkishToLatin(formatCurrency(result.summary.totalRentPayment))],
    [turkishToLatin('Genel Toplam Maliyet'), turkishToLatin(formatCurrency(result.summary.totalOutOfPocket))],
  ].map(row => row.map(cell => turkishToLatin(cell)));

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: summaryData,
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: 2,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { halign: 'right', cellWidth: 80 },
    },
  });

  // Payment to Income Ratios
  yPosition = (doc as any).lastAutoTable.finalY + 12;

  doc.setFontSize(14);
  doc.text(turkishToLatin('Odeme/Gelir Oranlari'), 14, yPosition);

  yPosition += 8;

  const ratioData = [
    [turkishToLatin('Baslangic Orani'), turkishToLatin(formatPercentage(result.periodData[0]?.paymentToIncomeRatio || 0))],
    [turkishToLatin('Ortalama Oran'), turkishToLatin(formatPercentage(result.summary.averagePaymentToIncomeRatio))],
    [turkishToLatin('Maksimum Oran'), turkishToLatin(formatPercentage(result.summary.maxPaymentToIncomeRatio))],
    [turkishToLatin('Maksimum Oran Ayi'), turkishToLatin(`${result.summary.maxRatioPeriod}. Ay`)],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: ratioData,
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: 2,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { halign: 'right', cellWidth: 80 },
    },
  });

  // Sustainability Analysis
  yPosition = (doc as any).lastAutoTable.finalY + 12;

  doc.setFontSize(14);
  doc.text(turkishToLatin('Surdurulebilirlik Analizi'), 14, yPosition);

  yPosition += 8;

  const sustainabilityData = [
    [turkishToLatin('Guvenli Aylar (<=30%)'), turkishToLatin(`${result.summary.sustainabilityBreakdown.safe} ay`)],
    [turkishToLatin('Dikkat Aylari (30-35%)'), turkishToLatin(`${result.summary.sustainabilityBreakdown.warning} ay`)],
    [turkishToLatin('Riskli Aylar (>35%)'), turkishToLatin(`${result.summary.sustainabilityBreakdown.critical} ay`)],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [],
    body: sustainabilityData,
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: 2,
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 80 },
      1: { halign: 'right', cellWidth: 80 },
    },
  });

  // Add new page for monthly detail table
  doc.addPage();

  doc.setFontSize(14);
  doc.text(turkishToLatin('Aylik Detay (Tum 240 Ay)'), 14, 20);

  // Monthly Detail Table (all 240 months with auto page break)
  const monthlyHeaders = [[turkishToLatin('Ay'), turkishToLatin('Taksit'), turkishToLatin('Kira'), turkishToLatin('Toplam'), turkishToLatin('Gelir'), turkishToLatin('Oran'), turkishToLatin('Durum')]];

  const monthlyData = result.periodData.map((period) => [
    period.period.toString(),
    turkishToLatin(formatCurrency(period.installmentAmount).replace(/\s/g, '')),
    period.isRentingPeriod ? turkishToLatin(formatCurrency(period.rentAmount).replace(/\s/g, '')) : '-',
    turkishToLatin(formatCurrency(period.totalMonthlyPayment).replace(/\s/g, '')),
    turkishToLatin(formatCurrency(period.householdIncome).replace(/\s/g, '')),
    turkishToLatin(formatPercentage(period.paymentToIncomeRatio)),
    turkishToLatin(period.sustainabilityStatus === 'safe' ? 'Guvenli' : period.sustainabilityStatus === 'warning' ? 'Dikkat' : 'Riskli'),
  ]);

  autoTable(doc, {
    startY: 28,
    head: monthlyHeaders,
    body: monthlyData,
    theme: 'grid',
    styles: {
      fontSize: 8,
      cellPadding: 1.5,
    },
    headStyles: {
      fillColor: [37, 99, 235],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' },
      1: { cellWidth: 25, halign: 'right' },
      2: { cellWidth: 25, halign: 'right' },
      3: { cellWidth: 25, halign: 'right' },
      4: { cellWidth: 25, halign: 'right' },
      5: { cellWidth: 20, halign: 'center' },
      6: { cellWidth: 20, halign: 'center' },
    },
    didParseCell: (data) => {
      // Color code status column
      if (data.column.index === 6 && data.row.section === 'body') {
        const status = data.cell.text[0];
        if (status === 'Guvenli') {
          data.cell.styles.textColor = [34, 197, 94]; // green
        } else if (status === 'Dikkat') {
          data.cell.styles.textColor = [234, 179, 8]; // yellow
        } else if (status === 'Riskli') {
          data.cell.styles.textColor = [239, 68, 68]; // red
        }
      }
    },
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      turkishToLatin(`Sayfa ${i} / ${pageCount} - Sosyal Konut App tarafindan olusturuldu`),
      105,
      290,
      { align: 'center' }
    );
  }

  // Generate filename with date
  const filename = `SosyalKonut_Hesaplama_${new Date().toISOString().split('T')[0]}.pdf`;

  // Save the PDF
  doc.save(filename);
}
