import i18n from '@/locales'
const { t } = i18n.global
import * as THREE from 'three'
import { USDZExporter } from 'three/addons/exporters/USDZExporter.js'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js'
import { objects, sceneObjects } from '@/composables/useObjects'
import { isLoading } from '@/composables/useUIState'

/* eslint-disable @typescript-eslint/no-explicit-any */
export const exportForAR = async (includeDesk: any) => {
  isLoading.value = true

  const deskData = objects.find((o) => o.type.startsWith('desk-'))
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
    // If no desk is included, we add all non-desk items.
    // Their positions must be adjusted relative to the floor (y=0).
    objects.forEach((data) => {
      if (!data.type.startsWith('desk-')) {
        const item3D = sceneObjects.get(data.id)
        if (item3D) {
          const clone = item3D.clone(true)

          // Get world transforms, as items might be nested.
          const worldPosition = item3D.getWorldPosition(new THREE.Vector3())
          const worldQuaternion = item3D.getWorldQuaternion(new THREE.Quaternion())
          const worldScale = item3D.getWorldScale(new THREE.Vector3())

          // Adjust position relative to the desk height.
          const deskHeight = deskData ? deskData.params.height : 0
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
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
    const isAndroid = /Android/.test(navigator.userAgent)
    const a = document.createElement('a')
    a.style.display = 'none'
    document.body.appendChild(a)

    try {
      if (isIOS) {
        // iOS requires USDZ
        const exporter = new USDZExporter()
        const arrayBuffer = await exporter.parse(objectToExport)
        const blob = new Blob([arrayBuffer], {
          type: 'model/vnd.usdz+zip',
        })
        a.href = URL.createObjectURL(blob)
        a.setAttribute('rel', 'ar')
        a.appendChild(document.createElement('img')) // Required for Quick Look
        a.download = 'scene.usdz'
      } else if (isAndroid) {
        const exporter = new GLTFExporter()
        exporter.parse(
          objectToExport,
          (result) => {
            const glbBlob = new Blob([result], {
              type: 'model/gltf-binary',
            })
            const glbUrl = URL.createObjectURL(glbBlob)

            // 打开 viewer.html 并传递 blob URL
            const viewerPage = `mv.html?src=${encodeURIComponent(glbUrl)}`
            window.open(viewerPage, '_blank')
          },
          (error: any) => {
            console.error('GLTF 导出错误:', error)
          },
          { binary: true },
        )
      } else {
        // Fallback for desktop: download GLB
        const exporter = new GLTFExporter()
        const result = await exporter.parseAsync(objectToExport, {
          binary: true,
        })
        const blob = new Blob([result], {
          type: 'model/gltf-binary',
        })
        a.href = URL.createObjectURL(blob)
        a.download = 'scene.glb'
      }

      if (!isAndroid) {
        a.click()
        if (a.href.startsWith('blob:')) {
          URL.revokeObjectURL(a.href)
        }
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('An error happened during AR export:', error)
    } finally {
      isLoading.value = false
    }
  }, 100)
}

GLTFExporter.prototype.parseAsync = function (input: any, options: any) {
  return new Promise((resolve, reject) => {
    this.parse(input, resolve, reject, options)
  })
}
