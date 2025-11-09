import * as THREE from 'three'
import type { BaseObject } from '../deskObject'
const textureLoader = new THREE.TextureLoader()

export interface KeyboardParams {
  name: string | ''
  width: number
  height: number
  depth: number
  isBlack: boolean
}
// 【修改】 将 KeyboardObject 的 type 扩展为联合类型
export interface KeyboardObject extends BaseObject {
  type: 'keyboard-108' | 'keyboard-87' | 'keyboard-68' | 'keyboard-60'
  params: KeyboardParams
}

// === 纹理缓存 ===
let cachedKeyboard108WhiteTexture: THREE.Texture | null = null
let cachedKeyboard108BlackTexture: THREE.Texture | null = null
let cachedKeyboard87WhiteTexture: THREE.Texture | null = null
let cachedKeyboard87BlackTexture: THREE.Texture | null = null
let cachedKeyboard68WhiteTexture: THREE.Texture | null = null
let cachedKeyboard68BlackTexture: THREE.Texture | null = null
let cachedKeyboard60WhiteTexture: THREE.Texture | null = null
let cachedKeyboard60BlackTexture: THREE.Texture | null = null

export const keyboard108Model = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'keyboard-108',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      width: 0.44,
      height: 0.02,
      depth: 0.14,
      isBlack: true,
    },
  }),
  buildGeometry: (group: THREE.Group, data: KeyboardObject) => {
    if (!cachedKeyboard108WhiteTexture) {
      cachedKeyboard108WhiteTexture = textureLoader.load('/textures/keyboard/108w.jpg')
      cachedKeyboard108WhiteTexture.colorSpace = THREE.SRGBColorSpace
    }
    if (!cachedKeyboard108BlackTexture) {
      cachedKeyboard108BlackTexture = textureLoader.load('/textures/keyboard/108b.jpg')
      cachedKeyboard108BlackTexture.colorSpace = THREE.SRGBColorSpace
    }

    const p = data.params
    // 1. 侧面材质 (保持不变)
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: p.isBlack ? 0x000000 : 0xffffff,
      metalness: 0.8,
      roughness: 0.4,
    })

    // 2. 【修改】 顶部贴图材质
    const topTexture = p.isBlack ? cachedKeyboard108BlackTexture! : cachedKeyboard108WhiteTexture!
    const textureMaterial = new THREE.MeshStandardMaterial({
      map: topTexture,
      metalness: 0.2,
      roughness: 0.7,
    })

    // 3. 材质数组 (保持不变)
    const materials = [
      metalMaterial, // 右
      metalMaterial, // 左
      textureMaterial, // 顶
      metalMaterial, // 底
      metalMaterial, // 前
      metalMaterial, // 后
    ]

    // 4. Mesh (保持不变)
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(p.width, p.height, p.depth), materials)
    mesh.position.y = p.height / 2
    group.add(mesh)
  },
}

export const keyboard87Model = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'keyboard-87',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      width: 0.36,
      height: 0.02,
      depth: 0.14,
      isBlack: true,
    },
  }),
  buildGeometry: (group: THREE.Group, data: KeyboardObject) => {
    if (!cachedKeyboard87WhiteTexture) {
      cachedKeyboard87WhiteTexture = textureLoader.load('/textures/keyboard/87w.jpg')
      cachedKeyboard87WhiteTexture.colorSpace = THREE.SRGBColorSpace
    }
    if (!cachedKeyboard87BlackTexture) {
      cachedKeyboard87BlackTexture = textureLoader.load('/textures/keyboard/87b.jpg')
      cachedKeyboard87BlackTexture.colorSpace = THREE.SRGBColorSpace
    }

    const p = data.params
    // 1. 侧面材质 (保持不变)
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: p.isBlack ? 0x000000 : 0xffffff,
      metalness: 0.8,
      roughness: 0.4,
    })

    // 2. 【修改】 顶部贴图材质
    const topTexture = p.isBlack ? cachedKeyboard87BlackTexture! : cachedKeyboard87WhiteTexture!
    const textureMaterial = new THREE.MeshStandardMaterial({
      map: topTexture,
      metalness: 0.2,
      roughness: 0.7,
    })

    // 3. 材质数组 (保持不变)
    const materials = [
      metalMaterial, // 右
      metalMaterial, // 左
      textureMaterial, // 顶
      metalMaterial, // 底
      metalMaterial, // 前
      metalMaterial, // 后
    ]

    // 4. Mesh (保持不变)
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(p.width, p.height, p.depth), materials)
    mesh.position.y = p.height / 2
    group.add(mesh)
  },
}

