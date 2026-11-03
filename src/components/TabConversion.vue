<script setup>
import { ref, computed } from 'vue'
import {
  GraduationCap,
  Clock,
  SlidersHorizontal,
  Image as ImageIcon,
  Minus,
  Plus,
  CheckCircle2,
  ChevronUp,
  ChevronDown
} from 'lucide-vue-next'
import {
  CONVERSION_PACKAGES,
  CONVERSION_FACILITIES,
  FLYERS_LIST,
  formatRupiah,
  formatNumberDots,
  parseNumberFromDots,
  formatDiscountEquivalent
} from '../data/pricingData.js'
import { usePricingStore } from '../composables/usePricingStore.js'
import SummaryInvoice from './SummaryInvoice.vue'

const {
  selectedKonversiId,
  konversiExtraWordsBlocks,
  konversiExtraCopies,
  konversiActualPages,
  konversiCustomAddonCost,
  konversiDiscountType,
  konversiDiscountValue,
  konversiCalculation,
  openFlyerModal
} = usePricingStore()

const showKonversiFacilities = ref(false)

const formattedDiscount = computed({
  get() {
    return konversiDiscountValue.value ? formatNumberDots(konversiDiscountValue.value) : ''
  },
  set(val) {
    konversiDiscountValue.value = parseNumberFromDots(val)
  }
})

const formattedAddon = computed({
  get() {
    return konversiCustomAddonCost.value ? formatNumberDots(konversiCustomAddonCost.value) : ''
  },
  set(val) {
    konversiCustomAddonCost.value = parseNumberFromDots(val)
  }
})

const discountEquivalent = computed(() => {
  return formatDiscountEquivalent(
    konversiDiscountType.value,
    konversiDiscountValue.value,
    konversiCalculation.value.discountAmount,
    konversiCalculation.value.subtotal
  )
})

function setDiscount(val) {
  konversiDiscountValue.value = Number(val) || 0
}
</script>

