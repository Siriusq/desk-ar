import i18n from '@/locales'
const { t } = i18n.global
import { ref } from 'vue'

import { exitToWelcome } from './useLayout'
import type { CatalogCategoryKey } from '@/types/modelLists'

// 共享状态
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

    // 方法
    toggleControlPanel,
    toggleHelpModal,
    toggleAddModelModal,
    confirmExit,
    toggleObjectExpansion,
    toggleMountDropdown,
    togglePreviewOptionModal,
  }
}
