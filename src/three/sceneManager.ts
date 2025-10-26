/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { TransformControls } from 'three/addons/controls/TransformControls.js'
import { saveState } from '@/composables/useHistory'
import { isTransformDragging } from '@/composables/useScene'
import { handleSceneClick, objects, sceneObjects, selectedObjectId } from '@/composables/useObjects'
import { createObject3D } from './objectFactory'
import type { DeskObject } from '@/types/deskObject'

export let scene: any, camera: any, renderer: any
export let orbitControls: any, transformControls: any, selectionBox: any

export let mouseDownInfo = { x: 0, y: 0, time: 0 }

// 存储 DOM 元素和事件处理函数，以便稍后移除
let domElement: HTMLDivElement | null = null
let handleMouseDown: (e: any) => void
let handleMouseUp: (e: any) => void

export const handleResize = () => {
  const container = document.getElementById('scene-container')
  if (camera && renderer && container) {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)

    console.log('--- 遍历数组元素类型 ---')

    // 【修改】 element 现在是强类型 DeskObject
    for (const element of objects.value) {
      // 假设 objects 是 ref，使用 .value
      // const type = typeof element // 这只会是 'object'

      // 现在你可以安全地访问属性
      console.log(`ID: ${element.id} | Type: ${element.type} | Color: ${element.params.color}`)
    }
  }
}

export const initThree = () => {
  const container = document.getElementById('scene-container')!
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0xf0f0f0)
  scene.fog = new THREE.Fog(0xf0f0f0, 10, 50)

  camera = new THREE.PerspectiveCamera(
    70,
    container.clientWidth / container.clientHeight,
    0.01,
    100,
  )
  camera.position.set(2, 2, 3)

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  })

  // 保存 DOM 元素引用
  domElement = renderer.domElement
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  container.innerHTML = ''
  container.appendChild(domElement!)

  scene.add(new THREE.AmbientLight(0xffffff, 0.7))
  const dLight = new THREE.DirectionalLight(0xffffff, 0.8)
  dLight.position.set(5, 10, 7.5)
  dLight.castShadow = true
  scene.add(dLight)

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color: 0xcccccc }),
  )
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)
  scene.add(new THREE.GridHelper(100, 100, 0x888888, 0x888888))

  orbitControls = new OrbitControls(camera, domElement!)
  transformControls = new TransformControls(camera, domElement!)
  transformControls.addEventListener('dragging-changed', (event: { value: boolean }) => {
    isTransformDragging.value = event.value
    orbitControls.enabled = !event.value
    if (!event.value) saveState() // Save state on drag end
  })
  transformControls.addEventListener('objectChange', () => {
    const obj = transformControls.object
    if (!obj?.userData.id) return
    const dataObj = objects.value.find((o: { id: string }) => o.id === obj.userData.id)
    if (!dataObj) return
    dataObj.position.x = obj.position.x
    dataObj.position.y = obj.position.y
    dataObj.position.z = obj.position.z
    dataObj.rotation.x = THREE.MathUtils.radToDeg(obj.rotation.x)
    dataObj.rotation.y = THREE.MathUtils.radToDeg(obj.rotation.y)
    dataObj.rotation.z = THREE.MathUtils.radToDeg(obj.rotation.z)
  })

  const gizmo = transformControls.getHelper()
  scene.add(gizmo)

  selectionBox = new THREE.BoxHelper(new THREE.Object3D())
  selectionBox.material.color.set(0x007bff)
  selectionBox.material.depthTest = false
  selectionBox.renderOrder = 1
  selectionBox.material.linewidth = 2
  selectionBox.visible = false
  scene.add(selectionBox)

  // 【修改】将事件处理函数保存到模块变量中
  handleMouseDown = (e: { clientX: number; clientY: number }) => {
    mouseDownInfo = { x: e.clientX, y: e.clientY, time: Date.now() }
  }

  handleMouseUp = (e: { clientX: number; clientY: number }) => {
    const dx = e.clientX - mouseDownInfo.x
    const dy = e.clientY - mouseDownInfo.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (Date.now() - mouseDownInfo.time < 300 && dist < 5) handleSceneClick(e)
  }

  // 【修改】使用保存的处理函数
  domElement!.addEventListener('mousedown', handleMouseDown)
  domElement!.addEventListener('mouseup', handleMouseUp)

  renderer.setAnimationLoop(() => {
    if (selectionBox.visible && sceneObjects.has(selectedObjectId.value)) {
      selectionBox.setFromObject(sceneObjects.get(selectedObjectId.value))
    }
    renderer.render(scene, camera)
  })
}

