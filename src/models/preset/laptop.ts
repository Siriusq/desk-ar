import * as THREE from 'three'
import type { MacbookObject } from '../deskObject'

export const macbookModal = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'macbook',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      width: 0.3,
      height: 0.015,
      depth: 0.21,
      color: '#CCCCCC',
      isMountable: true,
    },
  }),
  buildGeometry: (group: THREE.Group, data: MacbookObject) => {
    const { width, height, depth, color } = data.params as MacbookObject['params']
    const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.7 })
    const body = new THREE.Group()
    const base = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat)
    const screen = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat)
    screen.rotation.x = Math.PI / 1.5
    screen.position.z = -depth / 2
    screen.position.y = height / 2
    body.add(base, screen)
    body.position.y = height / 2
    group.add(body)
  },
}
