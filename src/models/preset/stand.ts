import * as THREE from 'three'
import type { BaseObject } from '../deskObject'

export interface UniversalStandParams {
  name: string | ''
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
      name: '',
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

// 圆形底座支架
export interface RoundBaseStandParams {
  name: string | ''
  baseRadius: number
  baseHeight: number
  poleRadius: number
  poleHeight: number
  tilterSize: number
  tilterAngleX: number
  tilterAngleY: number
  tilterAngleZ: number
  color: string
  mountedObjectId: string | null
}
export interface RoundBaseStandObject extends BaseObject {
  type: 'round-base-stand'
  params: RoundBaseStandParams
}

export const roundBaseStandModal = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'round-base-stand',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      baseRadius: 0.05,
      baseHeight: 0.005,
      poleRadius: 0.005,
      poleHeight: 0.25,
      tilterSize: 0.05,
      tilterAngleX: 0,
      tilterAngleY: 0,
      tilterAngleZ: 0,
      color: '#555555',
      mountedObjectId: null,
    },
  }),
  buildGeometry: (group: THREE.Group, data: RoundBaseStandObject) => {
    const p = data.params
    const mat = new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.7 })
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(p.baseRadius, p.baseRadius, p.baseHeight, 32),
      mat,
    )
    base.position.y = p.baseHeight / 2

    const pole = new THREE.Mesh(
      new THREE.CylinderGeometry(p.poleRadius, p.poleRadius, p.poleHeight, 16),
      mat,
    )
    pole.position.y = p.poleHeight / 2 + p.baseHeight

    const tilterGroup = new THREE.Group()
    const tilterPivotSize = p.poleRadius * 1.2
    const tilter = new THREE.Mesh(
      new THREE.BoxGeometry(p.tilterSize, tilterPivotSize, p.tilterSize),
      mat,
    )

    const tilterPivot = new THREE.Mesh(new THREE.SphereGeometry(tilterPivotSize, 16, 16), mat)
    tilterGroup.add(tilterPivot)
    tilter.position.y = p.poleRadius / 2 + tilterPivotSize / 2
    tilterGroup.add(tilter)

    tilterGroup.position.y = p.poleHeight + p.baseHeight
    tilterGroup.rotation.x = p.tilterAngleX
    tilterGroup.rotation.y = p.tilterAngleY
    tilterGroup.rotation.z = p.tilterAngleZ
    group.add(base, pole, tilterGroup)
  },
}

// 矩形底座支架
export interface RectangleBaseStandParams {
  name: string | ''
  baseWidth: number
  baseDepth: number
  baseHeight: number
  poleWidth: number
  poleDepth: number
  poleHeight: number
  tilterSize: number
  tilterAngleX: number
  tilterAngleY: number
  tilterAngleZ: number
  color: string
  mountedObjectId: string | null
}
export interface RectangleBaseStandObject extends BaseObject {
  type: 'rectangle-base-stand'
  params: RectangleBaseStandParams
}

export const rectangleBaseStandModal = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'rectangle-base-stand',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      baseWidth: 0.1,
      baseDepth: 0.06,
      baseHeight: 0.005,
      poleWidth: 0.01,
      poleDepth: 0.01,
      poleHeight: 0.25,
      tilterSize: 0.05,
      tilterAngleX: 0,
      tilterAngleY: 0,
      tilterAngleZ: 0,
      color: '#555555',
      mountedObjectId: null,
    },
  }),
  buildGeometry: (group: THREE.Group, data: RectangleBaseStandObject) => {
    const p = data.params
    const mat = new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.7 })
    const base = new THREE.Mesh(new THREE.BoxGeometry(p.baseWidth, p.baseHeight, p.baseDepth), mat)
    base.position.y = p.baseHeight / 2

    const pole = new THREE.Mesh(new THREE.BoxGeometry(p.poleWidth, p.poleHeight, p.poleDepth), mat)
    pole.position.y = p.poleHeight / 2 + p.baseHeight

    const tilterGroup = new THREE.Group()
    const tilterPivotSize = Math.max(p.poleWidth, p.poleDepth) * 0.6
    const tilter = new THREE.Mesh(
      new THREE.BoxGeometry(p.tilterSize, tilterPivotSize, p.tilterSize),
      mat,
    )

    const tilterPivot = new THREE.Mesh(new THREE.SphereGeometry(tilterPivotSize, 16, 16), mat)
    tilterGroup.add(tilterPivot)
    tilter.position.y = tilterPivotSize
    tilterGroup.add(tilter)

    tilterGroup.position.y = p.poleHeight + p.baseHeight
    tilterGroup.rotation.x = p.tilterAngleX
    tilterGroup.rotation.y = p.tilterAngleY
    tilterGroup.rotation.z = p.tilterAngleZ
    group.add(base, pole, tilterGroup)
  },
}
