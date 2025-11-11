import * as THREE from 'three'
import type { BaseObject } from '@/models/deskObject'

// 音响
export interface SpeakerParams {
  name: string | ''
  width: number
  height: number
  depth: number
  color: string
  isMountable: boolean
}

export interface SpeakerObject extends BaseObject {
  type: 'speaker'
  params: SpeakerParams
}

export const speakerModel = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'speaker',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      width: 0.15,
      height: 0.226,
      depth: 0.197,
      color: '#2e2e2e',
      isMountable: true,
    },
  }),
  buildGeometry: (group: THREE.Group, data: SpeakerObject) => {
    const p = data.params

    // 音响外壳（磨砂金属或塑料外壳）
    const speakerShellMaterial = new THREE.MeshStandardMaterial({
      color: p.color, // 深灰或黑色外壳
      metalness: 0.3, // 稍带金属感
      roughness: 0.6, // 磨砂质感
      envMapIntensity: 0.5, // 中等反射
    })

    // 发声单元（扬声器振膜）
    const speakerDriverMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x3a3a3a, // 深灰偏黑的振膜
      metalness: 0.1, // 振膜通常非金属，但带少许反光
      roughness: 0.3, // 光滑但非镜面
      reflectivity: 0.6, // 有一定反射感
      clearcoat: 0.5, // 薄层反光膜
      clearcoatRoughness: 0.2,
      side: THREE.DoubleSide,
    })
    const speakerRubberRingMaterial = new THREE.MeshStandardMaterial({
      color: 0x1b1b1b, // 深黑偏灰的橡胶色
      metalness: 0.0, // 橡胶无金属属性
      roughness: 0.85, // 高粗糙度，漫反射强
      envMapIntensity: 0.1, // 环境反射极弱
    })

    // 音响主体
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(p.width, p.height, p.depth),
      speakerShellMaterial,
    )
    body.position.y = p.height / 2

    // 前面板的扬声器单元
    const driverRadius = Math.min(p.width, p.height) * 0.4
    const driverDepth = 0.01
    const driver = new THREE.Mesh(
      new THREE.ConeGeometry(driverRadius, driverDepth, 32, 2, true),
      speakerDriverMaterial,
    )
    driver.rotation.x = -Math.PI / 2
    driver.position.set(0, p.height * 0.5, p.depth / 2 + driverDepth / 2 - 0.001)

    const driverInner = new THREE.Mesh(
      new THREE.ConeGeometry(driverRadius, driverDepth, 32, 2, true),
      speakerDriverMaterial,
    )
    driverInner.rotation.x = Math.PI / 2
    driverInner.position.set(0, p.height * 0.5, p.depth / 2 + driverDepth / 4)

    // 扬声器橡胶环
    const ringThickness = driverRadius * 0.15
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(driverRadius, ringThickness, 6, 32),
      speakerRubberRingMaterial,
    )
    ring.position.set(0, p.height * 0.5, p.depth / 2 + driverDepth / 2)

    // 音量旋钮
    const knobRadius = 0.01
    const knobDepth = 0.01
    const knob = new THREE.Mesh(
      new THREE.CylinderGeometry(knobRadius, knobRadius, knobDepth, 32),
      speakerShellMaterial,
    )
    knob.position.set(p.width * 0.5 - 0.02, p.height - 0.02, -p.depth / 2 - knobDepth / 2)
    knob.rotation.x = Math.PI / 2

    group.add(body, driver, ring, driverInner, knob)
  },
}

// 条形音响
// === 纹理缓存 ===
let cachedSoundBarTexture: THREE.Texture | null = null

export interface SoundBarObject extends BaseObject {
  type: 'sound-bar'
  params: SpeakerParams
}

export const soundBarModel = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'sound-bar',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      width: 0.45,
      height: 0.05,
      depth: 0.05,
      color: '#2e2e2e',
      isMountable: true,
    },
  }),
  buildGeometry: (group: THREE.Group, data: SoundBarObject) => {
    if (!cachedSoundBarTexture) {
      const loader = new THREE.TextureLoader()
      cachedSoundBarTexture = loader.load('/textures/speaker/soundbar-front.jpg')
      cachedSoundBarTexture.colorSpace = THREE.SRGBColorSpace
      // cachedSoundBarTexture.wrapS = THREE.RepeatWrapping
      // cachedSoundBarTexture.wrapT = THREE.RepeatWrapping
      // cachedSoundBarTexture.repeat.set(1, 1)
    }

    const p = data.params
    const bodyWidth = p.width - 0.02
    const c = new THREE.Color(p.color)

    // 音响外壳（磨砂金属或塑料外壳）
    const speakerShellMaterial = new THREE.MeshStandardMaterial({
      color: p.color, // 深灰或黑色外壳
      metalness: 0.3, // 稍带金属感
      roughness: 0.6, // 磨砂质感
      envMapIntensity: 0.5, // 中等反射
    })
    // 前面板材质使用纹理
    const frontPanelMaterial = new THREE.MeshStandardMaterial({
      map: cachedSoundBarTexture,
      metalness: 0.8, // 完全金属
      roughness: 0.3, // 略微粗糙，反射适中
      envMapIntensity: 1.0, // 强反射
      color: c.lerp(new THREE.Color(0xffffff), 0.1),
    })
    // 旋钮材质
    const knobMat = new THREE.MeshStandardMaterial({
      color: p.color,
      metalness: 0.6,
      roughness: 0.8,
      envMapIntensity: 0.2,
    })

    // 音响主体
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(bodyWidth, p.height, p.depth),
      speakerShellMaterial,
    )
    body.position.y = p.height / 2

    // 网面
    const frontPanel = new THREE.Mesh(
      new THREE.BoxGeometry(bodyWidth * 0.95, p.height * 0.9, 0.0002),
      frontPanelMaterial,
    )
    frontPanel.position.set(0, p.height * 0.55, p.depth / 2 + 0.0001)

    const topPanel = new THREE.Mesh(
      new THREE.BoxGeometry(bodyWidth * 0.95, 0.0002, p.depth * 0.9),
      frontPanelMaterial,
    )
    topPanel.position.set(0, p.height + 0.0001, p.depth * 0.05)

    // 侧边音量旋钮
    const knobRadius = Math.min(p.height, p.depth) * 0.3
    const knobDepth = 0.02
    const knob = new THREE.Mesh(
      new THREE.CylinderGeometry(knobRadius, knobRadius, knobDepth, 32),
      knobMat,
    )
    knob.position.set(bodyWidth * 0.5, p.height / 2, 0)
    knob.rotation.z = Math.PI / 2

    group.add(body, knob, frontPanel, topPanel)
  },
}
