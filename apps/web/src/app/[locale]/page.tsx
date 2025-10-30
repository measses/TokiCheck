import Link from 'next/link';
import { setRequestLocale } from 'next-intl/server';

export default function HomePage({ params: { locale } }: { params: { locale: string } }) {
  // Enable static rendering
  setRequestLocale(locale);
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <div className="inline-block bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
          🏗️ 500 Bin Sosyal Konut Projesi
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-primary">
          TOKİ Başvurusu Yapmalı mıyım?
        </h1>
        <p className="text-xl text-muted-foreground mb-4 max-w-3xl mx-auto">
          Taksit artışları, gelir dengesi ve kira-taksit çakışmasını şeffaf tablolar ve grafiklerle görün
        </p>
        <p className="text-lg text-muted-foreground mb-8 max-w-3xl mx-auto">
          📅 <strong>Başvurular:</strong> 10 Kasım - 19 Aralık 2025 •
          🎲 <strong>Kura:</strong> 29 Aralık 2025 - 27 Şubat 2026 •
          🏠 <strong>Teslimat:</strong> Mart 2027
        </p>
        <Link
          href={`/${locale}/calculator`}
          className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Hemen Hesapla
        </Link>
      </section>

      {/* Features Grid */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">
          Neler Hesaplayabilirsiniz?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Taksit Simülasyonu</h3>
            <p className="text-sm text-muted-foreground">
              6 ayda bir artışlı, 240 aylık taksit takvimi
            </p>
          </div>

          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Gelir Projeksiyonu</h3>
            <p className="text-sm text-muted-foreground">
              Hane gelirinizin zaman içindeki değişimi
            </p>
          </div>

          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Sürdürülebilirlik</h3>
            <p className="text-sm text-muted-foreground">
              Taksit/gelir oranına göre risk analizi
            </p>
          </div>

          <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">Kira-Taksit Çakışması</h3>
            <p className="text-sm text-muted-foreground">
              Teslimat gecikmesi dönemindeki ek maliyet
            </p>
          </div>
        </div>
      </section>

      {/* Project Info */}
      <section className="mb-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Proje Hakkında</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Başvuru Şartları */}
          <div className="border rounded-lg p-6 bg-blue-50/50">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              📋 Başvuru Şartları
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>T.C. vatandaşı, 18 yaş üstü</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Son 10 yıldır T.C. vatandaşı</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Başvuru yerinde en az 1 yıl ikamet</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>Üzerine kayıtlı bağımsız konut yok</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold">✓</span>
                <span>TOKİ ile daha önce sözleşme yapılmamış</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">💰</span>
                <span><strong>Gelir Şartı:</strong> İstanbul: ≤145.000₺ / Diğer: ≤127.000₺</span>
              </li>
            </ul>
          </div>

          {/* Kontenjanlar */}
          <div className="border rounded-lg p-6 bg-green-50/50">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              👥 Kontenjanlar
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span>🎖️ Şehit aileleri, gaziler</span>
                <span className="font-bold text-green-700">%5</span>
              </div>
              <div className="flex justify-between items-center">
                <span>♿ En az %40 engelli</span>
                <span className="font-bold text-green-700">%5</span>
              </div>
              <div className="flex justify-between items-center">
                <span>👶 3+ çocuklu aileler</span>
                <span className="font-bold text-green-700">%10</span>
              </div>
              <div className="flex justify-between items-center">
                <span>🎓 18-30 yaş gençler</span>
                <span className="font-bold text-blue-700">%20</span>
              </div>
              <div className="flex justify-between items-center">
                <span>👴 Emekliler</span>
                <span className="font-bold text-blue-700">%20</span>
              </div>
              <div className="flex justify-between items-center">
                <span>🏘️ Diğer alıcılar</span>
                <span className="font-bold text-gray-700">%40</span>
              </div>
            </div>
          </div>

          {/* Ödeme Detayları */}
          <div className="border rounded-lg p-6 bg-purple-50/50 md:col-span-2">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              💳 Ödeme Planı
            </h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex flex-col items-center p-3 bg-white rounded-lg">
                <span className="text-2xl mb-2">💵</span>
                <span className="font-semibold">Başvuru Ücreti</span>
                <span className="text-lg font-bold text-purple-600">5.000₺</span>
                <span className="text-xs text-gray-500 mt-1">Şehit yakınları/gaziler: Ücretsiz</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-white rounded-lg">
                <span className="text-2xl mb-2">🏦</span>
                <span className="font-semibold">Peşinat</span>
                <span className="text-lg font-bold text-purple-600">%10</span>
                <span className="text-xs text-gray-500 mt-1">Sözleşme sırasında</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-white rounded-lg">
                <span className="text-2xl mb-2">📅</span>
                <span className="font-semibold">Vade</span>
                <span className="text-lg font-bold text-purple-600">240 Ay</span>
                <span className="text-xs text-gray-500 mt-1">20 yıl, her 6 ayda artış</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Kimler İçin?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            'Asgari/2×Asgari Ücretli',
            'Kira Ödeyen',
            'Peşinatı Olan',
            'Karşılaştırmacı',
            'Danışman/İçerik Üreticisi',
          ].map((persona, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg text-center hover:bg-accent transition-colors"
            >
              <p className="font-medium">{persona}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center py-12 bg-accent rounded-lg">
        <h2 className="text-2xl font-bold mb-4">
          Açık Kaynak ve Ücretsiz
        </h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          TOKİCheck açık kaynak bir projedir. Kodları inceleyebilir, katkıda bulunabilir ve şeffaf hesaplamaları görebilirsiniz.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href={`/${locale}/calculator`}
            className="inline-block bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            Hesaplamaya Başla
          </Link>
          <a
            href="https://github.com/measses/TokiCheck"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-primary text-primary px-6 py-2 rounded-lg font-semibold hover:bg-primary/10 transition-colors"
          >
            GitHub'da İncele
          </a>
        </div>
      </section>
    </div>
  );
}
