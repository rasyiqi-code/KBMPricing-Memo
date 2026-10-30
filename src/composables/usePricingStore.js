import { ref, computed, watch } from 'vue'
import { Share } from '@capacitor/share'
import { Clipboard } from '@capacitor/clipboard'
import {
  BOOK_PACKAGES,
  CONVERSION_PACKAGES,
  CONVERSION_FACILITIES,
  EBOOK_PACKAGES,
  EBOOK_FACILITIES,
  PAGE_TIERS,
  QUANTITY_TIERS,
  getQuantityTier,
  getPageTier,
  formatRupiah
} from '../data/pricingData.js'

// Singleton reactive state so all modular components share the same calculator state
const activeTab = ref('paket')

// Customer & Marketing Info
const showCustomerForm = ref(false)
const customerName = ref('')
const customerPhone = ref('')
const bookTitle = ref('')
const marketingName = ref(
  typeof localStorage !== 'undefined' ? localStorage.getItem('kbm_marketing_name') || '' : ''
)
const customNotes = ref('')

watch(marketingName, (val) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('kbm_marketing_name', val || '')
  }
})

// ==================== 1. STATE PAKET BUKU CETAK ====================
const selectedPkgId = ref('terima_beres')
const pkgActualPages = ref(150)
const pkgExtraCopies = ref(0)
const pkgAddHaki = ref(false)
const pkgHakiFee = ref(500000)
const pkgDiscountType = ref('nominal')
const pkgDiscountValue = ref(0)
const pkgDiscountLabel = ref('Diskon Akademisi (Dosen/Guru/Mahasiswa)')

const selectedBookPkg = computed(() => {
  return BOOK_PACKAGES.find((p) => p.id === selectedPkgId.value) || BOOK_PACKAGES[0]
})

watch(selectedPkgId, (newId) => {
  const pkg = BOOK_PACKAGES.find((p) => p.id === newId)
  if (pkg && pkg.includesHaki) {
    pkgAddHaki.value = false
  }
})

const pkgCalculation = computed(() => {
  const pkg = selectedBookPkg.value
  const totalCopies = pkg.copies + (Number(pkgExtraCopies.value) || 0)
  const qtyTier = getQuantityTier(totalCopies)
  const pageTier = getPageTier(pkgActualPages.value, 'A5')
  const base150Tier = PAGE_TIERS.find((t) => t.a5 === 150)

  let extraPageCostPerBook = 0
  if (pkgActualPages.value > 150) {
    const currentTierUnit = pageTier.prices[qtyTier.colIndex] + pageTier.extraCostPerBook
    const base150Unit = base150Tier.prices[qtyTier.colIndex]
    extraPageCostPerBook = Math.max(0, currentTierUnit - base150Unit)
  }
  const totalExtraPageCost = extraPageCostPerBook * pkg.copies

  const unitPriceExtraCopy = pageTier.prices[qtyTier.colIndex] + pageTier.extraCostPerBook
  const extraCopiesCount = Math.max(0, Number(pkgExtraCopies.value) || 0)
  const totalExtraCopiesCost = extraCopiesCount * unitPriceExtraCopy

  const hakiCost = !pkg.includesHaki && pkgAddHaki.value ? Number(pkgHakiFee.value) || 0 : 0
  const subtotal = pkg.price + totalExtraPageCost + totalExtraCopiesCost + hakiCost

  let discountAmount = 0
  const rawDisc = Math.max(0, Number(pkgDiscountValue.value) || 0)
  if (pkgDiscountType.value === 'percent') {
    discountAmount = Math.round((subtotal * Math.min(100, rawDisc)) / 100)
  } else {
    discountAmount = Math.min(subtotal, rawDisc)
  }

  const grandTotal = Math.max(0, subtotal - discountAmount)
  const originalBase = pkg.originalPrice || pkg.price
  const totalBeforeDiscount = originalBase + totalExtraPageCost + totalExtraCopiesCost + hakiCost
  const totalSaved = Math.max(0, totalBeforeDiscount - grandTotal)

  return {
    pkg,
    actualPages: pkgActualPages.value,
    pageTierLabel: pageTier.label,
    extraPageCostPerBook,
    totalExtraPageCost,
    extraCopiesCount,
    unitPriceExtraCopy,
    totalExtraCopiesCost,
    hakiCost,
    subtotal,
    discountAmount,
    grandTotal,
    totalSaved,
    totalCopiesReceived: pkg.copies + pkg.bonusCopies + extraCopiesCount
  }
})

