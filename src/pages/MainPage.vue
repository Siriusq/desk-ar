<script setup lang="ts">
import SceneCanvas from '@/components/SceneCanvas.vue'
import EditorPanel from '@/components/EditorPanel.vue'
import { delay, isLoading, isPreviewOptionModalOpen, useUIState } from '@/composables/useUIState'
import HelpModal from '@/components/HelpModal.vue'
import AddModelModal from '@/components/AddModelModal.vue'
import { undo, redo, canUndo, canRedo } from '@/composables/useHistory'
import { deleteSelectObject } from '@/composables/useObjects'
import PreviewOptionModal from '@/components/PreviewOptionModal.vue'
import { measurementHint } from '@/composables/useMeasurement'
import { onMounted } from 'vue'

defineOptions({
  name: 'MainPage',
})

const {
  isControlPanelOpen,
  isHelpModalOpen,
  isAddModelModalOpen,
  toggleControlPanel,
  toggleAddModelModal,
} = useUIState()

onMounted(async () => {
  // 设置加载状态
  isLoading.value = true

  // 在此等待 300 毫秒
  await delay(300)

  //console.log('MainPage onMounted: Initializing Three.js...')
})
</script>

<template>
  <div class="canvas-container">
    <!--3D场景-->
    <SceneCanvas></SceneCanvas>

    <div v-if="measurementHint" class="measurement-hint">
      {{ measurementHint }}
    </div>

    <!--悬浮面板-->
    <div class="overlay-panel">
      <!--菜单按钮-->
      <BButton variant="primary" @click="toggleControlPanel">
        <Transition name="icon-fade" mode="out-in">
          <i v-if="!isControlPanelOpen" key="menu-icon" class="bi bi-list" />
          <i v-else key="close-icon" class="bi bi-x-lg" />
        </Transition>
        菜单
      </BButton>
      <!--添加按钮-->
      <BButton variant="success" @click="toggleAddModelModal">
        <i class="bi bi-plus-lg" />
      </BButton>
      <!--删除按钮-->
      <BButton variant="danger" @click="deleteSelectObject">
        <i class="bi bi-trash" />
      </BButton>
      <!--撤销按钮-->
      <BButton variant="warning" @click="undo" :disabled="!canUndo">
        <i class="bi bi-arrow-counterclockwise" />
      </BButton>
      <!--重做按钮-->
      <BButton variant="info" @click="redo" :disabled="!canRedo">
        <i class="bi bi-arrow-clockwise" />
      </BButton>
    </div>

    <!--帮助面板-->
    <HelpModal v-model="isHelpModalOpen" />

    <!--添加模型面板-->
    <AddModelModal v-model="isAddModelModalOpen" />

    <!--导出选项面板-->
    <PreviewOptionModal v-model="isPreviewOptionModalOpen" />

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

/* 【新增】 测量提示样式 */
.measurement-hint {
  position: absolute;
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  z-index: 20;
  pointer-events: none; /* 不妨碍点击 */
  font-size: 14px;
  white-space: nowrap;
}
</style>
