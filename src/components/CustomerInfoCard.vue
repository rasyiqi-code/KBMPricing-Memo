<script setup>
import { UserCheck, ChevronUp, ChevronDown } from 'lucide-vue-next'
import { usePricingStore } from '../composables/usePricingStore.js'

const {
  showCustomerForm,
  customerName,
  customerPhone,
  bookTitle,
  marketingName
} = usePricingStore()
</script>

<template>
  <section class="edge-section">
    <div
      class="section-header interactive"
      @click="showCustomerForm = !showCustomerForm"
    >
      <div class="section-title">
        <UserCheck :size="16" style="color: var(--kbm-red)" />
        <span>Data Penulis & Marketing</span>
      </div>
      <span class="badge-pill badge-neutral" style="display: inline-flex; align-items: center; gap: 4px">
        <span>{{ showCustomerForm ? 'Tutup' : 'Isi Data' }}</span>
        <component :is="showCustomerForm ? ChevronUp : ChevronDown" :size="13" />
      </span>
    </div>

    <form
      v-if="showCustomerForm"
      class="form-stack"
      style="margin-block-start: 12px"
      @submit.prevent
    >
      <div class="field-group">
        <label for="cust-name" class="field-label">Nama Calon Penulis / Instansi</label>
        <input
          id="cust-name"
          v-model="customerName"
          name="customer_name"
          type="text"
          autocomplete="name"
          enterkeyhint="next"
          class="input-control"
          placeholder="Contoh: Dr. Budi Santoso, M.Pd."
        />
      </div>

      <div class="field-group">
        <label for="cust-phone" class="field-label">Nomor WhatsApp Customer (Opsional)</label>
        <input
          id="cust-phone"
          v-model="customerPhone"
          name="customer_phone"
          type="tel"
          inputmode="tel"
          autocomplete="tel"
          enterkeyhint="next"
          class="input-control"
          placeholder="Contoh: 081234567890"
        />
      </div>

      <div class="field-group">
        <label for="book-title" class="field-label">Judul Naskah / Buku (Opsional)</label>
        <input
          id="book-title"
          v-model="bookTitle"
          name="book_title"
          type="text"
          enterkeyhint="next"
          class="input-control"
          placeholder="Contoh: Pengantar Manajemen Pendidikan"
        />
      </div>

      <div class="field-group">
        <label for="marketing-name" class="field-label">Nama Marketing (Tersimpan Otomatis)</label>
        <input
          id="marketing-name"
          v-model="marketingName"
          name="marketing_name"
          type="text"
          autocomplete="name"
          enterkeyhint="done"
          class="input-control"
          placeholder="Nama Anda (Konsultan KBM)"
        />
      </div>
    </form>
  </section>
</template>