// ==================== 2. STATE CETAK / TERBIT KUSTOM (TABEL) ====================
const customPaperSize = ref('A5')
const customPages = ref(150)
const customQty = ref(50)
const customAddHaki = ref(false)
const customHakiFee = ref(500000)
const customDiscountType = ref('nominal')
const customDiscountValue = ref(0)

function setPaperSize(size) {
  if (customPaperSize.value === size) return
  if (size === 'A4') {
    customPages.value = Math.max(30, Math.round(customPages.value / 2))
  } else {
    customPages.value = Math.max(60, customPages.value * 2)
  }
  customPaperSize.value = size
}

const customCalculation = computed(() => {
  const safeQty = Math.max(5, Number(customQty.value) || 5)
  const qtyTier = getQuantityTier(safeQty)
  const pageTier = getPageTier(customPages.value, customPaperSize.value)

  const unitPrice = pageTier.prices[qtyTier.colIndex] + pageTier.extraCostPerBook
  const baseTierUnitPrice = pageTier.prices[0] + pageTier.extraCostPerBook

  const printTotal = unitPrice * safeQty
  const normalPrintTotal = baseTierUnitPrice * safeQty
  const tierSavings = Math.max(0, normalPrintTotal - printTotal)

  const hakiCost = customAddHaki.value ? Number(customHakiFee.value) || 0 : 0
  const subtotal = printTotal + hakiCost

  let discountAmount = 0
  const rawDisc = Math.max(0, Number(customDiscountValue.value) || 0)
  if (customDiscountType.value === 'percent') {
    discountAmount = Math.round((subtotal * Math.min(100, rawDisc)) / 100)
  } else {
    discountAmount = Math.min(subtotal, rawDisc)
  }

  const grandTotal = Math.max(0, subtotal - discountAmount)
  const totalSavings = tierSavings + discountAmount

  let upsellTip = null
  const nextTierIndex = qtyTier.colIndex + 1
  if (nextTierIndex < QUANTITY_TIERS.length) {
    const nextTier = QUANTITY_TIERS[nextTierIndex]
    const nextTierMinQty = nextTier.min
    const nextTierUnitPrice = pageTier.prices[nextTierIndex] + pageTier.extraCostPerBook
    const nextTierTotal = nextTierUnitPrice * nextTierMinQty
    const diffCost = nextTierTotal - printTotal
    const extraBooks = nextTierMinQty - safeQty

    if (diffCost <= 0) {
      upsellTip = {
        targetQty: nextTierMinQty,
        extraBooks,
        nextUnitPrice: nextTierUnitPrice,
        nextTotal: nextTierTotal,
        diffCost,
        cheaper: true,
        message: `Cetak ${nextTierMinQty} Eks (${nextTier.label}) harga satuannya turun menjadi ${formatRupiah(nextTierUnitPrice)}/eks. Totalnya justru LEBIH HEMAT ${formatRupiah(Math.abs(diffCost))} dan dapat +${extraBooks} buku lebih banyak!`
      }
    } else if (extraBooks <= 25 || diffCost <= unitPrice * 5) {
      upsellTip = {
        targetQty: nextTierMinQty,
        extraBooks,
        nextUnitPrice: nextTierUnitPrice,
        nextTotal: nextTierTotal,
        diffCost,
        cheaper: false,
        message: `Tambah ${extraBooks} Eks lagi ke ${nextTierMinQty} Eks (${nextTier.label}), harga satuan turun jadi ${formatRupiah(nextTierUnitPrice)}/eks (hanya tambah ${formatRupiah(diffCost)} untuk +${extraBooks} buku${nextTierMinQty >= 100 && safeQty < 100 ? ' + GRATIS Bonus Kaos Cover Buku!' : '!'}).`
      }
    }
  }

  const bonuses = [
    'Gratis Ongkos Kirim Buku ke Seluruh Indonesia',
    'Bonus Gratis Gantungan Kunci Bergambar Cover Buku',
    'Bonus Gratis Pembatas Buku Eksklusif'
  ]
  if (safeQty >= 100) {
    bonuses.push('Bonus Tambahan Kaos Bergambar Cover Buku (Min. Cetak 100 Pcs)')
  }

  return {
    paperSize: customPaperSize.value,
    pages: customPages.value,
    qty: safeQty,
    qtyTier,
    pageTier,
    unitPrice,
    baseTierUnitPrice,
    printTotal,
    normalPrintTotal,
    tierSavings,
    hakiCost,
    subtotal,
    discountAmount,
    grandTotal,
    totalSavings,
    upsellTip,
    bonuses
  }
})

