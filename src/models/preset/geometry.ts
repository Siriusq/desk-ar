import * as THREE from 'three'
import type { BaseObject } from '@/models/deskObject'

// 自定义立方体
export interface CustomBoxParams {
  name: string | ''
  width: number
  height: number
  depth: number
  color: string
}
export interface CustomBoxObject extends BaseObject {
  type: 'custom-box'
  params: CustomBoxParams
}

export const customBoxModel = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'custom-box',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      width: 0.2,
      height: 0.4,
      depth: 0.5,
      color: '#BEBEBE',
    },
  }),
  buildGeometry: (group: THREE.Group, data: CustomBoxObject) => {
    const p = data.params
    const mat = new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.7 })
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(p.width, p.height, p.depth), mat)
    mesh.position.y = p.height / 2
    group.add(mesh)
  },
}

// 自定义圆柱体
export interface CustomCylinderParams {
  name: string | ''
  radiusTop: number
  radiusBottom: number
  height: number
  color: string
}
export interface CustomCylinderObject extends BaseObject {
  type: 'custom-cylinder'
  params: CustomCylinderParams
}

export const customCylinderModel = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'custom-cylinder',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      radiusTop: 0.1,
      radiusBottom: 0.1,
      height: 0.3,
      color: '#BEBEBE',
    },
  }),
  buildGeometry: (group: THREE.Group, data: CustomCylinderObject) => {
    const p = data.params
    const mat = new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.7 })
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(p.radiusTop, p.radiusBottom, p.height, 32),
      mat,
    )
    mesh.position.y = p.height / 2
    group.add(mesh)
  },
}

// 自定义球体
export interface CustomSphereParams {
  name: string | ''
  radius: number
  color: string
}
export interface CustomSphereObject extends BaseObject {
  type: 'custom-sphere'
  params: CustomSphereParams
}

export const customSphereModel = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'custom-sphere',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      radius: 0.15,
      color: '#BEBEBE',
    },
  }),
  buildGeometry: (group: THREE.Group, data: CustomSphereObject) => {
    const p = data.params
    const mat = new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.7 })
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(p.radius, 32, 16), mat)
    mesh.position.y = p.radius
    group.add(mesh)
  },
}
