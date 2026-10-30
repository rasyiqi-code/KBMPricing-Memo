// Data Harga Resmi Penerbit KBM Indonesia
// Diekstrak dari Katalog Resmi KBM Indonesia

export const QUANTITY_TIERS = [
  { id: 'tier_1', label: '5–49 Pcs/Eks', min: 5, max: 49, colIndex: 0 },
  { id: 'tier_2', label: '50–99 Pcs/Eks', min: 50, max: 99, colIndex: 1 },
  { id: 'tier_3', label: '100–149 Pcs/Eks', min: 100, max: 149, colIndex: 2 },
  { id: 'tier_4', label: '150–199 Pcs/Eks', min: 150, max: 199, colIndex: 3 },
  { id: 'tier_5', label: '200–299 Pcs/Eks', min: 200, max: 299, colIndex: 4 },
  { id: 'tier_6', label: '300–499 Pcs/Eks', min: 300, max: 499, colIndex: 5 },
  { id: 'tier_7', label: '500–1.000 Pcs/Eks', min: 500, max: 10000, colIndex: 6 }
]

export const PAGE_TIERS = [
  {
    id: 'p_60',
    a4: 30,
    a5: 60,
    label: '30 hal A4 / 60 hal A5',
    prices: [48750, 42500, 38750, 36875, 30000, 26250, 20000]
  },
  {
    id: 'p_100',
    a4: 50,
    a5: 100,
    label: '50 hal A4 / 100 hal A5',
    prices: [52500, 46250, 42500, 38125, 33750, 27500, 21250]
  },
  {
    id: 'p_150',
    a4: 75,
    a5: 150,
    label: '75 hal A4 / 150 hal A5',
    prices: [56250, 50000, 46875, 41875, 36875, 31250, 25000]
  },
  {
    id: 'p_200',
    a4: 100,
    a5: 200,
    label: '100 hal A4 / 200 hal A5',
    prices: [62500, 56250, 52500, 48125, 42500, 36250, 30000]
  },
  {
    id: 'p_250',
    a4: 125,
    a5: 250,
    label: '125 hal A4 / 250 hal A5',
    prices: [71250, 65000, 56250, 51875, 46250, 41250, 35000]
  },
  {
    id: 'p_300',
    a4: 150,
    a5: 300,
    label: '150 hal A4 / 300 hal A5',
    prices: [75000, 68750, 61250, 56875, 50000, 45000, 38750]
  },
  {
    id: 'p_350',
    a4: 175,
    a5: 350,
    label: '175 hal A4 / 350 hal A5',
    prices: [80000, 73750, 66250, 61875, 55000, 50000, 43750]
  },
  {
    id: 'p_400',
    a4: 200,
    a5: 400,
    label: '200 hal A4 / 400 hal A5',
    prices: [91250, 85000, 70000, 66875, 57500, 52500, 46250]
  },
  {
    id: 'p_450',
    a4: 225,
    a5: 450,
    label: '225 hal A4 / 450 hal A5',
    prices: [102500, 96250, 75000, 70625, 61250, 57500, 51250]
  },
  {
    id: 'p_500',
    a4: 250,
    a5: 500,
    label: '250 hal A4 / 500 hal A5',
    prices: [106250, 100000, 80000, 75625, 66250, 61250, 55000]
  }
]

export const TABLE_NOTES = [
  'Saat ini harga kertas sudah naik drastis, berlimpat-lipat, TETAPI HARGA KBM INDONESIA TETAP HEMAT.',
  'Harga Sudah termasuk Gratis Ongkos Kirim Buku ke Seluruh Indonesia & Bonus-Bonus Menarik Lainnya.',
  'Sudah Pasti dapat Bonus Gratis Gantungan Kunci bergambar Cover Buku dan Pembatas Buku.',
  'Cetak Minimal 100 Pcs dapat Bonus tambahan Kaos bergambar Cover Buku Anda.',
  'Ada Kuantitas Ada FASILITAS.'
]

