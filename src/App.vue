<script setup>
import { usePricingStore } from './composables/usePricingStore.js'
import AppHeader from './components/AppHeader.vue'
import CustomerInfoCard from './components/CustomerInfoCard.vue'
import TabBookPackage from './components/TabBookPackage.vue'
import TabCustomPrint from './components/TabCustomPrint.vue'
import TabConversion from './components/TabConversion.vue'
import TabEbook from './components/TabEbook.vue'
import TabReference from './components/TabReference.vue'
import WhatsAppPreviewCard from './components/WhatsAppPreviewCard.vue'
import TabletInspector from './components/TabletInspector.vue'
import MobileDock from './components/MobileDock.vue'
import ModalsOverlay from './components/ModalsOverlay.vue'

const { activeTab } = usePricingStore()
</script>

<template>
  <div class="app-shell">
    <AppHeader />

    <main class="main-content" :class="{ 'is-tablet-split': activeTab !== 'referensi' }">
      <!-- Left / Primary Column -->
      <div class="content-primary-col">
        <CustomerInfoCard />

        <TabBookPackage v-if="activeTab === 'paket'" />
        <TabCustomPrint v-else-if="activeTab === 'custom'" />
        <TabConversion v-else-if="activeTab === 'konversi'" />
        <TabEbook v-else-if="activeTab === 'ebook'" />
        <TabReference v-else-if="activeTab === 'referensi'" />

        <!-- Mobile-only inline WA preview card -->
        <WhatsAppPreviewCard v-if="activeTab !== 'referensi'" />
      </div>

      <!-- Right Column (Sticky Tablet Inspector: Invoice & WA Preview) -->
      <div v-if="activeTab !== 'referensi'" class="content-tablet-sidebar">
        <TabletInspector />
      </div>
    </main>

    <!-- NATIVE FULL-EDGE FIXED BOTTOM DOCK (Mobile Bottom Nav & Quick Actions) -->
    <MobileDock />

    <ModalsOverlay />
  </div>
</template>
