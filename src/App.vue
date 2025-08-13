<template>
  <v-app>
    <div class="layout">
      <LeftRailTabsVuetify
        v-model:open="open"
        v-model:active-id="activeId"
        :tabs="tabs"
      />

      <!-- Your page content goes here -->
      <main class="page">
        <h1>Your page</h1>
        <p>Hover the left tabs to expand; click to open the sidebar.</p>
      </main>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import LeftRailTabsVuetify, { type LeftTab } from './components/LeftRailTabsVuetify.vue'

const tabs = ref<LeftTab[]>([
  { id: 't1', label: 'Tab 1', contentTitle: 'Tab 1', content: 'Some random info.', color: '#ff6f61' },
  { id: 't2', label: 'Tab 2', contentTitle: 'Tab 2', content: 'Another block.', color: '#4db6ac' },
  { id: 't3', label: 'Tab 3', contentTitle: 'Tab 3', content: 'This is Tab 3.', color: '#9575cd' },
])

const open = ref(false)
const activeId = ref<string | null>(null)
</script>

<style scoped>
.layout{ display:grid; grid-template-columns:auto 1fr; height:100vh; }
.page{ padding:28px; }
</style>