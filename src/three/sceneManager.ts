/* eslint-disable @typescript-eslint/no-explicit-any */
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { TransformControls } from 'three/addons/controls/TransformControls.js'
import { saveState } from '@/composables/useHistory'
import { isTransformDragging } from '@/composables/useScene'
import { handleSceneClick, objects, sceneObjects, selectedObjectId } from '@/composables/useObjects'
import { createObject3D } from './objectFactory'
import type { DeskObject } from '@/models/deskObject'
import {
  initMeasurement,
  renderMeasurement,
  resizeMeasurement,
  cleanupMeasurement,
  isMeasuring,
  updateHoverMarker,
  hideHoverMarker,
  clearMeasurementUI,
  point1,
  point2,
} from '@/composables/useMeasurement'
import { PMREMGenerator } from 'three/src/extras/PMREMGenerator.js'
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js'
import {
  isAddModelModalOpen,
  isControlPanelOpen,
  isHelpModalOpen,
  isLoading,
  isMobile,
  isPreviewOptionModalOpen,
} from '@/composables/useUIState'

export let scene: any, camera: any, renderer: any
export let orbitControls: any, transformControls: any, selectionBox: any

// 两个相机
let perspectiveCamera: THREE.PerspectiveCamera
let orthoCamera: THREE.OrthographicCamera

export let mouseDownInfo = { x: 0, y: 0, time: 0 }

// 存储 DOM 元素和事件处理函数，以便稍后移除
let domElement: HTMLDivElement | null = null
let handleMouseDown: (e: any) => void
let handleMouseUp: (e: any) => void
// 悬停事件处理
let handleMouseMove: (e: MouseEvent) => void
let handleMouseOut: (e: MouseEvent) => void

// HDR
let pmremGenerator: PMREMGenerator | null = null
let environmentTexture: THREE.DataTexture | null = null

// 按需渲染
// 按需渲染的状态，确保每帧只渲染一次。
let isRenderScheduled = false
export const requestRender = () => {
  if (!renderer || !scene || !camera) return // 安全检查
  if (isRenderScheduled) return // 如果已经计划了渲染，则跳过
  isRenderScheduled = true

  requestAnimationFrame(() => {
    if (
      selectedObjectId.value &&
      selectionBox.visible &&
      sceneObjects.has(selectedObjectId.value)
    ) {
      selectionBox.setFromObject(sceneObjects.get(selectedObjectId.value))
    }
    // 渲染 3D 场景
    renderer.render(scene, camera)

    // 渲染 2D 标签
    renderMeasurement()

    // 重置标志，允许下一帧的渲染请求
    isRenderScheduled = false
  })
}

export const handleResize = () => {
  const container = document.getElementById('scene-container')
  if (camera && renderer && container) {
    const aspect = container.clientWidth / container.clientHeight

    if (camera.isPerspectiveCamera) {
      camera.aspect = aspect
    } else if (camera.isOrthographicCamera) {
      // 保持正交相机的视口高度，根据宽高比调整宽度
      const frustumHeight = camera.top - camera.bottom
      camera.left = (-frustumHeight * aspect) / 2
      camera.right = (frustumHeight * aspect) / 2
    }

    camera.updateProjectionMatrix()
    renderer.setSize(container.clientWidth, container.clientHeight)

    resizeMeasurement()

    requestRender()
  }
}

