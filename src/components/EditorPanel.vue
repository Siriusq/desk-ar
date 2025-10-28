<script setup lang="ts">
import { addModalCategory, isAddModelModalOpen, useUIState } from '@/composables/useUIState'
import { useWindowSize } from '@vueuse/core'
import { computed, watch } from 'vue'
import { saveLayoutToFile } from '@/composables/useLayout'
import {
  selectedObjectId,
  objects,
  updateObjectParam,
  updateObjectValue,
  deleteObject,
  dropObject,
  getMountedItem,
  unmountObject,
  mountObject,
  mountableItems,
} from '@/composables/useObjects'
import type { DeskObject } from '@/types/deskObject'
import { exportForAR } from '@/three/exporters'

// 使用 Composable 共享状态
const { isControlPanelOpen, toggleControlPanel, toggleHelpModal, confirmExit } = useUIState()

const { width } = useWindowSize()
// 定义宽屏断点 (Bootstrap lg 断点是 992px)
const LG_BREAKPOINT = 992

// 计算属性，决定 OffCanvas 的弹出位置
const placement = computed(() => {
  return width.value >= LG_BREAKPOINT ? 'end' : 'bottom'
})

watch(isAddModelModalOpen, (isOpen) => {
  if (!isOpen) addModalCategory.value = null
})

// 1. 计算选中的对象数据
const selectedObject = computed(() => {
  if (!selectedObjectId.value) return null
  return objects.value.find((o: DeskObject) => o.id === selectedObjectId.value)
})

// 2. 简单的名称转换
const getDisplayName = (type: string | undefined) => {
  if (!type) return 'Item'
  if (type.startsWith('desk-')) return '办公桌'
  if (type === 'monitor') return '显示器'
  if (type === 'macbook') return '笔记本电脑'
  // ...可以继续添加
  return type
}

// 3. 辅助函数，用于 v-for 循环 params
const getEditableParams = (obj: DeskObject | null) => {
  if (!obj || !obj.params) return []
  // 过滤掉不希望用户编辑的参数
  return Object.entries(obj.params).filter(
    ([key]) => key !== 'isMountable' && key !== 'mountedObjectId',
  )
}
</script>

