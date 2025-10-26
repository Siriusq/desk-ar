// src/types/deskObject.ts
// 1. 基础布局对象接口 (所有对象共享的属性)
// 注意：position 和 rotation 应该是纯对象，以便 JSON 序列化
export interface BaseObject {
  id: string
  type: string
  position: { x: number; y: number; z: number }
  rotation: { x: number; y: number; z: number }
  mountedToId: string | null
}

// 2. 具体的对象类型 (使用 type 区分)

// === 桌子 ===
export interface DeskRectParams {
  width: number
  depth: number
  height: number
  color: string
  showLegs: boolean
}
export interface DeskRectObject extends BaseObject {
  type: 'desk-rect'
  params: DeskRectParams
}

export interface DeskLParams {
  widthA: number
  depthA: number
  widthB: number
  depthB: number
  height: number
  color: string
  showLegs: boolean
}
export interface DeskLObject extends BaseObject {
  type: 'desk-l'
  params: DeskLParams
}

// === 设备 ===
export interface MonitorParams {
  width: number
  height: number
  color: string
  isMountable: boolean
}
export interface MonitorObject extends BaseObject {
  type: 'monitor'
  params: MonitorParams
}

export interface MacbookParams {
  width: number
  height: number
  depth: number
  color: string
  isMountable: boolean
}
export interface MacbookObject extends BaseObject {
  type: 'macbook'
  params: MacbookParams
}

export interface IphoneParams {
  width: number
  height: number
  depth: number
  color: string
  isMountable: boolean
}
export interface IphoneObject extends BaseObject {
  type: 'iphone'
  params: IphoneParams
}

// === 配件 ===
export interface KeyboardParams {
  width: number
  height: number
  depth: number
  color: string
}
export interface KeyboardObject extends BaseObject {
  type: 'keyboard'
  params: KeyboardParams
}

export interface MouseParams {
  width: number
  height: number
  depth: number
  color: string
}
export interface MouseObject extends BaseObject {
  type: 'mouse'
  params: MouseParams
}

export interface UniversalStandParams {
  baseSize: number
  poleHeight: number
  armLength: number
  color: string
  mountedObjectId: string | null
}
export interface UniversalStandObject extends BaseObject {
  type: 'universal-stand'
  params: UniversalStandParams
}

// === 其他 ===
export interface CustomBoxParams {
  width: number
  height: number
  depth: number
  color: string
}
export interface CustomBoxObject extends BaseObject {
  type: 'custom-box'
  params: CustomBoxParams
}

// 3. 导出最终的联合类型
export type DeskObject =
  | DeskRectObject
  | DeskLObject
  | MonitorObject
  | MacbookObject
  | IphoneObject
  | KeyboardObject
  | MouseObject
  | UniversalStandObject
  | CustomBoxObject

// 4. 导出 Type 字符串的联合类型，用于 addObject
export type DeskObjectType = DeskObject['type']
