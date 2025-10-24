<script setup lang="ts">
import { saveState } from '@/composables/useHistory'
import { loadLayoutData } from '@/composables/useLayout'
import { isPreviewing } from '@/composables/useScene'
import { addObject } from '@/three/objectFactory'
import { handleResize, initThree } from '@/three/sceneManager'
import { nextTick, onMounted, onUnmounted, watch } from 'vue'

onMounted(() => {
  const savedLayout = localStorage.getItem('ar-desk-planner-autosave')
  if (savedLayout) {
    loadLayoutData(JSON.parse(savedLayout))
  } else {
    initThree()
    addObject('desk-rect')
    saveState()
  }
  window.addEventListener('resize', handleResize)
  handleResize()
})

onUnmounted(() => window.removeEventListener('resize', handleResize))

watch(isPreviewing, () => {
  nextTick(() => {
    handleResize()
  })
})
</script>

<template>
  <div id="scene-container" ref="scene-container" class="canvas-container w-full"></div>
</template>
