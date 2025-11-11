// 模型类型
import type { DeskLObject, DeskRectObject } from './preset/desk'
import type { MonitorRiserObject } from './preset/monitor_riser'
import type { CustomBoxObject, CustomCylinderObject, CustomSphereObject } from './preset/geometry'
import type { KeyboardObject } from './preset/keyboard'
import type { MacbookObject } from './preset/laptop'
import type { MonitorObject, MonitorWithoutStandObject } from './preset/monitor'
import type { MouseObject } from './preset/mouse'
import type { PcCaseObject } from './preset/pc_case'
import type { PhoneObject } from './preset/phone'
import type { RectangleBaseStandObject, RoundBaseStandObject } from './preset/stand'
import type { TabletObject } from './preset/tablet'
import type { MousePadObject } from './preset/mouse_pad'
import type { SoundBarObject, SpeakerObject } from './preset/speaker'
import type { HeadphoneObject } from './preset/headphone'
import type { MicrophoneObject } from './preset/microphone'
import type { StylusObject } from './preset/stylus'
import type { MonitorLightObject } from './preset/monitor_light'
import type { RectangleBaseTableLightObject, RoundBaseTableLightObject } from './preset/table_light'
import type { WebcamObject } from './preset/webcam'
import type { WaterGlassObject } from './preset/water_glass'
import type { WirelessRouterObject } from './preset/wireless_router'

// 基础布局对象接口 (所有对象共享的属性)
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
  color: string // 占位符
}
export interface ImportedModelObject extends BaseObject {
  type: 'imported-model'
  params: ImportedModelParams
}

// 导出最终的联合类型
export type DeskObject =
  | DeskRectObject
  | DeskLObject
  | MonitorObject
  | MonitorWithoutStandObject
  | MacbookObject
  | PhoneObject
  | TabletObject
  | PcCaseObject
  | MousePadObject
  | KeyboardObject
  | MouseObject
  | StylusObject
  | SpeakerObject
  | SoundBarObject
  | HeadphoneObject
  | MicrophoneObject
  | WebcamObject
  | RoundBaseStandObject
  | RectangleBaseStandObject
  | MonitorRiserObject
  | MonitorLightObject
  | RoundBaseTableLightObject
  | RectangleBaseTableLightObject
  | WaterGlassObject
  | WirelessRouterObject
  | CustomBoxObject
  | CustomCylinderObject
  | CustomSphereObject
  | ImportedModelObject

// 导出 Type 字符串的联合类型，用于 addObject
// 不在这里添加 'imported-model'，防止它出现在 AddModelModal 的预设列表中
export type DeskObjectType =
  | 'desk-rect'
  | 'desk-l'
  | 'monitor'
  | 'monitor-without-stand'
  | 'macbook'
  | 'phone'
  | 'tablet'
  | 'pc-case'
  | 'mouse-pad'
  | 'keyboard-108'
  | 'keyboard-87'
  | 'keyboard-68'
  | 'keyboard-60'
  | 'mouse'
  | 'stylus'
  | 'speaker'
  | 'sound-bar'
  | 'headphone'
  | 'microphone'
  | 'webcam'
  | 'round-base-stand'
  | 'rectangle-base-stand'
  | 'monitor-riser'
  | 'monitor-light'
  | 'round-base-table-light'
  | 'rectangle-base-table-light'
  | 'water-glass'
  | 'wireless-router'
  | 'custom-box'
  | 'custom-cylinder'
  | 'custom-sphere'
