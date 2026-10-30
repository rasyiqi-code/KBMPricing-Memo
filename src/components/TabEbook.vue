<script setup>
import { ref } from 'vue'
import {
  TabletSmartphone,
  Image as ImageIcon,
  Minus,
  Plus,
  CheckCircle2,
  ChevronUp,
  ChevronDown
} from 'lucide-vue-next'
import {
  EBOOK_PACKAGES,
  EBOOK_FACILITIES,
  FLYERS_LIST,
  formatRupiah
} from '../data/pricingData.js'
import { usePricingStore } from '../composables/usePricingStore.js'
import SummaryInvoice from './SummaryInvoice.vue'

const {
  selectedEbookId,
  ebookPages,
  ebookAddHaki,
  ebookHakiFee,
  ebookDiscountValue,
  openFlyerModal
} = usePricingStore()

const showEbookFacilities = ref(false)
</script>

<template>
  <section class="edge-section">
    <div class="section-header">
      <h2 class="section-title">
        <TabletSmartphone :size="16" style="color: var(--kbm-red)" />
        <span>Paket Penerbitan E-Book</span>
      </h2>
      <button
        type="button"
        class="btn-micro accent"
        @click="openFlyerModal(FLYERS_LIST[2])"
      >
        <ImageIcon :size="13" />
        <span>Lihat Flyer</span>
      </button>
    </div>

    <div class="pkg-grid">
      <button
        v-for="eb in EBOOK_PACKAGES"
        :key="eb.id"
        type="button"
        class="pkg-card"
        :class="{ selected: selectedEbookId === eb.id }"
        @click="selectedEbookId = eb.id"
      >
        <div class="pkg-card-top">
          <span class="pkg-name">{{ eb.name }}</span>
        </div>

        <div class="pkg-price-group">
          <span class="pkg-price">{{ formatRupiah(eb.price) }}</span>
        </div>

        <div class="pkg-footer-tags">
          <span class="micro-tag">{{ eb.size }}</span>
          <span class="micro-tag">≤{{ eb.maxPages }} Hal</span>
        </div>
      </button>
    </div>

    <form class="form-stack" style="margin-block-start: 14px" @submit.prevent>
      <div class="field-group">
        <label for="ebook-pages" class="field-label">
          <span>Jumlah Halaman Naskah</span>
          <span class="field-hint">Standar ≤ 200 Hal</span>
        </label>
        <div class="stepper-unified">
          <button
            type="button"
            class="stepper-btn"
            aria-label="Kurangi halaman e-book"
            @click="ebookPages = Math.max(40, (Number(ebookPages) || 200) - 25)"
          >
            <Minus :size="16" />
          </button>
          <input
            id="ebook-pages"
            v-model.number="ebookPages"
            name="ebook_pages"
            type="text"
            inputmode="numeric"
            enterkeyhint="done"
            class="stepper-input-bare"
          />
          <button
            type="button"
            class="stepper-btn"
            aria-label="Tambah halaman e-book"
            @click="ebookPages = (Number(ebookPages) || 200) + 25"
          >
            <Plus :size="16" />
          </button>
        </div>
      </div>

      <div class="toggle-row">
        <label for="ebook-haki-check" class="toggle-label">
          <input
            id="ebook-haki-check"
            v-model="ebookAddHaki"
            name="ebook_add_haki"
            type="checkbox"
            class="toggle-checkbox"
          />
          <span>Sekalian Pengajuan HAKI</span>
        </label>
        <span class="toggle-price">+{{ formatRupiah(ebookHakiFee) }}</span>
      </div>

      <div class="field-group">
        <label for="ebook-discount" class="field-label">Potongan Diskon Khusus (Rp)</label>
        <input
          id="ebook-discount"
          v-model.number="ebookDiscountValue"
          name="ebook_discount"
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
      @click="showEbookFacilities = !showEbookFacilities"
    >
      <h3 class="section-title">
        <CheckCircle2 :size="16" style="color: var(--wa-green)" />
        <span>Fasilitas & Bonus E-Book</span>
      </h3>
      <span class="badge-pill badge-neutral" style="display: inline-flex; align-items: center; gap: 4px">
        <span>{{ showEbookFacilities ? 'Tutup' : 'Lihat' }}</span>
        <component :is="showEbookFacilities ? ChevronUp : ChevronDown" :size="13" />
      </span>
    </div>
    <div v-if="showEbookFacilities" class="facility-grid">
      <div v-for="(f, i) in EBOOK_FACILITIES" :key="i" class="facility-item">
        <span class="facility-check">✓</span>
        <span>{{ f }}</span>
      </div>
    </div>
  </section>
</template>
