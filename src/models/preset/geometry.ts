import * as THREE from 'three'
import type { CustomBoxObject } from '@/models/deskObject'

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
    const { width, height, depth, color } = data.params as CustomBoxObject['params']
    const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.7 })
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat)
    mesh.position.y = height / 2
    group.add(mesh)
  },
}
