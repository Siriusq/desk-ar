import * as THREE from 'three'
import type { BaseObject } from '../deskObject'

export interface UniversalStandParams {
  baseSize: number
  poleHeight: number
  armLength: number
  color: string
  mountedObjectId: string | null
}
export interface UniversalStandObject extends BaseObject {
  type: 'universal-stand'
  params: UniversalStandParams
}

export const universalStandModal = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'universal-stand',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      baseSize: 0.25,
      poleHeight: 0.4,
      armLength: 0.3,
      color: '#555555',
      mountedObjectId: null,
    },
  }),
  buildGeometry: (group: THREE.Group, data: UniversalStandObject) => {
    const p = data.params
    const mat = new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.7 })
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(p.baseSize / 2, p.baseSize / 2, 0.02, 32),
      mat,
    )
    base.position.y = 0.01
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, p.poleHeight, 16), mat)
    pole.position.y = p.poleHeight / 2 + 0.02
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, p.armLength, 16), mat)
    arm.rotation.z = Math.PI / 2
    arm.position.x = p.armLength / 2
    arm.position.y = p.poleHeight + 0.02
    group.add(base, pole, arm)
  },
}