export const keyboard68Model = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'keyboard-68',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      width: 0.32,
      height: 0.02,
      depth: 0.11,
      isBlack: true,
    },
  }),
  buildGeometry: (group: THREE.Group, data: KeyboardObject) => {
    if (!cachedKeyboard68WhiteTexture) {
      cachedKeyboard68WhiteTexture = textureLoader.load('/textures/keyboard/68w.jpg')
      cachedKeyboard68WhiteTexture.colorSpace = THREE.SRGBColorSpace
    }
    if (!cachedKeyboard68BlackTexture) {
      cachedKeyboard68BlackTexture = textureLoader.load('/textures/keyboard/68b.jpg')
      cachedKeyboard68BlackTexture.colorSpace = THREE.SRGBColorSpace
    }

    const p = data.params
    // 1. 侧面材质 (保持不变)
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: p.isBlack ? 0x000000 : 0xffffff,
      metalness: 0.8,
      roughness: 0.4,
    })

    // 2. 【修改】 顶部贴图材质
    const topTexture = p.isBlack ? cachedKeyboard68BlackTexture! : cachedKeyboard68WhiteTexture!
    const textureMaterial = new THREE.MeshStandardMaterial({
      map: topTexture,
      metalness: 0.2,
      roughness: 0.7,
    })

    // 3. 材质数组 (保持不变)
    const materials = [
      metalMaterial, // 右
      metalMaterial, // 左
      textureMaterial, // 顶
      metalMaterial, // 底
      metalMaterial, // 前
      metalMaterial, // 后
    ]

    // 4. Mesh (保持不变)
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(p.width, p.height, p.depth), materials)
    mesh.position.y = p.height / 2
    group.add(mesh)
  },
}

export const keyboard60Model = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'keyboard-60',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      width: 0.3,
      height: 0.02,
      depth: 0.11,
      isBlack: true,
    },
  }),
  buildGeometry: (group: THREE.Group, data: KeyboardObject) => {
    if (!cachedKeyboard60WhiteTexture) {
      cachedKeyboard60WhiteTexture = textureLoader.load('/textures/keyboard/60w.jpg')
      cachedKeyboard60WhiteTexture.colorSpace = THREE.SRGBColorSpace
    }
    if (!cachedKeyboard60BlackTexture) {
      cachedKeyboard60BlackTexture = textureLoader.load('/textures/keyboard/60b.jpg')
      cachedKeyboard60BlackTexture.colorSpace = THREE.SRGBColorSpace
    }

    const p = data.params
    // 1. 侧面材质 (保持不变)
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: p.isBlack ? 0x000000 : 0xffffff,
      metalness: 0.8,
      roughness: 0.4,
    })

    // 2. 【修改】 顶部贴图材质
    const topTexture = p.isBlack ? cachedKeyboard60BlackTexture! : cachedKeyboard60WhiteTexture!
    const textureMaterial = new THREE.MeshStandardMaterial({
      map: topTexture,
      metalness: 0.2,
      roughness: 0.7,
    })

    // 3. 材质数组 (保持不变)
    const materials = [
      metalMaterial, // 右
      metalMaterial, // 左
      textureMaterial, // 顶
      metalMaterial, // 底
      metalMaterial, // 前
      metalMaterial, // 后
    ]

    // 4. Mesh (保持不变)
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(p.width, p.height, p.depth), materials)
    mesh.position.y = p.height / 2
    group.add(mesh)
  },
}
