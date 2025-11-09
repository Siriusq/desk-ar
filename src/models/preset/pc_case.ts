// 电脑机箱
import * as THREE from 'three'
import type { BaseObject } from '@/models/deskObject'

export interface PcCaseParams {
  name: string | ''
  preset: PcCasePresetKey | '' // 允许空字符串或预设名
  width: number
  height: number
  depth: number
  color: string
  isMountable: boolean
}
export interface PcCaseObject extends BaseObject {
  type: 'pc_case'
  params: PcCaseParams
}
// 预设尺寸
export const pcCasePresets = {
  itx: { width: 0.15, depth: 0.25, height: 0.25 },
  matx: { width: 0.2, depth: 0.4, height: 0.45 },
  atx: { width: 0.22, depth: 0.45, height: 0.5 },
  eatx: { width: 0.25, depth: 0.5, height: 0.6 },
  c24: { width: 0.155, depth: 0.249, height: 0.249 },
  'rider-r2': { width: 0.149, depth: 0.206, height: 0.278 },
} as const
export type PcCasePresetKey = keyof typeof pcCasePresets

export const pcCaseModel = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'pc_case',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      preset: '', // 默认无预设
      width: 0.2,
      height: 0.45,
      depth: 0.4,
      color: '#2b2b2b',
      isMountable: true,
    },
  }),
  buildGeometry: (group: THREE.Group, data: PcCaseObject) => {
    // 清空旧内容
    const p = data.params

    // ✅ 应用预设尺寸（如果有）
    if (p.preset && pcCasePresets[p.preset]) {
      const preset = pcCasePresets[p.preset]
      p.width = preset.width
      p.depth = preset.depth
      p.height = preset.height
    }
    const mat = new THREE.MeshStandardMaterial({
      color: p.color,
      metalness: 0.8, // 金属质感强
      roughness: 0.4, // 略有粗糙，模拟磨砂或喷砂金属
      envMapIntensity: 0.8, // 环境反射适中
    })

    const feetHeight = 0.02
    const bodyHeight = p.height - feetHeight

    // 机箱主体
    const body = new THREE.Mesh(new THREE.BoxGeometry(p.width, bodyHeight, p.depth), mat)
    body.position.set(0, p.height / 2, 0)

    // 机箱脚垫
    const ftGeo = new THREE.CylinderGeometry(0.01, 0.01, feetHeight, 16)
    const createFeet = (x: number, z: number) => {
      const ft = new THREE.Mesh(ftGeo, mat)
      ft.position.set(x, feetHeight / 2, z)
      return ft
    }
    const foot1 = createFeet(-p.width / 2 + 0.02, -p.depth / 2 + 0.02)
    const foot2 = createFeet(p.width / 2 - 0.02, -p.depth / 2 + 0.02)
    const foot3 = createFeet(-p.width / 2 + 0.02, p.depth / 2 - 0.02)
    const foot4 = createFeet(p.width / 2 - 0.02, p.depth / 2 - 0.02)

    const caseGroup = new THREE.Group()
    caseGroup.add(foot1, foot2, foot3, foot4)
    caseGroup.add(body)

    group.add(caseGroup)
  },
}
