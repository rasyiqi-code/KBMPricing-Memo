<script setup>
import { computed } from 'vue'
import {
  Calculator,
  Sparkles,
  Gift,
  Minus,
  Plus,
  Award
} from 'lucide-vue-next'
import {
  PAGE_TIERS,
  PAPER_SIZES,
  SPOT_UV_FEE,
  EXTRA_HAKI_PERSON_FEE,
  formatRupiah,
  formatNumberDots,
  parseNumberFromDots,
  formatDiscountEquivalent
} from '../data/pricingData.js'
import { usePricingStore } from '../composables/usePricingStore.js'
import SummaryInvoice from './SummaryInvoice.vue'

const {
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
  customCalculation
} = usePricingStore()

const formattedDiscount = computed({
  get() {
    return customDiscountValue.value ? formatNumberDots(customDiscountValue.value) : ''
  },
  set(val) {
    customDiscountValue.value = parseNumberFromDots(val)
  }
})

const discountEquivalent = computed(() => {
  return formatDiscountEquivalent(
    customDiscountType.value,
    customDiscountValue.value,
    customCalculation.value.discountAmount,
    customCalculation.value.subtotal
  )
})

function setDiscount(val) {
  customDiscountValue.value = Number(val) || 0
}
</script>

<template>
  <section class="edge-section">
    <div class="section-header">
      <h2 class="section-title">
        <Calculator :size="16" style="color: var(--kbm-red)" />
        <span>Kalkulator Cetak Kustom</span>
      </h2>
      <span class="badge-pill">{{ customCalculation.qtyTier.label }}</span>
    </div>

    <form class="form-stack" @submit.prevent>
      <!-- Pilihan Ukuran Kertas Pasti -->
      <div class="field-group">
        <label class="field-label">
          <span>Pilih Ukuran Kertas Buku</span>
          <span class="field-hint">{{ customCalculation.paperLabel }}</span>
        </label>
        <div class="chip-row">
          <button
            v-for="paper in PAPER_SIZES"
            :key="paper.id"
            type="button"
            class="chip-btn"
            :class="{ active: customPaperSizeId === paper.id }"
            @click="customPaperSizeId = paper.id"
          >
            {{ paper.label }}
          </button>
        </div>

        <!-- Custom Width x Height Input if CUSTOM -->
        <div v-if="customPaperSizeId === 'CUSTOM'" class="custom-dim-box">
          <div class="dim-input-col">
            <label class="dim-label">Lebar (cm)</label>
            <input
              v-model.number="customPaperW"
              type="number"
              step="0.5"
              min="10"
              max="30"
              class="input-control"
              placeholder="14"
            />
          </div>
          <span class="dim-multiply">×</span>
          <div class="dim-input-col">
            <label class="dim-label">Tinggi (cm)</label>
            <input
              v-model.number="customPaperH"
              type="number"
              step="0.5"
              min="10"
              max="40"
              class="input-control"
              placeholder="20"
            />
          </div>
          <div class="dim-info-col">
            <span class="dim-result-tag">
              Kategori: {{ customCalculation.paperCategory === 'A4' ? 'B5 / A4' : 'A5 / Unesco' }}
            </span>
          </div>
        </div>
      </div>

      <div class="form-divider"></div>

      <!-- BARIS 2 KOLOM DI DESKTOP: JUMLAH HALAMAN & JUMLAH CETAK -->
      <div class="form-grid-2col">
        <!-- Stepper Jumlah Halaman -->
        <div class="field-group">
          <label for="custom-pages" class="field-label">
            <span>Jumlah Halaman ({{ customCalculation.paperCategory }})</span>
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
              :class="{ active: customPages === (customCalculation.paperCategory === 'A4' ? tier.a4 : tier.a5) }"
              @click="customPages = customCalculation.paperCategory === 'A4' ? tier.a4 : tier.a5"
            >
              {{ customCalculation.paperCategory === 'A4' ? tier.a4 : tier.a5 }} Hal
            </button>
          </div>
        </div>

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

      <div class="form-divider"></div>

      <!-- BARIS 2 KOLOM DI DESKTOP: FINISHING COVER & HAKI -->
      <div class="form-grid-2col">
        <!-- FINISHING HARD COVER & SPOT UV -->
        <div class="field-group">
          <label class="field-label">
            <span>Finishing & Sampul Buku</span>
          </label>
          
          <div class="toggle-card-group">
            <!-- Checkbox Hard Cover -->
            <div class="toggle-card-item">
              <label for="custom-hardcover-check" class="toggle-label" style="margin: 0; cursor: pointer">
                <input
                  id="custom-hardcover-check"
                  v-model="customUseHardCover"
                  type="checkbox"
                  class="toggle-checkbox"
                />
                <span>
                  <strong>Hard Cover Mewah</strong>
                  <small style="display: block; color: var(--text-muted); font-size: 0.78rem">
                    {{ customQty }} eks @ {{ formatRupiah(customCalculation.hardCoverRate) }}/eks
                  </small>
                </span>
              </label>
              <span class="toggle-price">
                {{ customUseHardCover ? `+${formatRupiah(customCalculation.hardCoverCost)}` : `@ ${formatRupiah(customCalculation.hardCoverRate)}` }}
              </span>
            </div>

            <!-- Checkbox Spot UV -->
            <div class="toggle-card-item">
              <label for="custom-spotuv-check" class="toggle-label" style="margin: 0; cursor: pointer">
                <input
                  id="custom-spotuv-check"
                  v-model="customUseSpotUv"
                  type="checkbox"
                  class="toggle-checkbox"
                />
                <span>
                  <strong>Finishing Spot UV</strong>
                  <small style="display: block; color: var(--text-muted); font-size: 0.78rem">Efek timbul mengkilap elegan pada cover</small>
                </span>
              </label>
              <span class="toggle-price">+{{ formatRupiah(SPOT_UV_FEE) }}</span>
            </div>
          </div>
        </div>

        <!-- OPSI HAKI -->
        <div class="field-group">
          <label class="field-label">
            <span>Sertifikat HAKI Kemenkumham</span>
          </label>

          <div class="haki-card-box" :class="{ active: customAddHaki }">
            <div class="haki-card-top">
              <label for="custom-haki-check" class="toggle-label" style="margin: 0; cursor: pointer">
                <input
                  id="custom-haki-check"
                  v-model="customAddHaki"
                  name="custom_add_haki"
                  type="checkbox"
                  class="toggle-checkbox"
                />
                <span style="font-weight: 600; font-size: 0.86rem">Sertakan Pengurusan HAKI (1 Nama)</span>
              </label>
              <span class="toggle-price">+{{ formatRupiah(customHakiFee) }}</span>
            </div>

            <!-- Seamless Author Counter inside the same card -->
            <div v-if="customAddHaki" class="haki-card-sub">
              <div>
                <span class="haki-sub-label">Jumlah Nama Penulis:</span>
                <span v-if="customHakiAuthors > 1" class="haki-sub-hint">
                  +{{ formatRupiah((customHakiAuthors - 1) * EXTRA_HAKI_PERSON_FEE) }} (+{{ customHakiAuthors - 1 }} nama @ 25rb)
                </span>
              </div>
              <div class="stepper-unified mini">
                <button
                  type="button"
                  class="stepper-btn"
                  aria-label="Kurangi nama penulis"
                  @click="customHakiAuthors = Math.max(1, (Number(customHakiAuthors) || 1) - 1)"
                >
                  <Minus :size="14" />
                </button>
                <input
                  v-model.number="customHakiAuthors"
                  type="text"
                  inputmode="numeric"
                  class="stepper-input-bare"
                />
                <button
                  type="button"
                  class="stepper-btn"
                  aria-label="Tambah nama penulis"
                  @click="customHakiAuthors = (Number(customHakiAuthors) || 1) + 1"
                >
                  <Plus :size="14" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="form-divider"></div>

      <!-- POTONGAN KHUSUS ANDA -->
      <div class="field-group">
        <label for="custom-discount" class="field-label">
          <span>Potongan Khusus Anda</span>
          <span v-if="discountEquivalent" class="field-hint" style="color: var(--kbm-red); font-weight: 700">
            {{ discountEquivalent }}
          </span>
        </label>
        <div class="discount-control-group">
          <div class="discount-top-row">
            <div class="segmented discount-segmented">
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
            <div class="discount-input-wrap">
              <input
                v-if="customDiscountType === 'nominal'"
                id="custom-discount"
                v-model="formattedDiscount"
                type="text"
                inputmode="numeric"
                enterkeyhint="done"
                class="input-control"
                placeholder="Contoh: 50.000"
              />
              <input
                v-else
                id="custom-discount-pct"
                v-model.number="customDiscountValue"
                type="number"
                min="0"
                max="100"
                enterkeyhint="done"
                class="input-control"
                placeholder="Contoh: 10"
              />
              <span v-if="discountEquivalent" class="discount-badge-tag">
                {{ discountEquivalent }}
              </span>
            </div>
          </div>
          <div v-if="customDiscountType === 'nominal'" class="chip-row">
            <button
              v-for="d in [0, 50000, 100000, 150000, 250000]"
              :key="d"
              type="button"
              class="chip-btn"
              :class="{ active: Number(customDiscountValue) === d }"
              @click="setDiscount(d)"
            >
              {{ d === 0 ? 'Tanpa Diskon' : formatRupiah(d) }}
            </button>
          </div>
          <div v-else class="chip-row">
            <button
              v-for="pct in [0, 5, 10, 15, 20, 25]"
              :key="pct"
              type="button"
              class="chip-btn"
              :class="{ active: Number(customDiscountValue) === pct }"
              @click="setDiscount(pct)"
            >
              {{ pct === 0 ? 'Tanpa Diskon' : `${pct}%` }}
            </button>
          </div>
        </div>
      </div>
    </form>
  </section>
</template>
