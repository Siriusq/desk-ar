<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { useUIState } from '@/composables/useUIState'
import { exportForAR } from '@/three/exporters'

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
    :title="t('previewOptionTitle')"
    size="md"
    no-footer
  >
    <div class="row g-2">
      <div class="col-12 col-md-6">
        <BButton variant="primary" class="w-100" @click="handleExport(true)">
          {{ t('includeDesk') }}
        </BButton>
      </div>
      <div class="col-12 col-md-6">
        <BButton variant="secondary" class="w-100" @click="handleExport(false)">
          {{ t('noDeskIncluded') }}
        </BButton>
      </div>
    </div>
  </BModal>
</template>
