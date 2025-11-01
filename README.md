# SosyalKonutApp

**"Kira → Taksit" karar destek ve senaryo simülatörü**

TOKİCheck, TOKİ/Sosyal Konut başvurusu düşünenlerin taksit artışları, gelir artışları, kira-taksit çakışma süresi, peşinat etkisi ve teslim gecikmesi gibi kritik değişkenleri basit, şeffaf grafik ve tablolarla görmesini sağlayan açık kaynak bir araçtır.

[English](#english) | [Türkçe](#türkçe)

---

## 🇹🇷 Türkçe

### 🎯 Amaç

TOKİCheck, konut sahibi olmak isteyen vatandaşların:
- Taksit artışlarını önceden görmesini
- Gelir-taksit dengesini takip etmesini
- Kira + taksit çakışma döneminin maliyetini hesaplamasını
- Peşinat miktarının etkisini anlamasını
- Farklı senaryoları (iyimser, orta, kötümser) karşılaştırmasını

sağlar.

### ✨ Temel Özellikler

- **Artışlı Taksit Simülasyonu**: 6 ayda bir artış (memur maaş artışı/ÜFE/sabit yüzde) ile 240 aylık tablo
- **Gelir Projeksiyonu**: Yıllık % artış, tek/çift çalışan, farklı zam ayları
- **Kira-Taksit Çakışma Analizi**: 18-36 ay teslim gecikmesi senaryoları
- **Peşinat Etkisi**: Peşinat miktarının toplam ödeme ve sürdürülebilirliğe etkisi
- **Sürdürülebilirlik Göstergesi**: Taksit/gelir oranına göre yeşil/sarı/kırmızı uyarı sistemi
- **Paylaşılabilir Linkler**: Senaryolarınızı başkalarıyla paylaşın
- **Şeffaf Hesaplamalar**: Her hesaplamanın formülü açıkça görülebilir

### 👥 Ana Kullanıcı Senaryoları

1. **Asgari/2×Asgari Ücretli Hane**: "Şimdi başvurmalı mıyım?"
2. **Kira Ödeyen Hane**: "3 yıl kira+taksit çakışırsa batar mıyım?"
3. **Peşinatı Olan**: "Peşinatı arttırırsam sürdürülebilirlik nasıl değişir?"
4. **Karşılaştırmacı**: "Altın/Mevduat'ta kalsam mı, TOKİ'ye girsem mi?"
5. **Danışman/İçerik Üreticisi**: Paylaşılabilir linkle senaryoyu anlatma

### 📦 Proje Yapısı

```
SosyalKonutApp/
├── apps/
│   └── web/              # Next.js frontend (gelecekte eklenecek)
├── packages/
│   ├── engine/           # Saf TypeScript hesaplama motoru
│   ├── types/            # Paylaşılan TypeScript tipleri
│   └── config/           # Paylaşılan konfigürasyonlar
├── .github/              # CI/CD ve GitHub templates
├── docs/                 # Dokümantasyon (gelecekte)
├── LICENSE               # MIT License
├── CONTRIBUTING.md       # Katkı rehberi
└── CODE_OF_CONDUCT.md    # Davranış kuralları
```

### 🚀 Hızlı Başlangıç

#### Gereksinimler

- Node.js >= 18.0.0
- npm >= 9.0.0

#### Kurulum

```bash
# Repoyu klonlayın
git clone https://github.com/measses/SosyalKonutApp.git
cd SosyalKonutApp

# Bağımlılıkları yükleyin
npm install

# Development modunda çalıştırın
npm run dev
```

#### Testleri Çalıştırma

```bash
# Tüm testleri çalıştır
npm test

# Test coverage
npm run test:coverage
```

### 🚀 Deployment

TOKİCheck, Vercel'de tek tıkla deploy edilebilir:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/measses/SosyalKonutApp)

**Manuel Deployment:**
1. GitHub repo'yu Vercel'e import edin
2. Framework preset: Next.js (otomatik algılanır)
3. Build command: `npm run vercel-build`
4. Deploy'a tıklayın

Detaylı deployment talimatları için [DEPLOYMENT.md](DEPLOYMENT.md) dosyasına bakın.

### 🏗️ Teknoloji Stack'i

#### Backend (Mevcut)
- **TypeScript**: Tip güvenli kod
- **Vitest**: Birim testleri
- **Pure Functions**: Framework-agnostic hesaplama mantığı

#### Frontend (Planlanan)
- **Next.js 14+**: App Router ile modern React
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Erişilebilir UI bileşenleri
- **Recharts**: İnteraktif grafikler
- **next-intl**: TR/EN dil desteği

### 📊 Kullanım Örneği

```typescript
import { calculateScenario } from '@SosyalKonutApp/engine';
import { ScenarioConfig } from '@SosyalKonutApp/types';

const config: ScenarioConfig = {
  name: 'Benim Senaryom',
  installmentConfig: {
    initialAmount: 5000_00,      // 5,000 TRY (kuruş cinsinden)
    totalInstallments: 240,      // 20 yıl
    downPayment: 50000_00,       // 50,000 TRY peşinat
    increaseConfig: {
      method: 'fixed-percentage',
      percentagePerPeriod: 7.5,  // Her 6 ayda %7.5
      increasePeriod: 6,
      increasePeriodUnit: 'month'
    }
  },
  incomeConfig: {
    householdMembers: [{
      id: 'member1',
      monthlyNetIncome: 17000_00,
      employmentStatus: 'employed',
      increaseMethod: 'fixed-percentage',
      annualIncreasePercentage: 15
    }],
    // ... diğer ayarlar
  },
  rentConfig: {
    monthlyRent: 8000_00,
    annualIncreasePercentage: 25,
    deliveryDelayMonths: 24
  }
};

const result = calculateScenario(config);

console.log(`Toplam Ödeme: ${result.summary.totalPayment / 100} TRY`);
console.log(`Maksimum Ödeme/Gelir Oranı: %${result.summary.maxPaymentToIncomeRatio}`);
```

### 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen [CONTRIBUTING.md](CONTRIBUTING.md) dosyasını okuyun.

**Özellikle şu alanlarda katkı arıyoruz:**
- Hesaplama motoru iyileştirmeleri
- Veri kaynağı entegrasyonları (TCMB, TÜİK API'leri)
- UI/UX geliştirmeleri
- Test coverage artırımı
- Dokümantasyon
- Türkçe/İngilizce çeviri iyileştirmeleri

### 📝 Lisans

Bu proje [MIT License](LICENSE) altında lisanslanmıştır.

### 🙏 Teşekkürler

Tüm [katkıda bulunanlara](https://github.com/measses/SosyalKonutApp/graphs/contributors) teşekkürler!

---

## 🇬🇧 English

### 🎯 Purpose

TOKİCheck helps Turkish citizens considering TOKİ/Social Housing applications to visualize and understand:
- Installment increases over time
- Income-to-installment balance
- Rent + installment overlap period costs
- Down payment impact
- Different scenario comparisons (optimistic, moderate, pessimistic)

### ✨ Core Features

- **Escalating Installment Simulation**: 6-month increase cycles (civil servant salary/PPI/fixed %) for 240 months
- **Income Projection**: Annual % increases, single/dual income, variable raise months
- **Rent-Installment Overlap Analysis**: 18-36 month delivery delay scenarios
- **Down Payment Impact**: Effect on total payment and sustainability
- **Sustainability Indicator**: Green/yellow/red warning system based on payment-to-income ratio
- **Shareable Links**: Share your scenarios with others
- **Transparent Calculations**: Every formula is clearly visible

### 🚀 Quick Start

#### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

#### Installation

```bash
# Clone the repository
git clone https://github.com/measses/SosyalKonutApp.git
cd SosyalKonutApp

# Install dependencies
npm install

# Run in development mode
npm run dev
```

#### Running Tests

```bash
# Run all tests
npm test

# Test coverage
npm run test:coverage
```

### 🚀 Deployment

Deploy TOKİCheck to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/measses/SosyalKonutApp)

**Manual Deployment:**
1. Import GitHub repo to Vercel
2. Framework preset: Next.js (auto-detected)
3. Build command: `npm run vercel-build`
4. Click Deploy

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

### 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

**We especially need help with:**
- Calculation engine improvements
- Data source integrations (TCMB, TÜİK APIs)
- UI/UX enhancements
- Test coverage
- Documentation
- Turkish/English translations

### 📝 License

This project is licensed under the [MIT License](LICENSE).

### 🙏 Acknowledgments

Thanks to all [contributors](https://github.com/measses/SosyalKonutApp/graphs/contributors)!

---

## 📞 İletişim / Contact

- **Issues**: [GitHub Issues](https://github.com/measses/SosyalKonutApp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/measses/SosyalKonutApp/discussions)

---

**Made with ❤️ for Turkish citizens seeking affordable housing**
