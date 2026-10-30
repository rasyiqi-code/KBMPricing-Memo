<script setup>
import { ref } from 'vue'
import {
  BookOpen,
  Image as ImageIcon,
  Shirt,
  Minus,
  Plus,
  SlidersHorizontal,
  CheckCircle2,
  ChevronUp,
  ChevronDown
} from 'lucide-vue-next'
import { BOOK_PACKAGES, formatRupiah } from '../data/pricingData.js'
import { usePricingStore } from '../composables/usePricingStore.js'
import SummaryInvoice from './SummaryInvoice.vue'

const {
  selectedPkgId,
  pkgActualPages,
  pkgExtraCopies,
  pkgAddHaki,
  pkgHakiFee,
  pkgDiscountType,
  pkgDiscountValue,
  selectedBookPkg,
  pkgCalculation,
  openFlyerModal
} = usePricingStore()

const showFacilities = ref(false)
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
        <span>Kustomisasi & Diskon</span>
      </h2>
      <span class="badge-pill badge-neutral">Ukuran A5 / Unesco</span>
    </div>

    <form class="form-stack" @submit.prevent>
      <!-- Stepper Jumlah Halaman -->
      <div class="field-group">
        <label for="pkg-pages" class="field-label">
          <span>Jumlah Halaman Naskah</span>
          <span class="field-hint">{{ pkgCalculation.pageTierLabel }}</span>
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

      <!-- Opsi HAKI -->
      <div v-if="!selectedBookPkg.includesHaki" class="toggle-row">
        <label for="pkg-haki-check" class="toggle-label">
          <input
            id="pkg-haki-check"
            v-model="pkgAddHaki"
            name="pkg_add_haki"
            type="checkbox"
            class="toggle-checkbox"
          />
          <span>Tambah Sertifikat HAKI Kemenkumham</span>
        </label>
        <span class="toggle-price">+{{ formatRupiah(pkgHakiFee) }}</span>
      </div>

      <div class="form-divider"></div>

      <!-- Potongan Diskon Khusus -->
      <div class="field-group">
        <label for="pkg-discount" class="field-label">
          <span>Potongan Diskon (Dosen/Guru/Mhs)</span>
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
          id="pkg-discount"
          v-model.number="pkgDiscountValue"
          name="pkg_discount"
          type="text"
          inputmode="numeric"
          enterkeyhint="done"
          class="input-control"
          :placeholder="pkgDiscountType === 'percent' ? 'Contoh: 10' : 'Contoh: 100000'"
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
