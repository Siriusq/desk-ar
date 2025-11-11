<script setup lang="ts">
import i18n from '@/locales'
const { t } = i18n.global
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { previewModelUrl } from '@/composables/usePreview'
import { isLoading } from '@/composables/useUIState'

// 动态导入 model-viewer，因为它只在此页面使用
import '@google/model-viewer'

const modelSrc = ref<string | null>(null)
const viewerRef = ref<HTMLModelViewerElement | null>(null)
const isARSupported = ref(false)

// 页面加载时：从共享状态获取 URL
onMounted(() => {
  if (previewModelUrl.value) {
    modelSrc.value = previewModelUrl.value
  }
  // 无论成功与否，都关闭全局加载指示器
  isLoading.value = false
})

// 计算属性：仅在 modelSrc 不存在时显示中央提示
const centralInfoText = computed(() => {
  return modelSrc.value ? null : t('modelFileNotFound')
})

// 页面卸载时：释放 Blob URL 资源
onUnmounted(() => {
  if (previewModelUrl.value) {
    //console.log('已释放 Blob URL 资源')
    URL.revokeObjectURL(previewModelUrl.value)
    previewModelUrl.value = null // 清空共享状态
  }
})

// 自定义 AR 按钮的点击事件
const startAR = () => {
  if (viewerRef.value) {
    viewerRef.value.activateAR()
  } else {
    console.warn(t('noModelViewerInstance'))
  }
}

// model-viewer 的 @load 事件处理函数
const onModelLoad = () => {
  if (viewerRef.value) {
    isARSupported.value = viewerRef.value.canActivateAR
    //console.log('Model loaded. AR Supported:', isARSupported.value)
  }
}
</script>

<template>
  <div class="preview-page-wrapper">
    <div class="position-fixed top-0 start-0 p-3 z-1">
      <BButton variant="warning" @click="$router.back"> ← {{ t('back') }} </BButton>
    </div>

    <div class="position-fixed top-0 end-0 p-3 z-1">
      <BButton v-if="isARSupported && modelSrc" variant="success" @click="startAR">
        {{ t('arMode') }}
      </BButton>
    </div>

    <div
      v-if="centralInfoText"
      class="info-center d-flex align-items-center justify-content-center"
    >
      <BAlert :show="true" variant="warning" class="shadow-lg mb-0">
        <h4 class="alert-heading">{{ t('warning') }}</h4>
        <p class="mb-0">
          {{ centralInfoText }}
        </p>
      </BAlert>
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

/* 中央提示文本的定位容器，覆盖整个视口并居中 */
.info-center {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 5; /* 确保它在 model-viewer 上方，但低于 fixed 按钮 */
  pointer-events: none; /* 允许点击穿透到底层元素 */
}
</style>
