import * as THREE from 'three'
import type { BaseObject } from '@/models/deskObject'

// 自定义立方体
export interface CustomBoxParams {
  width: number
  height: number
  depth: number
  color: string
}
export interface CustomBoxObject extends BaseObject {
  type: 'custom-box'
  params: CustomBoxParams
}

export const cubeModal = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'custom-box',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      width: 0.2,
      height: 0.4,
      depth: 0.5,
      color: '#BEBEBE',
    },
  }),
  buildGeometry: (group: THREE.Group, data: CustomBoxObject) => {
    const p = data.params
    const mat = new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.7 })
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(p.width, p.height, p.depth), mat)
    mesh.position.y = p.height / 2
    group.add(mesh)
  },
}
