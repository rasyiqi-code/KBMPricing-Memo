<script setup>
import { formatRupiah } from '../data/pricingData.js'
import { usePricingStore } from '../composables/usePricingStore.js'

const {
  activeTab,
  pkgCalculation,
  customCalculation,
  konversiCalculation,
  ebookCalculation,
  konversiCustomAddonName
} = usePricingStore()
</script>

<template>
  <section class="summary-section">
    <!-- 1. PAKET BUKU CETAK -->
    <template v-if="activeTab === 'paket'">
      <div class="summary-header">
        <span class="badge-pill badge-gold">{{ pkgCalculation.pkg.name }}</span>
        <span class="summary-meta">
          Diterima: <strong>{{ pkgCalculation.totalCopiesReceived }} Eks</strong>
        </span>
      </div>

      <div class="summary-row">
        <span class="summary-row-label">
          Paket Dasar ({{ pkgCalculation.pkg.copies }} Eks{{ pkgCalculation.pkg.bonusCopies ? ` + ${pkgCalculation.pkg.bonusCopies} Bonus` : '' }})
        </span>
        <span class="summary-row-val">
          <span v-if="pkgCalculation.pkg.originalPrice" class="strike-light">
            {{ formatRupiah(pkgCalculation.pkg.originalPrice) }}
          </span>
          {{ formatRupiah(pkgCalculation.pkg.price) }}
        </span>
      </div>

      <div v-if="pkgCalculation.totalExtraPageCost > 0" class="summary-row">
        <span class="summary-row-label">Penyesuaian {{ pkgCalculation.actualPages }} Hal</span>
        <span class="summary-row-val">+{{ formatRupiah(pkgCalculation.totalExtraPageCost) }}</span>
      </div>

      <div v-if="pkgCalculation.extraCopiesCount > 0" class="summary-row">
        <span class="summary-row-label">
          Tambah {{ pkgCalculation.extraCopiesCount }} Eks (@ {{ formatRupiah(pkgCalculation.unitPriceExtraCopy) }})
        </span>
        <span class="summary-row-val">+{{ formatRupiah(pkgCalculation.totalExtraCopiesCost) }}</span>
      </div>

      <div v-if="pkgCalculation.hakiCost > 0" class="summary-row">
        <span class="summary-row-label">Sertifikat HAKI Kemenkumham</span>
        <span class="summary-row-val">+{{ formatRupiah(pkgCalculation.hakiCost) }}</span>
      </div>

      <div v-if="pkgCalculation.discountAmount > 0" class="summary-row discount">
        <span class="summary-row-label">Potongan Diskon Khusus</span>
        <span class="summary-row-val">-{{ formatRupiah(pkgCalculation.discountAmount) }}</span>
      </div>

      <div class="summary-total-block">
        <div>
          <div class="summary-total-label">Estimasi Total Biaya</div>
          <div v-if="pkgCalculation.totalSaved > 0" class="summary-saved-tag">
            🎉 Hemat {{ formatRupiah(pkgCalculation.totalSaved) }}
          </div>
        </div>
        <div class="total-price-big">{{ formatRupiah(pkgCalculation.grandTotal) }}</div>
      </div>
    </template>

    <!-- 2. CETAK TABEL KUSTOM -->
    <template v-else-if="activeTab === 'custom'">
      <div class="summary-header">
        <span class="badge-pill badge-gold">{{ customCalculation.qtyTier.label }}</span>
        <span class="summary-meta">{{ customCalculation.pageTier.label }}</span>
      </div>

      <div class="summary-row">
        <span class="summary-row-label">Harga Satuan Buku</span>
        <span class="summary-row-val">
          <span
            v-if="customCalculation.unitPrice < customCalculation.baseTierUnitPrice"
            class="strike-light"
          >
            {{ formatRupiah(customCalculation.baseTierUnitPrice) }}
          </span>
          {{ formatRupiah(customCalculation.unitPrice) }} / eks
        </span>
      </div>

      <div class="summary-row">
        <span class="summary-row-label">Subtotal Cetak ({{ customCalculation.qty }} Eks)</span>
        <span class="summary-row-val">{{ formatRupiah(customCalculation.printTotal) }}</span>
      </div>

      <div v-if="customCalculation.hakiCost > 0" class="summary-row">
        <span class="summary-row-label">Biaya HAKI Kemenkumham</span>
        <span class="summary-row-val">+{{ formatRupiah(customCalculation.hakiCost) }}</span>
      </div>

      <div v-if="customCalculation.discountAmount > 0" class="summary-row discount">
        <span class="summary-row-label">Potongan Diskon Khusus</span>
        <span class="summary-row-val">-{{ formatRupiah(customCalculation.discountAmount) }}</span>
      </div>

      <div class="summary-total-block">
        <div>
          <div class="summary-total-label">Estimasi Total Biaya</div>
          <div v-if="customCalculation.totalSavings > 0" class="summary-saved-tag">
            🎉 Hemat {{ formatRupiah(customCalculation.totalSavings) }}
          </div>
        </div>
        <div class="total-price-big">{{ formatRupiah(customCalculation.grandTotal) }}</div>
      </div>
    </template>

    <!-- 3. KONVERSI KTI -->
    <template v-else-if="activeTab === 'konversi'">
      <div class="summary-header">
        <span class="badge-pill badge-gold">{{ konversiCalculation.pkg.name }}</span>
        <span class="summary-meta">{{ konversiCalculation.pkg.duration }}</span>
      </div>

      <div class="summary-row">
        <span class="summary-row-label">Paket {{ konversiCalculation.pkg.name }} (5 Eks)</span>
        <span class="summary-row-val">
          <span class="strike-light">{{ formatRupiah(konversiCalculation.pkg.originalPrice) }}</span>
          {{ formatRupiah(konversiCalculation.pkg.price) }}
        </span>
      </div>

      <div v-if="konversiCalculation.extraWordsCost > 0" class="summary-row">
        <span class="summary-row-label">
          Tambah Materi (+{{ konversiCalculation.extraWordsCount.toLocaleString('id-ID') }} Kata)
        </span>
        <span class="summary-row-val">+{{ formatRupiah(konversiCalculation.extraWordsCost) }}</span>
      </div>

      <div v-if="konversiCalculation.extraPageCost > 0" class="summary-row">
        <span class="summary-row-label">Penyesuaian Halaman ({{ konversiCalculation.actualPages }} Hal)</span>
        <span class="summary-row-val">+{{ formatRupiah(konversiCalculation.extraPageCost) }}</span>
      </div>

      <div v-if="konversiCalculation.extraCopiesCost > 0" class="summary-row">
        <span class="summary-row-label">Tambah Cetak +{{ konversiCalculation.extraCopies }} Eks</span>
        <span class="summary-row-val">+{{ formatRupiah(konversiCalculation.extraCopiesCost) }}</span>
      </div>

      <div v-if="konversiCalculation.customAddon > 0" class="summary-row">
        <span class="summary-row-label">{{ konversiCustomAddonName }}</span>
        <span class="summary-row-val">+{{ formatRupiah(konversiCalculation.customAddon) }}</span>
      </div>

      <div v-if="konversiCalculation.discountAmount > 0" class="summary-row discount">
        <span class="summary-row-label">Potongan Diskon Khusus</span>
        <span class="summary-row-val">-{{ formatRupiah(konversiCalculation.discountAmount) }}</span>
      </div>

      <div class="summary-total-block">
        <div>
          <div class="summary-total-label">Total Biaya Konversi</div>
          <div class="summary-saved-tag">
            🎉 Hemat {{ formatRupiah(konversiCalculation.promoSavings) }}
          </div>
        </div>
        <div class="total-price-big">{{ formatRupiah(konversiCalculation.grandTotal) }}</div>
      </div>
    </template>

    <!-- 4. E-BOOK -->
    <template v-else-if="activeTab === 'ebook'">
      <div class="summary-row">
        <span class="summary-row-label">{{ ebookCalculation.pkg.name }} (Maks 200 Hal)</span>
        <span class="summary-row-val">{{ formatRupiah(ebookCalculation.pkg.price) }}</span>
      </div>
      <div v-if="ebookCalculation.extraPagesCost > 0" class="summary-row">
        <span class="summary-row-label">Tambahan Halaman (+{{ ebookCalculation.extraPages }} Hal)</span>
        <span class="summary-row-val">+{{ formatRupiah(ebookCalculation.extraPagesCost) }}</span>
      </div>
      <div v-if="ebookCalculation.hakiCost > 0" class="summary-row">
        <span class="summary-row-label">Biaya Pengajuan HAKI</span>
        <span class="summary-row-val">+{{ formatRupiah(ebookCalculation.hakiCost) }}</span>
      </div>
      <div v-if="ebookCalculation.discountAmount > 0" class="summary-row discount">
        <span class="summary-row-label">Potongan Diskon Khusus</span>
        <span class="summary-row-val">-{{ formatRupiah(ebookCalculation.discountAmount) }}</span>
      </div>

      <div class="summary-total-block">
        <div class="summary-total-label">Total Terbit E-Book</div>
        <div class="total-price-big">{{ formatRupiah(ebookCalculation.grandTotal) }}</div>
      </div>
    </template>
  </section>
</template>

