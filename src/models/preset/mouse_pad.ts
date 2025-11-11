// 鼠标垫
import * as THREE from 'three'
import type { BaseObject } from '@/models/deskObject'

// 鼠标垫
export interface MousePadParams {
  name: string | ''
  preset: MousePadPresetKey | '' // 允许空字符串或预设名
  width: number
  depth: number
  thickness: number
  color: string
}

export interface MousePadObject extends BaseObject {
  type: 'mouse-pad'
  params: MousePadParams
}

// 预设尺寸
export const mousePadPresets = {
  small: { width: 0.26, depth: 0.215, thickness: 0.004 },
  medium: { width: 0.35, depth: 0.27, thickness: 0.004 },
  large: { width: 0.7, depth: 0.3, thickness: 0.004 },
  xl: { width: 0.8, depth: 0.3, thickness: 0.004 },
  xxl: { width: 0.9, depth: 0.4, thickness: 0.004 },
  xxxl: { width: 1.0, depth: 0.5, thickness: 0.004 },
  xxxxl: { width: 1.2, depth: 0.6, thickness: 0.004 },
} as const

export type MousePadPresetKey = keyof typeof mousePadPresets

export const mousePadModel = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'mouse-pad',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      preset: '', // 默认无预设
      width: 0.35,
      depth: 0.25,
      thickness: 0.004,
      color: '#333333',
    },
  }),
  buildGeometry: (group: THREE.Group, data: MousePadObject) => {
    const p = data.params
    // 应用预设尺寸（如果有）
    if (p.preset && mousePadPresets[p.preset]) {
      const preset = mousePadPresets[p.preset]
      p.width = preset.width
      p.depth = preset.depth
      p.thickness = preset.thickness
    }
    const mat = new THREE.MeshStandardMaterial({
      color: p.color,
      metalness: 0.0, // 无金属成分
      roughness: 0.9, // 很高的粗糙度，散射光强
      envMapIntensity: 0.2, // 环境反射弱
    })
    const pad = new THREE.Mesh(new THREE.BoxGeometry(p.width, p.thickness, p.depth), mat)
    pad.position.y = p.thickness / 2
    group.add(pad)
  },
}
