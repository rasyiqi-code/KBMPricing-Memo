<script setup>
import { Layers, X, Trash2, RotateCcw } from 'lucide-vue-next'
import { formatRupiah } from '../data/pricingData.js'
import { usePricingStore } from '../composables/usePricingStore.js'

const {
  savedQuotes,
  showCartModal,
  activeFlyerModal,
  toastMessage,
  waMessageStyle,
  removeSavedQuote,
  shareViaNativeSheet
} = usePricingStore()
</script>

<template>
  <!-- BOTTOM SHEET KOMPARASI PENAWARAN -->
  <div v-if="showCartModal" class="modal-backdrop" @click.self="showCartModal = false">
    <div class="modal-box">
      <div class="sheet-handle"></div>
      <div class="section-header" style="margin-block-end: 0">
        <h3 class="section-title">
          <Layers :size="16" style="color: var(--kbm-red)" />
          <span>Komparasi Penawaran ({{ savedQuotes.length }})</span>
        </h3>
        <button
          type="button"
          class="btn-micro"
          aria-label="Tutup modal"
          @click="showCartModal = false"
        >
          <X :size="14" />
        </button>
      </div>

      <div
        v-if="savedQuotes.length === 0"
        style="padding: 18px 8px; text-align: center; color: var(--text-secondary); font-size: 0.82rem"
      >
        Belum ada opsi disimpan. Ketuk tombol <strong>"+ Simpan Komparasi"</strong> untuk membandingkan beberapa paket sekaligus dalam satu pesan WhatsApp.
      </div>

      <div v-else class="pkg-list-vertical">
        <div
          v-for="(item, idx) in savedQuotes"
          :key="item.id"
          class="pkg-row-card"
        >
          <div>
            <div class="flyer-cat">Opsi {{ idx + 1 }} • {{ item.type }}</div>
            <div class="pkg-name">{{ item.title }}</div>
            <div class="pkg-price">{{ formatRupiah(item.grandTotal) }}</div>
          </div>
          <button
            type="button"
            class="btn-micro"
            aria-label="Hapus opsi"
            @click="removeSavedQuote(item.id)"
          >
            <Trash2 :size="13" />
          </button>
        </div>

        <div style="display: flex; gap: 8px; margin-block-start: 4px">
          <button
            type="button"
            class="btn btn-wa"
            style="flex: 1"
            @click="waMessageStyle = 'komparasi'; showCartModal = false; shareViaNativeSheet()"
          >
            <svg
              viewBox="0 0 24 24"
              width="15"
              height="15"
              fill="currentColor"
              style="flex-shrink: 0"
            >
              <path
                d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
              />
            </svg>
            <span>Kirim Komparasi ke WA</span>
          </button>
          <button
            type="button"
            class="btn btn-secondary"
            @click="savedQuotes = []"
          >
            <RotateCcw :size="13" />
            <span>Reset</span>
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- BOTTOM SHEET FLYER VIEWER -->
  <div v-if="activeFlyerModal" class="modal-backdrop" @click.self="activeFlyerModal = null">
    <div class="modal-box">
      <div class="sheet-handle"></div>
      <div class="section-header" style="margin-block-end: 0">
        <h3 class="section-title">{{ activeFlyerModal.title }}</h3>
        <button
          type="button"
          class="btn-micro"
          aria-label="Tutup flyer"
          @click="activeFlyerModal = null"
        >
          <X :size="14" />
        </button>
      </div>
      <img
        :src="activeFlyerModal.url"
        :alt="activeFlyerModal.title"
        style="inline-size: 100%; border-radius: 8px; height: auto"
      />
    </div>
  </div>

  <!-- TOAST NOTIFICATION -->
  <div v-if="toastMessage" class="toast-banner" role="status" aria-live="polite">
    {{ toastMessage }}
  </div>
</template>
