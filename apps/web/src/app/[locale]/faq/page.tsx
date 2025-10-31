'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Script from 'next/script';
import { useTranslations } from 'next-intl';

interface FAQItem {
  question: string;
  answer: string;
  reference?: string;
}

const faqData: FAQItem[] = [
  {
    question: '500 Bin Sosyal Konut Projesi nedir?',
    answer:
      "Cumhurbaşkanı tarafından açıklanan 500 bin sosyal konut projesi, uygun gelir grubundaki vatandaşların ev sahibi olmasını hedefleyen büyük ölçekli bir konut programıdır. Proje kapsamında konutlar, düşük peşinat ve uzun vadeli taksit seçenekleriyle sunulmaktadır.",
    reference: 'Kaynak: evsahibiturkiye.gov.tr',
  },
  {
    question: 'Başvuru şartları nelerdir?',
    answer:
      "Başvuru için temel şartlar:\n\n• 18 yaş ve üzeri T.C. vatandaşı olmak\n• Son 10 yıldır T.C. vatandaşı olmak\n• Başvuru yapılan ilde en az 1 yıl ikamet etmiş olmak\n• Kendisi ve eşi adına kayıtlı bağımsız konut olmaması\n• TOKİ ile daha önce sözleşme yapılmamış olması\n• Gelir şartı: İstanbul için ≤145.000₺, diğer iller için ≤127.000₺ (yıllık hane geliri)",
    reference: 'Kaynak: TOKİ Sosyal Konut Kitapçığı',
  },
  {
    question: 'Başvuru tarihleri ne zaman?',
    answer:
      'Başvurular 10 Kasım - 19 Aralık 2025 tarihleri arasında alınacaktır. Kura çekimi 29 Aralık 2025 - 27 Şubat 2026 tarihleri arasında yapılacak, teslimatlar ise Mart 2027\'de başlayacaktır.',
    reference: 'Kaynak: Resmi açıklamalar',
  },
  {
    question: 'Peşinat ne kadar?',
    answer:
      "Konut bedelinin %10'u kadar peşinat ödemesi yapılması gerekmektedir. Peşinat, sözleşme imzalandıktan sonra ödenir. Örneğin 2.000.000₺ değerinde bir konut için 200.000₺ peşinat gerekir.",
    reference: 'Kaynak: TOKİ Sosyal Konut Kitapçığı',
  },
  {
    question: 'Taksit planı nasıl işliyor?',
    answer:
      'Peşinat sonrası kalan tutar 240 ay (20 yıl) vadeli olarak ödenir. Taksitler her 6 ayda bir artış gösterir. İlk 6 ay sabit taksit ödenir, sonraki 6 ayda belirli oranda artış olur. Bu sistem 20 yıl boyunca devam eder.',
    reference: 'Kaynak: TOKİ Sosyal Konut Kitapçığı',
  },
  {
    question: 'Taksitler ne kadar artar?',
    answer:
      'Taksitler her 6 ayda bir yaklaşık %8-12 oranında artış gösterir. Bu artış oranı, enflasyon ve diğer ekonomik göstergeler dikkate alınarak belirlenir. Örneğin ilk 6 ay 10.000₺ taksit ödüyorsanız, ikinci 6 ay yaklaşık 11.000₺ olabilir.',
    reference: 'Kaynak: Geçmiş TOKİ projeleri analizi',
  },
  {
    question: 'Kira-taksit çakışması nedir?',
    answer:
      "Konutların teslim tarihi genellikle planlanan tarihten sonra gerçekleşebilir. Bu süre zarfında hem mevcut evinizin kirasını hem de konutun taksitini ödemeniz gerekir. Bu duruma 'kira-taksit çakışması' denir. Örneğin, taksitler 2026'da başlayıp konut 2027'de teslim edilirse, 12 ay boyunca hem kira hem taksit ödersiniz.",
    reference: 'Kaynak: Sosyal Konut App analizi',
  },
  {
    question: 'Gelir artışı nasıl hesaplanır?',
    answer:
      'Hesaplama aracımızda, hane gelirinizin yıllık artış oranını girebilirsiniz. Genellikle %10-30 arası bir değer girilir. Bu oran, maaş artışları, iş değişiklikleri ve kariyer ilerlemesi gibi faktörleri dikkate alır. Muhafazakar bir tahmin için düşük oran (%10-15), iyimser tahmin için yüksek oran (%20-30) kullanabilirsiniz.',
    reference: 'Kaynak: Sosyal Konut App metodolojisi',
  },
  {
    question: 'Sürdürülebilirlik analizi nedir?',
    answer:
      "Aylık toplam ödemenizin (taksit + kira) hane gelirinize oranını gösterir:\n\n• ≤30%: Güvenli (Yeşil) - Finansal açıdan sürdürülebilir\n• 30-35%: Dikkat (Sarı) - Riskli ama yönetilebilir\n• >35%: Riskli (Kırmızı) - Finansal zorluk yaşanabilir\n\nGenel tavsiye, bu oranın %30'un altında kalmasıdır.",
    reference: 'Kaynak: Finansal planlama standartları',
  },
  {
    question: 'Kontenjanlar nasıl dağıtılıyor?',
    answer:
      'Konutlar farklı gruplara ayrı kontenjanlarla dağıtılır:\n\n• Şehit aileleri ve gaziler: %5\n• En az %40 engelliler: %5\n• 3+ çocuklu aileler: %10\n• 18-30 yaş gençler: %20\n• Emekliler: %20\n• Diğer alıcılar: %40\n\nBirden fazla kontenjan için başvuru yapabilirsiniz.',
    reference: 'Kaynak: TOKİ Sosyal Konut Kitapçığı',
  },
  {
    question: 'Başvuru ücreti var mı?',
    answer:
      'Evet, başvuru sırasında 5.000₺ başvuru ücreti ödenir. Ancak şehit yakınları ve gaziler için başvuru ücretsizdir. Bu ücret başvuru sırasında alınır ve iade edilmez.',
    reference: 'Kaynak: TOKİ Sosyal Konut Kitapçığı',
  },
  {
    question: 'Eşimle birlikte başvurabilir miyiz?',
    answer:
      'Hayır, eşler ayrı ayrı başvuru yapamaz. Hane başına sadece bir başvuru yapılabilir. Başvuru hane geliri üzerinden değerlendirilir, bu nedenle eşlerin gelirleri toplanır.',
    reference: 'Kaynak: TOKİ başvuru kuralları',
  },
  {
    question: 'Konut tiplerini seçebilir miyim?',
    answer:
      'Başvuru sırasında tercih ettiğiniz il ve ilçeyi belirtirsiniz. Konut tipleri (1+1, 2+1, 3+1 gibi) proje bazında değişir. Kura sonucunda hak kazanırsanız, mevcut konut tiplerinden seçim yapabilirsiniz.',
    reference: 'Kaynak: TOKİ başvuru süreci',
  },
  {
    question: 'Bu hesaplama aracı resmi mi?',
    answer:
      'Hayır, Sosyal Konut App resmi bir TOKİ uygulaması değildir. Açık kaynak, bağımsız bir karar destek aracıdır. Hesaplamalar, geçmiş TOKİ projeleri ve finansal planlama prensiplerine dayanır. Resmi bilgiler için toki.gov.tr ve evsahibiturkiye.gov.tr adreslerini ziyaret edin.',
    reference: 'Kaynak: Sosyal Konut App',
  },
  {
    question: 'Verilerim güvende mi?',
    answer:
      'Evet, tüm hesaplamalar tarayıcınızda yerel olarak yapılır. Hiçbir veri sunucularımıza gönderilmez veya saklanmaz. Girdiğiniz bilgiler tamamen size aittir ve yalnızca sizin cihazınızda kalır.',
    reference: 'Kaynak: Sosyal Konut App gizlilik politikası',
  },
];

