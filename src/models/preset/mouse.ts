import * as THREE from 'three'
import type { BaseObject } from '../deskObject'

export interface MouseParams {
  width: number
  height: number
  depth: number
  color: string
}
export interface MouseObject extends BaseObject {
  type: 'mouse'
  params: MouseParams
}

export const mouseModal = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'mouse',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      width: 0.06,
      height: 0.03,
      depth: 0.1,
      color: '#333333',
    },
  }),
  buildGeometry: (group: THREE.Group, data: MouseObject) => {
    const p = data.params
    const mat = new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.7 })
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(p.width, p.height, p.depth), mat)
    mesh.position.y = p.height / 2
    group.add(mesh)
  },
}
