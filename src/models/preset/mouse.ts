import * as THREE from 'three'
import type { MouseObject } from '../deskObject'

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
    const { width, height, depth, color } = data.params as MouseObject['params']
    const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.7 })
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat)
    mesh.position.y = height / 2
    group.add(mesh)
  },
}
