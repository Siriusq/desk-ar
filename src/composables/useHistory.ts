import { computed, ref } from 'vue'
import { autoSave, sceneName } from './useLayout'
import { objects } from '@/composables/useObjects'
import { rebuildSceneFromData } from '@/three/sceneManager'

export const history = ref([])
export const historyIndex = ref(-1)
export const canUndo = computed(() => historyIndex.value > 0)
export const canRedo = computed(() => historyIndex.value < history.value.length - 1)

const deepClone = (obj: unknown) => JSON.parse(JSON.stringify(obj))

export const saveState = (shouldAutoSave = true) => {
  const currentState = {
    objects: deepClone(objects),
    sceneName: sceneName.value,
  }
  if (historyIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIndex.value + 1)
  }
  history.value.push(currentState)
  historyIndex.value++
  if (shouldAutoSave) autoSave()
}

export const loadState = (state: { sceneName: string; objects: unknown } | undefined) => {
  sceneName.value = state!.sceneName
  objects.splice(0, objects.length, ...deepClone(state!.objects))
  rebuildSceneFromData()
}

export const undo = () => {
  if (canUndo.value) {
    historyIndex.value--
    loadState(history.value[historyIndex.value])
  }
}

export const redo = () => {
  if (canRedo.value) {
    historyIndex.value++
    loadState(history.value[historyIndex.value])
  }
}
