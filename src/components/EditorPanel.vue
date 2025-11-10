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
import { computed, reactive, watch } from 'vue'
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
import { MathUtils } from 'three'
import { macbookPresets } from '@/models/preset/laptop'
import { monitorPresets } from '@/models/preset/monitor'
import { tabletPresets } from '@/models/preset/tablet'
import { phonePresets } from '@/models/preset/phone'
import { pcCasePresets } from '@/models/preset/pc_case'
import { mousePadPresets } from '@/models/preset/mouse_pad'

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
  if (obj.params.name) return obj.params.name
  if (type == 'imported-model') return obj.params.fileName
  return t('models.' + type)
}

// 3. 辅助函数，用于 v-for 循环 params
const getEditableParams = (obj: DeskObject | null) => {
  if (!obj || !obj.params) return []
  // 过滤掉不希望用户编辑的参数
  return Object.entries(obj.params).filter(
    ([key]) => key !== 'isMountable' && key !== 'mountedObjectId',
  )
}

// 数值单位
// 本地输入缓存，单位是输入框的单位（mm或度）
const inputValues = reactive<Record<string, number>>({})

// 当 selectedObject 变化时，更新输入框显示的值
watch(
  selectedObject,
  (obj) => {
    if (!obj) return
    const params = obj.params
    for (const [key, val] of Object.entries(params)) {
      if (typeof val === 'number') {
        inputValues[key] = fromThreeUnitToInput(key, val)
      }
    }
  },
  { immediate: true, deep: true },
)

// 按钮调整函数：根据 key 自动判断单位类型
const adjustValue = (key: string, delta: number) => {
  const current = inputValues[key] ?? 0
  let stepAdjusted = current + delta

  // 对角度参数使用不同步进（例如 ±1° 或 ±5°）
  if (angles.includes(key)) {
    stepAdjusted = current + delta / 10 // 例如按钮的 ±10 表示 ±1°
  }

  inputValues[key] = stepAdjusted
  fromInputToThreeUnit(key, stepAdjusted)
}

let adjustInterval: ReturnType<typeof setInterval> | null = null

const startAdjust = (key: string, delta: number) => {
  adjustValue(key, delta)
  adjustInterval = setInterval(() => adjustValue(key, delta), 300)
}
const stopAdjust = () => {
  if (adjustInterval) clearInterval(adjustInterval)
  adjustInterval = null
}

const angles = [
  'standRotationY',
  'screenTiltX',
  'screenRotateZ',
  'lidAngle',
  'tilterAngleX',
  'tilterAngleY',
  'tilterAngleZ',
  'openAngle',
]
const getUnitForParam = (key: string) => {
  // 根据 key 返回不同的单位
  if (angles.includes(key)) {
    return '°'
  } else if (key === 'curvatureR') {
    return 'R'
  }
  // 默认单位
  return 'mm'
}

// 数值转换,显示转换和更改数值转换，角度、曲率和长度
const fromInputToThreeUnit = (key: string, value: number) => {
  const currObject = selectedObject.value
  if (!currObject) return
  if (angles.includes(key)) {
    value = MathUtils.degToRad(value)
  } else if (key === 'screenSlideY') {
    if (value > 0) value = 0
    value /= 1000
  } else {
    if (value < 0) value = 0
    value /= 1000
  }
  // 默认单位
  updateObjectParam(currObject.id, key, value)
}

const fromThreeUnitToInput = (key: string, value: number) => {
  if (angles.includes(key)) {
    return Number(MathUtils.radToDeg(value).toFixed(0))
  } else {
    return Number((value * 1000).toFixed(0))
  }
}

// 下拉菜单支持
function getPresetOptions(type: string) {
  switch (type) {
    case 'macbook':
      return [
        { value: '', text: t('custom') },
        ...Object.keys(macbookPresets).map((k) => ({
          value: k,
          text: t(k),
        })),
      ]
    case 'monitor':
    case 'monitor-without-stand':
      return [
        { value: '', text: t('custom') },
        ...Object.keys(monitorPresets).map((k) => ({
          value: k,
          text: t(k),
        })),
      ]
    case 'tablet':
      return [
        { value: '', text: t('custom') },
        ...Object.keys(tabletPresets).map((k) => ({
          value: k,
          text: t(k),
        })),
      ]
    case 'phone':
      return [
        { value: '', text: t('custom') },
        ...Object.keys(phonePresets).map((k) => ({
          value: k,
          text: t(k),
        })),
      ]
    case 'pc_case':
      return [
        { value: '', text: t('custom') },
        ...Object.keys(pcCasePresets).map((k) => ({
          value: k,
          text: t(k),
        })),
      ]
    case 'mouse-pad':
      return [
        { value: '', text: t('custom') },
        ...Object.keys(mousePadPresets).map((k) => ({
          value: k,
          text: t(k),
        })),
      ]
    default:
      return [{ value: '', text: t('custom') }]
  }
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
                    :model-value="fromThreeUnitToInput(key, value as number)"
                    @change="fromInputToThreeUnit(key, Number($event.target.value))"
                    :step="1"
                  />
                  <BInputGroupText>{{ getUnitForParam(key) }}</BInputGroupText>
                </BInputGroup>
              </BCol>
              <BCol cols="6">
                <BButtonGroup size="sm" class="d-flex w-100">
                  <BButton
                    variant="outline-secondary"
                    @mousedown="startAdjust(key, -100)"
                    @mouseup="stopAdjust"
                    class="flex-fill pe-0 ps-0 me-0 ms-0"
                    >{{ angles.includes(key) ? '-10' : '-100' }}</BButton
                  >
                  <BButton
                    variant="outline-secondary"
                    @mousedown="startAdjust(key, -10)"
                    @mouseup="stopAdjust"
                    class="flex-fill pe-0 ps-0 me-0 ms-0"
                    >{{ angles.includes(key) ? '-1' : '-10' }}</BButton
                  >
                  <BButton
                    variant="outline-secondary"
                    @mousedown="startAdjust(key, +10)"
                    @mouseup="stopAdjust"
                    class="flex-fill pe-0 ps-0 me-0 ms-0"
                    >{{ angles.includes(key) ? '+1' : '+10' }}</BButton
                  >
                  <BButton
                    variant="outline-secondary"
                    @mousedown="startAdjust(key, +100)"
                    @mouseup="stopAdjust"
                    class="flex-fill pe-0 ps-0 me-0 ms-0"
                    >{{ angles.includes(key) ? '+10' : '+100' }}</BButton
                  >
                </BButtonGroup>
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
              :modelValue="value"
              @update:modelValue="updateObjectParam(selectedObject.id, key, $event)"
              switch
            />

            <!--下拉-->
            <!-- 开关 -->
            <BFormSelect
              v-else-if="key === 'preset'"
              v-model="(selectedObject.params as any)[key]"
              :options="getPresetOptions(selectedObject.type)"
              @change="
                updateObjectParam(selectedObject.id, key, (selectedObject.params as any)[key])
              "
              size="sm"
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

        <div
          v-if="
            selectedObject.type === 'round-base-stand' ||
            selectedObject.type === 'rectangle-base-stand'
          "
        >
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