// ==================== 3. STATE KONVERSI SKRIPSI/TESIS/DISERTASI/KTI ====================
const selectedKonversiId = ref('konversi_standar')
const konversiExtraWordsBlocks = ref(0)
const konversiExtraCopies = ref(0)
const konversiActualPages = ref(150)
const konversiCustomAddonCost = ref(0)
const konversiCustomAddonName = ref('Input Mendeley / Ubah Gaya Kepenulisan')
const konversiDiscountType = ref('nominal')
const konversiDiscountValue = ref(0)

const selectedKonversiPkg = computed(() => {
  return CONVERSION_PACKAGES.find((p) => p.id === selectedKonversiId.value) || CONVERSION_PACKAGES[0]
})

const konversiCalculation = computed(() => {
  const pkg = selectedKonversiPkg.value
  const wordBlocks = Math.max(0, Number(konversiExtraWordsBlocks.value) || 0)
  const extraWordsCost = wordBlocks * 1000000

  const extraCopies = Math.max(0, Number(konversiExtraCopies.value) || 0)
  const totalCopies = 5 + extraCopies
  const qtyTier = getQuantityTier(totalCopies)
  const pageTier = getPageTier(konversiActualPages.value, 'A5')
  const unitPriceExtraCopy = pageTier.prices[qtyTier.colIndex] + pageTier.extraCostPerBook
  const extraCopiesCost = extraCopies * unitPriceExtraCopy

  const base150Tier = PAGE_TIERS.find((t) => t.a5 === 150)
  let extraPageCostPerBook = 0
  if (konversiActualPages.value > 150) {
    const currentUnit = pageTier.prices[qtyTier.colIndex] + pageTier.extraCostPerBook
    const baseUnit = base150Tier.prices[qtyTier.colIndex]
    extraPageCostPerBook = Math.max(0, currentUnit - baseUnit)
  }
  const extraPageCost = extraPageCostPerBook * 5

  const customAddon = Math.max(0, Number(konversiCustomAddonCost.value) || 0)
  const subtotal = pkg.price + extraWordsCost + extraCopiesCost + extraPageCost + customAddon

  let discountAmount = 0
  const rawDisc = Math.max(0, Number(konversiDiscountValue.value) || 0)
  if (konversiDiscountType.value === 'percent') {
    discountAmount = Math.round((subtotal * Math.min(100, rawDisc)) / 100)
  } else {
    discountAmount = Math.min(subtotal, rawDisc)
  }

  const grandTotal = Math.max(0, subtotal - discountAmount)
  const promoSavings = pkg.originalPrice - pkg.price + discountAmount

  return {
    pkg,
    wordBlocks,
    extraWordsCount: wordBlocks * 3000,
    extraWordsCost,
    extraCopies,
    totalCopies,
    unitPriceExtraCopy,
    extraCopiesCost,
    actualPages: konversiActualPages.value,
    extraPageCost,
    customAddon,
    subtotal,
    discountAmount,
    grandTotal,
    promoSavings
  }
})

// ==================== 4. STATE PAKET E-BOOK ====================
const selectedEbookId = ref('ebook_non_sastra')
const ebookPages = ref(200)
const ebookExtraPageFeePer50 = ref(50000)
const ebookAddHaki = ref(false)
const ebookHakiFee = ref(500000)
const ebookDiscountType = ref('nominal')
const ebookDiscountValue = ref(0)