export default function FAQPage({ params: { locale } }: { params: { locale: string } }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const t = useTranslations('faq');

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // JSON-LD structured data for SEO
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      {/* JSON-LD for Google Rich Snippets */}
      <Script
        id="faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <div className="container mx-auto px-4 py-16 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-blue-200">
          💡 {t('badge')}
        </div>
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      {/* FAQ Accordion */}
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <button
              onClick={() => toggleAccordion(index)}
              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <span className="font-semibold text-gray-900 pr-8 text-lg">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-brand-teal flex-shrink-0 transition-transform duration-200 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-5 pt-2">
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {faq.answer}
                </p>
                {faq.reference && (
                  <p className="text-sm text-gray-500 mt-3 italic border-l-2 border-brand-teal pl-3">
                    {faq.reference}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="mt-16 text-center p-8 bg-gradient-to-r from-brand-teal/10 to-brand-coral/10 rounded-lg border border-brand-teal/20">
        <h2 className="text-2xl font-bold mb-3 text-gray-900">
          {t('ctaTitle')}
        </h2>
        <p className="text-gray-600 mb-6">
          {t('ctaDescription')}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a
            href={`/${locale}/calculator`}
            className="inline-block bg-brand-teal text-white px-6 py-3 rounded-lg font-semibold hover:bg-brand-teal-dark transition-colors"
          >
            {t('calculate')}
          </a>
          <a
            href="https://www.toki.gov.tr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            {t('officialSite')}
          </a>
        </div>
      </div>
    </div>
    </>
  );
}
