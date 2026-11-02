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
  PAPER_SIZES,
  SPOT_UV_FEE,
  EXTRA_HAKI_PERSON_FEE,
  EBOOK_EXTRA_PAGE_RATE,
  getQuantityTier,
  getPageTier,
  getHardCoverRate,
  resolvePaperCategory,
  formatRupiah,
  formatNumberDots,
  parseNumberFromDots
} from '../data/pricingData.js'

// Singleton reactive state so all modular components share the same calculator state
const activeTab = ref('paket')

// Customer & Marketing Info
const showCustomerForm = ref(false)
const customerSalutation = ref('Bapak') // 'Bapak' | 'Ibu'
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
const pkgPaperSizeId = ref('A5')
const pkgCustomW = ref(14)
const pkgCustomH = ref(20)
const pkgActualPages = ref(150)
const pkgExtraCopies = ref(0)
const pkgAddHaki = ref(false)
const pkgHakiAuthors = ref(1)
const pkgHakiFee = ref(500000)
const pkgUseHardCover = ref(false)
const pkgUseSpotUv = ref(false)
const pkgDiscountType = ref('nominal')
const pkgDiscountValue = ref(0)
const pkgDiscountLabel = ref('Potongan Khusus Anda')

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

  const paperCategory = resolvePaperCategory(pkgPaperSizeId.value, pkgCustomW.value, pkgCustomH.value)
  const paperDef = PAPER_SIZES.find((p) => p.id === pkgPaperSizeId.value) || PAPER_SIZES[0]
  const paperLabel =
    pkgPaperSizeId.value === 'CUSTOM'
      ? `Custom (${pkgCustomW.value} × ${pkgCustomH.value} cm)`
      : paperDef.label

  const pageTier = getPageTier(pkgActualPages.value, paperCategory)
  const base150Tier = PAGE_TIERS.find((t) => (paperCategory === 'A4' ? t.a4 === 75 : t.a5 === 150)) || PAGE_TIERS[2]

  const isNusantaraOrTerimaBeres = pkg.id === 'nusantara_new' || pkg.id === 'terima_beres'
  let extraPageCostPerBook = 0
  let totalExtraPageCost = 0
  const extraPages = Math.max(0, pkgActualPages.value - 150)

  if (isNusantaraOrTerimaBeres) {
    // Revisi KBM: Kelebihan halaman A5/Unesco @ 285/hal, B5/A4 @ 450/hal
    // Opsi B: Lebih hal x Tarif x 5 eks
    const ratePerPage = paperCategory === 'A4' ? 450 : 285
    extraPageCostPerBook = extraPages * ratePerPage
    totalExtraPageCost = extraPages * ratePerPage * pkg.copies
  } else if (pkgActualPages.value > 150) {
    const currentTierUnit = pageTier.prices[qtyTier.colIndex] + pageTier.extraCostPerBook
    const base150Unit = base150Tier.prices[qtyTier.colIndex]
    extraPageCostPerBook = Math.max(0, currentTierUnit - base150Unit)
    totalExtraPageCost = extraPageCostPerBook * pkg.copies
  }

  // Unit price for extra copies
  let unitPriceExtraCopy = 0
  if (isNusantaraOrTerimaBeres) {
    const ratePerPage = paperCategory === 'A4' ? 450 : 285
    const base150Unit = base150Tier.prices[qtyTier.colIndex]
    unitPriceExtraCopy = base150Unit + extraPages * ratePerPage
  } else {
    unitPriceExtraCopy = pageTier.prices[qtyTier.colIndex] + pageTier.extraCostPerBook
  }
  const extraCopiesCount = Math.max(0, Number(pkgExtraCopies.value) || 0)
  const totalExtraCopiesCost = extraCopiesCount * unitPriceExtraCopy

  // HAKI calculation (+Rp 25.000 per nama tambahan jika > 1 orang)
  let baseHakiCost = 0
  let extraAuthorsHakiCost = 0
  const authorsCount = Math.max(1, Number(pkgHakiAuthors.value) || 1)
  const extraAuthors = Math.max(0, authorsCount - 1)

  if (pkg.includesHaki) {
    extraAuthorsHakiCost = extraAuthors * EXTRA_HAKI_PERSON_FEE
  } else if (pkgAddHaki.value) {
    baseHakiCost = Number(pkgHakiFee.value) || 500000
    extraAuthorsHakiCost = extraAuthors * EXTRA_HAKI_PERSON_FEE
  }
  const hakiCost = baseHakiCost + extraAuthorsHakiCost

  // Hard Cover & Spot UV
  const hardCoverRate = getHardCoverRate(totalCopies)
  const hardCoverCost = pkgUseHardCover.value ? totalCopies * hardCoverRate : 0
  const spotUvCost = pkgUseSpotUv.value ? SPOT_UV_FEE : 0

  const subtotal =
    pkg.price +
    totalExtraPageCost +
    totalExtraCopiesCost +
    hakiCost +
    hardCoverCost +
    spotUvCost

  let discountAmount = 0
  const rawDisc = Math.max(0, Number(pkgDiscountValue.value) || 0)
  if (pkgDiscountType.value === 'percent') {
    discountAmount = Math.round((subtotal * Math.min(100, rawDisc)) / 100)
  } else {
    discountAmount = Math.min(subtotal, rawDisc)
  }

  const grandTotal = Math.max(0, subtotal - discountAmount)
  const originalBase = pkg.originalPrice || pkg.price
  const totalBeforeDiscount =
    originalBase +
    totalExtraPageCost +
    totalExtraCopiesCost +
    hakiCost +
    hardCoverCost +
    spotUvCost
  const totalSaved = Math.max(0, totalBeforeDiscount - grandTotal)

  return {
    pkg,
    paperSizeId: pkgPaperSizeId.value,
    paperLabel,
    paperCategory,
    actualPages: pkgActualPages.value,
    extraPages,
    pageTierLabel: pageTier.label,
    extraPageCostPerBook,
    totalExtraPageCost,
    extraCopiesCount,
    unitPriceExtraCopy,
    totalExtraCopiesCost,
    authorsCount,
    extraAuthors,
    baseHakiCost,
    extraAuthorsHakiCost,
    hakiCost,
    useHardCover: pkgUseHardCover.value,
    hardCoverRate,
    hardCoverCost,
    useSpotUv: pkgUseSpotUv.value,
    spotUvCost,
    subtotal,
    discountAmount,
    grandTotal,
    totalSaved,
    totalCopiesReceived: pkg.copies + pkg.bonusCopies + extraCopiesCount
  }
})

