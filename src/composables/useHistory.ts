import { computed, ref, type Ref } from 'vue'
import { autoSave, sceneName } from './useLayout'
import { objects } from '@/composables/useObjects'
import { rebuildSceneFromData } from '@/three/sceneManager'
import type { DeskObject } from '@/models/deskObject'

// 【新增】 为历史状态定义一个接口
interface HistoryState {
  objects: DeskObject[]
  sceneName: string
}

// 【修改】 为 ref 提供 HistoryState 数组类型，解决 'never' 错误
export const history: Ref<HistoryState[]> = ref([])
export const historyIndex = ref(-1)
export const canUndo = computed(() => historyIndex.value > 0)
export const canRedo = computed(() => historyIndex.value < history.value.length - 1)

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

// 【修改】 修正 loadState 的签名和实现
export const loadState = (state: HistoryState) => {
  sceneName.value = state.sceneName
  // 【修复】 直接使用 state.objects，而不是 state.objects.value
  // 我们仍然需要 deepClone 来防止历史状态被意外修改
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