// 初始化
export const initThree = () => {
  const container = document.getElementById('scene-container')!
  scene = new THREE.Scene()

  // 创建透视相机
  perspectiveCamera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.01,
    100,
  )
  perspectiveCamera.position.set(0, 1.7, 1.5)

  // 创建正交相机
  const aspect = container.clientWidth / container.clientHeight
  const frustumSize = 2 // 视口高度
  orthoCamera = new THREE.OrthographicCamera(
    (-frustumSize * aspect) / 2,
    (frustumSize * aspect) / 2,
    frustumSize / 2,
    -frustumSize / 2,
    0.1,
    100,
  )
  // 为正交相机设置默认 3/4 视角
  orthoCamera.position.set(2, 2, 2)
  orthoCamera.lookAt(0, 0.95, 0)

  // 设置默认激活的相机
  camera = perspectiveCamera

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  })

  // PBR & HDR 渲染器设置
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.NeutralToneMapping
  renderer.toneMappingExposure = 1.0 // 调整曝光

  // 保存 DOM 元素引用
  domElement = renderer.domElement
  renderer.setSize(container.clientWidth, container.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  container.innerHTML = ''
  container.appendChild(domElement!)

  // 初始化 CSS2DRenderer
  initMeasurement(container)

  // 初始化 PMREMGenerator 并加载 HDR
  pmremGenerator = new PMREMGenerator(renderer)
  pmremGenerator.compileEquirectangularShader()

  // public/ 目录下的 HDR 文件路径
  const hdriPath = isMobile
    ? './hdri/kloofendal_misty_morning_puresky_1k.hdr'
    : './hdri/kloofendal_misty_morning_puresky_2k.hdr'

  new HDRLoader().load(
    hdriPath,
    (texture) => {
      // 处理贴图以用于环境光
      environmentTexture = pmremGenerator!.fromEquirectangular(texture).texture as THREE.DataTexture

      // 设置为场景背景和环境光
      scene.background = new THREE.Color(0xf0f0f0)
      scene.environment = environmentTexture // 为所有 MeshStandardMaterial 提供光照

      // 清理原始贴图
      texture.dispose()

      isLoading.value = false

      requestRender()
    },
    undefined, // onProgress
    (error) => {
      console.error('无法加载 HDR:', error)
      // 回退到纯色背景
      scene.background = new THREE.Color(0xf0f0f0)
      isLoading.value = false // 解除加载状态

      requestRender()
    },
  )

  // 设置光源
  scene.add(new THREE.AmbientLight(0xffffff, 0.5))

  // 控制器初始化
  orbitControls = new OrbitControls(camera, domElement!)
  // 相机发生变化时请求渲染
  orbitControls.addEventListener('change', requestRender)

  transformControls = new TransformControls(camera, domElement!)
  transformControls.addEventListener('dragging-changed', (event: { value: boolean }) => {
    isTransformDragging.value = event.value
    orbitControls.enabled = !event.value
    if (!event.value) saveState()

    requestRender()
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

    // 拖动时实时渲染
    requestRender()
  })

  const gizmo = transformControls.getHelper()
  scene.add(gizmo)

  // 确保控制器看向桌面上方
  orbitControls.target.set(0, 0.75, 0)
  orbitControls.update()

  // 三维框初始化
  selectionBox = new THREE.BoxHelper(new THREE.Object3D())
  selectionBox.material.color.set(0x007bff)
  selectionBox.material.depthTest = false
  selectionBox.renderOrder = 1
  selectionBox.material.linewidth = 2
  selectionBox.visible = false
  scene.add(selectionBox)

  // 处理鼠标事件
  handleMouseDown = (e: { clientX: number; clientY: number }) => {
    mouseDownInfo = { x: e.clientX, y: e.clientY, time: Date.now() }
    requestRender()
  }

  handleMouseUp = (e: { clientX: number; clientY: number }) => {
    const dx = e.clientX - mouseDownInfo.x
    const dy = e.clientY - mouseDownInfo.y
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (Date.now() - mouseDownInfo.time < 300 && dist < 5) handleSceneClick(e)

    requestRender()
  }

  // 悬停事件处理
  handleMouseMove = (event: MouseEvent) => {
    requestRender()
    if (!isMeasuring.value) return // 仅在测量时运行

    // 射线检测逻辑
    const rect = renderer.domElement.getBoundingClientRect()
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1,
    )
    const raycaster = new THREE.Raycaster()
    raycaster.setFromCamera(mouse, camera)
    const intersects = raycaster.intersectObjects(Array.from(sceneObjects.values()), true)

    if (intersects.length > 0) {
      const intersect = intersects[0]!

      // 计算世界法线
      if (intersect.face) {
        const worldNormal = intersect.face.normal
          .clone()
          .transformDirection(intersect.object.matrixWorld)
        // 找到了物体，更新悬停标记
        updateHoverMarker(intersect.point, worldNormal)
      }
    } else {
      // 没找到，隐藏
      hideHoverMarker()
    }

    // 悬停时需要渲染
    requestRender()
  }

  handleMouseOut = () => {
    // 鼠标移出画布，隐藏
    hideHoverMarker()

    // 悬停结束时需要渲染
    requestRender()
  }

  domElement!.addEventListener('mousedown', handleMouseDown)
  domElement!.addEventListener('mouseup', handleMouseUp)
  domElement!.addEventListener('mousemove', handleMouseMove)
  domElement!.addEventListener('mouseout', handleMouseOut)

  // 在 initThree 结束时, 手动执行第一次渲染
  requestRender()
}

