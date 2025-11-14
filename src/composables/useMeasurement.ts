import i18n from '@/locales'
const { t } = i18n.global
import { ref, watch, computed } from 'vue'
import * as THREE from 'three'
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
import { scene, camera, renderer, transformControls, requestRender } from '@/three/sceneManager'
import { selectedObjectId } from './useObjects'

// --- 距离测量 ---

/** 切换测量模式 */
export const isMeasuring = ref(false)
/** 测量的起点 (世界坐标) */
export const point1 = ref<THREE.Vector3 | null>(null)
/** 测量的终点 (世界坐标) */
export const point2 = ref<THREE.Vector3 | null>(null)

// UI 提示状态
export const measurementHint = computed(() => {
  if (!isMeasuring.value) return ''
  if (!point1.value) return t('selectStartPoint')
  if (!point2.value) return t('selectEndPoint')
  return t('reselectStartPoint')
})

// --- 3D/2D UI 对象 ---
/** 2D 标签的渲染器 */
let cssRenderer: CSS2DRenderer
/** 场景中的测量线 */
let measurementLine: THREE.Line | null = null
/** 场景中的距离标签 */
let measurementLabel: CSS2DObject | null = null

// 高亮标记
let hoverMarker: THREE.Mesh | null = null
let point1Marker: THREE.Mesh | null = null
let point2Marker: THREE.Mesh | null = null
let markerGeometry: THREE.RingGeometry | null = null
let hoverMaterial: THREE.MeshBasicMaterial | null = null
let selectMaterial: THREE.MeshBasicMaterial | null = null

// --- Three.js 生命周期集成 ---

/**
 * [在 sceneManager.initThree 中调用]
 * 初始化 CSS2DRenderer 用于显示 HTML 标签
 * @param container 渲染器的 DOM 容器
 */
export const initMeasurement = (container: HTMLElement) => {
  cssRenderer = new CSS2DRenderer()
  cssRenderer.setSize(container.clientWidth, container.clientHeight)
  cssRenderer.domElement.style.position = 'absolute'
  cssRenderer.domElement.style.top = '0px'
  cssRenderer.domElement.style.pointerEvents = 'none' // 允许点击穿透
  container.appendChild(cssRenderer.domElement)

  // 初始化高亮标记为圆环
  markerGeometry = new THREE.RingGeometry(0.015, 0.02, 32) // 1.5cm - 2cm 环
  // 旋转几何体，使其“平躺”在 XZ 平面上，默认法线为 (0, 1, 0)
  markerGeometry.rotateX(-Math.PI / 2)

  hoverMaterial = new THREE.MeshBasicMaterial({
    color: 0xffcf26,
    depthTest: false,
  })
  selectMaterial = new THREE.MeshBasicMaterial({
    color: 0xf77c7c,
    depthTest: false,
  })

  hoverMarker = new THREE.Mesh(markerGeometry, hoverMaterial)
  hoverMarker.visible = false
  hoverMarker.renderOrder = 1000 // 始终在最前

  point1Marker = new THREE.Mesh(markerGeometry, selectMaterial)
  point1Marker.visible = false
  point1Marker.renderOrder = 1000

  point2Marker = new THREE.Mesh(markerGeometry, selectMaterial)
  point2Marker.visible = false
  point2Marker.renderOrder = 1000

  scene.add(hoverMarker, point1Marker, point2Marker)
}

/**
 * [在 sceneManager.setAnimationLoop 中调用]
 * 渲染 2D 标签
 */
export const renderMeasurement = () => {
  if (cssRenderer) {
    cssRenderer.render(scene, camera)
  }
}

/**
 * [在 sceneManager.handleResize 中调用]
 * 调整 2D 渲染器的大小
 */
export const resizeMeasurement = () => {
  if (cssRenderer && renderer) {
    cssRenderer.setSize(renderer.domElement.clientWidth, renderer.domElement.clientHeight)
  }
}

/**
 * [在 sceneManager.disposeScene 中调用]
 * 清理 2D 渲染器
 */
export const cleanupMeasurement = () => {
  if (cssRenderer) {
    cssRenderer.domElement.remove()
  }
  // 【修改】 释放标记的几何体
  markerGeometry?.dispose()
  hoverMaterial?.dispose()
  selectMaterial?.dispose()
}

/**
 * 清理场景中的测量 UI 元素
 * [垃圾回收]
 */
