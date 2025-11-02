<script setup lang="ts">
import {
  addModalCategory,
  isAddModelModalOpen,
  useUIState,
  isEditingName,
  tempSceneName,
  handleEditNameToggle,
} from '@/composables/useUIState'
import { useWindowSize } from '@vueuse/core'
import { computed, watch } from 'vue'
import { saveLayoutToFile, sceneName } from '@/composables/useLayout'
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
import type { DeskObject } from '@/models/deskObject'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { setCameraView, setCameraProjection } from '@/three/sceneManager'
// 【新增】 导入测量状态和切换函数
import { isMeasuring, toggleMeasurementMode } from '@/composables/useMeasurement'

// 使用 Composable 共享状态
const {
  isControlPanelOpen,
  toggleControlPanel,
  toggleHelpModal,
  confirmExit,
  togglePreviewOptionModal,
} = useUIState()

const { width } = useWindowSize()
// 定义宽屏断点 (Bootstrap lg 断点是 992px)
const LG_BREAKPOINT = 992

// 计算属性，决定 OffCanvas 的弹出位置
const placement = computed(() => {
  return width.value >= LG_BREAKPOINT ? 'end' : 'bottom'
})

watch(isAddModelModalOpen, (isOpen) => {
  if (!isOpen) addModalCategory.value = undefined
})

// 1. 计算选中的对象数据
const selectedObject = computed(() => {
  if (!selectedObjectId.value) return null
  return objects.value.find((o: DeskObject) => o.id === selectedObjectId.value)
})

