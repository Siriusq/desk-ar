import i18n from '@/locales'
const { t } = i18n.global
import { ref } from 'vue'
import { isLoading } from './useUIState'
import { addImportedObject } from '@/three/objectFactory'

// --- 导入本地GLB模型 ---

// --- 导入逻辑的 Promise 句柄 ---
let resolveRef: ((value: void | PromiseLike<void>) => void) | null = null
let rejectRef: ((reason?: unknown) => void) | null = null

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
          throw new Error(t('unableToReadFile'))
        }

        // 调用 objectFactory 创建数据对象
        // 将 dataUrl 存储在 useObjects 的 objects 数组中
        addImportedObject(file.name, dataUrl)

        isLoading.value = false
        resolve()
      } catch (error) {
        console.error(t('failedToAddImportedModel'), error)
        isLoading.value = false
        reject(error)
      }
    }

    reader.onerror = (error) => {
      console.error(t('fileReadError'), error)
      isLoading.value = false
      reject(error)
    }

    // 将文件读取为 Data URL，以便序列化并存入 .json
    reader.readAsDataURL(file)
  })
}

/**
 * 管理模型导入的 UI 逻辑
 */
export function useModelImporter() {
  const fileInput = ref<HTMLInputElement | null>(null)

  /**
   * 触发隐藏的文件输入框并返回一个 Promise，等待文件选择和导入完成。
   */
  const importModel = (): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      // 存储 resolve 和 reject 函数，供 handleFileChange 使用
      resolveRef = resolve
      rejectRef = reject

      fileInput.value?.click()
    })
  }

  /**
   * 处理文件输入框的 change 事件
   * @param event The change event from the file input.
   */
  const handleFileChange = async (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    // 捕获当前的 Promise 句柄
    const currentResolve = resolveRef
    const currentReject = rejectRef

    // 在导入操作开始时清空句柄，防止二次触发
    resolveRef = null
    rejectRef = null

    if (file) {
      if (file.name.endsWith('.gltf') || file.name.endsWith('.glb')) {
        try {
          await loadModelData(file)
          currentResolve?.() // 导入成功，解析 Promise
        } catch (error) {
          alert(t('importModelFailed', { error }))
          currentReject?.(error) // 导入失败，拒绝 Promise
        }
      } else {
        alert(t('invalidFileType'))
        currentReject?.(new Error(t('invalidFileType'))) // 文件类型无效，拒绝 Promise
      }
    } else {
      // 如果用户关闭对话框（没有选择文件），也应该处理（可选：解析或拒绝）
      // 这里我们选择解析，表示操作结束
      currentResolve?.()
    }

    // 清空输入框，以便下次可以选择同名文件
    target.value = ''
  }

  return {
    fileInput,
    importModel,
    handleFileChange,
  }
}
