import * as THREE from 'three'
import type { UniversalStandObject } from '../deskObject'

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
    const { baseSize, poleHeight, armLength, color } = data.params as UniversalStandObject['params']
    const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.7 })
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(baseSize / 2, baseSize / 2, 0.02, 32),
      mat,
    )
    base.position.y = 0.01
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, poleHeight, 16), mat)
    pole.position.y = poleHeight / 2 + 0.02
    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, armLength, 16), mat)
    arm.rotation.z = Math.PI / 2
    arm.position.x = armLength / 2
    arm.position.y = poleHeight + 0.02
    group.add(base, pole, arm)
  },
}