// ==================== 2. STATE CETAK / TERBIT KUSTOM (TABEL) ====================
const customPaperSizeId = ref('A5')
const customPaperW = ref(14)
const customPaperH = ref(20)
const customPages = ref(150)
const customQty = ref(50)
const customAddHaki = ref(false)
const customHakiAuthors = ref(1)
const customHakiFee = ref(500000)
const customUseHardCover = ref(false)
const customUseSpotUv = ref(false)
const customDiscountType = ref('nominal')
const customDiscountValue = ref(0)

const customCalculation = computed(() => {
  const safeQty = Math.max(5, Number(customQty.value) || 5)
  const qtyTier = getQuantityTier(safeQty)

  const paperCategory = resolvePaperCategory(customPaperSizeId.value, customPaperW.value, customPaperH.value)
  const paperDef = PAPER_SIZES.find((p) => p.id === customPaperSizeId.value) || PAPER_SIZES[0]
  const paperLabel =
    customPaperSizeId.value === 'CUSTOM'
      ? `Custom (${customPaperW.value} × ${customPaperH.value} cm)`
      : paperDef.label

  const pageTier = getPageTier(customPages.value, paperCategory)

  const unitPrice = pageTier.prices[qtyTier.colIndex] + pageTier.extraCostPerBook
  const baseTierUnitPrice = pageTier.prices[0] + pageTier.extraCostPerBook

  const printTotal = unitPrice * safeQty
  const normalPrintTotal = baseTierUnitPrice * safeQty
  const tierSavings = Math.max(0, normalPrintTotal - printTotal)

  // HAKI calculation
  let baseHakiCost = 0
  let extraAuthorsHakiCost = 0
  const authorsCount = Math.max(1, Number(customHakiAuthors.value) || 1)
  const extraAuthors = Math.max(0, authorsCount - 1)
  if (customAddHaki.value) {
    baseHakiCost = Number(customHakiFee.value) || 500000
    extraAuthorsHakiCost = extraAuthors * EXTRA_HAKI_PERSON_FEE
  }
  const hakiCost = baseHakiCost + extraAuthorsHakiCost

  // Hard Cover & Spot UV
  const hardCoverRate = getHardCoverRate(safeQty)
  const hardCoverCost = customUseHardCover.value ? safeQty * hardCoverRate : 0
  const spotUvCost = customUseSpotUv.value ? SPOT_UV_FEE : 0

  const subtotal = printTotal + hakiCost + hardCoverCost + spotUvCost

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
    paperSizeId: customPaperSizeId.value,
    paperLabel,
    paperCategory,
    pages: customPages.value,
    qty: safeQty,
    qtyTier,
    pageTier,
    unitPrice,
    baseTierUnitPrice,
    printTotal,
    normalPrintTotal,
    tierSavings,
    authorsCount,
    extraAuthors,
    hakiCost,
    useHardCover: customUseHardCover.value,
    hardCoverRate,
    hardCoverCost,
    useSpotUv: customUseSpotUv.value,
    spotUvCost,
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
const selectedEbookId = ref('ebook_resmi')
const ebookPages = ref(200)
const ebookAddHaki = ref(false)
const ebookHakiAuthors = ref(1)
const ebookHakiFee = ref(500000)
const ebookDiscountType = ref('nominal')
const ebookDiscountValue = ref(0)

const selectedEbookPkg = computed(() => {
  return EBOOK_PACKAGES[0]
})

const ebookCalculation = computed(() => {
  const pkg = selectedEbookPkg.value
  const pages = Math.max(1, Number(ebookPages.value) || 200)
  const extraPages = Math.max(0, pages - pkg.maxPages)
  // Revisi KBM: Kelebihan halaman e-book dikenakan tarif Rp 750 / halaman layout
  const extraPagesCost = extraPages * EBOOK_EXTRA_PAGE_RATE

  let baseHakiCost = 0
  let extraAuthorsHakiCost = 0
  const authorsCount = Math.max(1, Number(ebookHakiAuthors.value) || 1)
  const extraAuthors = Math.max(0, authorsCount - 1)
  if (ebookAddHaki.value) {
    baseHakiCost = Number(ebookHakiFee.value) || 500000
    extraAuthorsHakiCost = extraAuthors * EXTRA_HAKI_PERSON_FEE
  }
  const hakiCost = baseHakiCost + extraAuthorsHakiCost

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
    authorsCount,
    extraAuthors,
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
      title: `${c.pkg.name} (${c.totalCopiesReceived} Eks, ${c.actualPages} Hal - ${c.paperLabel})`,
      grandTotal: c.grandTotal,
      details: [
        `Harga Paket Dasar (${c.pkg.copies} Eks${c.pkg.bonusCopies ? ` + Bonus ${c.pkg.bonusCopies} Eks` : ''}): ${formatRupiah(c.pkg.price)}`,
        `Spesifikasi Ukuran Kertas: ${c.paperLabel}`,
        ...(c.totalExtraPageCost > 0
          ? [
              c.pkg.id === 'nusantara_new' || c.pkg.id === 'terima_beres'
                ? `Penyesuaian ${c.extraPages} Hal Tambahan (@ ${formatRupiah(c.paperCategory === 'A4' ? 450 : 285)} × 5 eks): +${formatRupiah(c.totalExtraPageCost)}`
                : `Penyesuaian ${c.actualPages} Hal (${c.pageTierLabel}): +${formatRupiah(c.totalExtraPageCost)}`
            ]
          : []),
        ...(c.extraCopiesCount > 0
          ? [`Tambahan Cetak ${c.extraCopiesCount} Eks (@ ${formatRupiah(c.unitPriceExtraCopy)}): +${formatRupiah(c.totalExtraCopiesCost)}`]
          : []),
        ...(c.pkg.includesHaki
          ? [
              c.extraAuthors > 0
                ? `Sertifikat HAKI Kemenkumham (${c.authorsCount} Nama Pencipta, +${c.extraAuthors} Nama @ Rp 25.000): +${formatRupiah(c.extraAuthorsHakiCost)}`
                : 'Sertifikat HAKI Kemenkumham: Termasuk (1 Nama Pencipta)'
            ]
          : c.hakiCost > 0
          ? [
              c.extraAuthors > 0
                ? `Pengajuan Sertifikat HAKI (${c.authorsCount} Nama, +${c.extraAuthors} Nama @ Rp 25.000): +${formatRupiah(c.hakiCost)}`
                : `Pengajuan Sertifikat HAKI Kemenkumham: +${formatRupiah(c.hakiCost)}`
            ]
          : []),
        ...(c.useHardCover
          ? [`Upgrade Sampul Hard Cover (${c.totalCopiesReceived} Eks @ ${formatRupiah(c.hardCoverRate)}): +${formatRupiah(c.hardCoverCost)}`]
          : []),
        ...(c.useSpotUv ? [`Finishing Spot UV Eksklusif: +${formatRupiah(c.spotUvCost)}`] : []),
        ...(c.discountAmount > 0 ? [`Potongan Khusus Anda: -${formatRupiah(c.discountAmount)}`] : [])
      ],
      facilities: c.pkg.facilities
    }
  }

  if (activeTab.value === 'custom') {
    const c = customCalculation.value
    return {
      type: 'Terbit & Cetak Buku Kustom',
      title: `Cetak ${c.qty} Eksemplar (${c.pages} Hal - ${c.paperLabel})`,
      grandTotal: c.grandTotal,
      details: [
        `Spesifikasi Ukuran: ${c.paperLabel}`,
        `Kategori Oplah: ${c.qtyTier.label} (${c.pageTier.label})`,
        `Harga Satuan Cetak: ${formatRupiah(c.unitPrice)} / eks`,
        `Subtotal Cetak (${c.qty} Eks): ${formatRupiah(c.printTotal)}`,
        ...(c.hakiCost > 0
          ? [
              c.extraAuthors > 0
                ? `Sertifikat HAKI (${c.authorsCount} Nama, +${c.extraAuthors} Nama @ Rp 25.000): +${formatRupiah(c.hakiCost)}`
                : `Sertifikat HAKI Kemenkumham: +${formatRupiah(c.hakiCost)}`
            ]
          : []),
        ...(c.useHardCover
          ? [`Upgrade Sampul Hard Cover (${c.qty} Eks @ ${formatRupiah(c.hardCoverRate)}): +${formatRupiah(c.hardCoverCost)}`]
          : []),
        ...(c.useSpotUv ? [`Finishing Spot UV: +${formatRupiah(c.spotUvCost)}`] : []),
        ...(c.discountAmount > 0 ? [`Potongan Khusus Anda: -${formatRupiah(c.discountAmount)}`] : [])
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
        ...(c.discountAmount > 0 ? [`Potongan Khusus Anda: -${formatRupiah(c.discountAmount)}`] : [])
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
      `Harga Paket E-Book (Maks. 200 Hal): ${formatRupiah(c.pkg.price)}`,
      ...(c.extraPagesCost > 0 ? [`Layout Tambahan +${c.extraPages} Hal (@ ${formatRupiah(EBOOK_EXTRA_PAGE_RATE)}): +${formatRupiah(c.extraPagesCost)}`] : []),
      ...(c.hakiCost > 0
        ? [
            c.extraAuthors > 0
              ? `Pengajuan HAKI (${c.authorsCount} Nama, +${c.extraAuthors} Nama @ Rp 25.000): +${formatRupiah(c.hakiCost)}`
              : `Pengajuan HAKI Kemenkumham: +${formatRupiah(c.hakiCost)}`
          ]
        : []),
      ...(c.discountAmount > 0 ? [`Potongan Khusus Anda: -${formatRupiah(c.discountAmount)}`] : [])
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
  const salutation = customerSalutation.value || 'Bapak'
  const namePart = customerName.value.trim() ? `*${customerName.value.trim()}*` : 'Penulis'
  const greetGreeting = `Halo ${salutation} ${namePart}, 🙏`

  lines.push(greetGreeting)
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
    } else {
      showToastMessage('Teks penawaran siap!')
    }
  }
}

async function shareViaNativeSheet() {
  const text = generatedWhatsAppText.value
  const targetPhone = customerPhone.value.replace(/\D/g, '')

  if (targetPhone) {
    let cleanPhone = targetPhone
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1)
    }
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
    window.open(waUrl, '_blank')
    return
  }

  try {
    const canShare = await Share.canShare()
    if (canShare && canShare.value) {
      await Share.share({
        title: 'Estimasi Biaya Terbit KBM Indonesia',
        text: text,
        dialogTitle: 'Kirim Penawaran ke WhatsApp'
      })
      return
    }
  } catch {
    // fallback to generic wa.me
  }

  const genericUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(genericUrl, '_blank')
}

