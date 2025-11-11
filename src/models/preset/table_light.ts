import * as THREE from 'three'
import type { BaseObject } from '@/models/deskObject'

// 台灯
// 圆形底座
export interface RoundBaseTableLightParams {
  name: string | ''
  baseRadius: number
  baseHeight: number
  poleWidth: number
  poleDepth: number
  poleHeight: number
  shellWidth: number
  shellLength: number
  shellThickness: number
  openAngle: number
  color: string
  isMountable: boolean
}
export interface RoundBaseTableLightObject extends BaseObject {
  type: 'round-base-table-light'
  params: RoundBaseTableLightParams
}

export const roundBaseTableLightModel = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'round-base-table-light',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      baseRadius: 0.085,
      baseHeight: 0.018,
      poleWidth: 0.032,
      poleDepth: 0.018,
      poleHeight: 0.4,
      shellWidth: 0.042,
      shellLength: 0.4,
      shellThickness: 0.012,
      openAngle: 0,
      color: '#ffffff',
      isMountable: false,
    },
  }),
  buildGeometry: (group: THREE.Group, data: RoundBaseTableLightObject) => {
    const p = data.params

    const bodyMat = new THREE.MeshStandardMaterial({
      color: p.color,
      metalness: 0.5,
      roughness: 0.4,
      side: THREE.DoubleSide,
    })
    const lightShellMat = new THREE.MeshPhysicalMaterial({
      color: 0xfff8e7, // 暖白色灯罩
      metalness: 0.0, // 无金属成分
      roughness: 0.2, // 略微粗糙，柔和漫反射
      transmission: 0.7, // 高透光度
      thickness: 0.4, // 模拟灯罩厚度
      ior: 1.45, // 折射率接近塑料或玻璃
      transparent: true, // 启用透明
      opacity: 0.9, // 允许部分光线通过
      envMapIntensity: 0.6, // 环境反射适中
      side: THREE.DoubleSide, // 内外都可见
    })

    //底座
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(p.baseRadius, p.baseRadius, p.baseHeight, 32),
      bodyMat,
    )
    base.position.y = p.baseHeight / 2
    group.add(base)

    // 灯杆
    const poleZPos = -p.baseRadius * 0.6 + p.poleDepth * 0.5
    const pole = new THREE.Mesh(
      new THREE.BoxGeometry(p.poleWidth, p.poleHeight, p.poleDepth),
      bodyMat,
    )
    pole.position.y = p.poleHeight / 2 + p.baseHeight
    pole.position.z = poleZPos
    group.add(pole)

    const pivotRadius = p.poleDepth * 0.7
    const polePivot = new THREE.Mesh(
      new THREE.CylinderGeometry(pivotRadius, pivotRadius, p.poleWidth, 16),
      bodyMat,
    )
    polePivot.rotation.z = Math.PI / 2
    polePivot.position.y = p.poleHeight + p.baseHeight + pivotRadius * 0.5
    polePivot.position.z = poleZPos
    group.add(polePivot)

    //灯组
    const pivotGroup = new THREE.Group()
    const shellPivot = new THREE.Mesh(
      new THREE.CylinderGeometry(pivotRadius, pivotRadius, p.poleWidth * 0.5, 16),
      bodyMat,
    )
    shellPivot.rotation.z = Math.PI / 2
    pivotGroup.add(shellPivot)

    const connectorHeight = 0.004 + pivotRadius
    const connector = new THREE.Mesh(
      new THREE.BoxGeometry(p.poleWidth * 0.5, connectorHeight, pivotRadius * 2),
      bodyMat,
    )
    connector.position.y = connectorHeight / 2
    pivotGroup.add(connector)

    const shell = new THREE.Mesh(
      new THREE.BoxGeometry(p.shellWidth, p.shellThickness, p.shellLength),
      bodyMat,
    )
    shell.position.z = p.shellLength * 0.4
    shell.position.y = p.shellThickness * 0.5 + 0.004 + pivotRadius
    pivotGroup.add(shell)

    const lightShell = new THREE.Mesh(
      new THREE.BoxGeometry(p.shellWidth * 0.8, 0.0004, p.shellLength * 0.7),
      lightShellMat,
    )
    lightShell.position.z = p.shellLength * 0.5
    lightShell.position.y = 0.004 + pivotRadius
    pivotGroup.add(lightShell)

    pivotGroup.position.y = p.poleHeight + p.baseHeight + pivotRadius * 0.5
    pivotGroup.position.z = poleZPos
    pivotGroup.rotation.x = -p.openAngle

    group.add(pivotGroup)
  },
}

