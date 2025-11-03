/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from 'three'
import { computed, nextTick, ref, watch, type Ref } from 'vue'
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
import type { DeskObject } from '@/models/deskObject'
import { disposeObject3D } from '@/three/objectFactory'
// 【新增】 导入测量状态和处理函数
import { isMeasuring, handleMeasurementClick } from '@/composables/useMeasurement'

// 【修改】 强类型
export const objects: Ref<DeskObject[]> = ref([]) // 使用 ref 而不是 reactive，以便在 history 中更容易被替换
export const selectedObjectId = ref<string | null>(null)
export const sceneObjects = new Map<string, THREE.Object3D>()

export const isDeskInScene = computed(() =>
  objects.value.some((obj) => obj.type.startsWith('desk-')),
)

// 挂载
export const mountableItems = computed(() =>
  objects.value.filter(
    (o): o is DeskObject & { params: { isMountable: boolean } } =>
      'isMountable' in o.params && o.params.isMountable && !o.mountedToId,
  ),
)

export const getMountedItem = (itemId: string) => objects.value.find((o) => o.id === itemId)

// 【修改】 updateObjectValue - 不再重建，只更新 3D 变换
export const updateObjectValue = (
  id: string,
  key: 'position' | 'rotation', // 限制 key
  axis: 'x' | 'y' | 'z', // 限制 axis
  value: number,
) => {
  const obj = objects.value.find((o) => o.id === id)
  if (obj) {
    // 1. 更新数据
    obj[key][axis] = value

    // 2. 立即更新 3D 视图
    const obj3D = sceneObjects.get(id)
    if (obj3D) {
      if (key === 'rotation') {
        obj3D.rotation[axis] = THREE.MathUtils.degToRad(value)
      } else {
        obj3D.position[axis] = value
      }
    }
    saveState() // 保存历史

    transformControls.attach(obj3D)
  }
}

// 【修改】 updateObjectParam - 必须调用 rebuildSceneFromData
export const updateObjectParam = (id: string, key: string, value: any) => {
  const obj = objects.value.find((o) => o.id === id)
  if (obj) {
    // 1. 更新数据
    ;(obj.params as any)[key] = value // 使用 any 来允许动态键

    // 2. 保存状态 (这会触发 autosave)
    saveState()

    // 3. 【重要】 重建整个场景
    // 这是修复问题 2 (物品消失) 和 4 (showLegs) 的关键
    rebuildSceneFromData()

    const obj3D = sceneObjects.get(id)
    transformControls.attach(obj3D)
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
      // 【修复】 添加类型守卫
      let deskHeight = 0
      if (desk && (desk.type === 'desk-rect' || desk.type === 'desk-l')) {
        deskHeight = desk.params.height // 现在可以安全访问 height
      }
      item.position.x = stand.position.x
      item.position.y = deskHeight
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

// 【修改】 dropObject 函数以正确计算底部位置
export const dropObject = (id: string) => {
  const dataObj = objects.value.find((o) => o.id === id)
  const obj3D = sceneObjects.get(id)
  if (!dataObj || !obj3D || dataObj.mountedToId) return

  const collidableObjects = Array.from(sceneObjects.values()).filter((o) => o.userData.id !== id)
  if (collidableObjects.length === 0) return

  const raycaster = new THREE.Raycaster()

  // 1. 获取对象当前的世界坐标（原点）
  const objWorldPosition = new THREE.Vector3()
  obj3D.getWorldPosition(objWorldPosition)

  // 【新增】 2. 计算对象的世界边界框
  // setFromObject 会考虑所有子对象、旋转和缩放
  const box = new THREE.Box3().setFromObject(obj3D)

  // 【新增】 3. 计算原点到对象最底部的垂直偏移量（在世界空间中）
  //    objWorldPosition.y 是原点的 Y
  //    box.min.y 是旋转后模型的最底部的 Y
  const worldOffset = objWorldPosition.y - box.min.y

  // 4. 从原点向下投射射线以找到表面
  raycaster.set(objWorldPosition, new THREE.Vector3(0, -1, 0))
  const intersects = raycaster.intersectObjects(collidableObjects, true)

  if (intersects.length > 0) {
    // 5. 获取表面在世界坐标中的 Y 值
    const surfaceWorldY = intersects[0]!.point.y

    // 【新增】 6. 计算对象原点的新世界坐标 Y
    //    新 Y = 表面 Y + 偏移量
    const newWorldOriginY = surfaceWorldY! + worldOffset

    // 7. 获取父对象的逆矩阵，以便将世界坐标转回局部坐标
    const parent = obj3D.parent
    const parentInverse = new THREE.Matrix4()
    if (parent) {
      parent.updateWorldMatrix(true, false)
      parentInverse.copy(parent.matrixWorld).invert()
    }

    // 8. 创建新的世界坐标向量
    const newWorldPosition = objWorldPosition.clone() // 从当前世界坐标开始
    newWorldPosition.y = newWorldOriginY // 仅修改 Y 值

    // 9. 将新的世界坐标转换回父对象的局部坐标
    newWorldPosition.applyMatrix4(parentInverse)

    // 【修复】 10. 更新数据和 3D 视图，使用 newWorldPosition.y（新的局部 Y）
    dataObj.position.y = newWorldPosition.y
    obj3D.position.y = newWorldPosition.y

    saveState()
  }
}

// 【修改】 handleSceneClick 以支持测量
export const handleSceneClick = (event: { clientX: any; clientY: any }) => {
  // 射线和相交逻辑
  const rect = renderer.domElement.getBoundingClientRect()
  const mouse = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1,
  )
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(Array.from(sceneObjects.values()), true)

  // 【修改】 模式分流
  if (isMeasuring.value) {
    // --- 测量模式 ---
    if (intersects.length > 0) {
      const intersect = intersects[0]!
      // 【新增】 计算世界法线
      if (intersect.face) {
        const worldNormal = intersect.face.normal
          .clone()
          .transformDirection(intersect.object.matrixWorld)
        // 传递精确的 3D 命中点和法线
        handleMeasurementClick(intersect.point, worldNormal)
      }
    }
  } else {
    // --- 选择模式 (原始逻辑) ---
    if (isTransformDragging.value) return

    let targetGroup: THREE.Object3D | null = null
    if (intersects.length > 0) {
      let obj: THREE.Object3D | null = intersects[0]?.object ?? null
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
}

watch(selectedObjectId, (newId) => {
  if (newId && !isMeasuring.value) {
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
