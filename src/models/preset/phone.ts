import * as THREE from 'three'
import type { IphoneObject } from '../deskObject'

export const iphoneModal = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'iphone',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      width: 0.07,
      height: 0.008,
      depth: 0.14,
      color: '#E0E0E0',
      isMountable: true,
    },
  }),
  buildGeometry: (group: THREE.Group, data: IphoneObject) => {
    const { width, height, depth, color } = data.params as IphoneObject['params']
    const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.7 })
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat)
    mesh.position.y = height / 2
    group.add(mesh)
  },
}
