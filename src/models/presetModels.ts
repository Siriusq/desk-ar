// 1. 定义 availableModels 的键的联合类型

import type { AvailableModelItem } from '@/types/modelList'

// 注意：这些是目录名
export type CatalogCategoryKey = 'desks' | 'devices' | 'accessories' | 'others'

// 2. 定义整个 availableModels 对象的结构
export interface AvailableModelsMap {
  desks: AvailableModelItem[]
  devices: AvailableModelItem[]
  accessories: AvailableModelItem[]
  others: AvailableModelItem[]
}

export const availableModels: AvailableModelsMap = {
  desks: [
    { type: 'desk-rect', name: 'desk-rect', icon: '▭' },
    { type: 'desk-l', name: 'desk-l', icon: 'L' },
  ],
  devices: [
    { type: 'monitor', name: 'monitor', icon: '🖥️' },
    { type: 'macbook', name: 'macbook', icon: '💻' },
    { type: 'iphone', name: 'iphone', icon: '📱' },
  ],
  accessories: [
    { type: 'keyboard', name: 'keyboard', icon: '⌨️' },
    { type: 'mouse', name: 'mouse', icon: '🖱️' },
    { type: 'universal-stand', name: 'universal-stand', icon: '🔩' },
  ],
  others: [{ type: 'custom-box', name: 'custom-box', icon: '📦' }],
}
