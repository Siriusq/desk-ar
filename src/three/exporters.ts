import i18n from '@/locales'
const { t } = i18n.global
import * as THREE from 'three'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
import { objects, sceneObjects } from '@/composables/useObjects'
import { isLoading } from '@/composables/useUIState'
import { previewModelUrl } from '@/composables/usePreview'
import router from '@/router'

export const exportForAR = async (includeDesk: boolean) => {
  isLoading.value = true

  const deskData = objects.value.find((o) => o.type.startsWith('desk-'))
  if (!deskData && includeDesk) {
    alert(t('noDeskError'))
    isLoading.value = false
    return
  }

  // This whole group will be exported.
  const objectToExport = new THREE.Group()

  // Clone and add the desk if requested.
  if (includeDesk && deskData) {
    const desk3D = sceneObjects.get(deskData.id)
    if (desk3D) {
      objectToExport.add(desk3D.clone(true))
    }
  } else {
    let deskHeight = 0
    if (deskData && (deskData.type === 'desk-rect' || deskData.type === 'desk-l')) {
      deskHeight = deskData.params.height + (deskData.position.y || 0) // 类型安全
    }
    // If no desk is included, we add all non-desk items.
    // Their positions must be adjusted relative to the floor (y=0).
    objects.value.forEach((data) => {
      if (!data.type.startsWith('desk-')) {
        const item3D = sceneObjects.get(data.id)
        if (item3D) {
          const clone = item3D.clone(true)

          // Get world transforms, as items might be nested.
          const worldPosition = item3D.getWorldPosition(new THREE.Vector3())
          const worldQuaternion = item3D.getWorldQuaternion(new THREE.Quaternion())
          const worldScale = item3D.getWorldScale(new THREE.Vector3())

          // Adjust position relative to the desk height.
          worldPosition.y -= deskHeight

          clone.position.copy(worldPosition)
          clone.quaternion.copy(worldQuaternion)
          clone.scale.copy(worldScale)

          objectToExport.add(clone)
        }
      }
    })
  }

  // Use a short timeout to let the UI update (show loading spinner)
  setTimeout(async () => {
    // 【优化】 统一创建 Exporter
    const exporter = new GLTFExporter()
    const options = { binary: true }

    const a = document.createElement('a')
    a.style.display = 'none'
    document.body.appendChild(a)

    try {
      // 【优化】 统一使用 parseAsync
      const result = await exporter.parseAsync(objectToExport, options)

      // 【修复】 使用类型断言
      const glbBlob = new Blob([result as ArrayBuffer], {
        type: 'model/gltf-binary',
      })

      // 在设置新 URL 之前，释放掉可能存在的旧 URL
      if (previewModelUrl.value) {
        URL.revokeObjectURL(previewModelUrl.value)
      }
      // 1. 创建新的 Blob URL 并存入共享状态
      const glbUrl = URL.createObjectURL(glbBlob)
      previewModelUrl.value = glbUrl

      // 2. 使用 Vue Router 导航到预览页
      router.push({ name: 'preview' })
    } catch (error) {
      console.error('An error happened during AR export:', error)
    } finally {
      isLoading.value = false
      document.body.removeChild(a) // 总是移除 a 标签
    }
  }, 100)
}

GLTFExporter.prototype.parseAsync = function (input, options) {
  return new Promise((resolve, reject) => {
    this.parse(input, resolve, reject, options)
  })
}
