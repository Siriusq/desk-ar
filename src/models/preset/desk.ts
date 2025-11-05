import * as THREE from 'three'
import type { DeskLObject, DeskRectObject } from '../deskObject'

export const deskRectModel = {
  createData: (id: string) => ({
    id: id,
    type: 'desk-rect',
    position: { x: 0, y: 0, z: 0 }, // 桌子总是在 y=0
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      width: 1.2,
      depth: 0.6,
      height: 0.75,
      color: '#8B4513',
    },
  }),
  buildGeometry: (group: THREE.Group, data: DeskRectObject) => {
    const { width, depth, height, color } = data.params as DeskRectObject['params']
    const mat = new THREE.MeshStandardMaterial({
      color: color,
      roughness: 0.7,
      metalness: 0.0,
    })
    const top = new THREE.Mesh(new THREE.BoxGeometry(width, 0.04, depth), mat)
    top.position.y = height - 0.02
    group.add(top)
    // 腿部逻辑
    if (true) {
      const legGeom = new THREE.CylinderGeometry(0.03, 0.03, height - 0.04, 16)
      ;[
        [width / 2 - 0.05, depth / 2 - 0.05],
        [-width / 2 + 0.05, depth / 2 - 0.05],
        [width / 2 - 0.05, -depth / 2 + 0.05],
        [-width / 2 + 0.05, -depth / 2 + 0.05],
      ].forEach((p) => {
        const leg = new THREE.Mesh(legGeom, mat)
        leg.position.set(p[0] as number, (height - 0.04) / 2, p[1] as number)
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
      widthA: 1.2,
      depthA: 0.6,
      widthB: 0.8,
      depthB: 0.5,
      height: 0.75,
      color: '#8B4513',
    },
  }),
  buildGeometry: (group: THREE.Group, data: DeskLObject) => {
    const { widthA, depthA, widthB, depthB, height, color } = data.params as DeskLObject['params']
    const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.7 })
    const y = height - 0.02 // 桌板中心Y高度

    // === 主桌面 ===
    const topA = new THREE.Mesh(new THREE.BoxGeometry(widthA, 0.04, depthA), mat)
    // 以直角点为基准，主桌向 X 轴正方向延伸
    topA.position.set(widthA / 2, y, depthA / 2)
    group.add(topA)

    // === 副桌面 ===
    const topB = new THREE.Mesh(new THREE.BoxGeometry(depthB, 0.04, widthB), mat)
    // 以直角点为基准，副桌向 Z 轴正方向延伸
    topB.position.set(depthB / 2, y, widthB / 2)
    group.add(topB)

    // === 桌腿 ===
    const legThickness = 0.04 // 立板厚度
    const legHeight = height - 0.04
    const yLegMid = (height - 0.04) / 2

    // 主桌右端整块腿（与主桌宽度一致）
    const legA = new THREE.Mesh(new THREE.BoxGeometry(legThickness, legHeight, depthA), mat)
    legA.position.set(widthA - legThickness / 2, yLegMid, depthA / 2)
    group.add(legA)

    // 副桌远端整块腿（与副桌宽度一致）
    const legB = new THREE.Mesh(new THREE.BoxGeometry(depthB, legHeight, legThickness), mat)
    legB.position.set(depthB / 2, yLegMid, widthB - legThickness / 2)
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
