// 定义 availableModels 的键的联合类型
import type { DeskObjectType } from './deskObject'

// 定义 availableModels 数组中每个目录元素的类型
export interface AvailableModelItem {
  type: DeskObjectType
  name: string
  icon: string
}

// 目录结构接口：包含图标和模型列表
export interface CatalogCategory {
  icon: string // 目录自身的图标
  models: AvailableModelItem[] // 目录下的模型列表
}

// 定义整个 availableModels 对象的结构
export interface AvailableModelsMap {
  desks: CatalogCategory
  computingDevices: CatalogCategory
  inputDevices: CatalogCategory
  audioDevices: CatalogCategory
  lighting: CatalogCategory
  stands: CatalogCategory
  customGeometry: CatalogCategory
}

// 目录名
export type CatalogCategoryKey = keyof AvailableModelsMap

export const availableModels: AvailableModelsMap = {
  desks: {
    icon: '🛋️',
    models: [
      { type: 'desk-rect', name: 'desk-rect', icon: '▭' },
      { type: 'desk-l', name: 'desk-l', icon: 'L' },
    ],
  },
  computingDevices: {
    icon: '💻',
    models: [
      { type: 'monitor', name: 'monitor', icon: '🖥️' },
      { type: 'monitor-without-stand', name: 'monitor-without-stand', icon: '🖥️' },
      { type: 'macbook', name: 'macbook', icon: '💻' },
      { type: 'phone', name: 'phone', icon: '📱' },
      { type: 'tablet', name: 'tablet', icon: '📲' },
      { type: 'pc-case', name: 'pc-case', icon: '🕹️' },
      { type: 'wireless-router', name: 'wireless-router', icon: '🛜' },
    ],
  },
  inputDevices: {
    icon: '⌨️',
    models: [
      { type: 'keyboard-108', name: 'keyboard-108', icon: '⌨️' },
      { type: 'keyboard-87', name: 'keyboard-87', icon: '⌨️' },
      { type: 'keyboard-68', name: 'keyboard-68', icon: '⌨️' },
      { type: 'keyboard-60', name: 'keyboard-60', icon: '⌨️' },
      { type: 'mouse', name: 'mouse', icon: '🖱️' },
      { type: 'mouse-pad', name: 'mouse-pad', icon: '⬜' },
      { type: 'stylus', name: 'stylus', icon: '✏️' },
    ],
  },
  audioDevices: {
    icon: '🔊',
    models: [
      { type: 'speaker', name: 'speaker', icon: '🔊' },
      { type: 'sound-bar', name: 'sound-bar', icon: '📢' },
      { type: 'headphone', name: 'headphone', icon: '🎧' },
      { type: 'microphone', name: 'microphone', icon: '🎤' },
      { type: 'webcam', name: 'webcam', icon: '📷' },
    ],
  },
  lighting: {
    icon: '💡',
    models: [
      { type: 'monitor-light', name: 'monitor-light', icon: '🔦' },
      { type: 'round-base-table-light', name: 'round-base-table-light', icon: '💡' },
      { type: 'rectangle-base-table-light', name: 'rectangle-base-table-light', icon: '💡' },
    ],
  },
  stands: {
    icon: '🔧',
    models: [
      { type: 'round-base-stand', name: 'round-base-stand', icon: '⚙️' },
      { type: 'rectangle-base-stand', name: 'rectangle-base-stand', icon: '🔩' },
      { type: 'monitor-riser', name: 'monitor-riser', icon: '⬆️' },
    ],
  },
  customGeometry: {
    icon: '📐',
    models: [
      { type: 'custom-box', name: 'custom-box', icon: '🧊' },
      { type: 'custom-cylinder', name: 'custom-cylinder', icon: '🛢️' },
      { type: 'custom-sphere', name: 'custom-sphere', icon: '⚪' },
      { type: 'water-glass', name: 'water-glass', icon: '🥛' },
    ],
  },
}