export const clearMeasurementUI = () => {
  // 清理 Line
  if (measurementLine) {
    scene.remove(measurementLine)
    measurementLine.geometry.dispose()
    ;(measurementLine.material as THREE.Material).dispose()
    measurementLine = null
  }
  // 清理 Label
  if (measurementLabel) {
    scene.remove(measurementLabel)
    if (measurementLabel.element.parentNode) {
      measurementLabel.element.parentNode.removeChild(measurementLabel.element)
    }
    measurementLabel = null
  }

  // 隐藏选中的标记
  if (point1Marker) point1Marker.visible = false
  if (point2Marker) point2Marker.visible = false

  requestRender()
}

/**
 * 绘制线和标签
 */
const drawMeasurement = () => {
  if (!point1.value || !point2.value) return

  // 清理旧的 UI
  clearMeasurementUI()

  // 绘制 3D 线
  const material = new THREE.LineBasicMaterial({
    color: 0xf77c7c,
    linewidth: 2,
    depthTest: false, // 始终在最前
  })
  const geometry = new THREE.BufferGeometry().setFromPoints([point1.value, point2.value])
  measurementLine = new THREE.Line(geometry, material)
  measurementLine.renderOrder = 999 // 确保在最前
  scene.add(measurementLine)

  // 计算距离和中点
  const distance = point1.value.distanceTo(point2.value)
  const midPoint = new THREE.Vector3().lerpVectors(point1.value, point2.value, 0.5)

  // 创建 HTML 标签
  const labelDiv = document.createElement('div')
  labelDiv.className = 'measurement-label'
  labelDiv.textContent = `${(distance * 1000).toFixed(0)} mm` // 转换为 mm
  labelDiv.style.color = '#fff'
  labelDiv.style.background = 'rgba(0, 0, 0, 0.7)'
  labelDiv.style.padding = '2px 5px'
  labelDiv.style.borderRadius = '3px'
  labelDiv.style.fontSize = '12px'

  // 创建 2D 对象并添加到场景
  measurementLabel = new CSS2DObject(labelDiv)
  measurementLabel.position.copy(midPoint)
  scene.add(measurementLabel)
}

// --- 核心功能 ---

/**
 * 接收 point 和 normal
 * @param point 射线命中的世界坐标点
 * @param normal 命中点的世界法线
 */
export const handleMeasurementClick = (point: THREE.Vector3, normal: THREE.Vector3) => {
  if (!isMeasuring.value) return

  // 定义圆环的默认“向上”法线
  const defaultNormal = new THREE.Vector3(0, 1, 0)

  if (!point1.value) {
    // 第一次点击：设置起点
    point1.value = point
    if (point1Marker) {
      point1Marker.position.copy(point)
      // 设置旋转
      point1Marker.quaternion.setFromUnitVectors(defaultNormal, normal)
      point1Marker.visible = true
    }
  } else if (!point2.value) {
    // 第二次点击：设置终点并绘制
    point2.value = point
    if (point2Marker) {
      point2Marker.position.copy(point)
      // 设置旋转
      point2Marker.quaternion.setFromUnitVectors(defaultNormal, normal)
      point2Marker.visible = true
    }
    drawMeasurement()
  } else {
    // 第三次点击：重置并开始新的测量
    clearMeasurementUI()
    point1.value = point
    point2.value = null
    if (point1Marker) {
      point1Marker.position.copy(point)
      // 设置旋转
      point1Marker.quaternion.setFromUnitVectors(defaultNormal, normal)
      point1Marker.visible = true
    }
  }

  requestRender()
}

/**
 * [在 MainPage.vue 中调用]
 * 切换测量模式的开/关
 */
export const toggleMeasurementMode = () => {
  isMeasuring.value = !isMeasuring.value

  requestRender()
}

/**
 * 接收 point 和 normal
 * @param point 射线命中的世界坐标点
 * @param normal 命中点的世界法线
 */
export const updateHoverMarker = (point: THREE.Vector3, normal: THREE.Vector3) => {
  if (hoverMarker && isMeasuring.value) {
    hoverMarker.position.copy(point)
    // 设置旋转
    const defaultNormal = new THREE.Vector3(0, 1, 0)
    hoverMarker.quaternion.setFromUnitVectors(defaultNormal, normal)
    hoverMarker.visible = true
  }
}

// 隐藏悬停标记
export const hideHoverMarker = () => {
  if (hoverMarker) {
    hoverMarker.visible = false
  }
}

// 监听测量模式状态
watch(isMeasuring, (isActive) => {
  if (isActive) {
    // 进入测量模式
    //orbitControls.enabled = false // 禁用相机旋转
    if (transformControls.object) {
      transformControls.detach() // 禁用变换控制器
    }
    selectedObjectId.value = null // 取消选中
  } else {
    // 退出测量模式
    //orbitControls.enabled = true // 恢复相机
    clearMeasurementUI() // [垃圾回收]
    point1.value = null
    point2.value = null
    // 确保悬停标记被隐藏
    hideHoverMarker()
  }
})
