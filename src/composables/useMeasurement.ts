// src/composables/useMeasurement.ts
import { ref, watch, computed } from 'vue'
import * as THREE from 'three'
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'
import { scene, camera, renderer, transformControls, orbitControls } from '@/three/sceneManager'
import { selectedObjectId } from './useObjects'

// --- 状态 ---
/** 切换测量模式 */
export const isMeasuring = ref(false)
/** 测量的第一个点 (世界坐标) */
const point1 = ref<THREE.Vector3 | null>(null)
/** 测量的第二个点 (世界坐标) */
const point2 = ref<THREE.Vector3 | null>(null)

// 【新增】 UI 提示状态 (请求 3)
export const measurementHint = computed(() => {
  if (!isMeasuring.value) return ''
  if (!point1.value) return '请选择第一个端点'
  if (!point2.value) return '请选择第二个端点'
  return '再次单击以重新选择端点'
})

// --- 3D/2D UI 对象 ---
/** 2D 标签的渲染器 */
let cssRenderer: CSS2DRenderer
/** 场景中的测量线 */
let measurementLine: THREE.Line | null = null
/** 场景中的距离标签 */
let measurementLabel: CSS2DObject | null = null

// 【新增】 高亮标记 (请求 1 & 2)
let hoverMarker: THREE.Mesh | null = null
let point1Marker: THREE.Mesh | null = null
let point2Marker: THREE.Mesh | null = null
let markerGeometry: THREE.SphereGeometry | null = null
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

  // 【新增】 初始化高亮标记
  markerGeometry = new THREE.SphereGeometry(0.015, 16, 16) // 1.5cm 小球
  hoverMaterial = new THREE.MeshBasicMaterial({
    color: 0xffcf26,
    transparent: true,
    opacity: 0.5,
    depthTest: false,
  })
  selectMaterial = new THREE.MeshBasicMaterial({
    color: 0xf77c7c,
    transparent: true,
    opacity: 0.5,
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

  // 【新增】 释放标记的几何体和材质
  markerGeometry?.dispose()
  hoverMaterial?.dispose()
  selectMaterial?.dispose()
}

/**
 * 清理场景中的测量 UI 元素
 * [垃圾回收]
 */
const clearMeasurementUI = () => {
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

  // 【新增】 隐藏选中的标记
  if (point1Marker) point1Marker.visible = false
  if (point2Marker) point2Marker.visible = false
}

/**
 * 绘制线和标签
 */
const drawMeasurement = () => {
  if (!point1.value || !point2.value) return

  // 1. 清理旧的 UI
  clearMeasurementUI()

  // 2. 绘制 3D 线
  const material = new THREE.LineBasicMaterial({
    color: 0xf77c7c,
    linewidth: 2,
    depthTest: false, // 始终在最前
  })
  const geometry = new THREE.BufferGeometry().setFromPoints([point1.value, point2.value])
  measurementLine = new THREE.Line(geometry, material)
  measurementLine.renderOrder = 999 // 确保在最前
  scene.add(measurementLine)

  // 3. 计算距离和中点
  const distance = point1.value.distanceTo(point2.value)
  const midPoint = new THREE.Vector3().lerpVectors(point1.value, point2.value, 0.5)

  // 4. 创建 HTML 标签
  const labelDiv = document.createElement('div')
  labelDiv.className = 'measurement-label'
  labelDiv.textContent = `${(distance * 1000).toFixed(0)} mm` // 转换为 mm
  labelDiv.style.color = '#fff'
  labelDiv.style.background = 'rgba(0, 0, 0, 0.7)'
  labelDiv.style.padding = '2px 5px'
  labelDiv.style.borderRadius = '3px'
  labelDiv.style.fontSize = '12px'

  // 5. 创建 2D 对象并添加到场景
  measurementLabel = new CSS2DObject(labelDiv)
  measurementLabel.position.copy(midPoint)
  scene.add(measurementLabel)
}

// --- 核心功能 ---

/**
 * [在 useObjects.handleSceneClick 中调用]
 * 处理测量模式下的点击
 * @param point 射线命中的世界坐标点
 */
export const handleMeasurementClick = (point: THREE.Vector3) => {
  if (!isMeasuring.value) return

  if (!point1.value) {
    // 第一次点击：设置起点
    point1.value = point
    // 【新增】 显示高亮标记 2
    if (point1Marker) {
      point1Marker.position.copy(point)
      point1Marker.visible = true
    }
  } else if (!point2.value) {
    // 第二次点击：设置终点并绘制
    point2.value = point
    // 【新增】 显示高亮标记 2
    if (point2Marker) {
      point2Marker.position.copy(point)
      point2Marker.visible = true
    }
    drawMeasurement()
  } else {
    // 第三次点击：重置并开始新的测量
    clearMeasurementUI()
    point1.value = point
    point2.value = null
    // 【新增】 显示高亮标记 1
    if (point1Marker) {
      point1Marker.position.copy(point)
      point1Marker.visible = true
    }
  }
}

/**
 * [在 MainPage.vue 中调用]
 * 切换测量模式的开/关
 */
export const toggleMeasurementMode = () => {
  isMeasuring.value = !isMeasuring.value
}

// 【新增】 更新悬停标记 (请求 1)
export const updateHoverMarker = (point: THREE.Vector3) => {
  if (hoverMarker && isMeasuring.value) {
    hoverMarker.position.copy(point)
    hoverMarker.visible = true
  }
}

// 【新增】 隐藏悬停标记 (请求 1)
export const hideHoverMarker = () => {
  if (hoverMarker) {
    hoverMarker.visible = false
  }
}

// 监听测量模式状态
watch(isMeasuring, (isActive) => {
  if (isActive) {
    // 进入测量模式
    orbitControls.enabled = false // 禁用相机旋转
    if (transformControls.object) {
      transformControls.detach() // 禁用变换控制器
    }
    selectedObjectId.value = null // 取消选中
  } else {
    // 退出测量模式
    orbitControls.enabled = true // 恢复相机
    clearMeasurementUI() // [垃圾回收]
    point1.value = null
    point2.value = null
    // 【新增】 确保悬停标记被隐藏
    hideHoverMarker()
  }
})
