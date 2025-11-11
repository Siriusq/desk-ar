import { computed, ref, type Ref } from 'vue'
import { autoSave, sceneName } from './useLayout'
import { objects } from './useObjects'
import { rebuildSceneFromData } from '@/three/sceneManager'
import type { DeskObject } from '@/models/deskObject'

// --- 历史记录 ---

// 历史状态接口
interface HistoryState {
  objects: DeskObject[]
  sceneName: string
}

export const history: Ref<HistoryState[]> = ref([])
export const historyIndex = ref(-1)
export const canUndo = computed(() => historyIndex.value > 0)
export const canRedo = computed(() => historyIndex.value < history.value.length - 1)

// 状态转存
const deepClone = (obj: DeskObject[]) => JSON.parse(JSON.stringify(obj))

export const saveState = (shouldAutoSave = true) => {
  const currentState = {
    objects: deepClone(objects.value),
    sceneName: sceneName.value,
  }
  if (historyIndex.value < history.value.length - 1) {
    history.value = history.value.slice(0, historyIndex.value + 1)
  }
  history.value.push(currentState)
  historyIndex.value++
  if (shouldAutoSave) autoSave()
}

export const loadState = (state: HistoryState) => {
  sceneName.value = state.sceneName
  objects.value.splice(0, objects.value.length, ...deepClone(state.objects))
  rebuildSceneFromData()
}

export const undo = () => {
  if (canUndo.value) {
    historyIndex.value--
    loadState(history.value[historyIndex.value]!)
  }
}

export const redo = () => {
  if (canRedo.value) {
    historyIndex.value++
    loadState(history.value[historyIndex.value]!)
  }
}
