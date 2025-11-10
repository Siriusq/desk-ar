import * as THREE from 'three'
import type { BaseObject } from '@/models/deskObject'

// 摄像头
export interface WebcamParams {
  name: string | ''
  width: number
  height: number
  depth: number
  color: string
  isMountable: boolean
}

export interface WebcamObject extends BaseObject {
  type: 'webcam'
  params: WebcamParams
}

export const WebcamModel = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'webcam',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      width: 0.1,
      height: 0.027,
      depth: 0.027,
      color: '#2e2e2e',
      isMountable: true,
    },
  }),
  buildGeometry: (group: THREE.Group, data: WebcamObject) => {
    const p = data.params
    const c = new THREE.Color(p.color)

    const bodyMat = new THREE.MeshStandardMaterial({
      color: p.color,
      metalness: 0.8,
      roughness: 0.2,
    })

    const standMat = new THREE.MeshStandardMaterial({
      color: c.lerp(new THREE.Color(0x888888), 0.1),
      metalness: 0.2,
      roughness: 0.5,
    })

    const lensGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x202020,
      metalness: 0.0, // 非金属
      roughness: 0.02, // 非常光滑
      transmission: 0.95, // 高透光率
      thickness: 0.8, // 稍厚，增强折射感
      ior: 1.52, // 光学玻璃常见折射率
      reflectivity: 0.9, // 强反射
      clearcoat: 1.0, // 表面镀膜层
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.2, // 环境反射稍强
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide, // 前后两面都可见
    })

    const lensMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x587569, // 略带深色，模拟镀膜后的镜片
      metalness: 0.0, // 非金属
      roughness: 0.02, // 非常光滑
      transmission: 0.95, // 高透光率
      thickness: 0.8, // 稍厚，增强折射感
      ior: 1.52, // 光学玻璃常见折射率
      reflectivity: 0.9, // 强反射
      clearcoat: 1.0, // 表面镀膜层
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.2, // 环境反射稍强
      transparent: true,
      opacity: 1.0,
      side: THREE.DoubleSide, // 前后两面都可见
    })

    // 底座
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(p.width * 0.3, 0.006, p.depth * 2.4),
      standMat,
    )
    base.position.z = -p.depth * 0.7
    base.position.y = 0.003
    group.add(base)

    const baseFrontHook = new THREE.Mesh(
      new THREE.BoxGeometry(p.width * 0.3, 0.016, 0.006),
      standMat,
    )
    baseFrontHook.position.z = p.depth * 0.5 + 0.003
    baseFrontHook.position.y = -0.002
    group.add(baseFrontHook)

    const basetailHook = new THREE.Mesh(new THREE.BoxGeometry(p.width * 0.3, 0.04, 0.006), standMat)
    basetailHook.position.z = -p.depth * 1.9 - 0.003
    basetailHook.position.y = -0.014
    group.add(basetailHook)

    // 机身
    const bodyGroup = new THREE.Group()
    const body = new THREE.Mesh(
      new THREE.BoxGeometry(p.width - p.height, p.height, p.depth),
      bodyMat,
    )
    bodyGroup.position.y = p.height * 0.5 + 0.006
    bodyGroup.add(body)

    // 两端弧形
    const arcRadius = p.height * 0.5
    const arcGeometry = new THREE.CylinderGeometry(arcRadius, arcRadius, p.depth, 32, 1)

    const leftArc = new THREE.Mesh(arcGeometry, bodyMat)
    leftArc.rotation.x = Math.PI * 0.5
    leftArc.position.x = -p.width / 2 + arcRadius

    const rightArc = new THREE.Mesh(arcGeometry, bodyMat)
    rightArc.rotation.x = Math.PI * 0.5
    rightArc.position.x = p.width / 2 - arcRadius

    bodyGroup.add(leftArc, rightArc)

    // 镜头外壳
    const lensRadius = arcRadius * 0.8
    const lensShell = new THREE.Mesh(new THREE.TorusGeometry(lensRadius, 0.001, 6, 32), standMat)
    lensShell.position.z = 0.0005 + p.depth * 0.5
    bodyGroup.add(lensShell)

    // 镜头玻璃
    const lensGlass = new THREE.Mesh(new THREE.CircleGeometry(lensRadius, 32), lensGlassMaterial)
    lensGlass.position.z = 0.0005 + p.depth * 0.5
    bodyGroup.add(lensGlass)

    // 镜头
    const lens = new THREE.Mesh(new THREE.CircleGeometry(0.003, 32), lensMaterial)
    lens.position.z = 0.0006 + p.depth * 0.5
    bodyGroup.add(lens)

    // 麦克风开孔
    const mic = new THREE.Mesh(new THREE.CylinderGeometry(0.002, 0.002, 0.001, 32, 1), standMat)
    mic.rotation.x = Math.PI * 0.5
    mic.position.x = lensRadius * 1.5
    mic.position.z = 0.0005 + p.depth * 0.5
    bodyGroup.add(mic)

    bodyGroup.position.y = p.height * 0.5 + 0.006
    group.add(bodyGroup)
  },
}
