<script setup>
import { ref, computed } from 'vue'
import {
  BookOpen,
  Image as ImageIcon,
  Shirt,
  Minus,
  Plus,
  SlidersHorizontal,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Layers,
  Sparkles,
  Award
} from 'lucide-vue-next'
import {
  BOOK_PACKAGES,
  PAPER_SIZES,
  SPOT_UV_FEE,
  EXTRA_HAKI_PERSON_FEE,
  formatRupiah,
  formatNumberDots,
  parseNumberFromDots
} from '../data/pricingData.js'
import { usePricingStore } from '../composables/usePricingStore.js'
import SummaryInvoice from './SummaryInvoice.vue'

const {
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
  openFlyerModal
} = usePricingStore()

const showFacilities = ref(false)

const formattedDiscount = computed({
  get() {
    return pkgDiscountValue.value ? formatNumberDots(pkgDiscountValue.value) : ''
  },
  set(val) {
    pkgDiscountValue.value = parseNumberFromDots(val)
  }
})
</script>

<template>
  <!-- PILIH PAKET BUKU (FULL-EDGE SECTION) -->
  <section class="edge-section">
    <div class="section-header">
      <h2 class="section-title">
        <BookOpen :size="16" style="color: var(--kbm-red)" />
        <span>Pilih Paket Penerbitan</span>
      </h2>
      <button
        type="button"
        class="btn-micro accent"
        @click="openFlyerModal({ title: selectedBookPkg.name, url: selectedBookPkg.flyerUrl })"
      >
        <ImageIcon :size="13" />
        <span>Lihat Flyer</span>
      </button>
    </div>

    <div class="pkg-grid">
      <button
        v-for="pkg in BOOK_PACKAGES"
        :key="pkg.id"
        type="button"
        class="pkg-card"
        :class="{ selected: selectedPkgId === pkg.id }"
        @click="selectedPkgId = pkg.id"
      >
        <div class="pkg-card-top">
          <span class="pkg-name">{{ pkg.shortName }}</span>
          <span class="pkg-qty-tag">{{ pkg.copies }} Eks</span>
        </div>

        <div class="pkg-price-group">
          <span v-if="pkg.originalPrice" class="pkg-strike">
            {{ formatRupiah(pkg.originalPrice) }}
          </span>
          <span class="pkg-price">{{ formatRupiah(pkg.price) }}</span>
        </div>

        <div class="pkg-footer-tags">
          <span v-if="pkg.bonusCopies > 0" class="micro-tag bonus">
            +{{ pkg.bonusCopies }} Eks
          </span>
          <span v-if="pkg.includesHaki" class="micro-tag bonus">
            +HAKI
          </span>
          <span v-if="pkg.tshirtBonus > 0" class="micro-tag">
            <Shirt :size="11" style="display: inline-block; vertical-align: -1px; margin-inline-end: 2px" />
            {{ pkg.tshirtBonus }} Kaos
          </span>
          <span class="micro-tag">≤{{ pkg.maxPages }} Hal</span>
        </div>
      </button>
    </div>
  </section>

  <!-- KUSTOMISASI TAMBAHAN & DISKON -->
  <section class="edge-section">
    <div class="section-header">
      <h2 class="section-title">
        <SlidersHorizontal :size="16" style="color: var(--kbm-red)" />
        <span>Kustomisasi Spesifikasi & Biaya</span>
      </h2>
      <span class="badge-pill badge-neutral">{{ pkgCalculation.paperLabel }}</span>
    </div>

    <form class="form-stack" @submit.prevent>
      <!-- Pilihan Ukuran Kertas Pasti -->
      <div class="field-group">
        <label class="field-label">
          <span>Ukuran Kertas Buku</span>
          <span class="field-hint">Pilihan Pasti untuk Percetakan</span>
        </label>
        <div class="chip-row">
          <button
            v-for="paper in PAPER_SIZES"
            :key="paper.id"
            type="button"
            class="chip-btn"
            :class="{ active: pkgPaperSizeId === paper.id }"
            @click="pkgPaperSizeId = paper.id"
          >
            {{ paper.label }}
          </button>
        </div>

        <!-- Custom Width x Height Input if CUSTOM -->
        <div v-if="pkgPaperSizeId === 'CUSTOM'" class="custom-dim-box">
          <div class="dim-input-col">
            <label class="dim-label">Lebar (cm)</label>
            <input
              v-model.number="pkgCustomW"
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
              v-model.number="pkgCustomH"
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
              Kategori: {{ pkgCalculation.paperCategory === 'A4' ? 'B5 / A4' : 'A5 / Unesco' }}
            </span>
          </div>
        </div>
      </div>

      <div class="form-divider"></div>

      <!-- Stepper Jumlah Halaman -->
      <div class="field-group">
        <label for="pkg-pages" class="field-label">
          <span>Jumlah Halaman Naskah</span>
          <span class="field-hint">
            <template v-if="selectedPkgId === 'nusantara_new' || selectedPkgId === 'terima_beres'">
              Lebih dari 150 hal @ Rp {{ pkgCalculation.paperCategory === 'A4' ? '450' : '285' }}/hal
            </template>
            <template v-else>
              {{ pkgCalculation.pageTierLabel }}
            </template>
          </span>
        </label>
        <div class="stepper-unified">
          <button
            type="button"
            class="stepper-btn"
            aria-label="Kurangi 10 halaman"
            @click="pkgActualPages = Math.max(40, (Number(pkgActualPages) || 150) - 10)"
          >
            <Minus :size="16" />
          </button>
          <input
            id="pkg-pages"
            v-model.number="pkgActualPages"
            name="pkg_pages"
            type="text"
            inputmode="numeric"
            enterkeyhint="done"
            class="stepper-input-bare"
          />
          <button
            type="button"
            class="stepper-btn"
            aria-label="Tambah 10 halaman"
            @click="pkgActualPages = (Number(pkgActualPages) || 150) + 10"
          >
            <Plus :size="16" />
          </button>
        </div>
        <div class="chip-row">
          <button
            v-for="p in [150, 200, 250, 300, 350, 400, 500]"
            :key="p"
            type="button"
            class="chip-btn"
            :class="{ active: pkgActualPages === p }"
            @click="pkgActualPages = p"
          >
            {{ p }} Hal
          </button>
        </div>
      </div>

      <div class="form-divider"></div>

      <!-- Stepper Tambah Eksemplar -->
      <div class="field-group">
        <label for="pkg-extra-copies" class="field-label">
          <span>Tambah Eksemplar Cetak</span>
          <span class="field-hint">@ {{ formatRupiah(pkgCalculation.unitPriceExtraCopy) }}/eks</span>
        </label>
        <div class="stepper-unified">
          <button
            type="button"
            class="stepper-btn"
            aria-label="Kurangi eksemplar tambahan"
            @click="pkgExtraCopies = Math.max(0, (Number(pkgExtraCopies) || 0) - 5)"
          >
            <Minus :size="16" />
          </button>
          <input
            id="pkg-extra-copies"
            v-model.number="pkgExtraCopies"
            name="pkg_extra_copies"
            type="text"
            inputmode="numeric"
            enterkeyhint="done"
            class="stepper-input-bare"
          />
          <button
            type="button"
            class="stepper-btn"
            aria-label="Tambah 5 eksemplar"
            @click="pkgExtraCopies = (Number(pkgExtraCopies) || 0) + 5"
          >
            <Plus :size="16" />
          </button>
        </div>
        <div class="chip-row">
          <button
            v-for="q in [0, 5, 10, 20, 50, 100]"
            :key="q"
            type="button"
            class="chip-btn"
            :class="{ active: pkgExtraCopies === q }"
            @click="pkgExtraCopies = q"
          >
            {{ q === 0 ? 'Tanpa Tambahan' : `+${q} Eks` }}
          </button>
        </div>
      </div>

      <div class="form-divider"></div>

      <!-- OPSI FINISHING COVER (HARD COVER & SPOT UV) -->
      <div class="field-group">
        <label class="field-label">
          <span>Finishing & Sampul Buku</span>
        </label>
        
        <!-- Checkbox Hard Cover -->
        <div class="toggle-row">
          <label for="pkg-hardcover-check" class="toggle-label">
            <input
              id="pkg-hardcover-check"
              v-model="pkgUseHardCover"
              type="checkbox"
              class="toggle-checkbox"
            />
            <span>
              <strong>Hard Cover Mewah</strong>
              <small style="display: block; color: var(--text-muted); font-size: 0.78rem">
                {{ pkgCalculation.totalCopiesReceived }} eks @ {{ formatRupiah(pkgCalculation.hardCoverRate) }}/eks
              </small>
            </span>
          </label>
          <span class="toggle-price">
            {{ pkgUseHardCover ? `+${formatRupiah(pkgCalculation.hardCoverCost)}` : `@ ${formatRupiah(pkgCalculation.hardCoverRate)}` }}
          </span>
        </div>

        <!-- Checkbox Spot UV -->
        <div class="toggle-row" style="margin-block-start: 8px">
          <label for="pkg-spotuv-check" class="toggle-label">
            <input
              id="pkg-spotuv-check"
              v-model="pkgUseSpotUv"
              type="checkbox"
              class="toggle-checkbox"
            />
            <span>
              <strong>Finishing Spot UV</strong>
              <small style="display: block; color: var(--text-muted); font-size: 0.78rem">Efek kilap timbul elegan pada cover buku</small>
            </span>
          </label>
          <span class="toggle-price">+{{ formatRupiah(SPOT_UV_FEE) }}</span>
        </div>
      </div>

      <div class="form-divider"></div>

      <!-- OPSI HAKI & PENAMBAHAN NAMA PENULIS -->
      <div class="field-group">
        <label class="field-label">
          <span>Sertifikat HAKI Kemenkumham</span>
        </label>

        <!-- Paket sudah termasuk HAKI -->
        <div v-if="selectedBookPkg.includesHaki" class="haki-included-box">
          <div style="display: flex; align-items: center; justify-content: space-between">
            <span style="display: flex; align-items: center; gap: 6px; font-weight: 600; color: #166534">
              <Award :size="16" />
              Sudah Termasuk Sertifikat HAKI (1 Nama Penulis)
            </span>
            <span class="badge-pill badge-gold">Gratis</span>
          </div>
        </div>

        <!-- Paket belum termasuk HAKI -->
        <div v-else class="toggle-row">
          <label for="pkg-haki-check" class="toggle-label">
            <input
              id="pkg-haki-check"
              v-model="pkgAddHaki"
              type="checkbox"
              class="toggle-checkbox"
            />
            <span>Tambah Sertifikat HAKI Kemenkumham (1 Nama)</span>
          </label>
          <span class="toggle-price">+{{ formatRupiah(pkgHakiFee) }}</span>
        </div>

        <!-- Stepper Jumlah Nama Penulis HAKI jika HAKI aktif -->
        <div v-if="selectedBookPkg.includesHaki || pkgAddHaki" class="author-haki-box" style="margin-block-start: 8px">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-block-end: 6px">
            <span style="font-size: 0.85rem; font-weight: 500">Jumlah Nama Penulis di Sertifikat HAKI:</span>
            <span v-if="pkgHakiAuthors > 1" class="field-hint" style="color: var(--kbm-red); font-weight: 600">
              +{{ formatRupiah((pkgHakiAuthors - 1) * EXTRA_HAKI_PERSON_FEE) }} (+{{ pkgHakiAuthors - 1 }} nama @ 25rb)
            </span>
          </div>
          <div class="stepper-unified mini">
            <button
              type="button"
              class="stepper-btn"
              aria-label="Kurangi nama penulis"
              @click="pkgHakiAuthors = Math.max(1, (Number(pkgHakiAuthors) || 1) - 1)"
            >
              <Minus :size="14" />
            </button>
            <input
              v-model.number="pkgHakiAuthors"
              type="text"
              inputmode="numeric"
              class="stepper-input-bare"
            />
            <button
              type="button"
              class="stepper-btn"
              aria-label="Tambah nama penulis"
              @click="pkgHakiAuthors = (Number(pkgHakiAuthors) || 1) + 1"
            >
              <Plus :size="14" />
            </button>
          </div>
        </div>
      </div>

      <div class="form-divider"></div>

      <!-- POTONGAN KHUSUS ANDA -->
      <div class="field-group">
        <label for="pkg-discount" class="field-label">
          <span>Potongan Khusus Anda</span>
        </label>
        <div class="segmented">
          <button
            type="button"
            class="segment-btn"
            :class="{ active: pkgDiscountType === 'nominal' }"
            @click="pkgDiscountType = 'nominal'"
          >
            Nominal (Rp)
          </button>
          <button
            type="button"
            class="segment-btn"
            :class="{ active: pkgDiscountType === 'percent' }"
            @click="pkgDiscountType = 'percent'"
          >
            Persen (%)
          </button>
        </div>
        <input
          v-if="pkgDiscountType === 'nominal'"
          id="pkg-discount"
          v-model="formattedDiscount"
          type="text"
          inputmode="numeric"
          enterkeyhint="done"
          class="input-control"
          placeholder="Contoh: 50.000"
        />
        <input
          v-else
          id="pkg-discount-pct"
          v-model.number="pkgDiscountValue"
          type="number"
          min="0"
          max="100"
          enterkeyhint="done"
          class="input-control"
          placeholder="Contoh: 10"
        />
        <div v-if="pkgDiscountType === 'nominal'" class="chip-row">
          <button
            v-for="d in [0, 50000, 100000, 150000, 250000]"
            :key="d"
            type="button"
            class="chip-btn"
            :class="{ active: pkgDiscountValue === d }"
            @click="pkgDiscountValue = d"
          >
            {{ d === 0 ? 'Tanpa Diskon' : formatRupiah(d) }}
          </button>
        </div>
      </div>
    </form>
  </section>

  <!-- SUMMARY INVOICE (Mobile inline view) -->
  <SummaryInvoice class="mobile-only-summary" />

  <!-- ACCORDION FASILITAS PAKET -->
  <section class="edge-section">
    <div
      class="section-header interactive"
      @click="showFacilities = !showFacilities"
    >
      <h3 class="section-title">
        <CheckCircle2 :size="16" style="color: var(--wa-green)" />
        <span>{{ pkgCalculation.pkg.facilities.length }} Fasilitas & Bonus Paket</span>
      </h3>
      <span class="badge-pill badge-neutral" style="display: inline-flex; align-items: center; gap: 4px">
        <span>{{ showFacilities ? 'Tutup' : 'Lihat' }}</span>
        <component :is="showFacilities ? ChevronUp : ChevronDown" :size="13" />
      </span>
    </div>
    <div v-if="showFacilities" class="facility-grid">
      <div
        v-for="(fac, i) in pkgCalculation.pkg.facilities"
        :key="i"
        class="facility-item"
      >
        <span class="facility-check">✓</span>
        <span>{{ fac }}</span>
      </div>
    </div>
  </section>
</template>
