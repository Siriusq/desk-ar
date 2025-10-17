<script setup lang="ts">
import { useUIState } from '@/composables/useUIState'

// 使用 Composable 共享状态
const { isHelpModalOpen, toggleHelpModal } = useUIState()
</script>

<template>
  <BModal
    :model-value="isHelpModalOpen"
    @update:model-value="toggleHelpModal"
    title="帮助说明"
    size="lg"
    scrollable
  >
    <p>一些帮助。</p>

    <template #footer>
      <BButton variant="secondary" @click="toggleHelpModal">我知道了</BButton>
    </template>
  </BModal>
</template>
