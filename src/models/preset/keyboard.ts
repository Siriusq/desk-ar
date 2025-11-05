import * as THREE from 'three'
import type { KeyboardObject } from '../deskObject'
const textureLoader = new THREE.TextureLoader()

export const keyboard108Modal = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'keyboard-108',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      width: 0.44,
      height: 0.02,
      depth: 0.14,
      isBlack: true,
    },
  }),
  buildGeometry: (group: THREE.Group, data: KeyboardObject) => {
    const { width, height, depth, isBlack } = data.params as KeyboardObject['params']
    // 1. 侧面材质 (保持不变)
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: isBlack ? 0x000000 : 0xffffff,
      metalness: 0.8,
      roughness: 0.4,
    })

    // 2. 【修改】 顶部贴图材质
    const textureMap = isBlack ? '/textures/keyboard/108b.jpg' : '/textures/keyboard/108w.jpg'
    // 使用从 params 传来的 textureMap 路径
    const topTexture = textureLoader.load(textureMap)
    topTexture.colorSpace = THREE.SRGBColorSpace
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
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), materials)
    mesh.position.y = height / 2
    group.add(mesh)
  },
}

export const keyboard87Modal = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'keyboard-87',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      width: 0.36,
      height: 0.02,
      depth: 0.14,
      isBlack: true,
    },
  }),
  buildGeometry: (group: THREE.Group, data: KeyboardObject) => {
    const { width, height, depth, isBlack } = data.params as KeyboardObject['params']
    // 1. 侧面材质 (保持不变)
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: isBlack ? 0x000000 : 0xffffff,
      metalness: 0.8,
      roughness: 0.4,
    })

    // 2. 【修改】 顶部贴图材质
    const textureMap = isBlack ? '/textures/keyboard/87b.jpg' : '/textures/keyboard/87w.jpg'
    // 使用从 params 传来的 textureMap 路径
    const topTexture = textureLoader.load(textureMap)
    topTexture.colorSpace = THREE.SRGBColorSpace
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
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), materials)
    mesh.position.y = height / 2
    group.add(mesh)
  },
}

export const keyboard68Modal = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'keyboard-68',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      width: 0.32,
      height: 0.02,
      depth: 0.11,
      isBlack: true,
    },
  }),
  buildGeometry: (group: THREE.Group, data: KeyboardObject) => {
    const { width, height, depth, isBlack } = data.params as KeyboardObject['params']
    // 1. 侧面材质 (保持不变)
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: isBlack ? 0x000000 : 0xffffff,
      metalness: 0.8,
      roughness: 0.4,
    })

    // 2. 【修改】 顶部贴图材质
    const textureMap = isBlack ? '/textures/keyboard/68b.jpg' : '/textures/keyboard/68w.jpg'
    // 使用从 params 传来的 textureMap 路径
    const topTexture = textureLoader.load(textureMap)
    topTexture.colorSpace = THREE.SRGBColorSpace
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
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), materials)
    mesh.position.y = height / 2
    group.add(mesh)
  },
}

export const keyboard60Modal = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'keyboard-60',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      width: 0.3,
      height: 0.02,
      depth: 0.11,
      isBlack: true,
    },
  }),
  buildGeometry: (group: THREE.Group, data: KeyboardObject) => {
    const { width, height, depth, isBlack } = data.params as KeyboardObject['params']
    // 1. 侧面材质 (保持不变)
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: isBlack ? 0x000000 : 0xffffff,
      metalness: 0.8,
      roughness: 0.4,
    })

    // 2. 【修改】 顶部贴图材质
    const textureMap = isBlack ? '/textures/keyboard/60b.jpg' : '/textures/keyboard/60w.jpg'
    // 使用从 params 传来的 textureMap 路径
    const topTexture = textureLoader.load(textureMap)
    topTexture.colorSpace = THREE.SRGBColorSpace
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
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), materials)
    mesh.position.y = height / 2
    group.add(mesh)
  },
}
