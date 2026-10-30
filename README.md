# KBM Pricing Calculator (KBM Pricing Pro)

Aplikasi kalkulator harga resmi dan pembuat memo quotation WhatsApp untuk tim marketing **Penerbit KBM Indonesia** (Depok, Sleman - Yogyakarta).

Dibuat menggunakan **Vue 3 + Vite**, terintegrasi dengan **Capacitor** untuk Android (APK), dan **Electron** untuk Desktop Windows (`.exe`).

---

## ✨ Fitur Utama

* **8 Paket Penerbitan Buku**: Nusantara New (5 eks), Terima Beres + HAKI (5 eks), Mataram (25 eks), Majapahit (50 eks), Pajajaran (100 eks), Sriwijaya (150 eks), Samudra Pasai (300 eks), Kutai Kertanegara (500 eks).
* **Kalkulator Cetak Oplah Bebas**: Berdasarkan tabel resmi 60–500 hal A5 (atau 30–250 hal A4) dan rentang oplah 5–1.000+ eksemplar.
* **Auto-Upsell Recommendation**: Saran cerdas penambahan oplah untuk mendapatkan harga satuan lebih murah.
* **Paket Konversi KTI / Tesis / Disertasi**: Standar (30 hari), VIP (15 hari), dan VVIP (7 hari) dengan opsi penambahan kata.
* **Paket E-Book**: Paket Sastra dan Non-Sastra.
* **1-Click Share ke WhatsApp**: Format penawaran resmi realtime (mode Lengkap, Ringkas, dan Komparasi).
* **Multi-Quote Comparison Memo**: Simpan beberapa skenario harga dan kirim perbandingan langsung ke calon penulis.
* **Galeri 11 Brosur Asli**: Lightbox viewer untuk mengecek brosur asli kapan saja.
* **Desain Responsif**:
  - **Smartphone (< 768px)**: Native full-edge mobile UI dengan floating action bar & persistent bottom nav.
  - **Tablet & Desktop (>= 768px)**: Dual-column master-detail layout dengan sticky invoice & live WA preview inspector.

---

## 🛠️ Panduan Build

### Prasyarat
- Node.js >= 18
- OpenJDK 17 atau 21 (untuk build Android APK)
- Android SDK Build-Tools (untuk build Android APK)

### Instalasi Dependensi
```bash
npm install
```

### Jalankan Mode Development (Web)
```bash
npm run dev
```

### Build Aplikasi Android (APK)
```bash
npm run android:build
```
Hasil APK berada di: `android/app/build/outputs/apk/debug/app-debug.apk`

### Build Aplikasi Desktop Windows (.exe)
```bash
npm run electron:build:win
```
Hasil file installer dan portable berada di folder `dist-electron/`.

---

## 📄 Lisensi
Hak Cipta © 2026 Penerbit KBM Indonesia.
