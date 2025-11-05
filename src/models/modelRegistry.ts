// src/three/modelRegistry.ts
import * as THREE from 'three'
import type { DeskObject, DeskObjectType, MonitorObject } from '@/models/deskObject'

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
        widthA: 1.2,
        depthA: 0.6,
        widthB: 0.8,
        depthB: 0.5,
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
      const y = height - 0.02 // 桌板中心Y高度

      // === 主桌面 ===
      const topA = new THREE.Mesh(new THREE.BoxGeometry(widthA, 0.04, depthA), mat)
      // 以直角点为基准，主桌向 X 轴正方向延伸
      topA.position.set(widthA / 2, y, depthA / 2)
      group.add(topA)

      // === 副桌面 ===
      const topB = new THREE.Mesh(new THREE.BoxGeometry(depthB, 0.04, widthB), mat)
      // 以直角点为基准，副桌向 Z 轴正方向延伸
      topB.position.set(depthB / 2, y, widthB / 2)
      group.add(topB)

      // === 桌腿 ===
      const legThickness = 0.04 // 立板厚度
      const legHeight = height - 0.04
      const yLegMid = (height - 0.04) / 2

      // 主桌右端整块腿（与主桌宽度一致）
      const legA = new THREE.Mesh(new THREE.BoxGeometry(legThickness, legHeight, depthA), mat)
      legA.position.set(widthA - legThickness / 2, yLegMid, depthA / 2)
      group.add(legA)

      // 副桌远端整块腿（与副桌宽度一致）
      const legB = new THREE.Mesh(new THREE.BoxGeometry(depthB, legHeight, legThickness), mat)
      legB.position.set(depthB / 2, yLegMid, widthB - legThickness / 2)
      group.add(legB)

      // 转角支撑板（可选）
      const legCorner = new THREE.Mesh(
        new THREE.BoxGeometry(legThickness, legHeight, legThickness),
        mat,
      )
      legCorner.position.set(legThickness / 2, yLegMid, legThickness / 2)
      group.add(legCorner)
    },
  },

  // --- MONITOR ---
  monitor: {
    createData: (id, yPos) => ({
      id,
      type: 'monitor',
      position: { x: 0, y: yPos, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      mountedToId: null,
      params: {
        width: 0.54, // 屏幕整体宽度
        height: 0.32, // 屏幕整体高度
        depth: 0.03, // 屏幕厚度
        color: '#333333', // 外壳颜色

        baseWidth: 0.243,
        baseDepth: 0.18,
        baseHeight: 0.01,

        standWidth: 0.102,
        standDepth: 0.027,
        standHeight: 0.34,

        standRotationY: 0, // 支架旋转（Y轴）
        screenTiltX: 0, // 屏幕俯仰角（X轴）
        screenSlideY: -0.05, // 屏幕上下滑动距离（顶部为0）
        screenRotateZ: 0,

        curvatureR: 0,

        isMountable: true,
      },
    }),

    buildGeometry: (group, data) => {
      const {
        width,
        height,
        depth,
        color,
        baseWidth,
        baseDepth,
        baseHeight,
        standWidth,
        standDepth,
        standHeight,
        standRotationY,
        screenSlideY,
        screenTiltX,
        screenRotateZ,
        curvatureR,
      } = data.params as MonitorObject['params']

      const border = 0.015
      const pivotBlockDepth = 0.04
      const pivotBlockHeight = 0.04
      const panelSubdivisions = 90

      const matBody = new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.1 })
      const matPanel = new THREE.MeshStandardMaterial({
        color: 0x111111,
        roughness: 0.2,
        metalness: 0.8,
      })

      while (group.children.length) group.remove(group.children[0]!)

      // === 底座 ===
      const base = new THREE.Mesh(new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth), matBody)
      base.position.y = baseHeight / 2
      group.add(base)

      // === 支架 ===
      const stand = new THREE.Mesh(
        new THREE.BoxGeometry(standWidth, standHeight, standDepth),
        matBody,
      )
      stand.position.y = baseHeight + standHeight / 2
      stand.position.z = -baseDepth / 2 + standDepth / 2 + 0.02
      stand.rotation.y = standRotationY
      group.add(stand)

      // === 滑动组（带动pivot和屏幕整体移动）===
      const slideGroup = new THREE.Group()
      slideGroup.position.set(0, baseHeight + standHeight + screenSlideY, stand.position.z)
      slideGroup.rotation.y = standRotationY
      group.add(slideGroup)

      // === pivot组 ===
      const pivotGroup = new THREE.Group()
      slideGroup.add(pivotGroup)

      // pivot连接块
      const pivotBlock = new THREE.Mesh(
        new THREE.BoxGeometry(standWidth * 0.7, pivotBlockHeight, pivotBlockDepth),
        matBody,
      )
      pivotBlock.position.set(0, 0, -depth / 2 - pivotBlockDepth / 2)
      pivotGroup.add(pivotBlock)

      // === 屏幕旋转组（横竖屏）===
      const rotateGroup = new THREE.Group()
      rotateGroup.rotation.z = screenRotateZ
      pivotGroup.add(rotateGroup)

      // === 屏幕组（俯仰）===
      const screenGroup = new THREE.Group()
      // screenGroup.position.set(
      //   0,
      //   -pivotBlockHeight / 2,
      //   pivotBlock.position.z + pivotBlockDepth / 2 + depth / 2,
      // )
      screenGroup.rotation.x = screenTiltX
      rotateGroup.add(screenGroup)
      pivotGroup.position.set(0, 0, pivotBlockDepth + standDepth)

      // === 曲面屏生成 ===
      const widthSeg = panelSubdivisions
      const heightSeg = 1

      const deformGeometry = (geo: THREE.BufferGeometry) => {
        const pos = geo.attributes.position!
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i)
          if (curvatureR > 0.1) {
            const theta = x / curvatureR
            const cosT = Math.cos(theta)
            const sinT = Math.sin(theta)
            const z0 = pos.getZ(i)
            pos.setX(i, curvatureR * sinT)
            pos.setZ(i, z0 + curvatureR * (1 - cosT))
          }
        }
        pos.needsUpdate = true
        geo.computeVertexNormals()
      }

      // 面板
      const panelGeo = new THREE.BoxGeometry(
        width - 2 * border,
        height - 2 * border,
        0.002,
        widthSeg,
        heightSeg,
        1,
      )
      deformGeometry(panelGeo)
      const panel = new THREE.Mesh(panelGeo, matPanel)
      panel.position.z = depth / 2 - 0.002 / 2 + 0.001
      screenGroup.add(panel)

      // 外框（可稍微前移一点）
      const frameGeo = new THREE.BoxGeometry(width, height, depth, widthSeg, heightSeg, 1)
      deformGeometry(frameGeo)
      const frame = new THREE.Mesh(frameGeo, matBody)
      screenGroup.add(frame)

      group.position.y = 0
    },
  },

  // --- KEYBOARD ---
  'keyboard-108': {
    createData: (id, yPos) => ({
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
    buildGeometry: (group, data) => {
      const { width, height, depth, isBlack } = data.params as DeskObject['params'] & {
        width: number
        height: number
        depth: number
        isBlack: boolean
      }
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
  },

  'keyboard-87': {
    createData: (id, yPos) => ({
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
    buildGeometry: (group, data) => {
      const { width, height, depth, isBlack } = data.params as DeskObject['params'] & {
        width: number
        height: number
        depth: number
        isBlack: boolean
      }
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
  },

  'keyboard-68': {
    createData: (id, yPos) => ({
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
    buildGeometry: (group, data) => {
      const { width, height, depth, isBlack } = data.params as DeskObject['params'] & {
        width: number
        height: number
        depth: number
        isBlack: boolean
      }
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
  },

  'keyboard-60': {
    createData: (id, yPos) => ({
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
    buildGeometry: (group, data) => {
      const { width, height, depth, isBlack } = data.params as DeskObject['params'] & {
        width: number
        height: number
        depth: number
        isBlack: boolean
      }
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
