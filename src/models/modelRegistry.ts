// src/three/modelRegistry.ts
import { monitorModel, monitorWithoutStandModel } from './preset/monitor'
import { deskLModel, deskRectModel } from './preset/desk'
import {
  keyboard108Modal,
  keyboard60Modal,
  keyboard68Modal,
  keyboard87Modal,
} from './preset/keyboard'
import { mouseModal } from './preset/mouse'
import { phoneModel } from './preset/phone'
import { macbookModal } from './preset/laptop'
import { universalStandModal } from './preset/stand'
import { cubeModal } from './preset/geometry'
import { tabletModel } from './preset/tablet'

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
  'keyboard-108': keyboard108Modal,

  'keyboard-87': keyboard87Modal,

  'keyboard-68': keyboard68Modal,

  'keyboard-60': keyboard60Modal,

  // --- MOUSE ---
  mouse: mouseModal,

  // --- IPHONE ---
  phone: phoneModel,

  // --- TABLET ---
  tablet: tabletModel,

  // --- MACBOOK ---
  macbook: macbookModal,

  // --- UNIVERSAL-STAND ---
  'universal-stand': universalStandModal,

  // --- CUSTOM-BOX ---
  'custom-box': cubeModal,
}
