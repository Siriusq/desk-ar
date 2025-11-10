// src/three/modelRegistry.ts
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

// 创建模型“注册表”
export const modelRegistry = {
  // --- DESK-RECT ---
  'desk-rect': deskRectModel,

  // --- DESK-L ---
  'desk-l': deskLModel,

  // --- MONITOR ---
  monitor: monitorModel,

  'monitor-without-stand': monitorWithoutStandModel,

  // --- KEYBOARD ---
  'keyboard-108': keyboard108Model,

  'keyboard-87': keyboard87Model,

  'keyboard-68': keyboard68Model,

  'keyboard-60': keyboard60Model,

  // --- MOUSE ---
  mouse: mouseModel,

  // --- STYLUS ---
  stylus: stylusModel,

  // --- IPHONE ---
  phone: phoneModel,

  // --- TABLET ---
  tablet: tabletModel,

  // --- MACBOOK ---
  macbook: macbookModel,

  // --- PC CASE ---
  'pc-case': pcCaseModel,

  // --- Mouse Pad ---
  'mouse-pad': mousePadModel,

  // --- SPEAKER ---
  speaker: speakerModel,
  'sound-bar': soundBarModel,
  headphone: headphoneModel,

  // --- MICROPHONE ---
  microphone: microphoneModel,

  // --- WEBCAM ---
  webcam: webcamModel,

  // --- LIGHT ---
  'monitor-light': monitorLightModel,
  'round-base-table-light': roundBaseTableLightModel,
  'rectangle-base-table-light': rectangleBaseTableLightModel,

  // --- WATER GLASS ---
  'water-glass': waterGlassModel,

  // --- UNIVERSAL-STAND ---
  'round-base-stand': roundBaseStandModel,
  'rectangle-base-stand': rectangleBaseStandModel,
  'monitor-riser': monitorRiserModel,

  // --- CUSTOM-Geometry ---
  'custom-box': customBoxModel,
  'custom-cylinder': customCylinderModel,
  'custom-sphere': customSphereModel,
}
