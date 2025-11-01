import { saveState } from '@/composables/useHistory'
import { isDeskInScene, objects, sceneObjects, selectedObjectId } from '@/composables/useObjects'
import { expandedObjectId } from '@/composables/useUIState'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import type { DeskObject, DeskObjectType } from '@/types/deskObject'
import { rebuildSceneFromData, scene } from './sceneManager'

// 【新增】 创建一个全局共享的 loader 实例
const gltfLoader = new GLTFLoader()
// 【新增】 创建一个全局共享的贴图加载器
const textureLoader = new THREE.TextureLoader()

// 【新增】 用于从 useModelImporter 调用的函数
export const addImportedObject = (fileName: string, dataUrl: string) => {
  const desk = objects.value.find((o) => o.type.startsWith('desk-'))
  let yPos = 0
  if (desk && (desk.type === 'desk-rect' || desk.type === 'desk-l')) {
    yPos = desk.params.height + (desk.position.y || 0)
  }

  // 1. 创建数据对象
  const data: DeskObject = {
    id: THREE.MathUtils.generateUUID(),
    type: 'imported-model',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      fileName: fileName,
      dataUrl: dataUrl,
      color: '#FFFFFF', // 占位符颜色，满足 TS 类型
    },
  }

  // 2. 更新数据层
  objects.value.push(data)

  // 3. 更新 UI 和历史记录
  selectedObjectId.value = data.id
  expandedObjectId.value = data.id
  saveState() // 保存状态

  // 4. 【重要】 触发场景重建
  // GLTFLoader 是异步的，rebuild 是最稳妥的集成方式
  rebuildSceneFromData()
}

// 辅助函数：根据数据将3D对象添加到场景
export const add3DObjectToScene = (obj3D: THREE.Group, data: DeskObject) => {
  if (!scene) return
  sceneObjects.set(data.id, obj3D)

  // 查找桌子 3D 对象
  const deskData = objects.value.find((o) => o.type.startsWith('desk-'))
  const desk3D = deskData ? sceneObjects.get(deskData.id) : undefined

  if (data.mountedToId) {
    const stand3D = sceneObjects.get(data.mountedToId)
    if (stand3D) {
      // (挂载逻辑将在 mountObject 中处理，这里暂时跳过)
      // (或者，如果 createObject3D 已经处理了挂载，这里就更简单)
    }
  } else if (!data.type.startsWith('desk-')) {
    // 如果不是桌子，尝试添加到桌子；如果桌子不存在，添加到场景
    if (desk3D) desk3D.add(obj3D)
    else scene.add(obj3D)
  } else {
    // 如果是桌子，直接添加到场景
    scene.add(obj3D)
    if (obj3D.userData) obj3D.userData.isDesk = true
  }
}

// 【修改】 addObject 现在是强类型，并且会创建 3D 对象
export const addObject = (type: DeskObjectType) => {
  if (type.startsWith('desk-') && isDeskInScene.value) return
  const desk = objects.value.find((o) => o.type.startsWith('desk-'))
  // 【修复】 添加类型守卫
  let yPos = 0
  if (desk && (desk.type === 'desk-rect' || desk.type === 'desk-l')) {
    yPos = desk.params.height + (desk.position.y || 0) // 类型安全
  }

  let data: DeskObject
  // TypeScript 现在会根据 case 自动推断 data 的类型
  switch (type) {
    case 'desk-rect':
      data = {
        id: THREE.MathUtils.generateUUID(),
        type: 'desk-rect',
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        mountedToId: null,
        params: {
          width: 1.2,
          depth: 0.6,
          height: 0.75,
          color: '#8B4513',
        },
      }
      break
    case 'desk-l':
      data = {
        id: THREE.MathUtils.generateUUID(),
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
      }
      break
    case 'monitor':
      data = {
        id: THREE.MathUtils.generateUUID(),
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
      }
      break
    case 'macbook':
      data = {
        id: THREE.MathUtils.generateUUID(),
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
      }
      break
    case 'keyboard':
      data = {
        id: THREE.MathUtils.generateUUID(),
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
      }
      break
    case 'mouse':
      data = {
        id: THREE.MathUtils.generateUUID(),
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
      }
      break
    case 'iphone':
      data = {
        id: THREE.MathUtils.generateUUID(),
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
      }
      break
    case 'universal-stand':
      data = {
        id: THREE.MathUtils.generateUUID(),
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
      }
      break
    case 'custom-box':
      data = {
        id: THREE.MathUtils.generateUUID(),
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
      }
      break
  }

  // 1. 更新数据层
  objects.value.push(data)

  // 2. 【优化】立即创建并添加 3D 视图
  const obj3D = createObject3D(data)
  if (obj3D) {
    add3DObjectToScene(obj3D, data)
  }

  // 3. 更新 UI 和历史记录
  selectedObjectId.value = data.id
  expandedObjectId.value = data.id
  saveState() // 保存状态
}

// 【新增】 辅助函数：彻底销毁一个 3D 对象
export const disposeObject3D = (obj3D: THREE.Object3D) => {
  if (!obj3D) return
  obj3D.parent?.remove(obj3D)
  obj3D.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh
      mesh.geometry?.dispose()
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((mat: THREE.Material) => mat.dispose())
        } else {
          mesh.material.dispose()
        }
      }
    }
  })
}

// 【新增】 辅助函数：用新数据替换一个 3D 对象
export const replaceObject3D = (data: DeskObject) => {
  const oldObj3D = sceneObjects.get(data.id)
  if (oldObj3D) {
    disposeObject3D(oldObj3D)
  }

  const newObj3D = createObject3D(data)
  if (newObj3D) {
    add3DObjectToScene(newObj3D, data)
    return newObj3D // 返回新对象，以便 transformControls 可以附加
  }
  return null
}

