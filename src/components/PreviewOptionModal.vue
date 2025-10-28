<script setup lang="ts">
import { useUIState } from '@/composables/useUIState'
import { exportForAR } from '@/three/exporters'

// 使用 Composable 共享状态
const { isPreviewOptionModalOpen, togglePreviewOptionModal } = useUIState()

const handleExport = (withDesk: boolean) => {
  exportForAR(withDesk)
  togglePreviewOptionModal()
}
</script>

<template>
  <BModal
    :model-value="isPreviewOptionModalOpen"
    @update:model-value="togglePreviewOptionModal"
    title="模型中是否包含桌子？"
    size="md"
    no-footer
  >
    <div class="row g-2">
      <div class="col-12 col-md-6">
        <BButton variant="primary" class="w-100" @click="handleExport(true)"> 包含桌子 </BButton>
      </div>
      <div class="col-12 col-md-6">
        <BButton variant="secondary" class="w-100" @click="handleExport(false)"> 不含桌子 </BButton>
      </div>
    </div>
  </BModal>
</template>