// 2. 简单的名称转换
const getDisplayName = (obj: DeskObject | undefined) => {
  if (!obj) return 'Unknown'
  const type = obj.type
  if (!type) return 'Item'
  if (type.startsWith('desk-')) return '办公桌'
  if (type == 'imported-model') return obj.params.fileName
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

const getUnitForParam = (key: string) => {
  // 示例逻辑：您可以根据 key 返回不同的单位
  if (key === 'opacity') {
    return '%'
  } else if (key === 'size') {
    return 'm' // 米
  }
  // 默认单位
  return 'mm'
}
</script>

<template>
  <!--编辑面板-->
  <BOffcanvas
    :model-value="isControlPanelOpen"
    @update:model-value="toggleControlPanel"
    :placement="placement"
    id="controlOffcanvas"
    no-backdrop
    no-close-on-backdrop
  >
    <!--场景名称编辑-->
    <template #title>
      <div class="d-flex flex-grow-1 align-items-center justify-content-between w-100">
        <BFormInput
          v-if="isEditingName"
          v-model="tempSceneName"
          size="sm"
          class="me-2"
          @keyup.enter="handleEditNameToggle"
        />
        <h5 v-else class="mb-0 offcanvas-title">{{ sceneName }}</h5>

        <div
          class="ms-2"
          style="cursor: pointer"
          @click="handleEditNameToggle"
          :title="isEditingName ? '保存名称' : '编辑名称'"
        >
          <i v-if="isEditingName" class="bi bi-check2-square" />
          <i v-else class="bi bi-pencil-square" />
        </div>
      </div>
    </template>

    <!--按钮-->
    <div class="row g-2 mb-3">
      <!--帮助按钮-->
      <div class="col-4">
        <BButton variant="primary" class="w-100" @click="toggleHelpModal">
          <i class="bi bi-question-lg" />
          帮助
        </BButton>
      </div>
      <!--保存按钮-->
      <div class="col-4">
        <BButton variant="warning" class="w-100" @click="saveLayoutToFile()">
          <i class="bi bi-save" />
          保存
        </BButton>
      </div>
      <!--退出按钮-->
      <div class="col-4">
        <BButton variant="danger" class="w-100" @click="confirmExit">
          <i class="bi bi-escape" />
          退出
        </BButton>
      </div>
      <!--预览按钮-->
      <div class="col-4">
        <BButton variant="success" class="w-100" @click="togglePreviewOptionModal">
          <i class="bi bi-badge-ar" />
          预览
        </BButton>
      </div>
      <!--视角按钮-->
      <div class="col-4">
        <BDropdown variant="info" class="w-100" toggle-class="w-100" text="视角">
          <template #button-content> <i class="bi bi-camera" /> 视角 </template>
          <BDropdownItem @click="setCameraView('default')">
            <i class="bi bi-camera-video" /> 默认透视
          </BDropdownItem>
          <BDropdownItem @click="setCameraView('top')">
            <i class="bi bi-arrow-down-square" /> 鸟瞰 (顶)
          </BDropdownItem>
          <BDropdownItem @click="setCameraView('front')">
            <i class="bi bi-aspect-ratio" /> 正面 (前)
          </BDropdownItem>
          <BDropdownItem @click="setCameraView('side')">
            <i class="bi bi-layout-sidebar-inset" /> 侧面 (左)
          </BDropdownItem>
          <BDropdownDivider />
          <BDropdownItem @click="setCameraProjection('orthographic')">
            <i class="bi bi-box" /> 切换正交
          </BDropdownItem>
        </BDropdown>
      </div>
      <!--测量按钮-->
      <div class="col-4">
        <BButton
          class="w-100"
          :variant="isMeasuring ? 'danger' : 'secondary'"
          @click="toggleMeasurementMode"
        >
          <Transition name="icon-fade" mode="out-in">
            <i v-if="isMeasuring" key="close-icon" class="bi bi-x-lg" />
            <i v-else key="measure-icon" class="bi bi-rulers" />
          </Transition>
          {{ isMeasuring ? '结束' : '测量' }}
        </BButton>
      </div>
    </div>

    <hr />

    <div class="dynamic-content">
      <div v-if="selectedObject">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h5 class="mb-0">{{ getDisplayName(selectedObject) }}</h5>
          <BButton size="sm" variant="secondary" @click="selectedObjectId = null">
            <i class="bi bi-x-lg" />
            返回列表
          </BButton>
        </div>

        <!--变换-->
        <div class="transform-section">
          <!--标题-->
          <BRow class="mb-2">
            <BCol>位置 (mm)</BCol>
            <BCol>旋转 (°)</BCol>
          </BRow>

          <!--x轴-->
          <BRow>
            <BCol>
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
            </BCol>
            <BCol
              ><BInputGroup size="sm" class="mb-2">
                <BInputGroupText>X°</BInputGroupText>
                <BFormInput
                  type="number"
                  step="1"
                  :model-value="selectedObject.rotation.x.toFixed(0)"
                  @change="
                    updateObjectValue(
                      selectedObject.id,
                      'rotation',
                      'x',
                      Number($event.target.value),
                    )
                  "
                />
              </BInputGroup>
            </BCol>
          </BRow>

          <!--y轴-->
          <BRow>
            <BCol>
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
            </BCol>
            <BCol>
              <BInputGroup size="sm" class="mb-2">
                <BInputGroupText>Y°</BInputGroupText>
                <BFormInput
                  type="number"
                  step="1"
                  :model-value="selectedObject.rotation.y.toFixed(0)"
                  @change="
                    updateObjectValue(
                      selectedObject.id,
                      'rotation',
                      'y',
                      Number($event.target.value),
                    )
                  "
                />
              </BInputGroup>
            </BCol>
          </BRow>

          <!--z轴-->
          <BRow>
            <BCol>
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
            </BCol>
            <BCol>
              <BInputGroup size="sm" class="mb-3">
                <BInputGroupText>Z°</BInputGroupText>
                <BFormInput
                  type="number"
                  step="1"
                  :model-value="selectedObject.rotation.z.toFixed(0)"
                  @change="
                    updateObjectValue(
                      selectedObject.id,
                      'rotation',
                      'z',
                      Number($event.target.value),
                    )
                  "
                />
              </BInputGroup>
            </BCol>
          </BRow>

          <!--下落按钮-->
          <BButton
            v-if="selectedObject.type !== 'imported-model'"
            variant="primary"
            size="sm"
            class="w-100"
            @click="dropObject(selectedObject.id)"
            :disabled="!!selectedObject.mountedToId"
          >
            <i class="bi bi-arrow-down-short" />
            下落至表面
          </BButton>
        </div>

        <!--物品参数调整-->
        <div v-if="selectedObject.type !== 'imported-model'">
          <hr />
          <BFormGroup
            v-for="[key, value] in getEditableParams(selectedObject)"
            :key="key"
            :label="t(key)"
            class="mb-3 align-items-center"
            label-class="py-0"
          >
            <!--数字-->
            <BRow v-if="typeof value === 'number'" align-v="end">
              <BCol cols="6">
                <BInputGroup size="sm">
                  <BFormInput
                    type="number"
                    :model-value="((value as number) * 1000).toFixed(0)"
                    @change="
                      updateObjectParam(selectedObject.id, key, Number($event.target.value) / 1000)
                    "
                    :min="1"
                    :max="3000"
                    :step="1"
                  />
                  <BInputGroupText>{{ getUnitForParam(key) }}</BInputGroupText>
                </BInputGroup>
              </BCol>
              <BCol cols="6">
                <BFormInput
                  type="range"
                  :model-value="((value as number) * 1000).toFixed(0)"
                  @input="
                    updateObjectParam(selectedObject.id, key, Number($event.target.value) / 1000)
                  "
                  min="1"
                  max="3000"
                  step="1"
                />
              </BCol>
            </BRow>

            <!--颜色-->
            <BRow v-else-if="key === 'color'" align-v="end">
              <BCol cols="6">
                <BInputGroup size="sm">
                  <BFormInput
                    type="text"
                    :model-value="value as string"
                    @change="updateObjectParam(selectedObject.id, key, $event.target.value)"
                    placeholder="#RRGGBB"
                    maxlength="7"
                  />
                  <BInputGroupText>HEX</BInputGroupText>
                </BInputGroup>
              </BCol>
              <BCol cols="6">
                <BFormInput
                  size="sm"
                  class="w-100"
                  type="color"
                  :model-value="value as string"
                  @input="updateObjectParam(selectedObject.id, key, $event.target.value)"
                />
              </BCol>
            </BRow>

            <!--开关-->
            <BFormCheckbox
              v-else-if="typeof value === 'boolean'"
              size="sm"
              :checked="value as boolean"
              @change="updateObjectParam(selectedObject.id, key, $event)"
              switch
            />

            <!--文本-->
            <BFormInput
              v-else
              type="text"
              size="sm"
              :model-value="value as string"
              @change="updateObjectParam(selectedObject.id, key, $event.target.value)"
            />
          </BFormGroup>
        </div>

        <div v-if="selectedObject.type === 'universal-stand'">
          <hr />
          <div
            v-if="
              'mountedObjectId' in selectedObject.params && selectedObject.params.mountedObjectId
            "
          >
            <p>
              已挂载:
              <strong
                >{{ getDisplayName(getMountedItem(selectedObject.params.mountedObjectId)) }}
              </strong>
            </p>
            <BButton variant="outline-danger" size="sm" @click="unmountObject(selectedObject.id)">
              卸载物品
            </BButton>
          </div>
          <BFormGroup v-else label="挂载物品">
            <BFormSelect @change="mountObject(selectedObject.id, $event.target.value)" size="sm">
              <BFormSelectOption :value="null">-- 未挂载 --</BFormSelectOption>
              <BFormSelectOption v-for="item in mountableItems" :key="item.id" :value="item.id">
                {{ getDisplayName(item) }} (ID: {{ item.id.substring(0, 4) }})
              </BFormSelectOption>
            </BFormSelect>
          </BFormGroup>
        </div>
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
            {{ getDisplayName(obj) }}
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
