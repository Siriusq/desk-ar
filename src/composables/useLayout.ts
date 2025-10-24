/* eslint-disable @typescript-eslint/no-explicit-any */
import i18n from '@/locales'
const { t } = i18n.global

import {
  disposeScene,
  initThree,
  rebuildSceneFromData,
  renderer,
  transformControls,
} from '@/three/sceneManager'
import { nextTick, ref } from 'vue'
import { history, historyIndex, saveState } from './useHistory'
import { objects, sceneObjects, selectedObjectId } from './useObjects'
import { addObject } from '@/three/objectFactory'
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

export const createNewLayout = () => {
  layoutLoaded.value = true
  sceneName.value = t('sceneNamePlaceholder')
  objects.splice(0)
  nextTick(() => {
    router.push('/main')
    // initThree()
    // addObject('desk-rect')
  })
  // saveState()
}

export const loadLayoutFromFile = (event: { target: { files: any[]; value: string } }) => {
  const file = event.target.files[0]
  if (!file) return
  router.push('/main')
  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      loadLayoutData(JSON.parse(e.target!.result))
    } catch (error) {
      console.error('Error parsing JSON file:', error)
    }
  }
  reader.readAsText(file)
  event.target.value = ''
}

export const loadLayoutData = (data: { sceneName: any; objects: any }) => {
  sceneName.value = data.sceneName || t('sceneNamePlaceholder')
  objects.splice(0, objects.length, ...data.objects)
  layoutLoaded.value = true
  nextTick(() => {
    initThree()
    rebuildSceneFromData()
    saveState(false) // Load initial state without adding to history
  })
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
  localStorage.setItem('ar-desk-planner-autosave', JSON.stringify(layoutData))
}

export const exitToWelcome = () => {
  localStorage.removeItem('ar-desk-planner-autosave')
  if (transformControls) {
    transformControls.detach()
  }
  layoutLoaded.value = false
  sceneName.value = ''
  objects.splice(0)
  selectedObjectId.value = null
  expandedObjectId.value = null
  history.value = []
  historyIndex.value = -1
  isAddModelModalOpen.value = false
  isHelpModalOpen.value = false
  //isArModalOpen.value = false
  addModalCategory.value = null
  isPreviewing.value = false

  if (renderer) {
    renderer.dispose()
    renderer.domElement.remove()
    disposeScene()
    sceneObjects.clear()
  }
  router.push('/')
}