// 重建场景
export const rebuildSceneFromData = () => {
  if (!scene) return
  sceneObjects.forEach((obj) => {
    if (transformControls.object === obj) transformControls.detach()
    obj.parent?.remove(obj)
    obj.traverse((c) => {
      if ((c as THREE.Mesh).isMesh) {
        const mesh = c as THREE.Mesh
        mesh.geometry?.dispose()

        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((mat) => mat.dispose())
          } else {
            mesh.material.dispose()
          }
        }
      }
    })
  })
  sceneObjects.clear()

  objects.value.forEach((data: DeskObject) => {
    const obj3D = createObject3D(data)
    if (obj3D) sceneObjects.set(data.id, obj3D)
  })

  // 桌子
  const deskData = objects.value.find((o: DeskObject) => o.type.startsWith('desk-'))
  const desk3D = deskData ? sceneObjects.get(deskData.id) : undefined

  if (desk3D) {
    scene.add(desk3D)
    desk3D.userData.isDesk = true
  }

  // 处理挂载
  objects.value.forEach((data: DeskObject) => {
    const obj3D = sceneObjects.get(data.id)
    if (!obj3D) return
    if (data.mountedToId) {
      const stand3D = sceneObjects.get(data.mountedToId)
      if (stand3D) {
        const standData = objects.value.find((o) => o.id === data.mountedToId)
        // 支架类型：圆形底座支架
        if (standData && standData.type === 'round-base-stand') {
          const { poleHeight, poleRadius, baseHeight, tilterAngleX, tilterAngleY, tilterAngleZ } =
            standData.params
          // 偏移被挂载物品Y轴至倾斜面顶部
          const objGroup = new THREE.Group()
          obj3D.position.y += poleRadius * 1.5
          objGroup.add(obj3D)
          objGroup.position.set(0, poleHeight + baseHeight, 0)
          objGroup.rotation.set(tilterAngleX, tilterAngleY, tilterAngleZ)
          stand3D.add(objGroup)
        }
        // 支架类型：方形底座支架
        if (standData && standData.type === 'rectangle-base-stand') {
          const {
            poleHeight,
            poleWidth,
            poleDepth,
            baseHeight,
            tilterAngleX,
            tilterAngleY,
            tilterAngleZ,
          } = standData.params
          // 偏移被挂载物品Y轴至倾斜面顶部
          const objGroup = new THREE.Group()
          const tilterPivotSize = Math.max(poleWidth, poleDepth) * 0.6
          obj3D.position.y += tilterPivotSize * 1.5
          objGroup.add(obj3D)
          objGroup.position.set(0, poleHeight + baseHeight, 0)
          objGroup.rotation.set(tilterAngleX, tilterAngleY, tilterAngleZ)
          stand3D.add(objGroup)
        }
      }
    } else if (!data.type.startsWith('desk-')) {
      if (desk3D) desk3D.add(obj3D)
      else scene.add(obj3D)
    }
  })

  // 场景重建后需要渲染
  requestRender()
}

// 场景销毁与资源回收
export const disposeScene = () => {
  //console.log('Disposing Three.js scene and controls...')

  // 停止渲染循环
  if (renderer) {
    renderer.setAnimationLoop(null)
  }

  // 销毁测量相关
  if (isMeasuring.value) {
    clearMeasurementUI()
    point1.value = null
    point2.value = null
    hideHoverMarker()
    isMeasuring.value = false
  }

  // 销毁 Controls 和移除它们的监听器
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

  // 移除在 initThree 中添加的 DOM 监听器
  if (domElement) {
    domElement.removeEventListener('mousedown', handleMouseDown)
    domElement.removeEventListener('mouseup', handleMouseUp)
    domElement.removeEventListener('mousemove', handleMouseMove) // 【新增】
    domElement.removeEventListener('mouseout', handleMouseOut) // 【新增】
  }

  // 清理和销毁场景中的所有对象（包括静态对象）
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
        // 灯光
        object.dispose?.()
      }
    })
    sceneObjects.clear() // 清空动态对象map
    scene = null
  }

  // 销毁 Renderer
  if (renderer) {
    renderer.dispose()
    renderer = null
  }

  // 移除 DOM 元素
  if (domElement) {
    domElement.remove()
    domElement = null
  }

  // 清理 2D 渲染器
  cleanupMeasurement()

  // 清理 HDR 资源
  if (pmremGenerator) {
    pmremGenerator.dispose()
    pmremGenerator = null
  }
  if (environmentTexture) {
    environmentTexture.dispose()
    environmentTexture = null
  }

  // 置空其他变量
  camera = null!
  perspectiveCamera = null!
  orthoCamera = null!
  selectionBox = null
  mouseDownInfo = { x: 0, y: 0, time: 0 }
  isControlPanelOpen.value = false
  isHelpModalOpen.value = false
  isAddModelModalOpen.value = false
  isPreviewOptionModalOpen.value = false

  //console.log('Scene disposal complete.')
}

// 切换相机投影模式
export const setCameraProjection = (projection: 'perspective' | 'orthographic') => {
  if (projection === 'perspective' && camera !== perspectiveCamera) {
    // 切换到透视
    camera = perspectiveCamera
  } else if (projection === 'orthographic' && camera !== orthoCamera) {
    // 切换到正交
    // 从当前透视相机的角度同步位置
    orthoCamera.position.copy(perspectiveCamera.position)
    orthoCamera.quaternion.copy(perspectiveCamera.quaternion)
    orthoCamera.zoom = 1 // 重置缩放
    camera = orthoCamera
  }

  // 更新控制器
  orbitControls.camera = camera
  transformControls.camera = camera

  // 更新相机投影矩阵
  handleResize()
  orbitControls.update()
  requestRender()
}

// 切换预设视图（仅限透视）
export const setCameraView = (view: 'default' | 'top' | 'front' | 'side') => {
  // 切换视图时，强制恢复到透视模式
  setCameraProjection('perspective')

  switch (view) {
    case 'top':
      perspectiveCamera.position.set(0, 2, 0.01) // 避免万向节锁
      break
    case 'front':
      perspectiveCamera.position.set(0, 1.2, 1)
      break
    case 'side':
      perspectiveCamera.position.set(2, 1.2, 0)
      break
    case 'default':
    default:
      perspectiveCamera.position.set(0, 1.7, 1.5)
      break
  }

  // 确保控制器看向桌面上方
  orbitControls.target.set(0, 0.95, 0)
  orbitControls.update()
  requestRender()
}
