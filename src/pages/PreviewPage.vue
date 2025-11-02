<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { previewModelUrl } from '@/composables/usePreview'
import { isLoading } from '@/composables/useUIState'

// 动态导入 model-viewer，因为它只在此页面使用
import '@google/model-viewer'

const modelSrc = ref<string | null>(null)
const infoText = ref('加载中...')
const viewerRef = ref<HTMLModelViewerElement | null>(null)
const isARSupported = ref(false)

// 1. 页面加载时：从共享状态获取 URL
onMounted(() => {
  if (previewModelUrl.value) {
    modelSrc.value = previewModelUrl.value
    infoText.value = '3D 预览'
  } else {
    infoText.value = '⚠️ 未找到模型。请返回重试。'
  }
  // 无论成功与否，都关闭全局加载指示器
  isLoading.value = false
})

// 2. 页面卸载时：释放 Blob URL 资源
onUnmounted(() => {
  if (previewModelUrl.value) {
    console.log('✅ 已释放 Blob URL 资源')
    URL.revokeObjectURL(previewModelUrl.value)
    previewModelUrl.value = null // 清空共享状态
  }
})

// 3. 自定义 AR 按钮的点击事件
const startAR = () => {
  if (viewerRef.value) {
    viewerRef.value.activateAR()
  } else {
    console.warn('AR 按钮点击无效，未找到 model-viewer 实例。')
  }
}

// 4. model-viewer 的 @load 事件处理函数
const onModelLoad = () => {
  if (viewerRef.value) {
    // 此时 canActivateAR 属性已经是准确的
    isARSupported.value = viewerRef.value.canActivateAR
    console.log('Model loaded. AR Supported:', isARSupported.value)
  }
}
</script>

<template>
  <div class="preview-page-wrapper">
    <div id="toolbar">
      <button id="backBtn" @click="$router.back">← 返回</button>
      <button v-if="isARSupported && modelSrc" id="arBtn" @click="startAR">AR 模式</button>
      <div class="info">{{ infoText }}</div>
    </div>

    <model-viewer
      v-if="modelSrc"
      id="viewer"
      ref="viewerRef"
      :src="modelSrc"
      ar
      ar-modes="webxr scene-viewer quick-look"
      camera-controls
      auto-rotate
      shadow-intensity="1"
      environment-image="neutral"
      alt="3D 模型预览"
      @load="onModelLoad"
    >
    </model-viewer>
  </div>
</template>

<style scoped>
.preview-page-wrapper {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100dvh;
  background: #f5f5f5;
  overflow: hidden;
  position: relative; /* 用于定位浮层 */
}

model-viewer {
  width: 100%;
  height: 100%;
  background-color: #fff;
}

#toolbar {
  position: fixed;
  top: 10px;
  left: 10px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 8px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  z-index: 10;
}

/* 顶部返回按钮 */
#backBtn,
#arBtn {
  border: none;
  background: #1976d2;
  color: white;
  border-radius: 6px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
}
#backBtn:hover {
  background: #1565c0;
}

.info {
  margin-left: 6px;
  font-size: 13px;
  color: #333;
}
</style>
