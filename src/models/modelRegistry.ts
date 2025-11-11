// 模型注册表
import { monitorModel, monitorWithoutStandModel } from './preset/monitor'
import { deskLModel, deskRectModel } from './preset/desk'
import {
  keyboard108Model,
  keyboard60Model,
  keyboard68Model,
  keyboard87Model,
} from './preset/keyboard'
import { mouseModel } from './preset/mouse'
import { phoneModel } from './preset/phone'
import { macbookModel } from './preset/laptop'
import { rectangleBaseStandModel, roundBaseStandModel } from './preset/stand'
import { customBoxModel, customCylinderModel, customSphereModel } from './preset/geometry'
import { tabletModel } from './preset/tablet'
import { pcCaseModel } from './preset/pc_case'
import { monitorRiserModel } from './preset/monitor_riser'
import { mousePadModel } from './preset/mouse_pad'
import { soundBarModel, speakerModel } from './preset/speaker'
import { headphoneModel } from './preset/headphone'
import { microphoneModel } from './preset/microphone'
import { stylusModel } from './preset/stylus'
import { monitorLightModel } from './preset/monitor_light'
import { rectangleBaseTableLightModel, roundBaseTableLightModel } from './preset/table_light'
import { webcamModel } from './preset/webcam'
import { waterGlassModel } from './preset/water_glass'
import { wirelessRouterModel } from './preset/wireless_router'

// 创建模型注册表
export const modelRegistry = {
  // ---  矩形桌子 ---
  'desk-rect': deskRectModel,

  // --- L形桌子 ---
  'desk-l': deskLModel,

  // --- 显示器 ---
  monitor: monitorModel,
  'monitor-without-stand': monitorWithoutStandModel,

  // --- 键盘 ---
  'keyboard-108': keyboard108Model,
  'keyboard-87': keyboard87Model,
  'keyboard-68': keyboard68Model,
  'keyboard-60': keyboard60Model,

  // --- 鼠标 ---
  mouse: mouseModel,

  // --- 手写笔 ---
  stylus: stylusModel,

  // --- 手机 ---
  phone: phoneModel,

  // --- 平板电脑 ---
  tablet: tabletModel,

  // --- 笔记本电脑 ---
  macbook: macbookModel,

  // --- 机箱 ---
  'pc-case': pcCaseModel,

  // --- 鼠标垫 ---
  'mouse-pad': mousePadModel,

  // --- 扬声器与耳机 ---
  speaker: speakerModel,
  'sound-bar': soundBarModel,
  headphone: headphoneModel,

  // --- 麦克风 ---
  microphone: microphoneModel,

  // --- 摄像头 ---
  webcam: webcamModel,

  // --- 灯光 ---
  'monitor-light': monitorLightModel,
  'round-base-table-light': roundBaseTableLightModel,
  'rectangle-base-table-light': rectangleBaseTableLightModel,

  // --- 水杯 ---
  'water-glass': waterGlassModel,

  // --- 路由器 ---
  'wireless-router': wirelessRouterModel,

  // --- 支架 ---
  'round-base-stand': roundBaseStandModel,
  'rectangle-base-stand': rectangleBaseStandModel,
  'monitor-riser': monitorRiserModel,

  // --- 自定义几何体 ---
  'custom-box': customBoxModel,
  'custom-cylinder': customCylinderModel,
  'custom-sphere': customSphereModel,
}