export const BOOK_PACKAGES = [
  {
    id: 'nusantara_new',
    name: 'Paket Nusantara New',
    shortName: 'Nusantara New',
    originalPrice: null,
    price: 750000,
    copies: 5,
    bonusCopies: 0,
    size: 'A5 / Unesco',
    maxPages: 150,
    revisions: 2,
    coverModel: '1 Cover 2 Model',
    colorPages: 0,
    tshirtBonus: 0,
    includesHaki: false,
    includesLogo: false,
    flyerUrl: './flyers/paket-nusantara-new.jpeg',
    badge: 'Hemat Pemula',
    facilities: [
      'Layout',
      '1 Cover 2 Model',
      'Mock Up Promosi',
      'Wrapping/Pembungkus Buku',
      'Lem Buku Sangat Kuat',
      'Laminasi Doff & Glossy',
      'ISBN/QRSBN/QRCBN',
      'Serah Simpan Ke Perpusnas RI',
      'Bebas Revisi 2 Kali',
      'Lembar Pemisah Halaman',
      'Keanggotaan IKAPI',
      'File Ebook',
      'Royalty 25% Penjualan',
      'Terindeks di Google Scholar',
      'Terindeks di Google Playbook',
      'Di upload di Repository OMP',
      'Sertifikat Penulis',
      'Gratis 100% Ongkos Kirim Buku ke Seluruh Indonesia'
    ]
  },
  {
    id: 'terima_beres',
    name: 'Paket Terima Beres (+HAKI)',
    shortName: 'Terima Beres',
    originalPrice: null,
    price: 1250000,
    copies: 5,
    bonusCopies: 0,
    size: 'A5 / Unesco',
    maxPages: 150,
    revisions: 2,
    coverModel: '1 Cover 2 Model',
    colorPages: 0,
    tshirtBonus: 0,
    includesHaki: true,
    includesLogo: false,
    flyerUrl: './flyers/paket-terima-beres.jpeg',
    badge: 'Populer + HAKI',
    facilities: [
      'Layout',
      '1 Cover 2 Model',
      'Mock Up Promosi',
      'Wrapping/Pembungkus Buku',
      'Lem Buku Sangat Kuat',
      'Laminasi Doff & Glossy',
      'ISBN/QRSBN Perpusnas/QRCBN',
      'Serah Simpan Ke Perpusnas RI',
      'Bebas Revisi 2 Kali',
      'Lembar Pemisah Halaman',
      'Keanggotaan IKAPI',
      'Terindeks di Google Playbook',
      'Terindeks di Google Scholar',
      'Di Upload Repository OMP',
      'Sertifikat Penulis',
      'Sertifikat Hak Cipta Buku (HAKI) Dari Kemenkumham',
      'Royalty 25% Penjualan',
      'File Ebook',
      'Gratis 100% Ongkos Kirim Buku ke Seluruh Indonesia'
    ]
  },
  {
    id: 'mataram',
    name: 'Paket Mataram',
    shortName: 'Mataram',
    originalPrice: null,
    price: 1406250,
    copies: 25,
    bonusCopies: 2,
    size: 'A5 / Unesco',
    maxPages: 150,
    revisions: 3,
    coverModel: '2 Pilihan Cover',
    colorPages: 0,
    tshirtBonus: 0,
    includesHaki: false,
    includesLogo: false,
    flyerUrl: './flyers/paket-mataram.jpeg',
    badge: '25 + 2 Eks',
    facilities: [
      'Layout',
      '2 Pilihan Cover',
      'Mock Up Promosi',
      'Wrapping/Pembungkus Buku',
      'Lem Buku Sangat Kuat',
      'Laminasi Doff & Glossy',
      'ISBN/QRSBN Perpusnas/QRCBN',
      'Serah Simpan Ke Perpusnas RI',
      'Bebas Revisi 3 Kali',
      'Lembar Pemisah Halaman',
      'Keanggotaan IKAPI',
      'Terindeks di Google Playbook',
      'Terindeks di Google Scholar',
      'Upload di Repository OMP',
      'Sertifikat Penulis',
      'Royalty 25% Penjualan',
      'File Ebook',
      'Gratis 100% Ongkos Kirim Buku ke Seluruh Indonesia',
      'Tambahan 2 Eksemplar Gratis'
    ]
  },
  {
    id: 'majapahit',
    name: 'Paket Majapahit',
    shortName: 'Majapahit',
    originalPrice: 2812500,
    price: 2500000,
    copies: 50,
    bonusCopies: 2,
    size: 'A5 / Unesco',
    maxPages: 150,
    revisions: 3,
    coverModel: '2 Pilihan Cover',
    colorPages: 0,
    tshirtBonus: 0,
    includesHaki: false,
    includesLogo: true,
    flyerUrl: './flyers/paket-majapahit.jpeg',
    badge: 'Hemat Rp 312.500',
    facilities: [
      'Layout',
      '2 Pilihan Cover',
      'Mock Up Promosi',
      'Wrapping/Pembungkus Buku',
      'Lem Buku Sangat Kuat',
      'Laminasi Doff & Glossy',
      'ISBN/QRSBN Perpusnas/QRCBN',
      'Serah Simpan Ke Perpusnas RI',
      'Bebas Revisi 3 Kali',
      'Lembar Pemisah Halaman',
      'Keanggotaan IKAPI',
      'Di Upload di Repository OMP',
      'Terindeks di Google Scholar',
      'Terindeks di Google Playbook',
      'Sertifikat Penulis',
      'Pasang Logo',
      'Royalty 25% Penjualan',
      'File Ebook',
      'Gratis 100% Ongkos Kirim Buku ke Seluruh Indonesia',
      'Tambahan 2 Eksemplar Gratis'
    ]
  },
  {
    id: 'pajajaran',
    name: 'Paket Pajajaran',
    shortName: 'Pajajaran',
    originalPrice: 5625000,
    price: 4687500,
    copies: 100,
    bonusCopies: 2,
    size: 'A5 / Unesco',
    maxPages: 150,
    revisions: 3,
    coverModel: '2 Pilihan Cover',
    colorPages: 0,
    tshirtBonus: 1,
    includesHaki: false,
    includesLogo: true,
    flyerUrl: './flyers/paket-pajajaran.jpeg',
    badge: 'Bonus Kaos + 2 Eks',
    facilities: [
      'Layout',
      '2 Pilihan Cover',
      'Mock Up Promosi',
      'Wrapping/Pembungkus Buku',
      'Lem Buku Sangat Kuat',
      'Laminasi Doff & Glossy',
      'ISBN/QRSBN Perpusnas/QRCBN',
      'Serah Simpan Ke Perpusnas RI',
      'Bebas Revisi 3 Kali',
      'Lembar Pemisah Halaman',
      'Keanggotaan IKAPI',
      'File Ebook',
      'Terindeks di Google Scholar',
      'Terindeks di Google Playbook',
      'Di Upload di Repository OMP',
      'Pasang Logo',
      'Royalty 25% Penjualan',
      'Sertifikat Penulis',
      'Gratis 100% Ongkos Kirim Buku ke Seluruh Indonesia',
      'Tambahan 2 Eksemplar Gratis',
      'Bonus 1 Kaos Eksklusif'
    ]
  },
  {
    id: 'sriwijaya',
    name: 'Paket Sriwijaya',
    shortName: 'Sriwijaya',
    originalPrice: 8437500,
    price: 6281250,
    copies: 150,
    bonusCopies: 3,
    size: 'A5 / Unesco',
    maxPages: 150,
    revisions: 3,
    coverModel: '2 Pilihan Cover',
    colorPages: 1,
    tshirtBonus: 1,
    includesHaki: false,
    includesLogo: true,
    flyerUrl: './flyers/paket-sriwijaya.jpeg',
    badge: 'Hemat Rp 2,15 Jt',
    facilities: [
      'Layout',
      '2 Pilihan Cover',
      'Mock Up Promosi',
      '1 Halaman Warna',
      'Wrapping/Pembungkus Buku',
      'Lem Buku Sangat Kuat',
      'Laminasi Doff & Glossy',
      'ISBN/QRSBN Perpusnas/QRCBN',
      'Serah Simpan Ke Perpusnas RI',
      'Bebas Revisi 3 Kali',
      'Lembar Pemisah Halaman',
      'Keanggotaan IKAPI',
      'Di Upload di Repository OMP',
      'Terindeks di Google Scholar',
      'Terindeks di Google Playbook',
      'Sertifikat Penulis',
      'Pasang Logo',
      'Royalty 25% Penjualan',
      'File Ebook',
      'Gratis 100% Ongkos Kirim Buku ke Seluruh Indonesia',
      'Tambahan 3 Eksemplar Gratis',
      'Bonus 1 Kaos Eksklusif'
    ]
  },
  {
    id: 'samudra_pasai',
    name: 'Paket Samudra Pasai',
    shortName: 'Samudra Pasai',
    originalPrice: 16875000,
    price: 9375000,
    copies: 300,
    bonusCopies: 7,
    size: 'A5 / Unesco',
    maxPages: 150,
    revisions: 3,
    coverModel: '2 Pilihan Cover',
    colorPages: 2,
    tshirtBonus: 1,
    includesHaki: false,
    includesLogo: true,
    flyerUrl: './flyers/paket-samudra-pasai.jpeg',
    badge: 'Hemat Rp 7,5 Jt',
    facilities: [
      'Layout',
      '2 Pilihan Cover',
      'Mock Up Promosi',
      '2 Halaman Warna',
      'Wrapping/Pembungkus Buku',
      'Lem Buku Sangat Kuat',
      'Laminasi Doff & Glossy',
      'ISBN/QRSBN Perpusnas/QRCBN',
      'Serah Simpan Ke Perpusnas RI',
      'Bebas Revisi 3 Kali',
      'Lembar Pemisah Halaman',
      'Keanggotaan IKAPI',
      'Terindeks di Google Playbook',
      'Terindeks di Google Scholar',
      'Di Upload di Repository OMP',
      'Sertifikat Penulis',
      'Pasang Logo',
      'Royalty 25% Penjualan',
      'File Ebook',
      'Gratis 100% Ongkos Kirim Buku ke Seluruh Indonesia',
      'Tambahan 7 Eksemplar Gratis',
      'Bonus 1 Kaos Eksklusif'
    ]
  },
  {
    id: 'kutai_kertanegara',
    name: 'Paket Kutai Kertanegara',
    shortName: 'Kutai Kertanegara',
    originalPrice: 28125000,
    price: 12500000,
    copies: 500,
    bonusCopies: 10,
    size: 'A5 / Unesco',
    maxPages: 150,
    revisions: 3,
    coverModel: '2 Pilihan Cover',
    colorPages: 2,
    tshirtBonus: 2,
    includesHaki: false,
    includesLogo: true,
    flyerUrl: './flyers/paket-kutai-kertanegara.jpeg',
    badge: 'Hemat Rp 15,6 Jt',
    facilities: [
      'Layout',
      '2 Pilihan Cover',
      '2 Mockup Promosi',
      '2 Halaman Warna',
      'Wrapping/Pembungkus Buku',
      'Lem Buku Sangat Kuat',
      'Laminasi Doff & Glossy',
      'ISBN/QRSBN/QRCBN Perpusnas',
      'Serah Simpan ke Perpusnas RI',
      'Bebas Revisi 3 Kali',
      'Lembar Pemisah Halaman',
      'Keanggotaan IKAPI',
      'File Ebook',
      'Di Upload di Repository OMP',
      'Terindeks di Google Scholar',
      'Terindeks di Google Playbook',
      'Sertifikat Penulis',
      'Pasang Logo',
      'Royalty 25% Penjualan',
      'Gratis 100% Ongkos Kirim Buku ke Seluruh Indonesia',
      'Tambahan 10 Eksemplar Gratis',
      'Bonus 2 Kaos Eksklusif'
    ]
  }
]

