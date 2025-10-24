/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { TransformControls } from 'three/addons/controls/TransformControls.js'
import { saveState } from '@/composables/useHistory'
import { isTransformDragging } from '@/composables/useScene'
import { handleSceneClick, objects, sceneObjects, selectedObjectId } from '@/composables/useObjects'
import { createObject3D } from './objectFactory'

export let scene: any, camera: any, renderer: any
export let orbitControls: any, transformControls: any, selectionBox: any

export let mouseDownInfo = { x: 0, y: 0, time: 0 }

export const handleResize = () => {
  const container = document.getElementById('scene-container')
  if (camera && renderer && container) {
    camera.aspect = container.clientWidth / container.clientHeight
    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)
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
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true
  container.innerHTML = ''
  container.appendChild(renderer.domElement)

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

  orbitControls = new OrbitControls(camera, renderer.domElement)
  transformControls = new TransformControls(camera, renderer.domElement)
  transformControls.addEventListener('dragging-changed', (event: { value: boolean }) => {
    isTransformDragging.value = event.value
    orbitControls.enabled = !event.value
    if (!event.value) saveState() // Save state on drag end
  })
  transformControls.addEventListener('objectChange', () => {
    const obj = transformControls.object
    if (!obj?.userData.id) return
    const dataObj = objects.find((o: { id: string }) => o.id === obj.userData.id)
    if (!dataObj) return
    dataObj.position.x = obj.position.x
    dataObj.position.y = obj.position.y
    dataObj.position.z = obj.position.z
    dataObj.rotation.x = THREE.MathUtils.radToDeg(obj.rotation.x)
    dataObj.rotation.y = THREE.MathUtils.radToDeg(obj.rotation.y)
    dataObj.rotation.z = THREE.MathUtils.radToDeg(obj.rotation.z)
  })
  // scene.add(transformControls.getHelper())
  const gizmo = transformControls.getHelper()
  scene.add(gizmo)

  selectionBox = new THREE.BoxHelper()
  selectionBox.material.color.set(0x007bff)
  selectionBox.material.depthTest = false
  selectionBox.renderOrder = 1
  selectionBox.material.linewidth = 2
  selectionBox.visible = false
  scene.add(selectionBox)

  renderer.domElement.addEventListener('mousedown', (e: { clientX: number; clientY: number }) => {
    mouseDownInfo = { x: e.clientX, y: e.clientY, time: Date.now() }
  })

  renderer.domElement.addEventListener('mouseup', (e: { clientX: number; clientY: number }) => {
    const dx = e.clientX - mouseDownInfo.x
    const dy = e.clientY - mouseDownInfo.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (Date.now() - mouseDownInfo.time < 300 && dist < 5) handleSceneClick(e)
  })

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

  objects.forEach((data) => {
    const obj3D = createObject3D(data)
    if (obj3D) sceneObjects.set(data.id, obj3D)
  })
  const desk3D = sceneObjects.get(
    objects.find((o: { type: string }) => o.type.startsWith('desk-'))?.id,
  )
  if (desk3D) {
    scene.add(desk3D)
    desk3D.userData.isDesk = true
  }

  objects.forEach((data) => {
    const obj3D = sceneObjects.get(data.id)
    if (!obj3D) return
    if (data.mountedToId) {
      const stand3D = sceneObjects.get(data.mountedToId)
      if (stand3D) {
        const standData = objects.find((o) => o.id === data.mountedToId)
        const { poleHeight, armLength } = standData.params
        obj3D.position.set(armLength, poleHeight + 0.02, 0)
        obj3D.rotation.set(0, 0, 0)
        stand3D.add(obj3D)
      }
    } else if (!data.type.startsWith('desk-')) {
      if (desk3D) desk3D.add(obj3D)
      else scene.add(obj3D)
    }
  })
}

export const disposeScene = () => {
  scene = null
  camera = null
  renderer = null
  orbitControls = null
  transformControls = null
  selectionBox = null
}
