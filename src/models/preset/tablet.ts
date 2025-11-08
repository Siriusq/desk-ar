import * as THREE from 'three'
import type { BaseObject } from '../deskObject'

export interface TabletParams {
  name: string | ''
  preset: TabletPresetKey | '' // 允许空字符串或预设名
  width: number
  height: number
  depth: number
  color: string
  isMountable: boolean
}
export interface TabletObject extends BaseObject {
  type: 'tablet'
  params: TabletParams
}

// 预设尺寸
export const tabletPresets = {
  '10-inch': { width: 0.179, depth: 0.248, height: 0.006 },
  '11-inch': { width: 0.185, depth: 0.254, height: 0.006 },
  '12-inch': { width: 0.195, depth: 0.263, height: 0.006 },
} as const

export type TabletPresetKey = keyof typeof tabletPresets

// === 纹理缓存 ===
let cachedScreenShotTexture: THREE.Texture | null = null

export const tabletModel = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'tablet',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      preset: '', // 默认无预设
      width: 0.179,
      height: 0.006,
      depth: 0.248,
      color: '#54524f',
      isMountable: true,
    },
  }),
  buildGeometry: (group: THREE.Group, data: TabletObject) => {
    if (!cachedScreenShotTexture) {
      const loader = new THREE.TextureLoader()
      cachedScreenShotTexture = loader.load('/textures/tablet/tablet-screenshot.jpg')
      cachedScreenShotTexture.colorSpace = THREE.SRGBColorSpace
    }
    // 清空旧内容
    while (group.children.length) group.remove(group.children[0]!)

    const p = data.params

    // ✅ 应用预设尺寸（如果有）
    if (p.preset && tabletPresets[p.preset]) {
      const preset = tabletPresets[p.preset]
      p.width = preset.width
      p.depth = preset.depth
      p.height = preset.height
    }

    // === 材质 ===
    const metalMat = new THREE.MeshPhysicalMaterial({
      color: p.color,
      metalness: 1.0,
      roughness: 0.25,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0,
      sheen: 0.3,
      sheenRoughness: 0.5,
      envMapIntensity: 1.2,
    })

    const screenMat = new THREE.MeshPhysicalMaterial({
      map: cachedScreenShotTexture,
      metalness: 0.0,
      roughness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      transmission: 0.04,
      thickness: 0.001,
      ior: 1.52,
      reflectivity: 0.9,
      envMapIntensity: 1.0,
    })

    const blackMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.2,
      metalness: 0.8,
    })

    // === 分组结构 ===
    const wrapper = new THREE.Group() // 外层包裹（用于整体定位）
    const bodyGroup = new THREE.Group()
    const buttonGroup = new THREE.Group()
    const cameraGroup = new THREE.Group()

    // === 机身 ===
    const baseMatArray = Array(6).fill(metalMat)
    baseMatArray[2] = blackMat // 顶面（屏幕下方的黑边）

    const base = new THREE.Mesh(new THREE.BoxGeometry(p.width, p.height, p.depth), baseMatArray)
    base.position.y = p.height / 2
    bodyGroup.add(base)

    // === 屏幕 ===
    const screen = new THREE.Mesh(
      new THREE.BoxGeometry(p.width * 0.95, 0.0001, p.depth * 0.96),
      screenMat,
    )
    screen.position.y = p.height + 0.00005
    bodyGroup.add(screen)

    // === 摄像头 ===
    const camera = new THREE.Mesh(
      new THREE.CylinderGeometry(0.005, 0.005, 0.002, 32),
      new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0, metalness: 0 }),
    )
    //camera.rotation.x = Math.PI / 2
    camera.position.set(-p.width / 2 + 0.01, -0.001, -p.depth / 2 + 0.01)
    cameraGroup.add(camera)

    // === 按钮 ===
    const buttonGeo = new THREE.BoxGeometry(0.001, 0.002, 0.01)
    const createButton = (x: number, z: number) => {
      const btn = new THREE.Mesh(buttonGeo, metalMat)
      btn.position.set(x, p.height / 2, z)
      return btn
    }

    const powerButton = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.002, 0.001), metalMat)
    powerButton.position.set(p.width / 2 - 0.015, p.height / 2, -p.depth / 2 - 0.0005)

    const volumeUp = createButton(p.width / 2 + 0.0005, -p.depth * 0.4 + 0.02)
    const volumeDown = createButton(p.width / 2 + 0.0005, -p.depth * 0.4)
    buttonGroup.add(powerButton, volumeUp, volumeDown)

    // === 层级关系 ===
    wrapper.add(bodyGroup)
    wrapper.add(cameraGroup)
    wrapper.add(buttonGroup)

    // === 调整整体原点（底部接地）===
    wrapper.position.y = 0 // wrapper 原点位于地面
    bodyGroup.position.y = 0 // 机身底部位于 y=0

    group.add(wrapper)
  },
}
