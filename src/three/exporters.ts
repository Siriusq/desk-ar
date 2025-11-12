import i18n from '@/locales'
const { t } = i18n.global
import * as THREE from 'three'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
import { objects, sceneObjects } from '@/composables/useObjects'
import { isLoading } from '@/composables/useUIState'
import { previewModelUrl } from '@/composables/usePreview'
import router from '@/router'

// --- 将场景中的模型打包并传入到预览页面 ---

export const exportForAR = async (includeDesk: boolean) => {
  isLoading.value = true

  const deskData = objects.value.find((o) => o.type.startsWith('desk-'))
  if (!deskData && includeDesk) {
    alert(t('noDeskError'))
    isLoading.value = false
    return
  }

  const objectToExport = new THREE.Group()

  // 是否包含桌子
  if (includeDesk && deskData) {
    const desk3D = sceneObjects.get(deskData.id)
    if (desk3D) {
      objectToExport.add(desk3D.clone(true))
    }
  } else {
    let deskHeight = 0
    if (deskData && (deskData.type === 'desk-rect' || deskData.type === 'desk-l')) {
      deskHeight = deskData.params.height + (deskData.position.y || 0)
    }
    // 如果不含桌子，遍历其他模型并将y坐标设置为零
    objects.value.forEach((data) => {
      if (!data.type.startsWith('desk-')) {
        const item3D = sceneObjects.get(data.id)
        if (item3D) {
          const clone = item3D.clone(true)

          const worldPosition = item3D.getWorldPosition(new THREE.Vector3())
          const worldQuaternion = item3D.getWorldQuaternion(new THREE.Quaternion())
          const worldScale = item3D.getWorldScale(new THREE.Vector3())

          worldPosition.y -= deskHeight

          clone.position.copy(worldPosition)
          clone.quaternion.copy(worldQuaternion)
          clone.scale.copy(worldScale)

          objectToExport.add(clone)
        }
      }
    })
  }

  // UI 延时
  setTimeout(async () => {
    const exporter = new GLTFExporter()
    const options = { binary: true }

    const a = document.createElement('a')
    a.style.display = 'none'
    document.body.appendChild(a)

    try {
      const result = await exporter.parseAsync(objectToExport, options)

      const glbBlob = new Blob([result as ArrayBuffer], {
        type: 'model/gltf-binary',
      })

      // 在设置新 URL 之前，释放掉可能存在的旧 URL
      if (previewModelUrl.value) {
        URL.revokeObjectURL(previewModelUrl.value)
      }
      // 创建新的 Blob URL 并存入共享状态
      const glbUrl = URL.createObjectURL(glbBlob)
      previewModelUrl.value = glbUrl

      // 导航到预览页
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
