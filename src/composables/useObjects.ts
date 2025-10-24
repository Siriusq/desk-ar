/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from 'three'
import { computed, nextTick, reactive, ref, watch } from 'vue'
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

export const objects = reactive([])
export const selectedObjectId = ref(null)
export const sceneObjects = new Map()

export const isDeskInScene = computed(() =>
  objects.some((obj: { type: any }) => obj.type.startsWith('desk-')),
)

// 挂载
export const mountableItems = computed(() =>
  objects.filter(
    (o: { params: { isMountable: unknown }; mountedToId: unknown }) =>
      o.params.isMountable && !o.mountedToId,
  ),
)

export const getModelDisplayName = (type: any) => {
  for (const category of Object.values(availableModels)) {
    const model = category.find((m) => m.type === type)
    if (model) return model.name
  }
  return 'Unknown'
}

export const getMountedItem = (itemId: string) =>
  objects.find((o: { id: string }) => o.id === itemId)

export const updateObjectValue = (
  id: any,
  key: string | number,
  axis: string | number,
  value: any,
) => {
  const obj = objects.find((o: { id: any }) => o.id === id)
  if (obj) {
    obj[key][axis] = Number(value)
  }
}

export const updateObjectParam = (id: any, key: string | number, value: any) => {
  const obj = objects.find((o: { id: any }) => o.id === id)
  if (obj) {
    obj.params[key] = value
  }
}

export const toggleObjectSelection = (id: any) => {
  selectedObjectId.value = selectedObjectId.value === id ? null : id
  if (selectedObjectId.value) expandedObjectId.value = id
}

export const mountObject = (standId: any, itemId: any) => {
  const stand = objects.find((o: { id: any }) => o.id === standId)
  const item = objects.find((o: { id: any }) => o.id === itemId)
  if (stand && item && !stand.params.mountedObjectId) {
    stand.params.mountedObjectId = itemId
    item.mountedToId = standId
    saveState()
  }
}

export const unmountObject = (standId: any) => {
  const stand = objects.find((o) => o.id === standId)
  if (stand && stand.params.mountedObjectId) {
    const item = objects.find((o: { id: any }) => o.id === stand.params.mountedObjectId)
    if (item) {
      item.mountedToId = null
      const desk = objects.find((o) => o.type.startsWith('desk-'))
      item.position.x = stand.position.x
      item.position.y = desk ? desk.params.height : 0
      item.position.z = stand.position.z
    }
    stand.params.mountedObjectId = null
    saveState()
  }
}

export const deleteObject = (id: any) => {
  const obj = objects.find((o: { id: any }) => o.id === id)
  if (!obj) return
  saveState()
  if (obj.type === 'universal-stand' && obj.params.mountedObjectId) unmountObject(id)
  if (obj.mountedToId) unmountObject(obj.mountedToId)
  if (obj.type.startsWith('desk-')) objects.splice(0, objects.length)
  else {
    const i = objects.findIndex((o: { id: any }) => o.id === id)
    if (i > -1) objects.splice(i, 1)
  }
}

export const dropObject = (id: any) => {
  const dataObj = objects.find((o: { id: any }) => o.id === id)
  const obj3D = sceneObjects.get(id)
  if (!dataObj || !obj3D || dataObj.mountedToId) return

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
    dataObj.position.y = firstHitPoint?.y
    saveState()
  }
}

export const handleSceneClick = (event: { clientX: any; clientY: any }) => {
  if (isTransformDragging.value) return // Disable clicks in preview mode
  const rect = renderer.domElement.getBoundingClientRect()
  const mouse = new THREE.Vector2(
    ((event.clientX - rect.left) / rect.width) * 2 - 1,
    -((event.clientY - rect.top) / rect.height) * 2 + 1,
  )
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mouse, camera)
  const intersects = raycaster.intersectObjects(Array.from(sceneObjects.values()), true)

  let targetGroup = null
  if (intersects.length > 0) {
    let obj = intersects[0]?.object
    while (obj && !obj.userData.id) obj = obj.parent!
    if (obj) targetGroup = obj
  }

  if (targetGroup) {
    const targetId = targetGroup.userData.id
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

watch(
  objects,
  () => {
    if (isTransformDragging.value) return
    rebuildSceneFromData()
    if (selectedObjectId.value && sceneObjects.has(selectedObjectId.value)) {
      const obj3D = sceneObjects.get(selectedObjectId.value)
      if (obj3D) {
        transformControls.attach(obj3D)
        selectionBox.setFromObject(obj3D)
        selectionBox.visible = true
      }
    }
  },
  { deep: true },
)

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
