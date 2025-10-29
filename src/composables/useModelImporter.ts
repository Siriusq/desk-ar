// src/composables/useModelImporter.ts
import { ref } from 'vue'
import { isLoading } from './useUIState'
// 【重要】 导入 objectFactory 中的新函数
import { addImportedObject } from '@/three/objectFactory'

/**
 * 将用户选择的 GLB/GLTF 文件读取为 Data URL
 * @param file The GLTF or GLB file selected by the user.
 */
const loadModelData = (file: File) => {
  return new Promise<void>((resolve, reject) => {
    isLoading.value = true
    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const dataUrl = event.target?.result as string
        if (!dataUrl) {
          throw new Error('无法读取文件。')
        }

        // 1. 调用 objectFactory 创建数据对象
        // 这会将 dataUrl 存储在 useObjects 的 objects 数组中
        addImportedObject(file.name, dataUrl)

        isLoading.value = false
        resolve()
      } catch (error) {
        console.error('添加导入的模型失败:', error)
        isLoading.value = false
        reject(error)
      }
    }

    reader.onerror = (error) => {
      console.error('文件读取错误:', error)
      isLoading.value = false
      reject(error)
    }

    // 将文件读取为 Data URL，以便序列化并存入 .json
    reader.readAsDataURL(file)
  })
}

/**
 * Composable，用于管理模型导入的 UI 逻辑
 */
export function useModelImporter() {
  const fileInput = ref<HTMLInputElement | null>(null)

  /**
   * 触发隐藏的文件输入框
   */
  const openImportDialog = () => {
    fileInput.value?.click()
  }

  /**
   * 处理文件输入框的 change 事件
   * @param event The change event from the file input.
   */
  const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (file) {
      if (file.name.endsWith('.gltf') || file.name.endsWith('.glb')) {
        try {
          await loadModelData(file)
        } catch (error) {
          alert(`导入模型失败: ${error}`)
        }
      } else {
        alert('文件类型无效。请选择 .gltf 或 .glb 文件。')
      }
    }
    // 清空输入框，以便下次可以选择同名文件
    target.value = ''
  }

  return {
    fileInput,
    openImportDialog,
    handleFileChange,
  }
}
