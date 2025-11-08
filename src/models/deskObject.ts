// src/types/deskObject.ts
// 1. 基础布局对象接口 (所有对象共享的属性)

import type { DeskLObject, DeskRectObject } from './preset/desk'
import type { CustomBoxObject, CustomCylinderObject, CustomSphereObject } from './preset/geometry'
import type { KeyboardObject } from './preset/keyboard'
import type { MacbookObject } from './preset/laptop'
import type { MonitorObject, MonitorWithoutStandObject } from './preset/monitor'
import type { MouseObject } from './preset/mouse'
import type { PhoneObject } from './preset/phone'
import type { RectangleBaseStandObject, RoundBaseStandObject } from './preset/stand'
import type { TabletObject } from './preset/tablet'

// 注意：position 和 rotation 应该是纯对象，以便 JSON 序列化
export interface BaseObject {
  id: string
  type: string
  name?: string // 可选名称属性
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  mountedToId: string | null
}

// 导入的模型类型
export interface ImportedModelParams {
  name?: string
  fileName: string
  dataUrl: string // 存储模型的 Base64 Data URL
  color: string // 占位符，以满足 createObject3D 和 sceneManager 的要求
}
export interface ImportedModelObject extends BaseObject {
  type: 'imported-model'
  params: ImportedModelParams
}

// 3. 导出最终的联合类型
export type DeskObject =
  | DeskRectObject
  | DeskLObject
  | MonitorObject
  | MonitorWithoutStandObject
  | MacbookObject
  | PhoneObject
  | TabletObject
  | KeyboardObject
  | MouseObject
  | RoundBaseStandObject
  | RectangleBaseStandObject
  | CustomBoxObject
  | CustomCylinderObject
  | CustomSphereObject
  | ImportedModelObject

// 4. 导出 Type 字符串的联合类型，用于 addObject
// 【注意】 我们 *不* 在这里添加 'imported-model'
// 这可以防止它出现在 AddModelModal 的预设列表中
export type DeskObjectType =
  | 'desk-rect'
  | 'desk-l'
  | 'monitor'
  | 'monitor-without-stand'
  | 'macbook'
  | 'phone'
  | 'tablet'
  | 'keyboard-108'
  | 'keyboard-87'
  | 'keyboard-68'
  | 'keyboard-60'
  | 'mouse'
  | 'round-base-stand'
  | 'rectangle-base-stand'
  | 'custom-box'
  | 'custom-cylinder'
  | 'custom-sphere'
