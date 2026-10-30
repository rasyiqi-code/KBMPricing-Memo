<script setup>
import { MessageSquare, Layers } from 'lucide-vue-next'
import { usePricingStore } from '../composables/usePricingStore.js'

const {
  customNotes,
  savedQuotes,
  waMessageStyle,
  generatedWhatsAppText,
  addCurrentToComparison
} = usePricingStore()
</script>

<template>
  <section class="edge-section flush-bottom mobile-only-preview-card">
    <div class="section-header">
      <h2 class="section-title">
        <MessageSquare :size="16" style="color: var(--wa-green)" />
        <span>Preview Pesan WA</span>
      </h2>
      <button type="button" class="btn-micro accent" @click="addCurrentToComparison">
        <Layers :size="13" />
        <span>+ Simpan Komparasi</span>
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
        <label for="wa-custom-notes" class="field-label">Catatan Tambahan di Pesan WA</label>
        <input
          id="wa-custom-notes"
          v-model="customNotes"
          name="custom_notes"
          type="text"
          enterkeyhint="done"
          class="input-control"
          placeholder="Contoh: Promo khusus bulan ini gratis pembatas buku"
        />
      </div>
    </div>

    <div class="wa-preview-box">
      <div class="wa-bubble">{{ generatedWhatsAppText }}</div>
    </div>
  </section>
</template>