export const CONVERSION_PACKAGES = [
  {
    id: 'konversi_standar',
    name: 'Konversi STANDAR',
    duration: '30 Hari Kerja',
    originalPrice: 2000000,
    price: 1500000,
    badge: 'Hemat Rp 500.000'
  },
  {
    id: 'konversi_vip',
    name: 'Konversi VIP',
    duration: '15 Hari Kerja',
    originalPrice: 2000000,
    price: 1750000,
    badge: 'Cepat 15 Hari'
  },
  {
    id: 'konversi_vvip',
    name: 'Konversi VVIP',
    duration: '7 Hari Kerja',
    originalPrice: 2000000,
    price: 1900000,
    badge: 'Kilat 7 Hari'
  }
]

export const CONVERSION_FACILITIES = [
  'ISBN Resmi Perpusnas RI',
  'Gratis Ongkir ke Seluruh Indonesia',
  '5 Eksemplar Buku Cetak',
  'Mengubah Judul',
  'Mengubah Struktur BAB',
  'Mengubah Struktur Daftar Isi',
  'Mengubah Parafrase Basic',
  'Proofreading Basic',
  'Desain Cover 2 Pilihan',
  'Layout Buku Profesional',
  'LoA / Invoice Resmi',
  'e-Sertifikat Penulis',
  'Maksimal Hasil 150 Halaman',
  'Hasil Ukuran A5 / Unesco',
  'PDF / E-Book Watermark',
  'Revisi 3 Kali',
  'Serah-simpan Perpusnas RI',
  'Upload OMP (Open Monograph Press)',
  'Penjualan di Marketplace dengan Royalty 25% dari Harga Dasar Penjualan'
]