<template>
  <section class="edge-section">
    <div class="section-header">
      <h2 class="section-title">
        <GraduationCap :size="16" style="color: var(--kbm-red)" />
        <span>Paket Konversi KTI Ber-ISBN</span>
      </h2>
      <button
        type="button"
        class="btn-micro accent"
        @click="openFlyerModal(FLYERS_LIST[1])"
      >
        <ImageIcon :size="13" />
        <span>Lihat Flyer</span>
      </button>
    </div>
    <p class="section-subtitle">
      Konversi naskah <strong>Tesis, Disertasi, Skripsi & KTI</strong> menjadi buku ber-ISBN (Termasuk 5 Eks Cetak + Gratis Ongkir).
    </p>

    <div class="pkg-list-vertical pkg-grid-3col">
      <button
        v-for="k in CONVERSION_PACKAGES"
        :key="k.id"
        type="button"
        class="pkg-row-card"
        :class="{ selected: selectedKonversiId === k.id }"
        @click="selectedKonversiId = k.id"
      >
        <div>
          <div class="pkg-name">{{ k.name }}</div>
          <div class="field-hint" style="display: flex; align-items: center; gap: 4px; margin-block-start: 2px">
            <Clock :size="12" />
            <span>Proses {{ k.duration }}</span>
          </div>
        </div>
        <div style="text-align: right">
          <div class="pkg-strike">{{ formatRupiah(k.originalPrice) }}</div>
          <div class="pkg-price">{{ formatRupiah(k.price) }}</div>
        </div>
      </button>
    </div>
  </section>

  <section class="edge-section">
    <div class="section-header">
      <h3 class="section-title">
        <SlidersHorizontal :size="16" style="color: var(--kbm-red)" />
        <span>Tambahan di Luar Fasilitas</span>
      </h3>
    </div>

    <form class="form-stack" @submit.prevent>
      <!-- BARIS 2 KOLOM DI DESKTOP: TAMBAH MATERI & INPUT MENDELEY -->
      <div class="form-grid-2col">
        <!-- Tambah Materi Isi -->
        <div class="field-group">
          <label class="field-label">
            <span>Tambah Materi Isi</span>
            <span class="field-hint">Rp 1 Jt / 3.000 Kata</span>
          </label>
          <div class="segmented">
            <button
              v-for="b in [0, 1, 2, 3]"
              :key="b"
              type="button"
              class="segment-btn"
              :class="{ active: konversiExtraWordsBlocks === b }"
              @click="konversiExtraWordsBlocks = b"
            >
              {{ b === 0 ? 'Tanpa Tambahan' : `+${b * 3}rb Kata` }}
            </button>
          </div>
        </div>

        <!-- Biaya Input Mendeley / Ubah Gaya -->
        <div class="field-group">
          <label for="konv-addon" class="field-label">
            <span>Input Mendeley / Ubah Gaya</span>
            <span v-if="konversiCustomAddonCost > 0" class="field-hint" style="color: var(--kbm-red); font-weight: 700">
              +{{ formatRupiah(konversiCustomAddonCost) }}
            </span>
          </label>
          <input
            id="konv-addon"
            v-model="formattedAddon"
            name="konversi_addon"
            type="text"
            inputmode="numeric"
            enterkeyhint="done"
            class="input-control"
            placeholder="Contoh: 150.000"
          />
          <div class="chip-row">
            <button
              v-for="a in [0, 100000, 200000, 300000, 500000]"
              :key="a"
              type="button"
              class="chip-btn"
              :class="{ active: Number(konversiCustomAddonCost) === a }"
              @click="konversiCustomAddonCost = a"
            >
              {{ a === 0 ? 'Rp 0' : formatRupiah(a) }}
            </button>
          </div>
        </div>
      </div>

      <div class="form-divider"></div>

      <!-- BARIS 2 KOLOM DI DESKTOP: ESTIMASI HALAMAN & TAMBAH CETAK -->
      <div class="form-grid-2col">
        <!-- Stepper Estimasi Halaman Hasil -->
        <div class="field-group">
          <label for="konv-pages" class="field-label">
            <span>Estimasi Halaman Hasil</span>
            <span class="field-hint">Standar ≤ 150 Hal</span>
          </label>
          <div class="stepper-unified">
            <button
              type="button"
              class="stepper-btn"
              aria-label="Kurangi halaman"
              @click="konversiActualPages = Math.max(60, (Number(konversiActualPages) || 150) - 25)"
            >
              <Minus :size="16" />
            </button>
            <input
              id="konv-pages"
              v-model.number="konversiActualPages"
              name="konversi_pages"
              type="text"
              inputmode="numeric"
              enterkeyhint="done"
              class="stepper-input-bare"
            />
            <button
              type="button"
              class="stepper-btn"
              aria-label="Tambah halaman"
              @click="konversiActualPages = (Number(konversiActualPages) || 150) + 25"
            >
              <Plus :size="16" />
            </button>
          </div>
          <div class="chip-row">
            <button
              v-for="p in [150, 175, 200, 250, 300]"
              :key="p"
              type="button"
              class="chip-btn"
              :class="{ active: Number(konversiActualPages) === p }"
              @click="konversiActualPages = p"
            >
              {{ p }} Hal
            </button>
          </div>
        </div>

        <!-- Stepper Tambahan Cetak -->
        <div class="field-group">
          <label for="konv-extra-copies" class="field-label">
            <span>Tambah Eksemplar Cetak</span>
            <span class="field-hint">@ {{ formatRupiah(konversiCalculation.unitPriceExtraCopy) }}/eks</span>
          </label>
          <div class="stepper-unified">
            <button
              type="button"
              class="stepper-btn"
              aria-label="Kurangi tambahan cetak"
              @click="konversiExtraCopies = Math.max(0, (Number(konversiExtraCopies) || 0) - 5)"
            >
              <Minus :size="16" />
            </button>
            <input
              id="konv-extra-copies"
              v-model.number="konversiExtraCopies"
              name="konversi_extra_copies"
              type="text"
              inputmode="numeric"
              enterkeyhint="done"
              class="stepper-input-bare"
            />
            <button
              type="button"
              class="stepper-btn"
              aria-label="Tambah 5 eksemplar"
              @click="konversiExtraCopies = (Number(konversiExtraCopies) || 0) + 5"
            >
              <Plus :size="16" />
            </button>
          </div>
          <div class="chip-row">
            <button
              v-for="c in [0, 5, 10, 20, 45, 95]"
              :key="c"
              type="button"
              class="chip-btn"
              :class="{ active: Number(konversiExtraCopies) === c }"
              @click="konversiExtraCopies = c"
            >
              {{ c === 0 ? 'Cukup 5 Eks' : `+${c} Eks` }}
            </button>
          </div>
        </div>
      </div>

      <div class="form-divider"></div>

      <!-- POTONGAN KHUSUS ANDA (DISCOUNT) -->
      <div class="field-group">
        <label for="konv-discount" class="field-label">
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
                :class="{ active: konversiDiscountType === 'nominal' }"
                @click="konversiDiscountType = 'nominal'"
              >
                Nominal (Rp)
              </button>
              <button
                type="button"
                class="segment-btn"
                :class="{ active: konversiDiscountType === 'percent' }"
                @click="konversiDiscountType = 'percent'"
              >
                Persen (%)
              </button>
            </div>
            <div class="discount-input-wrap">
              <input
                v-if="konversiDiscountType === 'nominal'"
                id="konv-discount"
                v-model="formattedDiscount"
                type="text"
                inputmode="numeric"
                enterkeyhint="done"
                class="input-control"
                placeholder="Contoh: 50.000"
              />
              <input
                v-else
                id="konv-discount-pct"
                v-model.number="konversiDiscountValue"
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
          <div v-if="konversiDiscountType === 'nominal'" class="chip-row">
            <button
              v-for="d in [0, 50000, 100000, 150000, 250000]"
              :key="d"
              type="button"
              class="chip-btn"
              :class="{ active: Number(konversiDiscountValue) === d }"
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
              :class="{ active: Number(konversiDiscountValue) === pct }"
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
