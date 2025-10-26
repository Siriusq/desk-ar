/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from 'three'
import { computed, nextTick, ref, watch, type Ref } from 'vue'
import { availableModels } from '@/models/presetModels'
import {
  camera,
  rebuildSceneFromData,
  renderer,
  selectionBox,
  transformControls,
} from '@/three/sceneManager'
import { isTransformDragging, transformMode } from '@/composables/useScene'
import { saveState } from './useHistory'
import { expandedObjectId } from './useUIState'
// 【新增】 导入类型和新的辅助函数
import type { DeskObject } from '@/types/deskObject'
import { disposeObject3D, replaceObject3D } from '@/three/objectFactory'

// 【修改】 强类型
export const objects: Ref<DeskObject[]> = ref([]) // 使用 ref 而不是 reactive，以便在 history 中更容易被替换
export const selectedObjectId = ref<string | null>(null)
export const sceneObjects = new Map<string, THREE.Object3D>()

export const isDeskInScene = computed(() =>
  objects.value.some((obj) => obj.type.startsWith('desk-')),
)

// 挂载
export const mountableItems = computed(() =>
  objects.value.filter((o) => 'isMountable' in o.params && o.params.isMountable && !o.mountedToId),
)

export const getModelDisplayName = (type: string) => {
  for (const category of Object.values(availableModels)) {
    const model = category.find((m) => m.type === type)
    if (model) return model.name
  }
  return 'Unknown'
}

export const getMountedItem = (itemId: string) => objects.value.find((o) => o.id === itemId)

// 【修改】 update 函数现在会替换 3D 对象
export const updateObjectValue = (
  id: string,
  key: 'position' | 'rotation', // 限制 key
  axis: 'x' | 'y' | 'z', // 限制 axis
  value: any,
) => {
  const obj = objects.value.find((o) => o.id === id)
  if (obj) {
    obj[key][axis] = Number(value)
    // 【修改】 触发 3D 视图更新
    const newObj3D = replaceObject3D(obj)
    // 如果更新的是当前选中的对象，重新附加控制器
    if (newObj3D && selectedObjectId.value === id) {
      transformControls.attach(newObj3D)
    }
    saveState() // 保存历史
  }
}

// 【修改】 update 函数现在会替换 3D 对象
export const updateObjectParam = (id: string, key: string, value: any) => {
  const obj = objects.value.find((o) => o.id === id)
  if (obj) {
    ;(obj.params as any)[key] = value // 使用 any 来允许动态键
    // 【修改】 触发 3D 视图更新
    const newObj3D = replaceObject3D(obj)
    // 如果更新的是当前选中的对象，重新附加控制器
    if (newObj3D && selectedObjectId.value === id) {
      transformControls.attach(newObj3D)
    }
    saveState() // 保存历史
  }
}

export const toggleObjectSelection = (id: string) => {
  selectedObjectId.value = selectedObjectId.value === id ? null : id
  if (selectedObjectId.value) expandedObjectId.value = id
}

// 【修改】 mount/unmount 必须调用 rebuildSceneFromData，因为它们会改变场景图（父子关系）
export const mountObject = (standId: string, itemId: string) => {
  const stand = objects.value.find((o) => o.id === standId)
  const item = objects.value.find((o) => o.id === itemId)

  // 确保 stand 是 'universal-stand'
  if (stand && item && stand.type === 'universal-stand' && !stand.params.mountedObjectId) {
    stand.params.mountedObjectId = itemId
    item.mountedToId = standId
    saveState()
    // 场景图已改变，执行重建
    rebuildSceneFromData()
  }
}

export const unmountObject = (standId: string) => {
  const stand = objects.value.find((o) => o.id === standId)
  if (stand && stand.type === 'universal-stand' && stand.params.mountedObjectId) {
    const item = objects.value.find((o) => o.id === stand.params.mountedObjectId)
    if (item) {
      item.mountedToId = null
      const desk = objects.value.find((o) => o.type.startsWith('desk-'))
      item.position.x = stand.position.x
      item.position.y = desk ? desk.params.height : 0
      item.position.z = stand.position.z
    }
    stand.params.mountedObjectId = null
    saveState()
    // 场景图已改变，执行重建
    rebuildSceneFromData()
  }
}

