<script setup>
import { ref, computed } from 'vue'
import { Table2, LayoutGrid, Images, ZoomIn, BookOpen, Layers } from 'lucide-vue-next'
import {
  PAGE_TIERS,
  QUANTITY_TIERS,
  TABLE_NOTES,
  FLYERS_LIST
} from '../data/pricingData.js'
import { usePricingStore } from '../composables/usePricingStore.js'

const { openFlyerModal } = usePricingStore()
const isCardMode = ref(false)
const selectedPageFilter = ref('all')

const filteredPageTiers = computed(() => {
  if (selectedPageFilter.value === 'all') {
    return PAGE_TIERS
  }
  return PAGE_TIERS.filter(p => p.id === selectedPageFilter.value)
})
</script>

<template>
  <section class="edge-section">
    <div class="section-header">
      <h2 class="section-title">
        <Table2 :size="16" style="color: var(--kbm-red)" />
        <span>Tabel Harga Terbit Buku</span>
      </h2>
      <button
        type="button"
        class="btn-micro"
        :class="{ accent: isCardMode }"
        @click="isCardMode = !isCardMode"
      >
        <component :is="isCardMode ? Table2 : LayoutGrid" :size="13" />
        <span>{{ isCardMode ? 'Tampilkan Tabel' : 'Mode Kartu' }}</span>
      </button>
    </div>

    <!-- Quick Page Filter Pills (Aktif di Mode Kartu) -->
    <div v-if="isCardMode" class="card-filter-scroll">
      <button
        type="button"
        class="filter-pill"
        :class="{ active: selectedPageFilter === 'all' }"
        @click="selectedPageFilter = 'all'"
      >
        Semua Halaman ({{ PAGE_TIERS.length }})
      </button>
      <button
        v-for="p in PAGE_TIERS"
        :key="p.id"
        type="button"
        class="filter-pill"
        :class="{ active: selectedPageFilter === p.id }"
        @click="selectedPageFilter = p.id"
      >
        {{ p.a5 }} Hal A5
      </button>
    </div>

    <!-- MODE 1: PROPER NATIVE CARD GRID -->
    <div v-if="isCardMode" class="pricing-card-list">
      <div
        v-for="tier in filteredPageTiers"
        :key="tier.id"
        class="pricing-tier-card"
      >
        <div class="tier-card-header">
          <div class="tier-badge-title">
            <BookOpen :size="16" class="tier-icon" />
            <div>
              <div class="tier-main-title">{{ tier.label }}</div>
              <div class="tier-sub-title">A5: {{ tier.a5 }} Halaman &bull; A4: {{ tier.a4 }} Halaman</div>
            </div>
          </div>
        </div>

        <div class="tier-rates-grid">
          <div
            v-for="(qt, idx) in QUANTITY_TIERS"
            :key="qt.id"
            class="rate-card-item"
          >
            <div class="rate-qty-badge">{{ qt.label }}</div>
            <div class="rate-price-box">
              <span class="rate-rp">Rp</span>
              <span class="rate-num">{{ tier.prices[idx].toLocaleString('id-ID') }}</span>
              <span class="rate-unit">/eks</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODE 2: RESPONSIVE HORIZONTAL SPREADSHEET TABLE -->
    <div
      v-else
      tabindex="0"
      role="region"
      aria-label="Tabel interaktif harga cetak dan terbit buku KBM Indonesia"
      class="table-wrapper"
    >
      <div class="table-caption-bar">
        <span>Harga Satuan Cetak/Terbit Buku per Eksemplar (Gratis Ongkir Seluruh Indonesia)</span>
      </div>
      <table class="pricing-table">
        <thead>
          <tr>
            <th class="th-corner">HALAMAN</th>
            <th v-for="qt in QUANTITY_TIERS" :key="qt.id">{{ qt.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in PAGE_TIERS" :key="row.id">
            <th class="th-page-label">{{ row.label }}</th>
            <td v-for="(price, idx) in row.prices" :key="idx">
              Rp {{ price.toLocaleString('id-ID') }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Catatan & Ketentuan Brosur -->
    <div class="facility-grid" style="margin-block-start: 14px">
      <div
        v-for="(note, idx) in TABLE_NOTES"
        :key="idx"
        class="facility-item"
      >
        <span class="facility-check">&bull;</span>
        <span>{{ note }}</span>
      </div>
    </div>
  </section>

  <!-- BROSUR RESMI (11 GAMBAR LIGHTBOX) -->
  <section class="edge-section">
    <div class="section-header">
      <h2 class="section-title">
        <Images :size="16" style="color: var(--kbm-red)" />
        <span>Brosur Resmi (11 Gambar)</span>
      </h2>
      <span class="badge-pill badge-neutral" style="display: inline-flex; align-items: center; gap: 4px">
        <ZoomIn :size="12" />
        <span>Ketuk untuk Zoom</span>
      </span>
    </div>

    <div class="flyer-grid">
      <div
        v-for="flyer in FLYERS_LIST"
        :key="flyer.id"
        class="flyer-card"
        @click="openFlyerModal(flyer)"
      >
        <img :src="flyer.url" :alt="flyer.title" class="flyer-img" loading="lazy" />
        <div class="flyer-caption">
          <div class="flyer-cat">{{ flyer.category }}</div>
          <div>{{ flyer.title }}</div>
        </div>
      </div>
    </div>
  </section>
</template>
