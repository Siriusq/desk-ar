import * as THREE from 'three'
import type { BaseObject } from '@/models/deskObject'

// 透明玻璃杯
export interface WaterGlassParams {
  name: string | ''
  height: number
  radius: number
  color: string
  isMountable: boolean
}

export interface WaterGlassObject extends BaseObject {
  type: 'water-glass'
  params: WaterGlassParams
}

export const waterGlassModel = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'water-glass',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      height: 0.18,
      radius: 0.025,
      color: '#e7edffff',
      isMountable: false,
    },
  }),
  buildGeometry: (group: THREE.Group, data: WaterGlassObject) => {
    const p = data.params
    const c = new THREE.Color(0xffffff)

    const glassCupMaterial = new THREE.MeshPhysicalMaterial({
      color: c.lerp(new THREE.Color(p.color), 1),
      metalness: 0.0, // 非金属
      roughness: 0.05, // 微微粗糙，柔和反光
      transmission: 1.0, // 完全透光
      thickness: 0.05, // 玻璃厚度（可调节透射折射强度）
      ior: 1.52, // 普通玻璃折射率
      reflectivity: 0.5, // 高反射率，表现出玻璃光泽
      clearcoat: 1.0, // 表面光滑镀膜
      clearcoatRoughness: 0.02,
      envMapIntensity: 0.1, // 环境反射适中
      transparent: true, // 启用透明
      opacity: 1.0,
      side: THREE.DoubleSide, // 让杯壁内外都能正确渲染
    })

    // 杯底
    const bottom = new THREE.Mesh(
      new THREE.CylinderGeometry(p.radius, p.radius, 0.01, 32, 1),
      glassCupMaterial,
    )
    bottom.position.y = 0.005

    // 杯壁
    const wallHeight = p.height - 0.01
    const wall = new THREE.Mesh(
      new THREE.CylinderGeometry(p.radius, p.radius, wallHeight, 32, 1, true),
      glassCupMaterial,
    )
    wall.position.y = wallHeight * 0.5 + 0.01

    const innerRadius = p.radius * 0.9
    const innerWall = new THREE.Mesh(
      new THREE.CylinderGeometry(innerRadius, innerRadius, wallHeight, 32, 1, true),
      glassCupMaterial,
    )
    innerWall.position.y = wallHeight * 0.5 + 0.01

    // 封顶
    const wallTop = new THREE.Mesh(
      new THREE.RingGeometry(innerRadius, p.radius, 32),
      glassCupMaterial,
    )
    wallTop.rotation.x = Math.PI * 0.5
    wallTop.position.y = p.height

    group.add(bottom, wall, innerWall, wallTop)
  },
}
