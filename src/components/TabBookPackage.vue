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
  parseNumberFromDots,
  formatDiscountEquivalent
} from '../data/pricingData.js'
import { usePricingStore } from '../composables/usePricingStore.js'
import SummaryInvoice from './SummaryInvoice.vue'

const {
  selectedPkgId,
  pkgPaperSizeId,
  pkgCustomW,
  pkgCustomH,
  pkgExtraPages,
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

const discountEquivalent = computed(() => {
  return formatDiscountEquivalent(
    pkgDiscountType.value,
    pkgDiscountValue.value,
    pkgCalculation.value.discountAmount,
    pkgCalculation.value.subtotal
  )
})

function setDiscount(val) {
  pkgDiscountValue.value = Number(val) || 0
}
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

      <!-- BARIS 2 KOLOM DI DESKTOP: JUMLAH HALAMAN & TAMBAH EKSEMPLAR -->
      <div class="form-grid-2col">
        <!-- Stepper Tambah Halaman Lebih -->
        <div class="field-group">
          <label for="pkg-extra-pages" class="field-label">
            <span>Tambah Halaman Naskah</span>
            <span class="field-hint">
              <template v-if="selectedPkgId === 'nusantara_new' || selectedPkgId === 'terima_beres'">
                @ Rp {{ pkgCalculation.paperCategory === 'A4' ? '450' : '285' }}/hal
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
              aria-label="Kurangi 5 halaman"
              @click="pkgExtraPages = Math.max(0, (Number(pkgExtraPages) || 0) - 5)"
            >
              <Minus :size="16" />
            </button>
            <input
              id="pkg-extra-pages"
              v-model.number="pkgExtraPages"
              name="pkg_extra_pages"
              type="text"
              inputmode="numeric"
              enterkeyhint="done"
              class="stepper-input-bare"
            />
            <button
              type="button"
              class="stepper-btn"
              aria-label="Tambah 5 halaman"
              @click="pkgExtraPages = (Number(pkgExtraPages) || 0) + 5"
            >
              <Plus :size="16" />
            </button>
          </div>
          <div class="chip-row">
            <button
              v-for="p in [0, 5, 10, 20, 50, 100, 150]"
              :key="p"
              type="button"
              class="chip-btn"
              :class="{ active: (Number(pkgExtraPages) || 0) === p }"
              @click="pkgExtraPages = p"
            >
              {{ p === 0 ? 'Tanpa Tambahan' : `+${p} Hal` }}
            </button>
          </div>
        </div>

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
      </div>

      <div class="form-divider"></div>

      <!-- BARIS 2 KOLOM DI DESKTOP: FINISHING COVER & HAKI -->
      <div class="form-grid-2col">
        <!-- OPSI FINISHING COVER (HARD COVER & SPOT UV) -->
        <div class="field-group">
          <label class="field-label">
            <span>Finishing & Sampul Buku</span>
          </label>
          
          <div class="toggle-card-group">
            <!-- Checkbox Hard Cover -->
            <div class="toggle-card-item">
              <label for="pkg-hardcover-check" class="toggle-label" style="margin: 0; cursor: pointer">
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
            <div class="toggle-card-item">
              <label for="pkg-spotuv-check" class="toggle-label" style="margin: 0; cursor: pointer">
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
        </div>

        <!-- OPSI HAKI & PENAMBAHAN NAMA PENULIS -->
        <div class="field-group">
          <label class="field-label">
            <span>Sertifikat HAKI Kemenkumham</span>
          </label>

          <div class="haki-card-box" :class="{ active: selectedBookPkg.includesHaki || pkgAddHaki }">
            <!-- Paket sudah termasuk HAKI -->
            <div v-if="selectedBookPkg.includesHaki" class="haki-card-top haki-included-header">
              <span style="display: flex; align-items: center; gap: 6px; font-weight: 600; color: #166534; font-size: 0.86rem">
                <Award :size="16" />
                Sudah Termasuk Sertifikat HAKI (1 Nama)
              </span>
              <span class="badge-pill badge-gold">Gratis</span>
            </div>

            <!-- Paket belum termasuk HAKI (Toggle) -->
            <div v-else class="haki-card-top">
              <label for="pkg-haki-check" class="toggle-label" style="margin: 0; cursor: pointer">
                <input
                  id="pkg-haki-check"
                  v-model="pkgAddHaki"
                  type="checkbox"
                  class="toggle-checkbox"
                />
                <span style="font-weight: 600; font-size: 0.86rem">Tambah Sertifikat HAKI (1 Nama)</span>
              </label>
              <span class="toggle-price">+{{ formatRupiah(pkgHakiFee) }}</span>
            </div>

            <!-- Seamless Author Counter inside the same card -->
            <div v-if="selectedBookPkg.includesHaki || pkgAddHaki" class="haki-card-sub">
              <div>
                <span class="haki-sub-label">Jumlah Nama Penulis:</span>
                <span v-if="pkgHakiAuthors > 1" class="haki-sub-hint">
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
        </div>
      </div>

      <div class="form-divider"></div>

      <!-- POTONGAN KHUSUS ANDA -->
      <div class="field-group">
        <label for="pkg-discount" class="field-label">
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
            <div class="discount-input-wrap">
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
              <span v-if="discountEquivalent" class="discount-badge-tag">
                {{ discountEquivalent }}
              </span>
            </div>
          </div>
          <div v-if="pkgDiscountType === 'nominal'" class="chip-row">
            <button
              v-for="d in [0, 50000, 100000, 150000, 250000]"
              :key="d"
              type="button"
              class="chip-btn"
              :class="{ active: Number(pkgDiscountValue) === d }"
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
              :class="{ active: Number(pkgDiscountValue) === pct }"
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
