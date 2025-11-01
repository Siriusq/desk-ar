// src/three/modelRegistry.ts
import * as THREE from 'three'
import type { DeskObject, DeskObjectType } from '@/types/deskObject'

// 1. 定义贴图加载器（因为它只在这里被使用）
const textureLoader = new THREE.TextureLoader()

// 2. 定义模型“配方”的接口
interface ModelDefinition {
  /**
   * 创建此对象的数据 (用于 addObject)
   */
  createData: (id: string, yPos: number) => DeskObject

  /**
   * 构建此对象的 3D 几何体 (用于 createObject3D)
   * 它会接收一个空的 Group，并应在其中填充 3D 对象
   */
  buildGeometry: (group: THREE.Group, data: DeskObject) => void
}

// 3. 创建模型“注册表”
// 我们将把 objectFactory.ts 中 switch 的所有逻辑移到这里
export const modelRegistry: Record<DeskObjectType, ModelDefinition> = {
  // --- DESK-RECT ---
  'desk-rect': {
    createData: (id) => ({
      id: id,
      type: 'desk-rect',
      position: { x: 0, y: 0, z: 0 }, // 桌子总是在 y=0
      rotation: { x: 0, y: 0, z: 0 },
      mountedToId: null,
      params: {
        width: 1.2,
        depth: 0.6,
        height: 0.75,
        color: '#8B4513',
      },
    }),
    buildGeometry: (group, data) => {
      const { width, depth, height, color } = data.params as DeskObject['params'] & {
        width: number
        depth: number
        height: number
        color: string
      }
      const mat = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.7,
        metalness: 0.0,
      })
      const top = new THREE.Mesh(new THREE.BoxGeometry(width, 0.04, depth), mat)
      top.position.y = height - 0.02
      group.add(top)
      // 腿部逻辑
      if (true) {
        const legGeom = new THREE.CylinderGeometry(0.03, 0.03, height - 0.04, 16)
        ;[
          [width / 2 - 0.05, depth / 2 - 0.05],
          [-width / 2 + 0.05, depth / 2 - 0.05],
          [width / 2 - 0.05, -depth / 2 + 0.05],
          [-width / 2 + 0.05, -depth / 2 + 0.05],
        ].forEach((p) => {
          const leg = new THREE.Mesh(legGeom, mat)
          leg.position.set(p[0] as number, (height - 0.04) / 2, p[1] as number)
          group.add(leg)
        })
      }
    },
  },

  // --- DESK-L ---
  'desk-l': {
    createData: (id) => ({
      id: id,
      type: 'desk-l',
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      mountedToId: null,
      params: {
        widthA: 1.5,
        depthA: 0.7,
        widthB: 1.5,
        depthB: 0.7,
        height: 0.75,
        color: '#8B4513',
      },
    }),
    buildGeometry: (group, data) => {
      const { widthA, depthA, widthB, depthB, height, color } =
        data.params as DeskObject['params'] & {
          widthA: number
          depthA: number
          widthB: number
          depthB: number
          height: number
          color: string
        }
      const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.7 })
      const shape = new THREE.Shape()
      shape.moveTo(-widthA / 2, -depthA / 2)
      shape.lineTo(widthA / 2, -depthA / 2)
      shape.lineTo(widthA / 2, depthA / 2 - depthB)
      shape.lineTo(widthA / 2 - widthB, depthA / 2 - depthB)
      shape.lineTo(widthA / 2 - widthB, depthA / 2)
      shape.lineTo(-widthA / 2, depthA / 2)
      shape.closePath()
      const extrudeSettings = { depth: 0.04, bevelEnabled: false }
      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
      const top = new THREE.Mesh(geometry, mat)
      top.rotation.x = -Math.PI / 2
      top.position.y = height
      group.add(top)
      // 腿部逻辑
      if (true) {
        /* simplified legs */
      }
    },
  },

  // --- MONITOR ---
  monitor: {
    createData: (id, yPos) => ({
      id: id,
      type: 'monitor',
      position: { x: 0, y: yPos, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      mountedToId: null,
      params: {
        width: 0.55,
        height: 0.32,
        color: '#222222',
        isMountable: true,
      },
    }),
    buildGeometry: (group, data) => {
      const { width, height, color } = data.params as DeskObject['params'] & {
        width: number
        height: number
        color: string
      }
      const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.7 })
      const screen = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.01), mat)
      screen.position.y = height / 2 + 0.1
      const standBase = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.01, 0.2), mat)
      const standPole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.1), mat)
      standPole.position.y = 0.05
      group.add(screen, standBase, standPole)
    },
  },

  // --- KEYBOARD ---
  keyboard: {
    createData: (id, yPos) => ({
      id: id,
      type: 'keyboard',
      position: { x: 0, y: yPos, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      mountedToId: null,
      params: {
        width: 0.44,
        height: 0.02,
        depth: 0.14,
        color: '#333333',
      },
    }),
    buildGeometry: (group, data) => {
      const { width, height, depth, color } = data.params as DeskObject['params'] & {
        width: number
        height: number
        depth: number
        color: string
      }
      // 贴图逻辑
      const metalMaterial = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.8,
        roughness: 0.4,
      })
      const topTexture = textureLoader.load('/textures/keyboard-vector-diffuse-1-HD.jpg')
      topTexture.colorSpace = THREE.SRGBColorSpace
      const textureMaterial = new THREE.MeshStandardMaterial({
        map: topTexture,
        metalness: 0.2,
        roughness: 0.7,
      })
      const materials = [
        metalMaterial, // 右
        metalMaterial, // 左
        textureMaterial, // 顶
        metalMaterial, // 底
        metalMaterial, // 前
        metalMaterial, // 后
      ]
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), materials)
      mesh.position.y = height / 2
      group.add(mesh)
    },
  },

  // --- MOUSE ---
  mouse: {
    createData: (id, yPos) => ({
      id: id,
      type: 'mouse',
      position: { x: 0, y: yPos, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      mountedToId: null,
      params: {
        width: 0.06,
        height: 0.03,
        depth: 0.1,
        color: '#333333',
      },
    }),
    buildGeometry: (group, data) => {
      const { width, height, depth, color } = data.params as DeskObject['params'] & {
        width: number
        height: number
        depth: number
        color: string
      }
      const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.7 })
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat)
      mesh.position.y = height / 2
      group.add(mesh)
    },
  },

  // --- IPHONE ---
  iphone: {
    createData: (id, yPos) => ({
      id: id,
      type: 'iphone',
      position: { x: 0, y: yPos, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      mountedToId: null,
      params: {
        width: 0.07,
        height: 0.008,
        depth: 0.14,
        color: '#E0E0E0',
        isMountable: true,
      },
    }),
    buildGeometry: (group, data) => {
      const { width, height, depth, color } = data.params as DeskObject['params'] & {
        width: number
        height: number
        depth: number
        color: string
      }
      const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.7 })
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat)
      mesh.position.y = height / 2
      group.add(mesh)
    },
  },

  // --- MACBOOK ---
  macbook: {
    createData: (id, yPos) => ({
      id: id,
      type: 'macbook',
      position: { x: 0, y: yPos, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      mountedToId: null,
      params: {
        width: 0.3,
        height: 0.015,
        depth: 0.21,
        color: '#CCCCCC',
        isMountable: true,
      },
    }),
    buildGeometry: (group, data) => {
      const { width, height, depth, color } = data.params as DeskObject['params'] & {
        width: number
        height: number
        depth: number
        color: string
      }
      const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.7 })
      const body = new THREE.Group()
      const base = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat)
      const screen = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat)
      screen.rotation.x = Math.PI / 1.5
      screen.position.z = -depth / 2
      screen.position.y = height / 2
      body.add(base, screen)
      body.position.y = height / 2
      group.add(body)
    },
  },

  // --- UNIVERSAL-STAND ---
  'universal-stand': {
    createData: (id, yPos) => ({
      id: id,
      type: 'universal-stand',
      position: { x: 0, y: yPos, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      mountedToId: null,
      params: {
        baseSize: 0.25,
        poleHeight: 0.4,
        armLength: 0.3,
        color: '#555555',
        mountedObjectId: null,
      },
    }),
    buildGeometry: (group, data) => {
      const { baseSize, poleHeight, armLength, color } = data.params as DeskObject['params'] & {
        baseSize: number
        poleHeight: number
        armLength: number
        color: string
      }
      const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.7 })
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(baseSize / 2, baseSize / 2, 0.02, 32),
        mat,
      )
      base.position.y = 0.01
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, poleHeight, 16), mat)
      pole.position.y = poleHeight / 2 + 0.02
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, armLength, 16), mat)
      arm.rotation.z = Math.PI / 2
      arm.position.x = armLength / 2
      arm.position.y = poleHeight + 0.02
      group.add(base, pole, arm)
    },
  },

  // --- CUSTOM-BOX ---
  'custom-box': {
    createData: (id, yPos) => ({
      id: id,
      type: 'custom-box',
      position: { x: 0, y: yPos, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      mountedToId: null,
      params: {
        width: 0.2,
        height: 0.4,
        depth: 0.5,
        color: '#BEBEBE',
      },
    }),
    buildGeometry: (group, data) => {
      const { width, height, depth, color } = data.params as DeskObject['params'] & {
        width: number
        height: number
        depth: number
        color: string
      }
      const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.7 })
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat)
      mesh.position.y = height / 2
      group.add(mesh)
    },
  },
}