export const rebuildSceneFromData = () => {
  if (!scene) return
  sceneObjects.forEach((obj) => {
    if (transformControls.object === obj) transformControls.detach()
    obj.parent?.remove(obj)
    obj.traverse(
      (c: {
        isMesh: boolean
        geometry: { dispose: () => void }
        material: { dispose: () => void }
      }) => {
        if (c.isMesh) {
          c.geometry.dispose()
          c.material.dispose()
        }
      },
    )
  })
  sceneObjects.clear()

  // 【修改】 data 现在是强类型 DeskObject
  objects.value.forEach((data: DeskObject) => {
    // 假设 objects 是 ref，使用 .value
    const obj3D = createObject3D(data)
    if (obj3D) sceneObjects.set(data.id, obj3D)
  })

  // 【修改】 data 现在是强类型
  const deskData = objects.value.find((o: DeskObject) => o.type.startsWith('desk-'))
  const desk3D = deskData ? sceneObjects.get(deskData.id) : undefined

  if (desk3D) {
    scene.add(desk3D)
    desk3D.userData.isDesk = true
  }

  // 【修改】 data 现在是强类型
  objects.value.forEach((data: DeskObject) => {
    const obj3D = sceneObjects.get(data.id)
    if (!obj3D) return
    if (data.mountedToId) {
      const stand3D = sceneObjects.get(data.mountedToId)
      if (stand3D) {
        // 【修改】 standData 现在是强类型
        const standData = objects.value.find((o) => o.id === data.mountedToId)
        // 确保 standData 和 params 存在
        if (standData && 'poleHeight' in standData.params && 'armLength' in standData.params) {
          const { poleHeight, armLength } = standData.params
          obj3D.position.set(armLength, poleHeight + 0.02, 0)
          obj3D.rotation.set(0, 0, 0)
          stand3D.add(obj3D)
        }
      }
    } else if (!data.type.startsWith('desk-')) {
      if (desk3D) desk3D.add(obj3D)
      else scene.add(obj3D)
    }
  })
}

export const disposeScene = () => {
  console.log('Disposing Three.js scene and controls...')

  // 1. 停止渲染循环
  if (renderer) {
    renderer.setAnimationLoop(null)
  }

  // 2. 销毁 Controls 和移除它们的监听器
  if (orbitControls) {
    orbitControls.dispose()
    orbitControls = null
  }
  if (transformControls) {
    // 移除 transformControls 自身的监听器
    transformControls.removeEventListener('dragging-changed')
    transformControls.removeEventListener('objectChange')
    transformControls.dispose()
    transformControls = null
  }

  // 3. 移除在 initThree 中添加的 DOM 监听器
  if (domElement) {
    domElement.removeEventListener('mousedown', handleMouseDown)
    domElement.removeEventListener('mouseup', handleMouseUp)
  }

  // 4. 清理和销毁场景中的所有对象（包括静态对象）
  if (scene) {
    scene.traverse((object: any) => {
      if (object.isMesh) {
        if (object.geometry) {
          object.geometry.dispose()
        }
        if (object.material) {
          // 处理材质数组
          if (Array.isArray(object.material)) {
            object.material.forEach((material: any) => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      } else if (object.isLight) {
        // 灯光也可能需要 dispose (如果它们有 shadow map textures)
        object.dispose?.()
      }
    })
    sceneObjects.clear() // 清空动态对象map
    scene = null
  }

  // 5. 销毁 Renderer
  if (renderer) {
    renderer.dispose()
    renderer = null
  }

  // 6. 移除 DOM 元素
  if (domElement) {
    domElement.remove()
    domElement = null
  }

  // 7. 置空其他变量
  camera = null
  selectionBox = null
  mouseDownInfo = { x: 0, y: 0, time: 0 }

  console.log('Scene disposal complete.')
}