export const CONVERSION_EXCLUDED = [
  'Penambahan Materi Isi (Rp 1.000.000 / 3.000 kata, berlaku kelipatan)',
  'Merubah Gaya Kepenulisan',
  'Input Mendeley'
]

export const EBOOK_PACKAGES = [
  {
    id: 'ebook_sastra',
    name: 'Paket E-Book Sastra',
    category: 'Sastra (Novel, Puisi, Cerpen, Antologi)',
    price: 250000,
    size: 'A5 / Unesco',
    maxPages: 200
  },
  {
    id: 'ebook_non_sastra',
    name: 'Paket E-Book Non Sastra',
    category: 'Non Sastra (Pendidikan, Referensi, Monograf, Umum)',
    price: 400000,
    size: 'A5 / Unesco',
    maxPages: 200
  }
]

export const EBOOK_FACILITIES = [
  'Layout Profesional',
  '1 Cover Eksklusif',
  'Mock Up Promosi',
  'QRSBN Perpusnas / QRCBN / ISBN',
  'Serah Simpan Ke Perpusnas RI',
  'Bebas Revisi 2 Kali',
  'Royalty / Bagi hasil 25% dari harga dasar Cetak',
  'Keanggotaan IKAPI',
  'File Ebook / PDF Ber-Watermark',
  'Terindeks di Google Scholar & Google Playbook (GB)',
  'Di Upload di Repository OMP',
  'Sertifikat Penulis',
  'Dapat Diajukan Hak Cipta Buku (HAKI) Dari Kemenkumham'
]

