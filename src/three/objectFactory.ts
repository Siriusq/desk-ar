import { saveState } from '@/composables/useHistory'
import { isDeskInScene, objects, sceneObjects, selectedObjectId } from '@/composables/useObjects'
import { expandedObjectId } from '@/composables/useUIState'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import type { DeskObject, DeskObjectType } from '@/models/deskObject'
import { rebuildSceneFromData, scene } from './sceneManager'
import { modelRegistry } from '../models/modelRegistry'
const gltfLoader = new GLTFLoader()

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

// 【修改】 addObject - 现在使用注册表
export const addObject = (type: DeskObjectType) => {
  if (type.startsWith('desk-') && isDeskInScene.value) return
  const desk = objects.value.find((o) => o.type.startsWith('desk-'))

  let yPos = 0
  if (desk && (desk.type === 'desk-rect' || desk.type === 'desk-l')) {
    yPos = desk.params.height + (desk.position.y || 0)
  }

  // 【优化】 替换
  const definition = modelRegistry[type]
  if (!definition) {
    console.error(`No model definition found for type: ${type}`)
    return
  }

  // 1. 从注册表创建数据
  const data = definition.createData(THREE.MathUtils.generateUUID(), yPos)

  // 2. 更新数据层
  objects.value.push(data)

  // 3. 【优化】立即创建并添加 3D 视图
  const obj3D = createObject3D(data)
  if (obj3D) {
    add3DObjectToScene(obj3D, data)
  }

  // 4. 更新 UI 和历史记录
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

// 【修改】 createObject3D - 现在使用注册表
export const createObject3D = (data: DeskObject): THREE.Group | null => {
  const group = new THREE.Group()
  group.userData.id = data.id

  // 【优化】 替换
  if (data.type === 'imported-model') {
    // 1. 特殊处理 'imported-model' (异步加载)
    const { dataUrl } = data.params
    gltfLoader.load(
      dataUrl,
      (gltf) => {
        gltf.scene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            child.castShadow = true
            child.receiveShadow = true
          }
        })
        group.add(gltf.scene)
      },
      undefined,
      (error) => {
        console.error(`加载模型 ${data.params.fileName} 失败:`, error)
      },
    )
  } else {
    // 2. 从注册表构建所有预设模型
    const definition = modelRegistry[data.type as DeskObjectType]
    if (definition) {
      definition.buildGeometry(group, data)
    } else {
      console.warn(`No geometry builder found for type: ${data.type}`)
      return null
    }
  }

  // 3. 通用设置 (位置, 旋转, 阴影)
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
