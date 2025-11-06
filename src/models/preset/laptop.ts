import * as THREE from 'three'
import type { BaseObject } from '../deskObject'

export interface MacbookParams {
  width: number
  height: number
  depth: number
  color: string
  isMountable: boolean
}
export interface MacbookObject extends BaseObject {
  type: 'macbook'
  params: MacbookParams
}

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
    const p = data.params
    const mat = new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.7 })
    const body = new THREE.Group()
    const base = new THREE.Mesh(new THREE.BoxGeometry(p.width, p.height, p.depth), mat)
    const screen = new THREE.Mesh(new THREE.BoxGeometry(p.width, p.height, p.depth), mat)
    screen.rotation.x = Math.PI / 1.5
    screen.position.z = -p.depth / 2
    screen.position.y = p.height / 2
    body.add(base, screen)
    body.position.y = p.height / 2
    group.add(body)
  },
}
