<script setup lang="ts">
import { saveState } from '@/composables/useHistory'
import { cleanupThreeResources, isNewlyCreated, loadAutoSaveData } from '@/composables/useLayout'
import { addObject } from '@/three/objectFactory'
import { handleResize, initThree, rebuildSceneFromData } from '@/three/sceneManager'
import { onMounted, onUnmounted } from 'vue'

onMounted(() => {
  console.log('MainPage onMounted: Initializing Three.js...')
  initThree()
  // 再次调用loadAutoSaveData()确保场景数据被正确加载
  if (!loadAutoSaveData()) {
    // 如果没有自动保存数据
    console.log('No autosave found, rebuilding scene (likely new or empty).')
    if (isNewlyCreated.value) {
      addObject('desk-rect')
      saveState()
      isNewlyCreated.value = false
      console.log('New Scene Created')
    } else {
      rebuildSceneFromData()
      saveState(false) // Load initial state without adding to history
      console.log('Scene Loaded')
    }
  }

  // 读取 composables 中的 objects 数组并构建3D场景
  rebuildSceneFromData()

  window.addEventListener('resize', handleResize)
  handleResize()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  console.log('MainPage onUnmounted: Cleaning up Three.js resources...')
  // 离开此页面时都销毁 Three.js 资源
  // 状态和 localStorage 不会在这里被清除
  cleanupThreeResources()
})
</script>

<template>
  <div id="scene-container" ref="scene-container" class="canvas-container w-full"></div>
</template>
