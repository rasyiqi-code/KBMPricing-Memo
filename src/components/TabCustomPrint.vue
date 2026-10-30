<script setup>
import {
  Calculator,
  Sparkles,
  Gift,
  Minus,
  Plus
} from 'lucide-vue-next'
import { PAGE_TIERS, formatRupiah } from '../data/pricingData.js'
import { usePricingStore } from '../composables/usePricingStore.js'
import SummaryInvoice from './SummaryInvoice.vue'

const {
  customPaperSize,
  customPages,
  customQty,
  customAddHaki,
  customHakiFee,
  customDiscountType,
  customDiscountValue,
  setPaperSize,
  customCalculation
} = usePricingStore()
</script>

<template>
  <section class="edge-section">
    <div class="section-header">
      <h2 class="section-title">
        <Calculator :size="16" style="color: var(--kbm-red)" />
        <span>Kalkulator Tabel Harga</span>
      </h2>
      <span class="badge-pill">{{ customCalculation.qtyTier.label }}</span>
    </div>

    <form class="form-stack" @submit.prevent>
      <div class="field-group">
        <label class="field-label">Pilih Ukuran Kertas Buku</label>
        <div class="segmented">
          <button
            type="button"
            class="segment-btn"
            :class="{ active: customPaperSize === 'A5' }"
            @click="setPaperSize('A5')"
          >
            📐 A5 / Unesco
          </button>
          <button
            type="button"
            class="segment-btn"
            :class="{ active: customPaperSize === 'A4' }"
            @click="setPaperSize('A4')"
          >
            📄 Ukuran A4
          </button>
        </div>
      </div>

      <div class="form-divider"></div>

      <!-- Stepper Jumlah Halaman -->
      <div class="field-group">
        <label for="custom-pages" class="field-label">
          <span>Jumlah Halaman ({{ customPaperSize }})</span>
          <span class="field-hint">{{ customCalculation.pageTier.label }}</span>
        </label>
        <div class="stepper-unified">
          <button
            type="button"
            class="stepper-btn"
            aria-label="Kurangi halaman"
            @click="customPages = Math.max(20, (Number(customPages) || 100) - 25)"
          >
            <Minus :size="16" />
          </button>
          <input
            id="custom-pages"
            v-model.number="customPages"
            name="custom_pages"
            type="text"
            inputmode="numeric"
            enterkeyhint="done"
            class="stepper-input-bare"
          />
          <button
            type="button"
            class="stepper-btn"
            aria-label="Tambah halaman"
            @click="customPages = (Number(customPages) || 100) + 25"
          >
            <Plus :size="16" />
          </button>
        </div>
        <div class="chip-row">
          <button
            v-for="tier in PAGE_TIERS"
            :key="tier.id"
            type="button"
            class="chip-btn"
            :class="{ active: customPages === (customPaperSize === 'A4' ? tier.a4 : tier.a5) }"
            @click="customPages = customPaperSize === 'A4' ? tier.a4 : tier.a5"
          >
            {{ customPaperSize === 'A4' ? tier.a4 : tier.a5 }} Hal
          </button>
        </div>
      </div>

      <div class="form-divider"></div>

      <!-- Stepper Jumlah Eksemplar -->
      <div class="field-group">
        <label for="custom-qty" class="field-label">
          <span>Jumlah Cetak (Eksemplar)</span>
          <span class="field-hint">Min. 5 Eks</span>
        </label>
        <div class="stepper-unified">
          <button
            type="button"
            class="stepper-btn"
            aria-label="Kurangi eksemplar"
            @click="customQty = Math.max(5, (Number(customQty) || 5) - 5)"
          >
            <Minus :size="16" />
          </button>
          <input
            id="custom-qty"
            v-model.number="customQty"
            name="custom_qty"
            type="text"
            inputmode="numeric"
            enterkeyhint="done"
            class="stepper-input-bare"
          />
          <button
            type="button"
            class="stepper-btn"
            aria-label="Tambah eksemplar"
            @click="customQty = (Number(customQty) || 5) + 5"
          >
            <Plus :size="16" />
          </button>
        </div>
        <div class="chip-row">
          <button
            v-for="q in [5, 10, 25, 50, 100, 150, 200, 300, 500]"
            :key="q"
            type="button"
            class="chip-btn"
            :class="{ active: customQty === q }"
            @click="customQty = q"
          >
            {{ q }} Eks
          </button>
        </div>
      </div>

      <!-- UPSELL INSIGHT BOX -->
      <div v-if="customCalculation.upsellTip" class="upsell-box">
        <div style="display: flex; gap: 8px; align-items: flex-start">
          <Sparkles :size="16" style="flex-shrink: 0; color: #b45309; margin-block-start: 1px" />
          <div>
            <strong>Rekomendasi Upsell Marketing:</strong>
            <p>{{ customCalculation.upsellTip.message }}</p>
          </div>
        </div>
        <button
          type="button"
          class="upsell-btn"
          @click="customQty = customCalculation.upsellTip.targetQty"
        >
          Terapkan {{ customCalculation.upsellTip.targetQty }} Eksemplar Sekarang →
        </button>
      </div>

      <!-- Opsi HAKI -->
      <div class="toggle-row">
        <label for="custom-haki-check" class="toggle-label">
          <input
            id="custom-haki-check"
            v-model="customAddHaki"
            name="custom_add_haki"
            type="checkbox"
            class="toggle-checkbox"
          />
          <span>Sertakan Pengurusan HAKI</span>
        </label>
        <span class="toggle-price">+{{ formatRupiah(customHakiFee) }}</span>
      </div>

      <div class="form-divider"></div>

      <!-- Potongan Diskon -->
      <div class="field-group">
        <label for="custom-discount" class="field-label">Potongan Diskon Khusus</label>
        <div class="segmented">
          <button
            type="button"
            class="segment-btn"
            :class="{ active: customDiscountType === 'nominal' }"
            @click="customDiscountType = 'nominal'"
          >
            Nominal (Rp)
          </button>
          <button
            type="button"
            class="segment-btn"
            :class="{ active: customDiscountType === 'percent' }"
            @click="customDiscountType = 'percent'"
          >
            Persen (%)
          </button>
        </div>
        <input
          id="custom-discount"
          v-model.number="customDiscountValue"
          name="custom_discount"
          type="text"
          inputmode="numeric"
          enterkeyhint="done"
          class="input-control"
          placeholder="0"
        />
      </div>
    </form>
  </section>

  <!-- SUMMARY INVOICE (Mobile inline view) -->
  <SummaryInvoice class="mobile-only-summary" />

  <section class="edge-section">
    <div class="section-header" style="margin-block-end: 4px">
      <h3 class="section-title">
        <Gift :size="16" style="color: var(--wa-green)" />
        <span>Bonus Pasti Didapat</span>
      </h3>
    </div>
    <div class="facility-grid">
      <div v-for="(b, idx) in customCalculation.bonuses" :key="idx" class="facility-item">
        <span class="facility-check">✓</span>
        <span>{{ b }}</span>
      </div>
    </div>
  </section>
</template>
