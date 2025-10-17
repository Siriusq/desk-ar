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

  const setControlPanelOpen = (value: boolean) => {
    isControlPanelOpen.value = value
  }

  // --- Modal 状态逻辑 ---
  const toggleHelpModal = () => {
    isHelpModalOpen.value = !isHelpModalOpen.value
  }

  // --- 返回状态和方法 ---
  return {
    // 状态返回为只读 (readonly) 引用，防止组件随意修改
    isControlPanelOpen: readonly(isControlPanelOpen),
    isHelpModalOpen: readonly(isHelpModalOpen),

    // 方法返回给组件使用
    toggleControlPanel,
    toggleHelpModal,

    // 直接返回设置函数，用于 v-model
    setHelpModalOpen: (value: boolean) => {
      isHelpModalOpen.value = value
    },

    setControlPanelOpen,
  }
}
