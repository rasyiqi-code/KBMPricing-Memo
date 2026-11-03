<script setup>
import { ref, computed } from 'vue'
import {
  TabletSmartphone,
  Image as ImageIcon,
  Minus,
  Plus,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Award
} from 'lucide-vue-next'
import {
  EBOOK_PACKAGES,
  EBOOK_FACILITIES,
  FLYERS_LIST,
  EXTRA_HAKI_PERSON_FEE,
  EBOOK_EXTRA_PAGE_RATE,
  formatRupiah,
  formatNumberDots,
  parseNumberFromDots,
  formatDiscountEquivalent
} from '../data/pricingData.js'
import { usePricingStore } from '../composables/usePricingStore.js'
import SummaryInvoice from './SummaryInvoice.vue'

const {
  selectedEbookId,
  ebookPages,
  ebookAddHaki,
  ebookHakiAuthors,
  ebookHakiFee,
  ebookDiscountType,
  ebookDiscountValue,
  ebookCalculation,
  openFlyerModal
} = usePricingStore()

const showEbookFacilities = ref(false)

const formattedDiscount = computed({
  get() {
    return ebookDiscountValue.value ? formatNumberDots(ebookDiscountValue.value) : ''
  },
  set(val) {
    ebookDiscountValue.value = parseNumberFromDots(val)
  }
})

const discountEquivalent = computed(() => {
  return formatDiscountEquivalent(
    ebookDiscountType.value,
    ebookDiscountValue.value,
    ebookCalculation.value.discountAmount,
    ebookCalculation.value.subtotal
  )
})

function setDiscount(val) {
  ebookDiscountValue.value = Number(val) || 0
}
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

    <!-- Hanya ada 1 Paket E-Book Rp 400.000 -->
    <div class="pkg-grid single">
      <button
        v-for="eb in EBOOK_PACKAGES"
        :key="eb.id"
        type="button"
        class="pkg-card selected"
      >
        <div class="pkg-card-top">
          <span class="pkg-name">{{ eb.name }}</span>
          <span class="badge-pill badge-gold">ISBN & HAKI Ready</span>
        </div>

        <div class="pkg-price-group">
          <span class="pkg-price">{{ formatRupiah(eb.price) }}</span>
        </div>

        <div class="pkg-footer-tags">
          <span class="micro-tag">{{ eb.size }}</span>
          <span class="micro-tag">Standar ≤ {{ eb.maxPages }} Hal</span>
          <span class="micro-tag bonus">Layout + Cover + Distribusi</span>
        </div>
      </button>
    </div>

    <form class="form-stack" style="margin-block-start: 14px" @submit.prevent>
      <!-- BARIS 2 KOLOM DI DESKTOP: JUMLAH HALAMAN & HAKI -->
      <div class="form-grid-2col">
        <!-- Stepper Jumlah Halaman -->
        <div class="field-group">
          <label for="ebook-pages" class="field-label">
            <span>Jumlah Halaman Naskah</span>
            <span class="field-hint">
              <template v-if="ebookPages > 200">
                Lebih {{ ebookPages - 200 }} hal layout @ Rp {{ EBOOK_EXTRA_PAGE_RATE }}/hal
              </template>
              <template v-else>
                Standar Maksimal 200 Halaman
              </template>
            </span>
          </label>
          <div class="stepper-unified">
            <button
              type="button"
              class="stepper-btn"
              aria-label="Kurangi halaman e-book"
              @click="ebookPages = Math.max(20, (Number(ebookPages) || 200) - 20)"
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
              @click="ebookPages = (Number(ebookPages) || 200) + 20"
            >
              <Plus :size="16" />
            </button>
          </div>
          <div class="chip-row">
            <button
              v-for="p in [100, 150, 200, 250, 300, 400]"
              :key="p"
              type="button"
              class="chip-btn"
              :class="{ active: Number(ebookPages) === p }"
              @click="ebookPages = p"
            >
              {{ p }} Hal
            </button>
          </div>
        </div>

        <!-- OPSI HAKI (UNIFIED CARD) -->
        <div class="field-group">
          <label class="field-label">
            <span>Sertifikat HAKI Kemenkumham</span>
          </label>
          <div class="haki-card-box" :class="{ active: ebookAddHaki }">
            <div class="haki-card-top">
              <label for="ebook-haki-check" class="toggle-label" style="margin: 0; cursor: pointer">
                <input
                  id="ebook-haki-check"
                  v-model="ebookAddHaki"
                  name="ebook_add_haki"
                  type="checkbox"
                  class="toggle-checkbox"
                />
                <span style="font-weight: 600; font-size: 0.86rem">Sekalian Pengajuan HAKI (1 Nama)</span>
              </label>
              <span class="toggle-price">+{{ formatRupiah(ebookHakiFee) }}</span>
            </div>

            <!-- Seamless Author Counter inside the same card -->
            <div v-if="ebookAddHaki" class="haki-card-sub">
              <div>
                <span class="haki-sub-label">Jumlah Nama Penulis:</span>
                <span v-if="ebookHakiAuthors > 1" class="haki-sub-hint">
                  +{{ formatRupiah((ebookHakiAuthors - 1) * EXTRA_HAKI_PERSON_FEE) }} (+{{ ebookHakiAuthors - 1 }} nama @ 25rb)
                </span>
              </div>
              <div class="stepper-unified mini">
                <button
                  type="button"
                  class="stepper-btn"
                  aria-label="Kurangi nama penulis"
                  @click="ebookHakiAuthors = Math.max(1, (Number(ebookHakiAuthors) || 1) - 1)"
                >
                  <Minus :size="14" />
                </button>
                <input
                  v-model.number="ebookHakiAuthors"
                  type="text"
                  inputmode="numeric"
                  class="stepper-input-bare"
                />
                <button
                  type="button"
                  class="stepper-btn"
                  aria-label="Tambah nama penulis"
                  @click="ebookHakiAuthors = (Number(ebookHakiAuthors) || 1) + 1"
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
        <label for="ebook-discount" class="field-label">
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
                :class="{ active: ebookDiscountType === 'nominal' }"
                @click="ebookDiscountType = 'nominal'"
              >
                Nominal (Rp)
              </button>
              <button
                type="button"
                class="segment-btn"
                :class="{ active: ebookDiscountType === 'percent' }"
                @click="ebookDiscountType = 'percent'"
              >
                Persen (%)
              </button>
            </div>
            <div class="discount-input-wrap">
              <input
                v-if="ebookDiscountType === 'nominal'"
                id="ebook-discount"
                v-model="formattedDiscount"
                type="text"
                inputmode="numeric"
                enterkeyhint="done"
                class="input-control"
                placeholder="Contoh: 50.000"
              />
              <input
                v-else
                id="ebook-discount-pct"
                v-model.number="ebookDiscountValue"
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
          <div v-if="ebookDiscountType === 'nominal'" class="chip-row">
            <button
              v-for="d in [0, 25000, 50000, 75000, 100000]"
              :key="d"
              type="button"
              class="chip-btn"
              :class="{ active: Number(ebookDiscountValue) === d }"
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
              :class="{ active: Number(ebookDiscountValue) === pct }"
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
