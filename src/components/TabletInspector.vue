<script setup>
import { MessageSquare, Layers, Copy } from 'lucide-vue-next'
import { formatRupiah } from '../data/pricingData.js'
import { usePricingStore } from '../composables/usePricingStore.js'
import SummaryInvoice from './SummaryInvoice.vue'

const {
  customNotes,
  savedQuotes,
  waMessageStyle,
  generatedWhatsAppText,
  currentActiveTotal,
  addCurrentToComparison,
  copyWhatsAppText,
  shareViaNativeSheet
} = usePricingStore()
</script>

<template>
  <aside class="tablet-inspector-panel">
    <!-- 1. LIVE SUMMARY INVOICE -->
    <SummaryInvoice />

    <!-- 2. LIVE WHATSAPP PREVIEW CARD -->
    <div class="edge-section tablet-card-box">
      <div class="section-header">
        <h2 class="section-title">
          <MessageSquare :size="16" style="color: var(--wa-green)" />
          <span>Preview Pesan WA</span>
        </h2>
        <button type="button" class="btn-micro accent" @click="addCurrentToComparison">
          <Layers :size="13" />
          <span>+ Komparasi ({{ savedQuotes.length }})</span>
        </button>
      </div>

      <div class="form-stack" style="margin-block-end: 12px">
        <div class="segmented">
          <button
            type="button"
            class="segment-btn"
            :class="{ active: waMessageStyle === 'lengkap' }"
            @click="waMessageStyle = 'lengkap'"
          >
            Lengkap
          </button>
          <button
            type="button"
            class="segment-btn"
            :class="{ active: waMessageStyle === 'ringkas' }"
            @click="waMessageStyle = 'ringkas'"
          >
            Ringkas
          </button>
          <button
            type="button"
            class="segment-btn"
            :class="{ active: waMessageStyle === 'komparasi' }"
            @click="waMessageStyle = 'komparasi'"
          >
            Komparasi ({{ savedQuotes.length }})
          </button>
        </div>

        <div class="field-group">
          <label for="tablet-wa-notes" class="field-label">Catatan Tambahan di Pesan WA</label>
          <input
            id="tablet-wa-notes"
            v-model="customNotes"
            name="tablet_custom_notes"
            type="text"
            enterkeyhint="done"
            class="input-control"
            placeholder="Contoh: Promo khusus bulan ini"
          />
        </div>
      </div>

      <div class="wa-preview-box" style="margin-inline: 0; border-radius: var(--radius-sm)">
        <div class="wa-bubble">{{ generatedWhatsAppText }}</div>
      </div>

      <!-- Action Buttons directly in sidebar -->
      <div class="tablet-action-row">
        <button type="button" class="btn btn-secondary" style="flex: 1" @click="copyWhatsAppText">
          <Copy :size="15" />
          <span>Salin Teks WA</span>
        </button>
        <button type="button" class="btn btn-wa" style="flex: 1.2" @click="shareViaNativeSheet">
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
          <span>Bagikan ke WA</span>
        </button>
      </div>
    </div>
  </aside>
</template>