// 【修改】 deleteObject 现在会销毁 3D 对象
export const deleteObject = (id: string) => {
  const obj = objects.value.find((o) => o.id === id)
  if (!obj) return

  saveState() // 在修改前保存状态

  // 先处理挂载关系
  if (obj.type === 'universal-stand' && obj.params.mountedObjectId) unmountObject(id)
  if (obj.mountedToId) unmountObject(obj.mountedToId)

  // 【新增】 从 3D 场景中移除
  const obj3D = sceneObjects.get(id)
  if (obj3D) {
    if (transformControls.object === obj3D) transformControls.detach()
    disposeObject3D(obj3D)
    sceneObjects.delete(id)
  }

  // 如果删除的是桌子，清空所有
  if (obj.type.startsWith('desk-')) {
    objects.value = [] // 清空数据
    // 清理所有 3D 对象 (rebuildSceneFromData 会处理)
    rebuildSceneFromData()
  } else {
    // 否则，只删除这一个
    const i = objects.value.findIndex((o) => o.id === id)
    if (i > -1) objects.value.splice(i, 1)
  }
}

// 【修改】 dropObject 必须更新 3D 视图
export const dropObject = (id: string) => {
  const dataObj = objects.value.find((o) => o.id === id)
  const obj3D = sceneObjects.get(id)
  if (!dataObj || !obj3D || dataObj.mountedToId) return

  // ... (Raycaster 逻辑保持不变)
  const collidableObjects = Array.from(sceneObjects.values()).filter((o) => o.userData.id !== id)
  if (collidableObjects.length === 0) return
  const raycaster = new THREE.Raycaster()
  const objPosition = new THREE.Vector3()
  obj3D.getWorldPosition(objPosition)
  raycaster.set(objPosition, new THREE.Vector3(0, -1, 0))
  const intersects = raycaster.intersectObjects(collidableObjects, true)

  if (intersects.length > 0) {
    const firstHitPoint = intersects[0]?.point
    const parent = obj3D.parent
    const parentInverse = new THREE.Matrix4()
    if (parent) {
      parent.updateWorldMatrix(true, false)
      parentInverse.copy(parent.matrixWorld).invert()
      firstHitPoint?.applyMatrix4(parentInverse)
    }
    // 【修改】 同时更新数据和 3D 视图
    if (firstHitPoint) {
      dataObj.position.y = firstHitPoint.y
      obj3D.position.y = firstHitPoint.y // 立即更新 3D 视图
    }
    saveState()
  }
}

// 【修改】 handleSceneClick 强类型
export const handleSceneClick = (event: { clientX: any; clientY: any }) => {
  if (isTransformDragging.value) return
  // ... (Raycaster 逻辑保持不变)
  const rect = renderer.domElement.getBoundingClientRect()
  const mouse = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1,
  )
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(Array.from(sceneObjects.values()), true)

  let targetGroup: THREE.Object3D | null = null
  if (intersects.length > 0) {
    let obj: THREE.Object3D | null = intersects[0]?.object
    while (obj && !obj.userData.id) obj = obj.parent
    if (obj) targetGroup = obj
  }

  if (targetGroup) {
    const targetId = targetGroup.userData.id as string
    if (selectedObjectId.value === targetId) {
      transformMode.value = transformMode.value === 'translate' ? 'rotate' : 'translate'
    } else {
      selectedObjectId.value = targetId
      transformMode.value = 'translate'
    }
  } else {
    selectedObjectId.value = null
  }
}

watch(selectedObjectId, (newId) => {
  if (newId) {
    const obj3D = sceneObjects.get(newId)
    if (obj3D) {
      transformControls.attach(obj3D)
      selectionBox.setFromObject(obj3D)
      selectionBox.visible = true

      expandedObjectId.value = newId
      nextTick(() => {
        const element = document.getElementById('item-' + newId)
        element?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      })
    }
  } else {
    if (transformControls) transformControls.detach()
    if (selectionBox) selectionBox.visible = false
    expandedObjectId.value = null
  }
})
