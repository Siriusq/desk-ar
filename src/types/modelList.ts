// src/types/modelList.ts

import type { DeskObjectType } from './deskObject'

// 定义 availableModels 数组中每个目录元素的类型
export interface AvailableModelItem {
  type: DeskObjectType
  name: string
  icon: string
}
