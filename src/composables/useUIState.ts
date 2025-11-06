import i18n from '@/locales'
const { t } = i18n.global
import { ref } from 'vue'

import { exitToWelcome, sceneName } from './useLayout'
import type { CatalogCategoryKey } from '@/models/modelCatalog'

// 共享状态
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
const isAndroid = /Android/.test(navigator.userAgent)
export const isMobile = isIOS || isAndroid
export const isControlPanelOpen = ref(false)
export const isHelpModalOpen = ref(false)
export const isAddModelModalOpen = ref(false)
export const isPreviewOptionModalOpen = ref(false)
export const isLoading = ref(false)
export const addModalCategory = ref<CatalogCategoryKey>()

export const expandedObjectId = ref()

// const isArModalOpen = ref(false)
// const isMobile = ref(window.innerWidth < 768)
const showMountDropdownFor = ref()

// 【新增】 标题编辑状态
export const isEditingName = ref(false)
export const tempSceneName = ref(sceneName.value)

// 【新增】 处理标题编辑的切换和保存
export const handleEditNameToggle = () => {
  if (isEditingName.value) {
    // 正在编辑 -> 点击保存
    sceneName.value = tempSceneName.value
    // 注意：useHistory.ts 中的 saveState() 会在下次操作时
    // 自动捕获这个新的 sceneName.value，无需手动调用
  } else {
    // 正在显示 -> 点击编辑
    tempSceneName.value = sceneName.value // 同步当前名称到输入框
  }
  isEditingName.value = !isEditingName.value
}

/**
 * 暂停函数执行指定毫秒数
 * @param ms 延迟的毫秒数 (例如，300ms)
 * @returns 一个在延迟后解决的 Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// 封装 UI 状态管理，用于控制 OffCanvas 和 Modal 的显示/隐藏。
export function useUIState() {
  // --- OffCanvas 状态逻辑 ---
  const toggleControlPanel = () => {
    isControlPanelOpen.value = !isControlPanelOpen.value
  }

  // --- Modal 状态逻辑 ---
  const toggleHelpModal = () => {
    isHelpModalOpen.value = !isHelpModalOpen.value
  }

  const toggleAddModelModal = () => {
    isAddModelModalOpen.value = !isAddModelModalOpen.value
  }

  const togglePreviewOptionModal = () => {
    isPreviewOptionModalOpen.value = !isPreviewOptionModalOpen.value
  }

  const confirmExit = () => {
    if (window.confirm(t('exitConfirm'))) {
      exitToWelcome()
    }
  }

  const toggleObjectExpansion = (id: string) => {
    expandedObjectId.value = expandedObjectId.value === id ? null : id
  }

  const toggleMountDropdown = (standId: string) => {
    showMountDropdownFor.value = showMountDropdownFor.value === standId ? null : standId
  }

  // --- 返回状态和方法 ---
  return {
    // 只读状态
    isControlPanelOpen,
    isHelpModalOpen,
    isAddModelModalOpen,
    isPreviewOptionModalOpen,
    isLoading,
    addModalCategory,
    isEditingName,
    tempSceneName,

    // 方法
    toggleControlPanel,
    toggleHelpModal,
    toggleAddModelModal,
    confirmExit,
    toggleObjectExpansion,
    toggleMountDropdown,
    togglePreviewOptionModal,
    handleEditNameToggle,
  }
}