const selectedEbookPkg = computed(() => {
  return EBOOK_PACKAGES.find((p) => p.id === selectedEbookId.value) || EBOOK_PACKAGES[0]
})

const ebookCalculation = computed(() => {
  const pkg = selectedEbookPkg.value
  const pages = Math.max(1, Number(ebookPages.value) || 200)
  const extraPages = Math.max(0, pages - pkg.maxPages)
  const extraBlocks = extraPages > 0 ? Math.ceil(extraPages / 50) : 0
  const extraPagesCost = extraBlocks * (Number(ebookExtraPageFeePer50.value) || 0)
  const hakiCost = ebookAddHaki.value ? Number(ebookHakiFee.value) || 0 : 0

  const subtotal = pkg.price + extraPagesCost + hakiCost

  let discountAmount = 0
  const rawDisc = Math.max(0, Number(ebookDiscountValue.value) || 0)
  if (ebookDiscountType.value === 'percent') {
    discountAmount = Math.round((subtotal * Math.min(100, rawDisc)) / 100)
  } else {
    discountAmount = Math.min(subtotal, rawDisc)
  }

  const grandTotal = Math.max(0, subtotal - discountAmount)

  return {
    pkg,
    pages,
    extraPages,
    extraPagesCost,
    hakiCost,
    subtotal,
    discountAmount,
    grandTotal
  }
})

// ==================== 5. MULTI-QUOTE COMPARISON & MODALS ====================
const savedQuotes = ref([])
const showCartModal = ref(false)
const activeFlyerModal = ref(null)
const toastMessage = ref('')
let toastTimer = null

function showToastMessage(msg) {
  toastMessage.value = msg
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 2600)
}

function openFlyerModal(flyer) {
  activeFlyerModal.value = flyer
}