export const FLYERS_LIST = [
  { id: 'tabel', title: 'Daftar Harga Terbit Buku (Tabel)', url: './flyers/tabel-harga.jpeg', category: 'Tabel' },
  { id: 'konversi', title: 'Paket & Layanan Konversi KTI/Skripsi/Tesis', url: './flyers/paket-konversi.jpeg', category: 'Konversi' },
  { id: 'ebook', title: 'Paket Penerbitan E-Book', url: './flyers/paket-ebook.jpeg', category: 'E-Book' },
  { id: 'nusantara', title: 'Paket Nusantara New (Rp 750.000 - 5 Eks)', url: './flyers/paket-nusantara-new.jpeg', category: 'Buku Cetak' },
  { id: 'terimaberes', title: 'Paket Terima Beres (Rp 1.250.000 - 5 Eks + HAKI)', url: './flyers/paket-terima-beres.jpeg', category: 'Buku Cetak' },
  { id: 'mataram', title: 'Paket Mataram (Rp 1.406.250 - 25 Eks)', url: './flyers/paket-mataram.jpeg', category: 'Buku Cetak' },
  { id: 'majapahit', title: 'Paket Majapahit (Rp 2.500.000 - 50 Eks)', url: './flyers/paket-majapahit.jpeg', category: 'Buku Cetak' },
  { id: 'pajajaran', title: 'Paket Pajajaran (Rp 4.687.500 - 100 Eks)', url: './flyers/paket-pajajaran.jpeg', category: 'Buku Cetak' },
  { id: 'sriwijaya', title: 'Paket Sriwijaya (Rp 6.281.250 - 150 Eks)', url: './flyers/paket-sriwijaya.jpeg', category: 'Buku Cetak' },
  { id: 'samudrapasai', title: 'Paket Samudra Pasai (Rp 9.375.000 - 300 Eks)', url: './flyers/paket-samudra-pasai.jpeg', category: 'Buku Cetak' },
  { id: 'kutai', title: 'Paket Kutai Kertanegara (Rp 12.500.000 - 500 Eks)', url: './flyers/paket-kutai-kertanegara.jpeg', category: 'Buku Cetak' }
]

// Helper Functions
export function getQuantityTier(qty) {
  const safeQty = Math.max(5, Number(qty) || 5)
  for (const tier of QUANTITY_TIERS) {
    if (safeQty >= tier.min && safeQty <= tier.max) {
      return tier
    }
  }
  return QUANTITY_TIERS[QUANTITY_TIERS.length - 1]
}

export function getPageTier(pages, paperSize = 'A5') {
  const numPages = Math.max(1, Number(pages) || 150)
  const key = paperSize === 'A4' ? 'a4' : 'a5'
  for (const tier of PAGE_TIERS) {
    if (numPages <= tier[key]) {
      return { ...tier, extraPages: 0, extraCostPerBook: 0 }
    }
  }
  // Jika melebihi 500 hal A5 / 250 hal A4, hitung proporsional per kelipatan 50 hal A5 (25 hal A4)
  const maxTier = PAGE_TIERS[PAGE_TIERS.length - 1]
  const step = paperSize === 'A4' ? 25 : 50
  const extraSteps = Math.ceil((numPages - maxTier[key]) / step)
  // Rata-rata kenaikan per step sekitar Rp 4.500 - Rp 5.000 per buku
  const extraCostPerBook = extraSteps * 5000
  return {
    ...maxTier,
    label: `${numPages} hal ${paperSize} (> ${maxTier[key]} hal)`,
    extraPages: numPages - maxTier[key],
    extraCostPerBook
  }
}

export function formatRupiah(amount) {
  const num = Math.round(Number(amount) || 0)
  return 'Rp ' + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}
