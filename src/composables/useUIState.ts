import { ref, readonly } from 'vue'

// 共享状态
const isControlPanelOpen = ref(false)
const isHelpModalOpen = ref(false)

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

  // --- 返回状态和方法 ---
  return {
    // 只读状态
    isControlPanelOpen: readonly(isControlPanelOpen),
    isHelpModalOpen: readonly(isHelpModalOpen),

    // 方法
    toggleControlPanel,
    toggleHelpModal,
  }
}
