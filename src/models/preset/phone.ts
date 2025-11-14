import * as THREE from 'three'
import type { BaseObject } from '@/models/deskObject'

// 手机
export interface PhoneParams {
  name: string | ''
  preset: PhonePresetKey | '' // 允许空字符串或预设名
  width: number
  height: number
  depth: number
  color: string
  isMountable: boolean
}
export interface PhoneObject extends BaseObject {
  type: 'phone'
  params: PhoneParams
}

// 预设尺寸
export const phonePresets = {
  '6-inch': { width: 0.071, depth: 0.146, height: 0.006 },
  '6.5-inch': { width: 0.074, depth: 0.152, height: 0.006 },
  '7-inch': { width: 0.078, depth: 0.158, height: 0.006 },
} as const

export type PhonePresetKey = keyof typeof phonePresets

// === 纹理缓存 ===
let cachedScreenShotTexture: THREE.Texture | null = null

export const phoneModel = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'phone',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      preset: '', // 默认无预设
      width: 0.071,
      height: 0.006,
      depth: 0.146,
      color: '#54524f',
      isMountable: true,
    },
  }),
  buildGeometry: (group: THREE.Group, data: PhoneObject) => {
    if (!cachedScreenShotTexture) {
      const loader = new THREE.TextureLoader()
      cachedScreenShotTexture = loader.load('./textures/phone/phone_screenshot.jpg')
      cachedScreenShotTexture.colorSpace = THREE.SRGBColorSpace
    }
    // 清空旧内容
    while (group.children.length) group.remove(group.children[0]!)

    const p = data.params

    // 应用预设尺寸（如果有）
    if (p.preset && phonePresets[p.preset]) {
      const preset = phonePresets[p.preset]
      p.width = preset.width
      p.depth = preset.depth
      p.height = preset.height
    }

    // === 材质 ===
    const metalMat = new THREE.MeshStandardMaterial({
      color: p.color,
      metalness: 1.0, // 高金属感
      roughness: 0.25, // 略微粗糙，保持较高的光泽度
      envMapIntensity: 1.2, // 保持环境反射强度
    })

    const screenMat = new THREE.MeshStandardMaterial({
      map: cachedScreenShotTexture, // 贴图显示屏幕内容
      metalness: 0.0,
      roughness: 0.05, // 极低粗糙度模拟高光玻璃表面的尖锐反射
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
      new THREE.BoxGeometry(p.width * 0.95, 0.0001, p.depth * 0.98),
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

    const powerButton = createButton(p.width / 2 + 0.0005, -p.depth * 0.3)
    const volumeUp = createButton(-p.width / 2 - 0.0005, -p.depth * 0.3 + 0.02)
    const volumeDown = createButton(-p.width / 2 - 0.0005, -p.depth * 0.3)
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
