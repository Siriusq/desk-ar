<script setup lang="ts">
import SceneCanvas from '@/components/SceneCanvas.vue'
import EditorPanel from '@/components/EditorPanel.vue'
import { useUIState } from '@/composables/useUIState'
import HelpModal from '@/components/HelpModal.vue'

// 使用 Composable 共享状态
const { isHelpModalOpen, toggleControlPanel, setHelpModalOpen, toggleHelpModal } = useUIState()
</script>

<template>
  <div class="canvas-container">
    <!--3D场景-->
    <SceneCanvas></SceneCanvas>

    <!--悬浮面板-->
    <div class="overlay-panel">
      <button @click="$router.push('/preview')">进入预览页面</button>
      <button @click="$router.push('/')">返回欢迎页面</button>
      <button class="btn btn-primary" type="button" @click="toggleControlPanel">
        <i class="bi bi-list"></i>
      </button>
      <BButton @click="toggleHelpModal"> 帮助 </BButton>
    </div>

    <!--帮助面板-->
    <HelpModal :model-value="isHelpModalOpen" @update:model-value="setHelpModalOpen" />

    <!--控制面板-->
    <EditorPanel></EditorPanel>
  </div>
</template>

<style scoped>
.canvas-container {
  /* 确保容器占据整个所需的空间 */
  width: 100vw;
  height: 100vh;
  position: relative;
}

/* 左上角悬浮按钮 */
.overlay-panel {
  position: absolute; /* 悬浮在 TresCanvas 上方 */
  top: 20px; /* 距离顶部 20px */
  left: 20px; /* 距离左侧 20px */
  display: flex;
  gap: 10px;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.5); /* 半透明背景 */
  border-radius: 5px;
  z-index: 10; /* 确保它在 Canvas 上方 (通常 Canvas 的 z-index 较低) */
}
</style>
