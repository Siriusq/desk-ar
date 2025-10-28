import { ref, watch } from 'vue'
import { transformControls } from '@/three/sceneManager'

export const isPreviewing = ref(false)
export const isTransformDragging = ref(false)
export const transformMode = ref('translate')

// 监听模型控制器类型，移动/旋转切换
watch(transformMode, (mode) => {
  if (transformControls) transformControls.setMode(mode)
})