function getActiveItemSummary() {
  if (activeTab.value === 'paket' || activeTab.value === 'referensi') {
    const c = pkgCalculation.value
    return {
      type: 'Paket Penerbitan Buku',
      title: `${c.pkg.name} (${c.totalCopiesReceived} Eks, ${c.actualPages} Hal A5)`,
      grandTotal: c.grandTotal,
      details: [
        `Harga Paket Dasar (${c.pkg.copies} Eks${c.pkg.bonusCopies ? ` + Bonus ${c.pkg.bonusCopies} Eks` : ''}): ${formatRupiah(c.pkg.price)}`,
        ...(c.totalExtraPageCost > 0 ? [`Penyesuaian ${c.actualPages} Hal (${c.pageTierLabel}): +${formatRupiah(c.totalExtraPageCost)}`] : []),
        ...(c.extraCopiesCount > 0 ? [`Tambahan Cetak ${c.extraCopiesCount} Eks (@ ${formatRupiah(c.unitPriceExtraCopy)}): +${formatRupiah(c.totalExtraCopiesCost)}`] : []),
        ...(c.hakiCost > 0 ? [`Pengajuan Sertifikat HAKI Kemenkumham: +${formatRupiah(c.hakiCost)}`] : []),
        ...(c.discountAmount > 0 ? [`${pkgDiscountLabel.value}: -${formatRupiah(c.discountAmount)}`] : [])
      ],
      facilities: c.pkg.facilities
    }
  }

  if (activeTab.value === 'custom') {
    const c = customCalculation.value
    return {
      type: 'Terbit & Cetak Buku Kustom',
      title: `Cetak ${c.qty} Eksemplar (${c.pages} Hal ${c.paperSize})`,
      grandTotal: c.grandTotal,
      details: [
        `Kategori Tier: ${c.qtyTier.label} (${c.pageTier.label})`,
        `Harga Satuan: ${formatRupiah(c.unitPrice)} / eks`,
        `Subtotal Cetak (${c.qty} Eks): ${formatRupiah(c.printTotal)}`,
        ...(c.hakiCost > 0 ? [`Sertifikat HAKI Kemenkumham: +${formatRupiah(c.hakiCost)}`] : []),
        ...(c.discountAmount > 0 ? [`Potongan Diskon Khusus: -${formatRupiah(c.discountAmount)}`] : [])
      ],
      facilities: c.bonuses
    }
  }

  if (activeTab.value === 'konversi') {
    const c = konversiCalculation.value
    return {
      type: 'Paket Konversi KTI/Skripsi/Tesis/Disertasi',
      title: `${c.pkg.name} (${c.pkg.duration} - ${c.totalCopies} Eks)`,
      grandTotal: c.grandTotal,
      details: [
        `Biaya Paket ${c.pkg.name} (${c.pkg.duration}): ${formatRupiah(c.pkg.price)} (Harga Normal ${formatRupiah(c.pkg.originalPrice)})`,
        ...(c.extraWordsCost > 0 ? [`Penambahan Materi +${c.extraWordsCount.toLocaleString('id-ID')} Kata: +${formatRupiah(c.extraWordsCost)}`] : []),
        ...(c.extraPageCost > 0 ? [`Penyesuaian ${c.actualPages} Halaman: +${formatRupiah(c.extraPageCost)}`] : []),
        ...(c.extraCopiesCost > 0 ? [`Tambahan Cetak +${c.extraCopies} Eks (@ ${formatRupiah(c.unitPriceExtraCopy)}): +${formatRupiah(c.extraCopiesCost)}`] : []),
        ...(c.customAddon > 0 ? [`${konversiCustomAddonName.value}: +${formatRupiah(c.customAddon)}`] : []),
        ...(c.discountAmount > 0 ? [`Potongan Diskon Khusus: -${formatRupiah(c.discountAmount)}`] : [])
      ],
      facilities: CONVERSION_FACILITIES
    }
  }

  const c = ebookCalculation.value
  return {
    type: 'Paket Penerbitan E-Book',
    title: `${c.pkg.name} (${c.pages} Hal A5/Unesco)`,
    grandTotal: c.grandTotal,
    details: [
      `Harga Dasar ${c.pkg.name} (Maks. 200 Hal): ${formatRupiah(c.pkg.price)}`,
      ...(c.extraPagesCost > 0 ? [`Tambahan +${c.extraPages} Halaman: +${formatRupiah(c.extraPagesCost)}`] : []),
      ...(c.hakiCost > 0 ? [`Pengajuan HAKI Kemenkumham: +${formatRupiah(c.hakiCost)}`] : []),
      ...(c.discountAmount > 0 ? [`Potongan Diskon Khusus: -${formatRupiah(c.discountAmount)}`] : [])
    ],
    facilities: EBOOK_FACILITIES
  }
}

const currentActiveTotal = computed(() => getActiveItemSummary().grandTotal)

function addCurrentToComparison() {
  const item = getActiveItemSummary()
  savedQuotes.value.push({
    id: Date.now() + Math.random(),
    ...item
  })
  showToastMessage('Ditambahkan ke daftar perbandingan WA!')
}

function removeSavedQuote(id) {
  savedQuotes.value = savedQuotes.value.filter((q) => q.id !== id)
}

// ==================== 6. WHATSAPP MESSAGE GENERATOR ====================
const waMessageStyle = ref('lengkap')

