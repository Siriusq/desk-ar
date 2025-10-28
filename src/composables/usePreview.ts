import { ref } from 'vue'

/**
 * 用于在导出页面和预览页面之间临时共享
 * 3D 模型的 blob URL。
 */
export const previewModelUrl = ref<string | null>(null)