<template>
  <!--控制面板-->
  <BOffcanvas
    :model-value="isControlPanelOpen"
    @update:model-value="toggleControlPanel"
    :placement="placement"
    id="controlOffcanvas"
    title="控制面板"
    no-backdrop
    no-close-on-backdrop
  >
    <!--按钮-->
    <div class="row g-2 mb-3">
      <!--帮助按钮-->
      <div class="col-6 col-md-3">
        <BButton variant="secondary" class="w-100" @click="toggleHelpModal">
          <i class="bi bi-question-lg" />
          帮助
        </BButton>
      </div>
      <!--预览按钮-->
      <div class="col-6 col-md-3">
        <BButton variant="success" class="w-100" @click="exportForAR(true)">
          <i class="bi bi-badge-ar" />
          预览
        </BButton>
      </div>
      <!--保存按钮-->
      <div class="col-6 col-md-3">
        <BButton variant="warning" class="w-100" @click="saveLayoutToFile()">
          <i class="bi bi-save" />
          保存
        </BButton>
      </div>
      <!--退出按钮-->
      <div class="col-6 col-md-3">
        <BButton variant="danger" class="w-100" @click="confirmExit">
          <i class="bi bi-escape" />
          退出
        </BButton>
      </div>
    </div>

    <hr />

    <div class="dynamic-content">
      <div v-if="selectedObject">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0">编辑 {{ getDisplayName(selectedObject.type) }}</h5>
          <BButton size="sm" variant="outline-secondary" @click="selectedObjectId = null">
            <i class="bi bi-x-lg" />
            返回列表
          </BButton>
        </div>

        <BAccordion flush>
          <BAccordionItem title="变换 (Transform)" visible>
            <h6>位置 (mm)</h6>
            <BInputGroup size="sm" class="mb-2">
              <BInputGroupText>X</BInputGroupText>
              <BFormInput
                type="number"
                step="1"
                :model-value="(selectedObject.position.x * 1000).toFixed(0)"
                @change="
                  updateObjectValue(
                    selectedObject.id,
                    'position',
                    'x',
                    Number($event.target.value) / 1000,
                  )
                "
              />
            </BInputGroup>
            <BInputGroup size="sm" class="mb-2">
              <BInputGroupText>Y</BInputGroupText>
              <BFormInput
                type="number"
                step="1"
                :model-value="(selectedObject.position.y * 1000).toFixed(0)"
                @change="
                  updateObjectValue(
                    selectedObject.id,
                    'position',
                    'y',
                    Number($event.target.value) / 1000,
                  )
                "
              />
            </BInputGroup>
            <BInputGroup size="sm" class="mb-3">
              <BInputGroupText>Z</BInputGroupText>
              <BFormInput
                type="number"
                step="1"
                :model-value="(selectedObject.position.z * 1000).toFixed(0)"
                @change="
                  updateObjectValue(
                    selectedObject.id,
                    'position',
                    'z',
                    Number($event.target.value) / 1000,
                  )
                "
              />
            </BInputGroup>

            <h6>旋转 (°)</h6>
            <BInputGroup size="sm" class="mb-2">
              <BInputGroupText>X°</BInputGroupText>
              <BFormInput
                type="number"
                step="1"
                :model-value="selectedObject.rotation.x.toFixed(0)"
                @change="
                  updateObjectValue(selectedObject.id, 'rotation', 'x', Number($event.target.value))
                "
              />
            </BInputGroup>
            <BInputGroup size="sm" class="mb-2">
              <BInputGroupText>Y°</BInputGroupText>
              <BFormInput
                type="number"
                step="1"
                :model-value="selectedObject.rotation.y.toFixed(0)"
                @change="
                  updateObjectValue(selectedObject.id, 'rotation', 'y', Number($event.target.value))
                "
              />
            </BInputGroup>
            <BInputGroup size="sm" class="mb-3">
              <BInputGroupText>Z°</BInputGroupText>
              <BFormInput
                type="number"
                step="1"
                :model-value="selectedObject.rotation.z.toFixed(0)"
                @change="
                  updateObjectValue(selectedObject.id, 'rotation', 'z', Number($event.target.value))
                "
              />
            </BInputGroup>

            <BButton
              variant="outline-primary"
              size="sm"
              class="w-100"
              @click="dropObject(selectedObject.id)"
              :disabled="!!selectedObject.mountedToId"
            >
              <i class="bi bi-arrow-down-short" />
              下落至表面
            </BButton>
          </BAccordionItem>

          <BAccordionItem title="参数 (Parameters)" visible>
            <BFormGroup
              v-for="[key, value] in getEditableParams(selectedObject)"
              :key="key"
              :label="key"
              label-cols-sm="4"
              label-align-sm="right"
              class="mb-3"
            >
              <BFormInput
                v-if="key === 'color'"
                type="color"
                :model-value="value as string"
                @input="updateObjectParam(selectedObject.id, key, $event.target.value)"
              />
              <BFormCheckbox
                v-else-if="typeof value === 'boolean'"
                :checked="value as boolean"
                @change="updateObjectParam(selectedObject.id, key, $event)"
                switch
              />
              <BFormInput
                v-else-if="typeof value === 'number'"
                type="range"
                :model-value="value as number"
                @input="updateObjectParam(selectedObject.id, key, Number($event.target.value))"
                min="0.1"
                max="3"
                step="0.01"
              />
              <BFormInput
                v-else
                type="text"
                :model-value="value as string"
                @change="updateObjectParam(selectedObject.id, key, $event.target.value)"
              />
            </BFormGroup>
          </BAccordionItem>

          <BAccordionItem
            v-if="selectedObject.type === 'universal-stand'"
            title="挂载 (Mount)"
            visible
          >
            <div
              v-if="
                'mountedObjectId' in selectedObject.params && selectedObject.params.mountedObjectId
              "
            >
              <p>
                已挂载:
                <strong
                  >{{ getDisplayName(getMountedItem(selectedObject.params.mountedObjectId)?.type) }}
                </strong>
              </p>
              <BButton variant="outline-danger" size="sm" @click="unmountObject(selectedObject.id)">
                卸载物品
              </BButton>
            </div>
            <BFormGroup v-else label="选择要挂载的物品">
              <BFormSelect @change="mountObject(selectedObject.id, $event.target.value)">
                <BFormSelectOption :value="null">-- 未挂载 --</BFormSelectOption>
                <BFormSelectOption v-for="item in mountableItems" :key="item.id" :value="item.id">
                  {{ getDisplayName(item.type) }} (ID: {{ item.id.substring(0, 4) }})
                </BFormSelectOption>
              </BFormSelect>
            </BFormGroup>
          </BAccordionItem>
        </BAccordion>
      </div>

      <div v-else>
        <h5 class="mb-3">场景对象</h5>
        <BListGroup v-if="objects.length > 0">
          <BListGroupItem
            v-for="obj in objects"
            :key="obj.id"
            @click="selectedObjectId = obj.id"
            button
            class="d-flex justify-content-between align-items-center"
          >
            {{ getDisplayName(obj.type) }}
            <BButton variant="outline-danger" size="sm" @click.stop="deleteObject(obj.id)">
              <i class="bi bi-trash" />
            </BButton>
          </BListGroupItem>
        </BListGroup>
        <BAlert v-else :model-value="true" variant="info">场景为空，请在主菜单中添加物品。</BAlert>
      </div>
    </div>
  </BOffcanvas>
</template>

<style scoped>
/* 可选：为平滑切换添加一点过渡 */
.dynamic-content {
  transition: opacity 0.2s ease;
}
</style>
