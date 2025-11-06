import * as THREE from 'three'
import type { BaseObject } from '../deskObject'
const textureLoader = new THREE.TextureLoader()

export interface MacbookParams {
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

export const macbookModal = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'macbook',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      width: 0.3,
      height: 0.015,
      depth: 0.21,
      lidAngle: 0,
      color: '#CCCCCC',
      isMountable: true,
    },
  }),
  buildGeometry: (group: THREE.Group, data: MacbookObject) => {
    const p = data.params
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
    const keyboardTextureMap = '/textures/laptop/macbook-keyboard.jpg'
    // 使用从 params 传来的 textureMap 路径
    const keyboardTexture = textureLoader.load(keyboardTextureMap)
    keyboardTexture.colorSpace = THREE.SRGBColorSpace
    const keyboardTextureMaterial = new THREE.MeshStandardMaterial({
      map: keyboardTexture,
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
