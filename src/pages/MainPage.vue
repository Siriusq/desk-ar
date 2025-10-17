<script setup lang="ts">
import SceneCanvas from '@/components/SceneCanvas.vue'
import EditorPanel from '@/components/EditorPanel.vue'
import { useUIState } from '@/composables/useUIState'
import HelpModal from '@/components/HelpModal.vue'

// 使用 Composable 共享状态
const { isControlPanelOpen, isHelpModalOpen, toggleControlPanel, toggleHelpModal } = useUIState()
</script>

<template>
  <div class="canvas-container">
    <!--3D场景-->
    <SceneCanvas></SceneCanvas>

    <!--悬浮面板-->
    <div class="overlay-panel">
      <BButton variant="primary" @click="toggleControlPanel">
        <Transition name="icon-fade" mode="out-in">
          <i v-if="!isControlPanelOpen" key="menu-icon" class="bi bi-list" />
          <i v-else key="close-icon" class="bi bi-x-lg" />
        </Transition>
        菜单
      </BButton>
      <BButton @click="toggleHelpModal">
        <i class="bi bi-info-lg" />
        帮助
      </BButton>
    </div>

    <!--帮助面板-->
    <HelpModal v-model="isHelpModalOpen" />

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
  top: 8px; /* 距离顶部 20px */
  left: 16px; /* 距离左侧 20px */
  display: flex;
  gap: 10px;
  z-index: 10; /* 确保它在 Canvas 上方 (通常 Canvas 的 z-index 较低) */
}

/* 按钮图标动画 */
.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: all 0.2s ease;
}

/* 元素进入的起始状态和离开的结束状态 */
.icon-fade-enter-from,
.icon-fade-leave-to {
  opacity: 0;
}
</style>
