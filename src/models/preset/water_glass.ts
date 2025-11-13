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

    const glassCupMaterial = new THREE.MeshStandardMaterial({
      color: c.lerp(new THREE.Color(p.color), 1),
      metalness: 0.0,
      roughness: 0.05, // 保持低粗糙度，模拟玻璃的高光泽
      envMapIntensity: 0.1,
      transparent: true,
      opacity: 0.3, // 将不透明度设置为一个低值，实现透明玻璃感
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
