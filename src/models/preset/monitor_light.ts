import * as THREE from 'three'
import type { BaseObject } from '@/models/deskObject'

// 屏幕挂灯
export interface MonitorLightParams {
  name: string | ''
  width: number
  radius: number
  depth: number
  color: string
  isMountable: boolean
}

export interface MonitorLightObject extends BaseObject {
  type: 'monitor-light'
  params: MonitorLightParams
}

export const monitorLightModel = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'monitor-light',
    position: { x: 0, y: yPos + 0.5, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      width: 0.4,
      radius: 0.012,
      depth: 0.035,
      color: '#ffffff',
      isMountable: true,
    },
  }),
  buildGeometry: (group: THREE.Group, data: MonitorLightObject) => {
    const p = data.params

    const bodyMat = new THREE.MeshStandardMaterial({
      color: p.color,
      metalness: 0.5,
      roughness: 0.4,
      side: THREE.DoubleSide,
    })

    // 灯体主体
    const lightGroup = new THREE.Group()
    // 两端
    const capGeometry = new THREE.CylinderGeometry(p.radius, p.radius, p.width * 0.025, 32)
    const leftCapMesh = new THREE.Mesh(capGeometry, bodyMat)
    const rightCapMesh = new THREE.Mesh(capGeometry, bodyMat)
    leftCapMesh.position.y = -p.width * 0.4875
    rightCapMesh.position.y = p.width * 0.4875
    lightGroup.add(leftCapMesh, rightCapMesh)

    // 外壳
    const bodyGeometry = new THREE.CylinderGeometry(
      p.radius,
      p.radius,
      p.width * 0.95,
      24,
      1,
      true,
      -Math.PI * 0.1,
      Math.PI * 1.5,
    )
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMat)
    lightGroup.add(bodyMesh)

    // 灯罩
    const lightShellGeometry = new THREE.CylinderGeometry(
      p.radius,
      p.radius,
      p.width * 0.95,
      8,
      1,
      true,
      Math.PI * 1.4,
      Math.PI * 0.5,
    )
    const lightShellMat = new THREE.MeshStandardMaterial({
      color: 0xfff8e7, // 基础颜色
      metalness: 0.0,
      roughness: 1.0, // 让光线更柔和地散开，近似透光效果。
      // emissive 模拟灯泡的发光效果，提升视觉上的“亮”感
      emissive: 0xfff8e7,
      emissiveIntensity: 1.5, // 强度可调整，让它亮起来
      transparent: true, // 透明度模拟半透
      opacity: 0.9, // 略微不透明
    })
    const lightShellMesh = new THREE.Mesh(lightShellGeometry, lightShellMat)
    lightGroup.add(lightShellMesh)
    lightGroup.rotation.z = Math.PI / 2
    lightGroup.position.z = (p.depth + p.radius) * 0.5
    lightGroup.position.y = p.radius + 0.01

    //支架
    const armGroup = new THREE.Group()
    const armGeometry = new THREE.BoxGeometry(p.width * 0.2, 0.006, p.depth)
    const armMesh = new THREE.Mesh(armGeometry, bodyMat)
    armMesh.position.y = 0.003
    armGroup.add(armMesh)

    // 支架尾部挂钩
    const armHookMesh = new THREE.Mesh(armGeometry, bodyMat)
    armHookMesh.rotation.x = Math.PI / 2
    armHookMesh.position.y = -p.depth / 2
    armHookMesh.position.z = -p.depth * 0.5 + 0.003
    armGroup.add(armHookMesh)

    // 支架连接部分
    const armConnectorGeometry = new THREE.BoxGeometry(p.width * 0.2, 0.006, 0.016)
    const armConnectorMesh = new THREE.Mesh(armConnectorGeometry, bodyMat)
    armConnectorMesh.rotation.x = Math.PI / 2
    armConnectorMesh.position.y = 0.008
    armConnectorMesh.position.z = p.depth * 0.5
    armGroup.add(armConnectorMesh)

    group.add(lightGroup)
    group.add(armGroup)
  },
}
