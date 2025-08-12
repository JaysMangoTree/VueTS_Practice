<template>
  <div class="lr-shell" :class="{ open: isOpen }">
    <!-- TAB RAIL (fixed at top-left) -->
    <v-sheet
      class="lr-rail"
      color="transparent"
      elevation="0"
      @mouseleave="hoverId = null"
    >
      <v-btn
        v-for="t in tabs"
        :key="t.id"
        block
        class="lr-tab"
        :class="{
          'lr-tab--hover': hoverId === t.id && !isOpen,
          'lr-tab--active': isOpen && activeId === t.id
        }"
        variant="text"
        @mouseenter="hoverId = t.id"
        @focus="hoverId = t.id"
        @click="onTabClick(t.id)"
        :aria-expanded="isOpen && activeId === t.id"
        :aria-controls="`panel-${t.id}`"
      >
        <span class="lr-tab__label">{{ t.label }}</span>
      </v-btn>
    </v-sheet>

    <!-- SIDEBAR / DRAWER (shifted to the right of the rail, no scrim) -->
    <v-navigation-drawer
      v-model="isOpen"
      :width="panelWidth"
      location="left"
      floating
      temporary
      :scrim="false"
      absolute
      class="lr-drawer"
      :style="{ left: isOpen ? `var(--tab-width)` : `-${panelWidth}px` }"
    >
      <template v-if="current" #prepend>
        <div class="lr-drawer__header">
          <h2 class="lr-title">{{ current.contentTitle ?? current.label }}</h2>
          <v-btn size="small" variant="outlined" @click="close" aria-label="Close">Close</v-btn>
        </div>
      </template>

      <div v-if="current" class="lr-drawer__body" :id="`panel-${current.id}`" role="region">
        <slot name="content" :tab="current">
          <p class="mb-4">{{ current.content }}</p>
        </slot>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, defineProps, defineEmits } from 'vue'

export type LeftTab = {
  id: string
  label: string
  content?: string
  contentTitle?: string
}

const props = defineProps<{
  tabs: LeftTab[]
  open?: boolean
  activeId?: string | null
  panelWidth?: number
}>()

const emit = defineEmits<{
  'update:open': [boolean]
  'update:active-id': [string | null]
}>()

const hoverId = ref<string | null>(null)

const _open = ref<boolean>(props.open ?? false)
const _activeId = ref<string | null>(props.activeId ?? null)
watch(() => props.open, v => { if (typeof v === 'boolean') _open.value = v })
watch(() => props.activeId, v => { _activeId.value = v ?? null })

const isOpen = computed({
  get: () => _open.value,
  set: v => { _open.value = v; emit('update:open', v) }
})
const activeId = computed({
  get: () => _activeId.value,
  set: v => { _activeId.value = v; emit('update:active-id', v) }
})

const current = computed(() => props.tabs.find(t => t.id === activeId.value))
const panelWidth = computed(() => props.panelWidth ?? 360)

function onTabClick(id: string) {
  if (isOpen.value && activeId.value === id) {
    isOpen.value = false
    return
  }
  activeId.value = id
  isOpen.value = true
}
function close(){ isOpen.value = false }
</script>

<style scoped>
.lr-shell{
  position:relative;
  height:100%;
  display:grid;
  grid-template-columns: auto 1fr; /* rail + app content */
}

/* === FIXED, TOP-LEFT RAIL (only as tall as its tabs) === */
.lr-rail{
  position: relative;
  top: 16px;
  left: 0;
  z-index: 2000; /* keep above page, below drawer content if needed */
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 16px 10px;
  width: var(--tab-width);
  transition: width var(--dur) var(--easing);
  height: auto;
}

/* rail widens slightly when hovering any tab (only if not open) */
.lr-shell:not(.open) .lr-rail:hover{
  width:var(--tab-width-hover);
}

.lr-tab{
  height:120px;
  justify-content:center;
  border:var(--stroke) solid var(--border);
  border-right:none;
  border-top-left-radius:var(--radius);
  border-bottom-left-radius:var(--radius);
  background:var(--rail-bg) !important;
  color:var(--text) !important;
  box-shadow: 3px 0 0 0 var(--border) inset;
  transition: transform var(--dur) var(--easing), background var(--dur) var(--easing);
}
.lr-tab__label{
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-weight:700;
  letter-spacing:.5px;
}
.lr-tab--hover{ transform: translateX(4px) scaleX(1.05); background:var(--hover) !important; }
.lr-tab--active{ transform: translateX(6px) scaleX(1.08); background:var(--panel-bg) !important; }

/* === Drawer sits to the right of the fixed rail, and keeps the hand-drawn borders === */
.lr-drawer {
  border-left: var(--stroke) solid var(--border);
  border-right: var(--stroke) solid var(--border);
  transition: left var(--dur) var(--easing);
}
.lr-drawer__header{
  display:flex; align-items:center; justify-content:space-between; gap:12px;
  padding:18px 16px; border-bottom: var(--stroke) solid var(--border);
}
.lr-title{ margin:0; font-size:28px; font-weight:800; }
.lr-drawer__body{ padding:16px; line-height:1.6; }
</style>