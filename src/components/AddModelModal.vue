<script setup lang="ts">
import { useUIState } from '@/composables/useUIState'
import { isDeskInScene } from '@/composables/useObjects'
import { availableModels } from '@/models/presetModels'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

// 使用 Composable 共享状态
const { isAddModelModalOpen, toggleAddModelModal, addModalCategory } = useUIState()
</script>

<template>
  <BModal
    :model-value="isAddModelModalOpen"
    @update:model-value="toggleAddModelModal"
    size="lg"
    scrollable
    no-footer
  >
    <template #header="{ close }">
      <div class="d-flex w-100 justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-2">
          <!--返回按钮-->
          <button
            v-if="addModalCategory"
            class="plain-icon-button me-2"
            aria-label="返回"
            @click="addModalCategory = null"
          >
            <i class="bi bi-arrow-left" />
          </button>

          <!--动态标题-->
          <h5 class="modal-title">
            {{
              addModalCategory
                ? `${t('add')} ${t('categories.' + addModalCategory)}`
                : t('selectCategory')
            }}
          </h5>
        </div>

        <div>
          <button type="button" class="btn-close" aria-label="Close" @click="close()"></button>
        </div>
      </div>
    </template>

    <!--目录选择-->
    <div v-if="!addModalCategory" class="row row-cols-auto gap-3">
      <BButton
        v-for="(models, category) in availableModels"
        :key="category"
        @click="addModalCategory = category"
        :disabled="category === 'desks' && isDeskInScene"
        class="fw-bold w-auto"
        variant="secondary"
      >
        <div class="font-semibold text-lg">
          {{ t('categories.' + category) }}
        </div>
      </BButton>
    </div>
  </BModal>
</template>

<style scoped>
.plain-icon-button {
  background: none;
  border: none;
  cursor: pointer; /* 确保有手型光标 */
  padding: 0; /* 移除内边距 */
  /* 其他样式调整，如大小和颜色 */
  font-size: 1.25rem;
  color: #333;
}
.plain-icon-button:hover {
  opacity: 0.7; /* 悬停效果 */
}
</style>