const generatedWhatsAppText = computed(() => {
  const lines = []
  const greetName = customerName.value.trim() ? `Bapak/Ibu *${customerName.value.trim()}*` : 'Bapak/Ibu Penulis'

  lines.push(`Halo ${greetName}, 🙏`)
  lines.push(`Berikut kami sampaikan rincian estimasi biaya penerbitan buku di *Penerbit KBM Indonesia*:`)
  if (bookTitle.value.trim()) {
    lines.push(`📖 *Judul Naskah:* ${bookTitle.value.trim()}`)
  }
  lines.push('')

  if (waMessageStyle.value === 'komparasi' && savedQuotes.value.length > 0) {
    lines.push(`*PERBANDINGAN OPSI PENERBITAN:*`)
    lines.push('─────────────────────')
    savedQuotes.value.forEach((q, idx) => {
      lines.push(`*Opsi ${idx + 1}: ${q.title}*`)
      q.details.forEach((d) => lines.push(`• ${d}`))
      lines.push(`👉 *Total Estimasi: ${formatRupiah(q.grandTotal)}*`)
      lines.push('')
    })
  } else {
    const active = getActiveItemSummary()
    lines.push(`📌 *Layanan:* ${active.type}`)
    lines.push(`📦 *Pilihan:* *${active.title}*`)
    lines.push('─────────────────────')
    lines.push(`*Rincian Kalkulasi:*`)
    active.details.forEach((d) => lines.push(`• ${d}`))
    lines.push('─────────────────────')
    lines.push(`💰 *TOTAL ESTIMASI: ${formatRupiah(active.grandTotal)}*`)
    lines.push('*(Gratis 100% Ongkir ke Seluruh Indonesia)*')
    lines.push('')

    if (waMessageStyle.value === 'lengkap') {
      lines.push(`✅ *Fasilitas & Bonus yang Didapatkan:*`)
      active.facilities.forEach((f) => lines.push(`✓ ${f}`))
      lines.push('')
    }
  }

  if (customNotes.value.trim()) {
    lines.push(`📝 *Catatan Tambahan:*`)
    lines.push(customNotes.value.trim())
    lines.push('')
  }

  lines.push(`*Penerbit KBM Indonesia*`)
  lines.push(`_Terbit Buku Tanpa Ribet — Anggota IKAPI_`)
  lines.push(`🌐 Web: Penerbitkbm.com`)
  lines.push(`📍 Depok, Sleman - Yogyakarta`)
  if (marketingName.value.trim()) {
    lines.push(`👤 Konsultan Penerbitan: *${marketingName.value.trim()}*`)
  }

  return lines.join('\n')
})

async function copyWhatsAppText() {
  const text = generatedWhatsAppText.value
  try {
    await Clipboard.write({ string: text })
    showToastMessage('✅ Teks rincian harga berhasil disalin!')
  } catch {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      showToastMessage('✅ Teks rincian harga berhasil disalin!')
    }
  }
}

function normalizePhone(phone) {
  let cleaned = (phone || '').replace(/[^0-9]/g, '')
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1)
  }
  return cleaned
}

function sendDirectWhatsApp() {
  const text = encodeURIComponent(generatedWhatsAppText.value)
  const phone = normalizePhone(customerPhone.value)
  const url = phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`
  window.open(url, '_blank')
}

async function shareViaNativeSheet() {
  const text = generatedWhatsAppText.value
  try {
    await Share.share({
      title: 'Estimasi Harga Penerbit KBM Indonesia',
      text,
      dialogTitle: 'Bagikan Kalkulasi Harga ke WhatsApp'
    })
  } catch {
    sendDirectWhatsApp()
  }
}

export function usePricingStore() {
  return {
    activeTab,
    showCustomerForm,
    customerName,
    customerPhone,
    bookTitle,
    marketingName,
    customNotes,
    selectedPkgId,
    pkgActualPages,
    pkgExtraCopies,
    pkgAddHaki,
    pkgHakiFee,
    pkgDiscountType,
    pkgDiscountValue,
    pkgDiscountLabel,
    selectedBookPkg,
    pkgCalculation,
    customPaperSize,
    customPages,
    customQty,
    customAddHaki,
    customHakiFee,
    customDiscountType,
    customDiscountValue,
    setPaperSize,
    customCalculation,
    selectedKonversiId,
    konversiExtraWordsBlocks,
    konversiExtraCopies,
    konversiActualPages,
    konversiCustomAddonCost,
    konversiCustomAddonName,
    konversiDiscountType,
    konversiDiscountValue,
    selectedKonversiPkg,
    konversiCalculation,
    selectedEbookId,
    ebookPages,
    ebookExtraPageFeePer50,
    ebookAddHaki,
    ebookHakiFee,
    ebookDiscountType,
    ebookDiscountValue,
    selectedEbookPkg,
    ebookCalculation,
    savedQuotes,
    showCartModal,
    activeFlyerModal,
    toastMessage,
    openFlyerModal,
    currentActiveTotal,
    addCurrentToComparison,
    removeSavedQuote,
    waMessageStyle,
    generatedWhatsAppText,
    copyWhatsAppText,
    sendDirectWhatsApp,
    shareViaNativeSheet
  }
}
