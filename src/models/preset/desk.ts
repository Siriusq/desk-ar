import * as THREE from 'three'
import type { BaseObject } from '../deskObject'

export interface DeskRectParams {
  name: string | ''
  width: number
  depth: number
  height: number
  color: string
}
export interface DeskRectObject extends BaseObject {
  type: 'desk-rect'
  params: DeskRectParams
}

export interface DeskLParams {
  name: string | ''
  widthA: number
  depthA: number
  widthB: number
  depthB: number
  height: number
  color: string
}
export interface DeskLObject extends BaseObject {
  type: 'desk-l'
  params: DeskLParams
}

export const deskRectModel = {
  createData: (id: string) => ({
    id: id,
    type: 'desk-rect',
    position: { x: 0, y: 0, z: 0 }, // 桌子总是在 y=0
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      width: 1.2,
      depth: 0.6,
      height: 0.75,
      color: '#8B4513',
    },
  }),
  buildGeometry: (group: THREE.Group, data: DeskRectObject) => {
    const p = data.params
    const mat = new THREE.MeshStandardMaterial({
      color: p.color,
      roughness: 0.7,
      metalness: 0.0,
    })
    const top = new THREE.Mesh(new THREE.BoxGeometry(p.width, 0.04, p.depth), mat)
    top.position.y = p.height - 0.02
    group.add(top)
    // 腿部逻辑
    if (true) {
      const legGeom = new THREE.CylinderGeometry(0.03, 0.03, p.height - 0.04, 16)
      ;[
        [p.width / 2 - 0.05, p.depth / 2 - 0.05],
        [-p.width / 2 + 0.05, p.depth / 2 - 0.05],
        [p.width / 2 - 0.05, -p.depth / 2 + 0.05],
        [-p.width / 2 + 0.05, -p.depth / 2 + 0.05],
      ].forEach((x) => {
        const leg = new THREE.Mesh(legGeom, mat)
        leg.position.set(x[0] as number, (p.height - 0.04) / 2, x[1] as number)
        group.add(leg)
      })
    }
  },
}

export const deskLModel = {
  createData: (id: string) => ({
    id: id,
    type: 'desk-l',
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      widthA: 1.2,
      depthA: 0.6,
      widthB: 0.8,
      depthB: 0.5,
      height: 0.75,
      color: '#8B4513',
    },
  }),
  buildGeometry: (group: THREE.Group, data: DeskLObject) => {
    const p = data.params
    const mat = new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.7 })
    const y = p.height - 0.02 // 桌板中心Y高度

    // === 主桌面 ===
    const topA = new THREE.Mesh(new THREE.BoxGeometry(p.widthA, 0.04, p.depthA), mat)
    // 以直角点为基准，主桌向 X 轴正方向延伸
    topA.position.set(p.widthA / 2, y, p.depthA / 2)
    group.add(topA)

    // === 副桌面 ===
    const topB = new THREE.Mesh(new THREE.BoxGeometry(p.depthB, 0.04, p.widthB), mat)
    // 以直角点为基准，副桌向 Z 轴正方向延伸
    topB.position.set(p.depthB / 2, y, p.widthB / 2)
    group.add(topB)

    // === 桌腿 ===
    const legThickness = 0.04 // 立板厚度
    const legHeight = p.height - 0.04
    const yLegMid = (p.height - 0.04) / 2

    // 主桌右端整块腿（与主桌宽度一致）
    const legA = new THREE.Mesh(new THREE.BoxGeometry(legThickness, legHeight, p.depthA), mat)
    legA.position.set(p.widthA - legThickness / 2, yLegMid, p.depthA / 2)
    group.add(legA)

    // 副桌远端整块腿（与副桌宽度一致）
    const legB = new THREE.Mesh(new THREE.BoxGeometry(p.depthB, legHeight, legThickness), mat)
    legB.position.set(p.depthB / 2, yLegMid, p.widthB - legThickness / 2)
    group.add(legB)

    // 转角支撑板（可选）
    const legCorner = new THREE.Mesh(
      new THREE.BoxGeometry(legThickness, legHeight, legThickness),
      mat,
    )
    legCorner.position.set(legThickness / 2, yLegMid, legThickness / 2)
    group.add(legCorner)
  },
}
