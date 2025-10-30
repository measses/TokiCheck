import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { ScenarioResult } from '@tokicheck/types';
import { formatCurrency, formatPercentage } from './utils';

export function exportToPDF(result: ScenarioResult, housingInfo?: string) {
  const doc = new jsPDF();

  // Add Turkish font support (using default fonts for now)
  doc.setFont('helvetica');

  // Title
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235); // blue-600
  doc.text('TOKI Hesaplama Raporu', 105, 20, { align: 'center' });

  // Date and Housing Info
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 14, 35);
  if (housingInfo) {
    doc.text(`Konut: ${housingInfo}`, 14, 42);
  }

  // Summary Section
  let yPosition = housingInfo ? 55 : 48;

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text('Ozet Bilgiler', 14, yPosition);

  yPosition += 8;
  doc.setFontSize(10);

  const summaryData = [
    ['Peşinat', formatCurrency(result.summary.downPayment)],
    ['Toplam Taksit Ödemesi (20 yıl)', formatCurrency(result.summary.totalInstallmentPayment)],
    ['Toplam Kira Ödemesi', formatCurrency(result.summary.totalRentPayment)],
    ['Genel Toplam Maliyet', formatCurrency(result.summary.totalOutOfPocket)],
  ];

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
  doc.text('Odeme/Gelir Oranlari', 14, yPosition);

  yPosition += 8;

  const ratioData = [
    ['Baslangic Orani', formatPercentage(result.periodData[0]?.paymentToIncomeRatio || 0)],
    ['Ortalama Oran', formatPercentage(result.summary.averagePaymentToIncomeRatio)],
    ['Maksimum Oran', formatPercentage(result.summary.maxPaymentToIncomeRatio)],
    ['Maksimum Oran Ayi', `${result.summary.maxRatioPeriod}. Ay`],
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
  doc.text('Surdurulebilirlik Analizi', 14, yPosition);

  yPosition += 8;

  const sustainabilityData = [
    ['Guvenli Aylar (≤30%)', `${result.summary.sustainabilityBreakdown.safe} ay`],
    ['Dikkat Aylari (30-35%)', `${result.summary.sustainabilityBreakdown.warning} ay`],
    ['Riskli Aylar (>35%)', `${result.summary.sustainabilityBreakdown.critical} ay`],
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
  doc.text('Aylik Detay (Ilk 60 Ay)', 14, 20);

  // Monthly Detail Table (first 60 months for space)
  const monthlyHeaders = [['Ay', 'Taksit', 'Kira', 'Toplam', 'Gelir', 'Oran', 'Durum']];

  const monthlyData = result.periodData.slice(0, 60).map((period) => [
    period.period.toString(),
    formatCurrency(period.installmentAmount).replace(/\s/g, ''),
    period.isRentingPeriod ? formatCurrency(period.rentAmount).replace(/\s/g, '') : '-',
    formatCurrency(period.totalMonthlyPayment).replace(/\s/g, ''),
    formatCurrency(period.householdIncome).replace(/\s/g, ''),
    formatPercentage(period.paymentToIncomeRatio),
    period.sustainabilityStatus === 'safe' ? 'Guvenli' : period.sustainabilityStatus === 'warning' ? 'Dikkat' : 'Riskli',
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
      `Sayfa ${i} / ${pageCount} - TOKİCheck tarafindan olusturuldu`,
      105,
      290,
      { align: 'center' }
    );
  }

  // Generate filename with date
  const filename = `TOKI_Hesaplama_${new Date().toISOString().split('T')[0]}.pdf`;

  // Save the PDF
  doc.save(filename);
}