// 【修改】 createObject3D 现在是强类型
export const createObject3D = (data: DeskObject): THREE.Group | null => {
  const group = new THREE.Group()
  group.userData.id = data.id

  // 【修改】 将 mat 的创建移入 switch
  // 因为 'imported-model' 会自带材质
  let mat: THREE.MeshStandardMaterial

  switch (data.type) {
    case 'desk-rect': {
      mat = new THREE.MeshStandardMaterial({
        color: data.params.color,
        roughness: 0.7,
        metalness: 0.0,
      })
      const { width, depth, height } = data.params
      const top = new THREE.Mesh(new THREE.BoxGeometry(width, 0.04, depth), mat)
      top.position.y = height - 0.02
      group.add(top)
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
      break
    }
    case 'desk-l': {
      mat = new THREE.MeshStandardMaterial({ color: data.params.color, roughness: 0.7 })
      const { widthA, depthA, widthB, depthB, height } = data.params
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
      if (true) {
        /* simplified legs */
      }
      break
    }
    case 'monitor': {
      mat = new THREE.MeshStandardMaterial({ color: data.params.color, roughness: 0.7 })
      const { width, height } = data.params
      const screen = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.01), mat)
      screen.position.y = height / 2 + 0.1
      const standBase = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.01, 0.2), mat)
      const standPole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.1), mat)
      standPole.position.y = 0.05
      group.add(screen, standBase, standPole)
      break
    }
    case 'macbook': {
      mat = new THREE.MeshStandardMaterial({ color: data.params.color, roughness: 0.7 })
      const { width, height, depth } = data.params
      const body = new THREE.Group()
      const base = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat)
      const screen = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat)
      screen.rotation.x = Math.PI / 1.5
      screen.position.z = -depth / 2
      screen.position.y = height / 2
      body.add(base, screen)
      body.position.y = height / 2
      group.add(body)
      break
    }
    case 'universal-stand': {
      mat = new THREE.MeshStandardMaterial({ color: data.params.color, roughness: 0.7 })
      const { baseSize, poleHeight, armLength } = data.params
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
      break
    }
    case 'custom-box': {
      mat = new THREE.MeshStandardMaterial({ color: data.params.color, roughness: 0.7 })
      const { width, height, depth } = data.params
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat)
      mesh.position.y = height / 2
      group.add(mesh)
      break
    }
    case 'keyboard': {
      const { width, height, depth, color } = data.params

      // 1. 为侧面和底部创建金属材质
      //    (使用 data.params.color 作为金属颜色)
      const metalMaterial = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.8, // 表现为金属
        roughness: 0.4, // 轻微粗糙的金属
      })

      // 2. 为顶部创建贴图材质
      //    (确保贴图在 /public/textures/keyboard_layout.jpg)
      const topTexture = textureLoader.load('/textures/keyboard-vector-diffuse-1-HD.jpg')
      topTexture.colorSpace = THREE.SRGBColorSpace // 确保颜色正确
      const textureMaterial = new THREE.MeshStandardMaterial({
        map: topTexture,
        metalness: 0.2, // 顶部通常是塑料
        roughness: 0.7,
      })

      // 3. 按 BoxGeometry 的顺序创建材质数组
      //    顺序: [右 (px), 左 (nx), 顶 (py), 底 (ny), 前 (pz), 后 (nz)]
      const materials = [
        metalMaterial, // 右
        metalMaterial, // 左
        textureMaterial, // 顶
        metalMaterial, // 底
        metalMaterial, // 前
        metalMaterial, // 后
      ]

      // 4. 创建使用材质数组的 Mesh
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), materials)
      mesh.position.y = height / 2
      group.add(mesh)
      break
    }
    case 'mouse': {
      mat = new THREE.MeshStandardMaterial({ color: data.params.color, roughness: 0.7 })
      const { width, height, depth } = data.params
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat)
      mesh.position.y = height / 2
      group.add(mesh)
      break
    }
    case 'iphone': {
      mat = new THREE.MeshStandardMaterial({ color: data.params.color, roughness: 0.7 })
      const { width, height, depth } = data.params
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat)
      mesh.position.y = height / 2
      group.add(mesh)
      break
    }
    // 【新增】 处理导入的模型
    case 'imported-model': {
      const { dataUrl } = data.params
      // 异步加载
      gltfLoader.load(
        dataUrl,
        (gltf) => {
          // 加载成功后，填充 placeholder group
          gltf.scene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
              child.castShadow = true
              child.receiveShadow = true
            }
          })
          group.add(gltf.scene)
        },
        undefined, // onProgress
        (error) => {
          console.error(`加载模型 ${data.params.fileName} 失败:`, error)
        },
      )
      // 立即返回 group，它将作为异步加载的容器
      break
    }
  }

  // 【修改】 调整 if 条件，以允许 'imported-model' 的空 group 通过
  if (group.children.length > 0 || data.type === 'imported-model') {
    if (!data.mountedToId) {
      group.position.set(data.position.x, data.position.y, data.position.z)
      group.rotation.set(
        THREE.MathUtils.degToRad(data.rotation.x),
        THREE.MathUtils.degToRad(data.rotation.y),
        THREE.MathUtils.degToRad(data.rotation.z),
      )
    }
    group.traverse((c) => {
      c.castShadow = true
      c.receiveShadow = true
    })
    return group
  }
  return null
}
