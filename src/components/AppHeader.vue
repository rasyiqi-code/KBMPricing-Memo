<script setup>
import {
  Layers,
  BookOpen,
  Calculator,
  GraduationCap,
  TabletSmartphone,
  Images
} from 'lucide-vue-next'
import { usePricingStore } from '../composables/usePricingStore.js'

const { activeTab, savedQuotes, showCartModal } = usePricingStore()
</script>

<template>
  <header class="app-header">
    <div class="header-top">
      <div class="brand-badge">
        <img
          src="/kbm-logo.png"
          alt="KBM Indonesia"
          class="brand-logo-img"
        />
        <div class="header-title">
          <h1>KBM Pricing Pro</h1>
          <p>Kalkulator Marketing & Penawaran WA</p>
        </div>
      </div>

      <!-- TABLET TOP NAVIGATION TABS (Visible on >= 768px) -->
      <nav class="header-nav-tablet" aria-label="Navigasi Kategori Tablet">
        <button
          type="button"
          class="tablet-tab-btn"
          :class="{ active: activeTab === 'paket' }"
          @click="activeTab = 'paket'"
        >
          <BookOpen :size="16" />
          <span>Paket Buku</span>
        </button>
        <button
          type="button"
          class="tablet-tab-btn"
          :class="{ active: activeTab === 'custom' }"
          @click="activeTab = 'custom'"
        >
          <Calculator :size="16" />
          <span>Cetak Tabel</span>
        </button>
        <button
          type="button"
          class="tablet-tab-btn"
          :class="{ active: activeTab === 'konversi' }"
          @click="activeTab = 'konversi'"
        >
          <GraduationCap :size="16" />
          <span>Konversi KTI</span>
        </button>
        <button
          type="button"
          class="tablet-tab-btn"
          :class="{ active: activeTab === 'ebook' }"
          @click="activeTab = 'ebook'"
        >
          <TabletSmartphone :size="16" />
          <span>E-Book</span>
        </button>
        <button
          type="button"
          class="tablet-tab-btn"
          :class="{ active: activeTab === 'referensi' }"
          @click="activeTab = 'referensi'"
        >
          <Images :size="16" />
          <span>Tabel & Brosur</span>
        </button>
      </nav>

      <button
        type="button"
        class="quote-cart-btn"
        aria-label="Buka daftar komparasi penawaran"
        @click="showCartModal = true"
      >
        <Layers :size="15" />
        <span>Komparasi</span>
        <span class="quote-badge">{{ savedQuotes.length }}</span>
      </button>
    </div>
  </header>
</template>
