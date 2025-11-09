import * as THREE from 'three'
import type { BaseObject } from '../deskObject'

// 头戴式耳机
export interface HeadphoneParams {
  name: string | ''
  width: number
  depth: number
  color: string
  isMountable: boolean
}

export interface HeadphoneObject extends BaseObject {
  type: 'headphone'
  params: HeadphoneParams
}

export const headphoneModel = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'headphone',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      width: 0.18,
      depth: 0.08,
      color: '#333333',
      isMountable: true,
    },
  }),
  buildGeometry: (group: THREE.Group, data: HeadphoneObject) => {
    const p = data.params
    const c = new THREE.Color(p.color)
    const shellMat = new THREE.MeshStandardMaterial({
      color: p.color,
      metalness: 0.5,
      roughness: 0.4,
    })
    const cushionMat = new THREE.MeshStandardMaterial({
      color: c.lerp(new THREE.Color(0x888888), 0.2),
      metalness: 0.2,
      roughness: 0.7,
    })
    const innerMat = new THREE.MeshStandardMaterial({
      color: c.lerp(new THREE.Color(0x888888), 0.4),
      metalness: 0.1,
      roughness: 0.8,
    })

    // 头梁
    const headband = new THREE.Mesh(
      new THREE.TorusGeometry(p.width / 2, p.depth * 0.1, 8, 32, Math.PI * 1.2),
      shellMat,
    )
    headband.rotation.z = -Math.PI * 0.1
    headband.position.y = p.depth * 0.4

    const earCupGroup = new THREE.Group()
    // 扬声器外壳
    const earcupGeometry = new THREE.CylinderGeometry(p.depth * 0.5, p.depth * 0.4, 0.04, 32)
    const earCup = new THREE.Mesh(earcupGeometry, shellMat)
    earCup.position.set(0, 0.02, 0)
    earCupGroup.add(earCup)

    // 内衬
    const earInnerGeometry = new THREE.CylinderGeometry(p.depth * 0.45, p.depth * 0.45, 0.004, 16)
    const earInner = new THREE.Mesh(earInnerGeometry, innerMat)
    earInner.position.set(0, 0.042, 0)
    earCupGroup.add(earInner)

    // 耳垫
    const earCushionRadius = p.depth * 0.5 - 0.01
    const earCushionGeometry = new THREE.TorusGeometry(earCushionRadius, 0.01, 32, 32)
    const earCushion = new THREE.Mesh(earCushionGeometry, cushionMat)
    earCushion.rotation.x = Math.PI / 2
    earCushion.position.set(0, 0.04, 0)
    earCupGroup.add(earCushion)
    earCupGroup.rotation.z = -Math.PI * 0.42
    earCupGroup.position.y = -earCushionRadius * 0.5

    const leftEarcupGroup = earCupGroup.clone()
    leftEarcupGroup.position.set(-p.width / 2 - 0.004, 0, 0)
    const rightEarcupGroup = earCupGroup.clone()
    rightEarcupGroup.rotation.y = Math.PI
    rightEarcupGroup.position.set(p.width / 2 + 0.004, 0, 0)

    earCupGroup.clear()

    const headPhoneGroup = new THREE.Group()
    headPhoneGroup.add(leftEarcupGroup, rightEarcupGroup, headband)
    headPhoneGroup.position.y = -p.depth * 0.3 - p.width * 0.5
    group.add(headPhoneGroup)
  },
}
