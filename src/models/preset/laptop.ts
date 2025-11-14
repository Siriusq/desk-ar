import * as THREE from 'three'
import type { BaseObject } from '@/models/deskObject'

// 笔记本电脑
export interface MacbookParams {
  name: string | ''
  preset: MacbookPresetKey | '' // 允许空字符串或预设名
  width: number
  height: number
  depth: number
  lidAngle: number
  color: string
  isMountable: boolean
}
export interface MacbookObject extends BaseObject {
  type: 'macbook'
  params: MacbookParams
}

// 预设尺寸
export const macbookPresets = {
  '13-inch': { width: 0.304, depth: 0.215, height: 0.014 },
  '14-inch': { width: 0.312, depth: 0.221, height: 0.015 },
  '15-inch': { width: 0.34, depth: 0.237, height: 0.016 },
  '16-inch': { width: 0.355, depth: 0.248, height: 0.017 },
} as const

export type MacbookPresetKey = keyof typeof macbookPresets

// === 纹理缓存 ===
let cachedkeyboardTexture: THREE.Texture | null = null

export const macbookModel = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'macbook',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      preset: '', // 默认无预设
      width: 0.3,
      height: 0.015,
      depth: 0.21,
      lidAngle: Math.PI * 0.5,
      color: '#CCCCCC',
      isMountable: true,
    },
  }),
  buildGeometry: (group: THREE.Group, data: MacbookObject) => {
    if (!cachedkeyboardTexture) {
      const loader = new THREE.TextureLoader()
      cachedkeyboardTexture = loader.load('./textures/laptop/macbook_keyboard.jpg')
      cachedkeyboardTexture.colorSpace = THREE.SRGBColorSpace
    }

    const p = data.params

    // 应用预设尺寸（如果有）
    if (p.preset && macbookPresets[p.preset]) {
      const preset = macbookPresets[p.preset]
      p.width = preset.width
      p.depth = preset.depth
    }

    const border = 0.007
    const screenHeight = 0.001
    const topPanelHeight = 0.004
    const topBodyHeight = screenHeight + topPanelHeight
    const basePanelHeight = p.height - topPanelHeight

    const matBody = new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.7 })
    const matScreen = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.2,
      metalness: 0.8,
    })
    const matTouchPad = new THREE.MeshStandardMaterial({
      color: p.color,
      roughness: 0.2,
      metalness: 0.5,
    })

    // 2. 【修改】 顶部贴图材质
    const keyboardTextureMaterial = new THREE.MeshStandardMaterial({
      map: cachedkeyboardTexture,
      metalness: 0.2,
      roughness: 0.7,
    })

    // 3. 材质数组 (保持不变)
    const keyboardMaterials = [
      matBody, // 右
      matBody, // 左
      keyboardTextureMaterial, // 顶
      matBody, // 底
      matBody, // 前
      matBody, // 后
    ]

    // 顶部外壳
    const topBody = new THREE.Group()
    const topPanel = new THREE.Mesh(
      new THREE.BoxGeometry(p.width, topPanelHeight, p.depth),
      matBody,
    )
    topPanel.position.y = topPanelHeight / 2 + screenHeight
    topBody.add(topPanel)

    // 屏幕
    const screen = new THREE.Mesh(
      new THREE.BoxGeometry(p.width - border * 2, screenHeight, p.depth - border * 2),
      matScreen,
    )
    screen.position.y = topBodyHeight
    topBody.add(screen)

    topBody.position.y = -topBodyHeight
    topBody.position.z = -p.depth / 2

    // 转轴处理
    const pivot = new THREE.Group()
    pivot.position.y = p.height - topBodyHeight
    pivot.position.z = -p.depth / 2
    pivot.add(topBody)

    // 旋转模拟屏幕开合
    const currLidAngle = Math.min(Math.max(p.lidAngle, 0), Math.PI)
    pivot.rotation.x = Math.PI - currLidAngle

    // 机身
    const baseBody = new THREE.Group()
    const basePanel = new THREE.Mesh(
      new THREE.BoxGeometry(p.width, basePanelHeight, p.depth),
      matBody,
    )
    basePanel.position.y = basePanelHeight / 2
    baseBody.add(basePanel)

    // 键盘
    const keyboard = new THREE.Mesh(
      new THREE.BoxGeometry(p.width * 0.8, screenHeight, p.depth * 0.5),
      keyboardMaterials,
    )
    keyboard.position.y = basePanelHeight + screenHeight / 2
    keyboard.position.z = -p.depth * 0.2
    baseBody.add(keyboard)

    // 触控板
    const touchPad = new THREE.Mesh(
      new THREE.BoxGeometry(p.width * 0.4, screenHeight, p.depth * 0.4),
      matTouchPad,
    )
    touchPad.position.y = basePanelHeight + screenHeight / 2
    touchPad.position.z = p.depth * 0.28
    baseBody.add(touchPad)

    const body = new THREE.Group()
    body.add(baseBody, pivot)
    group.add(body)
  },
}
