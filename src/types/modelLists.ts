// 定义 availableModels 的键的联合类型
import type { DeskObjectType } from './deskObject'

// 定义 availableModels 数组中每个目录元素的类型
export interface AvailableModelItem {
  type: DeskObjectType
  name: string
  icon: string
}

// 1. 新的目录结构接口：包含图标和模型列表
export interface CatalogCategory {
  icon: string // 目录自身的图标
  models: AvailableModelItem[] // 目录下的模型列表
}

// 2. 定义整个 availableModels 对象的结构
export interface AvailableModelsMap {
  desks: CatalogCategory
  devices: CatalogCategory
  accessories: CatalogCategory
  others: CatalogCategory
}

// 目录名
export type CatalogCategoryKey = keyof AvailableModelsMap

export const availableModels: AvailableModelsMap = {
  desks: {
    icon: '🪑', // 新增：目录图标
    models: [
      { type: 'desk-rect', name: 'desk-rect', icon: '▭' },
      { type: 'desk-l', name: 'desk-l', icon: 'L' },
    ],
  },
  devices: {
    icon: '💻', // 新增：目录图标
    models: [
      { type: 'monitor', name: 'monitor', icon: '🖥️' },
      { type: 'macbook', name: 'macbook', icon: '💻' },
      { type: 'iphone', name: 'iphone', icon: '📱' },
    ],
  },
  accessories: {
    icon: '⌨️', // 新增：目录图标
    models: [
      { type: 'keyboard', name: 'keyboard', icon: '⌨️' },
      { type: 'mouse', name: 'mouse', icon: '🖱️' },
      { type: 'universal-stand', name: 'universal-stand', icon: '🔩' },
    ],
  },
  others: {
    icon: '🧩', // 新增：目录图标
    models: [{ type: 'custom-box', name: 'custom-box', icon: '📦' }],
  },
}
