# 🔐 Environment Variables Setup

Bu proje **açık kaynak** bir projedir. Hassas bilgiler (GTM ID, API keys) kaynak kodunda **bulunmaz**.

---

## 📋 Gerekli Environment Variables

### Development (Local)

1. `.env.local` dosyası oluştur:
```bash
cp apps/web/.env.local.example apps/web/.env.local
```

2. Dosyayı düzenle ve kendi değerlerini gir:

```bash
# apps/web/.env.local

# Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Google Tag Manager (OPTIONAL)
# Eğer analytics kullanmak istiyorsan doldur
# Yoksa boş bırak, proje çalışmaya devam eder
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
```

### Production (Vercel)

1. **Vercel Dashboard** → Projen → **Settings** → **Environment Variables**

2. Şu değişkenleri ekle:

| Key | Value | Environment |
|-----|-------|-------------|
| `NEXT_PUBLIC_GTM_ID` | `GTM-XXXXXXX` | Production, Preview, Development |

3. **Redeploy** et

---

## 🏷️ Google Tag Manager ID Nasıl Alınır?

### Adım 1: GTM Account Oluştur

1. https://tagmanager.google.com/ aç
2. **Create Account** tıkla
3. Account bilgilerini doldur:
   - Account Name: `Sosyal Konut App`
   - Country: `Turkey`

### Adım 2: Container Oluştur

1. Container Name: `Sosyal Konut Web`
2. Target platform: **Web**
3. **Create** tıkla

### Adım 3: Container ID'yi Kopyala

1. Dashboard'da sağ üstte `GTM-XXXXXXX` formatında ID göreceksin
2. Bu ID'yi kopyala
3. `.env.local` veya Vercel environment variables'a yapıştır

**Detaylı rehber:** `GTM_CLOUDFLARE_SETUP.md` dosyasını oku!

---

## ❓ GTM Olmadan Çalışır mı?

**Evet!** GTM tamamen opsiyonel. Eğer `NEXT_PUBLIC_GTM_ID` tanımlı değilse:

✅ Proje normal çalışır
✅ Tüm özellikler aktif
✅ Analytics sadece çalışmaz
✅ Cookie banner yine gösterilir (best practice)

---

## 🔒 Güvenlik Notları

### ✅ Yapılması Gerekenler:

1. **`.env.local` dosyasını asla commit etme!**
   - Zaten `.gitignore`'da var ✅

2. **Hassas bilgileri environment variable olarak sakla**
   - API keys
   - Database credentials
   - GTM/GA IDs

3. **`NEXT_PUBLIC_*` prefix'i dikkatli kullan**
   - Bu değişkenler client-side'da görünür
   - Hassas bilgiler için kullanma
   - GTM ID public olduğu için NEXT_PUBLIC_ kullanılabilir

### ❌ Yapılmaması Gerekenler:

1. ❌ Environment variables'ı kaynak koduna hardcode etme
2. ❌ API keys'i `NEXT_PUBLIC_*` prefix'i ile paylaşma
3. ❌ Database credentials'ı client-side'a expose etme

---

## 🤝 Contributing (Katkıda Bulunma)

Projeye katkıda bulunurken:

1. **Kendi GTM ID'ni kullan**
   - Test için kendi container'ını oluştur
   - Production ID'sini asla commit etme

2. **Environment variables'ı README'de belirt**
   - Yeni bir environment variable eklersen
   - `.env.local.example` dosyasını güncelle
   - Bu dosyayı güncelle

3. **Hassas bilgileri paylaşma**
   - API keys
   - GTM/GA IDs
   - Database credentials

---

## 📚 Daha Fazla Bilgi

- [GTM Setup Rehberi](./GTM_CLOUDFLARE_SETUP.md)
- [Security Checklist](./SECURITY_CHECKLIST.md)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

---

**Son Güncelleme:** 2025-01-31
