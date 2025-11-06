import * as THREE from 'three'
import type { BaseObject } from '../deskObject'

export interface IphoneParams {
  width: number
  height: number
  depth: number
  color: string
  isMountable: boolean
}
export interface IphoneObject extends BaseObject {
  type: 'iphone'
  params: IphoneParams
}

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
    const p = data.params
    const mat = new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.7 })
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(p.width, p.height, p.depth), mat)
    mesh.position.y = p.height / 2
    group.add(mesh)
  },
}