export function usePricingStore() {
  return {
    activeTab,
    showCustomerForm,
    customerSalutation,
    customerName,
    customerPhone,
    bookTitle,
    marketingName,
    customNotes,

    // Paket Buku
    selectedPkgId,
    pkgPaperSizeId,
    pkgCustomW,
    pkgCustomH,
    pkgActualPages,
    pkgExtraCopies,
    pkgAddHaki,
    pkgHakiAuthors,
    pkgHakiFee,
    pkgUseHardCover,
    pkgUseSpotUv,
    pkgDiscountType,
    pkgDiscountValue,
    pkgDiscountLabel,
    selectedBookPkg,
    pkgCalculation,

    // Kustom Tabel
    customPaperSizeId,
    customPaperW,
    customPaperH,
    customPages,
    customQty,
    customAddHaki,
    customHakiAuthors,
    customHakiFee,
    customUseHardCover,
    customUseSpotUv,
    customDiscountType,
    customDiscountValue,
    customCalculation,

    // Konversi
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

    // Ebook
    selectedEbookId,
    ebookPages,
    ebookAddHaki,
    ebookHakiAuthors,
    ebookHakiFee,
    ebookDiscountType,
    ebookDiscountValue,
    selectedEbookPkg,
    ebookCalculation,

    // Komparasi & Modal
    savedQuotes,
    showCartModal,
    activeFlyerModal,
    toastMessage,
    showToastMessage,
    openFlyerModal,
    getActiveItemSummary,
    currentActiveTotal,
    addCurrentToComparison,
    removeSavedQuote,

    // WhatsApp
    waMessageStyle,
    generatedWhatsAppText,
    copyWhatsAppText,
    shareViaNativeSheet
  }
}
