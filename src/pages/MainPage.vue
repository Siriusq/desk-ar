<script setup lang="ts">
import SceneCanvas from '@/components/SceneCanvas.vue'
import EditorPanel from '@/components/EditorPanel.vue'
import { isPreviewOptionModalOpen, useUIState } from '@/composables/useUIState'
import HelpModal from '@/components/HelpModal.vue'
import AddModelModal from '@/components/AddModelModal.vue'
import { useModelManager } from '@/composables/useImportManager'
import { ref } from 'vue'
import { undo, redo, canUndo, canRedo } from '@/composables/useHistory'
import { deleteObject, selectedObjectId } from '@/composables/useObjects'
import PreviewOptionModal from '@/components/PreviewOptionModal.vue'

defineOptions({
  name: 'MainPage',
})

// 使用 Composable 共享状态
const {
  isControlPanelOpen,
  isHelpModalOpen,
  isAddModelModalOpen,
  toggleControlPanel,
  toggleAddModelModal,
} = useUIState()

// 导入模型管理 Composable
const { handleFileChange } = useModelManager()

// 文件输入元素的引用
const fileInput = ref<HTMLInputElement | null>(null)

const deleteSelectObject = () => {
  if (selectedObjectId.value) {
    deleteObject(selectedObjectId.value)
    selectedObjectId.value = null
  }
}
</script>

<template>
  <div class="canvas-container">
    <!--3D场景-->
    <SceneCanvas></SceneCanvas>

    <!-- 隐藏的文件输入框 -->
    <!-- 接收 .gltf 或 .glb 文件，并在文件变化时调用 handleFileChange -->
    <input
      ref="fileInput"
      type="file"
      accept=".gltf,.glb"
      @change="handleFileChange"
      style="display: none"
    />

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
      <BButton variant="danger" @click="deleteSelectObject()">
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
</style>