// 方形底座
export interface RectangleBaseTableLightParams {
  name: string | ''
  baseWidth: number
  baseDepth: number
  baseHeight: number
  poleWidth: number
  poleDepth: number
  poleHeight: number
  shellWidth: number
  shellLength: number
  shellThickness: number
  openAngle: number
  color: string
  isMountable: boolean
}
export interface RectangleBaseTableLightObject extends BaseObject {
  type: 'rectangle-base-table-light'
  params: RectangleBaseTableLightParams
}

export const rectangleBaseTableLightModel = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'rectangle-base-table-light',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      baseWidth: 0.16,
      baseDepth: 0.18,
      baseHeight: 0.018,
      poleWidth: 0.032,
      poleDepth: 0.018,
      poleHeight: 0.4,
      shellWidth: 0.042,
      shellLength: 0.4,
      shellThickness: 0.012,
      openAngle: 0,
      color: '#ffffff',
      isMountable: false,
    },
  }),
  buildGeometry: (group: THREE.Group, data: RectangleBaseTableLightObject) => {
    const p = data.params

    const bodyMat = new THREE.MeshStandardMaterial({
      color: p.color,
      metalness: 0.5,
      roughness: 0.4,
      side: THREE.DoubleSide,
    })
    const lightShellMat = new THREE.MeshPhysicalMaterial({
      color: 0xfff8e7, // 暖白色灯罩
      metalness: 0.0, // 无金属成分
      roughness: 0.2, // 略微粗糙，柔和漫反射
      transmission: 0.7, // 高透光度
      thickness: 0.4, // 模拟灯罩厚度
      ior: 1.45, // 折射率接近塑料或玻璃
      transparent: true, // 启用透明
      opacity: 0.9, // 允许部分光线通过
      envMapIntensity: 0.6, // 环境反射适中
      side: THREE.DoubleSide, // 内外都可见
    })

    //底座
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(p.baseWidth, p.baseHeight, p.baseDepth),
      bodyMat,
    )
    base.position.y = p.baseHeight / 2
    group.add(base)

    // 灯杆
    const poleZPos = -p.baseDepth * 0.3 + p.poleDepth * 0.5
    const pole = new THREE.Mesh(
      new THREE.BoxGeometry(p.poleWidth, p.poleHeight, p.poleDepth),
      bodyMat,
    )
    pole.position.y = p.poleHeight / 2 + p.baseHeight
    pole.position.z = poleZPos
    group.add(pole)

    const pivotRadius = p.poleDepth * 0.7
    const polePivot = new THREE.Mesh(
      new THREE.CylinderGeometry(pivotRadius, pivotRadius, p.poleWidth, 16),
      bodyMat,
    )
    polePivot.rotation.z = Math.PI / 2
    polePivot.position.y = p.poleHeight + p.baseHeight + pivotRadius * 0.5
    polePivot.position.z = poleZPos
    group.add(polePivot)

    //灯组
    const pivotGroup = new THREE.Group()
    const shellPivot = new THREE.Mesh(
      new THREE.CylinderGeometry(pivotRadius, pivotRadius, p.poleWidth * 0.5, 16),
      bodyMat,
    )
    shellPivot.rotation.z = Math.PI / 2
    pivotGroup.add(shellPivot)

    const connectorHeight = 0.004 + pivotRadius
    const connector = new THREE.Mesh(
      new THREE.BoxGeometry(p.poleWidth * 0.5, connectorHeight, pivotRadius * 2),
      bodyMat,
    )
    connector.position.y = connectorHeight / 2
    pivotGroup.add(connector)

    const shell = new THREE.Mesh(
      new THREE.BoxGeometry(p.shellWidth, p.shellThickness, p.shellLength),
      bodyMat,
    )
    shell.position.z = p.shellLength * 0.4
    shell.position.y = p.shellThickness * 0.5 + 0.004 + pivotRadius
    pivotGroup.add(shell)

    const lightShell = new THREE.Mesh(
      new THREE.BoxGeometry(p.shellWidth * 0.8, 0.0004, p.shellLength * 0.7),
      lightShellMat,
    )
    lightShell.position.z = p.shellLength * 0.5
    lightShell.position.y = 0.004 + pivotRadius
    pivotGroup.add(lightShell)

    pivotGroup.position.y = p.poleHeight + p.baseHeight + pivotRadius * 0.5
    pivotGroup.position.z = poleZPos
    pivotGroup.rotation.x = -p.openAngle

    group.add(pivotGroup)
  },
}
