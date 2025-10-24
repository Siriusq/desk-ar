import * as THREE from 'three'
import { ref, watch } from 'vue'
import { sceneObjects, selectedObjectId } from '@/composables/useObjects'
import { camera, orbitControls, transformControls } from '@/three/sceneManager'

export const isPreviewing = ref(false)
export const isTransformDragging = ref(false)
export const transformMode = ref('translate')

export const togglePreview = (state: boolean) => {
  isPreviewing.value = state
  if (state) {
    selectedObjectId.value = null
    const allObjectsGroup = new THREE.Group()
    sceneObjects.forEach((obj) => allObjectsGroup.add(obj.clone()))
    if (allObjectsGroup.children.length > 0) {
      const box = new THREE.Box3().setFromObject(allObjectsGroup)
      const center = box.getCenter(new THREE.Vector3())
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      const fov = camera.fov * (Math.PI / 180)
      let cameraZ = Math.abs(maxDim / (2 * Math.tan(fov / 2)))
      cameraZ *= 1.5

      orbitControls.target.copy(center)
      camera.position.copy(center)
      camera.position.z += cameraZ
      camera.lookAt(center)
    }
  }
}

// 监听模型控制器类型，移动/旋转切换
watch(transformMode, (mode) => {
  if (transformControls) transformControls.setMode(mode)
})
