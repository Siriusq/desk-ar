<script setup lang="ts">
import { useUIState } from '@/composables/useUIState'
import { isDeskInScene } from '@/composables/useObjects'
import { availableModels } from '@/models/modelCatalog'
import { useI18n } from 'vue-i18n'
import { addObject } from '@/three/objectFactory'
const { t } = useI18n()
import { useModelImporter } from '@/composables/useModelImporter'
const { fileInput, importModel, handleFileChange } = useModelImporter()
const { isAddModelModalOpen, toggleAddModelModal, addModalCategory } = useUIState()

// 异步处理模型导入，然后关闭Modal
const handleImportModelClick = async () => {
  try {
    await importModel()
    isAddModelModalOpen.value = false
  } catch (e) {
    console.error('导入失败:', e)
  }
}
</script>

<template>
  <BModal
    :model-value="isAddModelModalOpen"
    @update:model-value="toggleAddModelModal"
    size="lg"
    scrollable
    no-footer
    ><input
      type="file"
      ref="fileInput"
      @change="handleFileChange"
      class="d-none"
      accept=".glb,.gltf"
    />
    <template #header="{ close }">
      <div class="d-flex w-100 justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-2 align">
          <!--返回按钮-->
          <button
            v-if="addModalCategory"
            class="plain-icon-button me-1"
            aria-label="返回"
            @click="addModalCategory = undefined"
          >
            <i class="bi bi-arrow-left" />
          </button>

          <!--动态标题-->
          <h5 class="modal-title my-0">
            {{
              addModalCategory ? `${t('add')} ${t('categories.' + addModalCategory)}` : t('addItem')
            }}
          </h5>
        </div>

        <div>
          <button type="button" class="btn-close" aria-label="Close" @click="close()"></button>
        </div>
      </div>
    </template>

    <!--目录选择-->
    <div v-if="!addModalCategory" class="model-selection-grid">
      <div v-for="(models, category) in availableModels" :key="category" class="model-item-wrapper">
        <BButton
          class="model-button fw-bold"
          variant="secondary"
          @click="addModalCategory = category"
          :disabled="category === 'desks' && isDeskInScene"
        >
          <div class="model-icon mb-3">{{ models.icon }}</div>
          <div>{{ t('categories.' + category) }}</div>
        </BButton>
      </div>

      <div class="model-item-wrapper">
        <BButton class="fw-bold model-button" variant="secondary" @click="handleImportModelClick">
          <div class="model-icon mb-3">📥</div>
          <div>导入</div>
        </BButton>
      </div>
    </div>
    <!--模型选择-->
    <div v-else class="model-selection-grid">
      <div
        v-for="model in availableModels[addModalCategory].models"
        :key="model.type"
        class="model-item-wrapper"
      >
        <BButton
          class="model-button fw-bold"
          variant="secondary"
          @click="(addObject(model.type), (isAddModelModalOpen = false))"
        >
          <div class="model-icon mb-3">{{ model.icon }}</div>
          <div>{{ t('models.' + model.type) }}</div>
        </BButton>
      </div>
    </div>
  </BModal>
</template>

<style scoped>
.plain-icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-size: 1.25rem;
  color: #333;
  display: inline-flex; /* 使用 inline-flex 保证它和文本流一起 */
  align-items: center;
  justify-content: center;
  /* 关键优化：设置一个固定高度，例如 38px (Bootstrap 常见按钮高度) */
  height: 20px;
  width: 20px;
  /* 消除 line-height 的影响 */
  line-height: 1;
}

/* ---------------------------------- */
/* Modal Body - 模型选择网格样式 */
/* ---------------------------------- */

.model-selection-grid {
  /* 🌟 关键修改：使用 Grid 布局 🌟 */
  display: grid;

  /* 🌟 核心 Grid 属性：实现自适应和左对齐 🌟 */
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));

  /* 设置按钮之间的间隙 */
  gap: 16px; /* 行和列都使用 16px 间隙 */
  padding: 16px;
}

.model-item-wrapper {
  margin: 0;
  min-width: unset;
  max-width: unset;
  /* 确保按钮填充 Grid 单元格 */
  width: 100%;
}

.model-button {
  /* 确保按钮内容是列布局（图标在上，文本在下） */
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center; /* 图标和文本水平居中 */
  /* 强制按钮宽度自适应，这里使用 max-width 限制按钮太宽 */
  min-width: 120px;
  max-width: 150px;
  height: 100px; /* 统一高度，使网格整齐 */
  padding: 10px;
}

/* 增大 Emoji 图标 */
.model-icon {
  font-size: 2.5rem; /* 大图标 */
  line-height: 1; /* 消除行高对布局的影响 */
}

/* 按钮名称样式 */
.model-name {
  font-size: 0.85rem;
  font-weight: 600;
  text-align: center;
  /* 确保文本不溢出 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
