import i18n from '@/locales'
const { t } = i18n.global

import { disposeScene, renderer, transformControls } from '@/three/sceneManager'
import { nextTick, ref } from 'vue'
import { history, historyIndex, saveState } from './useHistory'
import { objects, sceneObjects, selectedObjectId } from './useObjects'
import { isPreviewing } from './useScene'
import {
  isAddModelModalOpen,
  isHelpModalOpen,
  addModalCategory,
  expandedObjectId,
} from './useUIState'
import router from '@/router'

export const layoutLoaded = ref(false)
export const sceneName = ref('')
export const isNewlyCreated = ref(false)

export const createNewLayout = () => {
  resetApplicationState()
  layoutLoaded.value = true
  isNewlyCreated.value = true
  sceneName.value = t('sceneNamePlaceholder')
  objects.splice(0)
  nextTick(() => {
    router.push('/main')
  })
}

export const loadLayoutFromFile = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (!target || !target.files || target.files.length === 0) {
    return
  }
  const file = target.files[0]
  if (!file) return

  console.log('loaded from file')

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const result = (e.target as FileReader).result
      if (typeof result === 'string') {
        resetApplicationState()

        const data = JSON.parse(result)
        sceneName.value = data.sceneName || t('sceneNamePlaceholder')
        objects.splice(0, objects.length, ...data.objects)
        layoutLoaded.value = true
        isNewlyCreated.value = false

        // 立即将这个新加载的布局保存到 localStorage
        // 这样如果用户刷新，它也会被保留
        saveState(true) // 强制保存当前状态

        console.log('Layout data loaded successfully from file.')

        nextTick(() => {
          router.push('/main')
        })
      }
    } catch (error) {
      console.error('Error parsing JSON file:', error)
    }
  }
  reader.readAsText(file)
  target.value = ''
}

// 【新增】函数：从 localStorage 加载自动保存的数据
export const loadAutoSaveData = () => {
  const autoSaveData = localStorage.getItem('ar-desk-planner-autosave')
  if (!autoSaveData) {
    return false // 没有自动保存数据
  }
  try {
    const data = JSON.parse(autoSaveData)
    sceneName.value = data.sceneName || t('sceneNamePlaceholder')
    objects.splice(0, objects.length, ...data.objects)
    layoutLoaded.value = true // 标记为已加载
    isNewlyCreated.value = false
    console.log('Auto-save data loaded successfully.')
    return true
  } catch (error) {
    console.error('Error parsing auto-save JSON:', error)
    localStorage.removeItem('ar-desk-planner-autosave') // 清理损坏的数据
    return false
  }
}

export const saveLayoutToFile = () => {
  const layoutData = {
    sceneName: sceneName.value,
    objects: JSON.parse(JSON.stringify(objects)),
  }
  const blob = new Blob([JSON.stringify(layoutData, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${sceneName.value.replace(/ /g, '_')}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const autoSave = () => {
  if (!layoutLoaded.value) return
  const layoutData = {
    sceneName: sceneName.value,
    objects: JSON.parse(JSON.stringify(objects)),
  }
  console.log('auto saved!')
  localStorage.setItem('ar-desk-planner-autosave', JSON.stringify(layoutData))
}

export const exitToWelcome = () => {
  // 1. 清理 3D 资源
  cleanupThreeResources()
  // 2. 清理状态和 localStorage
  resetApplicationState()
  // 3. 导航
  router.push('/')
}

// 【新增】函数：仅清理 Three.js 相关资源
// 这将在 MainPage.onUnmounted 时被调用
export const cleanupThreeResources = () => {
  if (transformControls) {
    transformControls.detach()
  }
  if (renderer) {
    renderer.dispose()
    renderer.domElement.remove()
    // disposeScene 会将 scene, camera, renderer 等变量设为 null
    disposeScene()
    sceneObjects.clear()
    console.log('Three.js resources disposed.')
  }
}

// 【新增】函数：重置应用状态和 localStorage
// 这将在 WelcomePage.onMounted 时被调用
export const resetApplicationState = () => {
  localStorage.removeItem('ar-desk-planner-autosave')
  layoutLoaded.value = false
  sceneName.value = ''
  objects.splice(0)
  selectedObjectId.value = null
  expandedObjectId.value = null
  history.value = []
  historyIndex.value = -1
  isAddModelModalOpen.value = false
  isHelpModalOpen.value = false
  addModalCategory.value = null
  isPreviewing.value = false
  isNewlyCreated.value = false
  console.log('Application state reset and autosave cleared.')
}
