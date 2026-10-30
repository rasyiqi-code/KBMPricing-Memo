<script setup>
import { ref } from 'vue'
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
  formatRupiah
} from '../data/pricingData.js'
import { usePricingStore } from '../composables/usePricingStore.js'
import SummaryInvoice from './SummaryInvoice.vue'

const {
  selectedKonversiId,
  konversiExtraWordsBlocks,
  konversiExtraCopies,
  konversiActualPages,
  konversiCustomAddonCost,
  konversiDiscountValue,
  konversiCalculation,
  openFlyerModal
} = usePricingStore()

const showKonversiFacilities = ref(false)
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

    <div class="pkg-list-vertical">
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
            {{ b === 0 ? 'Tidak' : `+${b * 3}rb Kata` }}
          </button>
        </div>
      </div>

      <div class="form-divider"></div>

      <!-- Stepper Tambahan Cetak -->
      <div class="field-group">
        <label for="konv-extra-copies" class="field-label">
          <span>Tambah Cetak (>5 Eks Bawaan)</span>
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
            :class="{ active: konversiExtraCopies === c }"
            @click="konversiExtraCopies = c"
          >
            {{ c === 0 ? 'Cukup 5 Eks' : `+${c} Eks (Total ${5 + c})` }}
          </button>
        </div>
      </div>

      <div class="form-divider"></div>

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
      </div>

      <div class="field-group">
        <label for="konv-addon" class="field-label">Biaya Input Mendeley / Ubah Gaya (Rp)</label>
        <input
          id="konv-addon"
          v-model.number="konversiCustomAddonCost"
          name="konversi_addon"
          type="text"
          inputmode="numeric"
          enterkeyhint="done"
          class="input-control"
          placeholder="0"
        />
      </div>

      <div class="field-group">
        <label for="konv-discount" class="field-label">Potongan Diskon Khusus (Rp)</label>
        <input
          id="konv-discount"
          v-model.number="konversiDiscountValue"
          name="konversi_discount"
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
    <div
      class="section-header interactive"
      @click="showKonversiFacilities = !showKonversiFacilities"
    >
      <h3 class="section-title">
        <CheckCircle2 :size="16" style="color: var(--wa-green)" />
        <span>19 Fasilitas Paket Konversi</span>
      </h3>
      <span class="badge-pill badge-neutral" style="display: inline-flex; align-items: center; gap: 4px">
        <span>{{ showKonversiFacilities ? 'Tutup' : 'Lihat' }}</span>
        <component :is="showKonversiFacilities ? ChevronUp : ChevronDown" :size="13" />
      </span>
    </div>
    <div v-if="showKonversiFacilities" class="facility-grid">
      <div v-for="(f, i) in CONVERSION_FACILITIES" :key="i" class="facility-item">
        <span class="facility-check">{{ i + 1 }}.</span>
        <span>{{ f }}</span>
      </div>
    </div>
  </section>
</template>
