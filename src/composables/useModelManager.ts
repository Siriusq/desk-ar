import { type Ref, shallowRef } from 'vue'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Group } from 'three'

/**
 * Interface for a model loaded into the scene.
 */
export interface LoadedModel {
  id: string
  name: string
  scene: Group // Using Group or Scene to store the model
}

// Global state for storing loaded models
// Using shallowRef to prevent Vue from deeply observing the large Three.js objects
const models: Ref<LoadedModel[]> = shallowRef([])

// Initialize GLTFLoader
const loader = new GLTFLoader()

/**
 * Generates a simple unique ID.
 */
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2)
}

/**
 * Loads a GLTF/GLB model from a File object.
 * @param file The GLTF or GLB file selected by the user.
 */
export function useModelManager() {
  /**
   * Loads a model from a File object into the Three.js scene.
   * @param file The GLTF or GLB File object.
   */
  const loadModel = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        const url = event.target?.result as string

        // Load the model from the data URL
        loader.load(
          url,
          (gltf) => {
            const newModel: LoadedModel = {
              id: generateId(),
              name: file.name,
              // The loaded GLTF object contains scene, animations, cameras, etc.
              // We primarily use the scene group.
              scene: gltf.scene,
            }

            // Set the model's initial position or scale if necessary
            newModel.scene.traverse((child) => {
              // Example: enable shadows
              if ((child as any).isMesh) {
                child.castShadow = true
                child.receiveShadow = true
              }
            })

            // Add the new model to the shared state.
            models.value = [...models.value, newModel]
            console.log(
              `Model "${file.name}" loaded successfully. Total models: ${models.value.length}`,
            )
            resolve()
          },
          (error) => {
            if (error instanceof ProgressEvent && error.total === 0) {
              console.warn('Ignoring expected ProgressEvent error during Data URL loading.', error)
              // 如果是假阳性错误，我们忽略它，不调用 reject()，因为模型通常会成功加载。
              return
            }

            // 如果是其他类型的错误，则认为是真正的加载/解析失败
            console.error('An actual error happened during model loading or parsing:', error)
            reject(error)
          },
        )
      }

      reader.onerror = (error) => {
        console.error('File reading error:', error)
        reject(error)
      }

      reader.readAsDataURL(file)
    })
  }

  /**
   * Handles the file input change event to start loading the model.
   * @param event The change event from the file input.
   */
  const handleFileChange = (event: Event) => {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]

    if (file) {
      if (file.name.endsWith('.gltf') || file.name.endsWith('.glb')) {
        loadModel(file)
      } else {
        console.warn('Invalid file type selected. Please choose a .gltf or .glb file.')
      }
    }
    // Clear the input value to allow the same file to be selected again (important for repeat imports)
    target.value = ''
  }

  /**
   * Removes a model from the scene by its ID.
   * @param id The unique ID of the model to remove.
   */
  const removeModel = (id: string) => {
    models.value = models.value.filter((model) => model.id !== id)
    console.log(`Model with ID ${id} removed.`)
  }

  return {
    models,
    handleFileChange,
    removeModel,
    loadModel, // Expose loadModel if needed elsewhere
  }
}
