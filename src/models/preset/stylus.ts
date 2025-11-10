import * as THREE from 'three'
import type { BaseObject } from '@/models/deskObject'

// 手写笔
export interface StylusParams {
  name: string | ''
  length: number
  radius: number
  color: string
  isMountable: boolean
}

export interface StylusObject extends BaseObject {
  type: 'stylus'
  params: StylusParams
}

export const stylusModel = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'stylus',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      length: 0.17,
      radius: 0.0045,
      color: '#ffffff',
      isMountable: true,
    },
  }),
  buildGeometry: (group: THREE.Group, data: StylusObject) => {
    const p = data.params
    const c = new THREE.Color(p.color)

    const bodyMat = new THREE.MeshStandardMaterial({
      color: p.color,
      metalness: 0.5,
      roughness: 0.4,
    })
    const tipMat = new THREE.MeshStandardMaterial({
      color: c.lerp(new THREE.Color(0x888888), 0.5),
      metalness: 0.5,
      roughness: 0.3,
      side: THREE.DoubleSide,
    })

    const stylusGroup = new THREE.Group()

    // 手写笔主体
    const bodyGeometry = new THREE.CylinderGeometry(p.radius, p.radius, p.length * 0.8, 16)
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMat)
    bodyMesh.position.y = -p.length * 0.4
    stylusGroup.add(bodyMesh)

    // 手写笔笔尖
    const tipGeometry = new THREE.ConeGeometry(p.radius, p.length * 0.15, 16)
    const tipMesh = new THREE.Mesh(tipGeometry, tipMat)
    tipMesh.position.y = p.length * 0.075
    stylusGroup.add(tipMesh)

    // 手写笔笔帽
    const capGeometry = new THREE.CapsuleGeometry(p.radius, p.length * 0.1, 8, 16)
    const capMesh = new THREE.Mesh(capGeometry, bodyMat)
    capMesh.position.y = -p.length * 0.8 + p.radius
    stylusGroup.add(capMesh)

    stylusGroup.rotation.x = Math.PI / 2 // 横放
    stylusGroup.position.y = p.radius // 放置在桌面上
    stylusGroup.position.z = p.length * 0.425

    group.add(stylusGroup)
  },
}
