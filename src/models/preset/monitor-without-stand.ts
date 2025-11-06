import * as THREE from 'three'
import type { BaseObject } from '../deskObject'

export interface MonitorWithoutStandParams {
  width: number
  height: number
  depth: number
  color: string
  curvatureR: number
  isMountable: boolean
}

export interface MonitorWithoutStandObject extends BaseObject {
  type: 'monitor-without-stand'
  params: MonitorWithoutStandParams
}

export const monitorWithoutStandModel = {
  createData: (id: string, yPos: number) => ({
    id,
    type: 'monitor-without-stand',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      width: 0.54,
      height: 0.32,
      depth: 0.03,
      color: '#333333',
      curvatureR: 0, // 0 表示平面
      isMountable: true,
    },
  }),

  buildGeometry: (group: THREE.Group, data: MonitorWithoutStandObject) => {
    const { width, height, depth, color, curvatureR } = data.params

    const border = 0.015 // 边框厚度
    const panelDepth = 0.002
    const panelSubdivisions = 90

    const matBody = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.6,
      metalness: 0.1,
    })

    const matPanel = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.2,
      metalness: 0.8,
    })

    while (group.children.length) group.remove(group.children[0]!)

    // === 曲面变形函数 ===
    const deformGeometry = (geo: THREE.BufferGeometry) => {
      const pos = geo.attributes.position!
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i)
        if (curvatureR > 0.1) {
          const theta = x / curvatureR
          const cosT = Math.cos(theta)
          const sinT = Math.sin(theta)
          const z0 = pos.getZ(i)
          pos.setX(i, curvatureR * sinT)
          pos.setZ(i, z0 + curvatureR * (1 - cosT))
        }
      }
      pos.needsUpdate = true
      geo.computeVertexNormals()
    }

    const widthSeg = panelSubdivisions
    const heightSeg = 1

    // === 面板（前表面）===
    const screenGroup = new THREE.Group()
    const panelGeo = new THREE.BoxGeometry(
      width - 2 * border,
      height - 2 * border,
      panelDepth,
      widthSeg,
      heightSeg,
      1,
    )
    deformGeometry(panelGeo)
    const panel = new THREE.Mesh(panelGeo, matPanel)
    panel.position.y = height / 2
    // 位于外框前表面
    panel.position.z = depth - panelDepth / 2 + 0.001
    screenGroup.add(panel)

    // 外框
    const frameGeo = new THREE.BoxGeometry(width, height, depth, widthSeg, heightSeg, 1)
    deformGeometry(frameGeo)
    const frame = new THREE.Mesh(frameGeo, matBody)
    frame.position.y = height / 2
    frame.position.z = depth / 2
    screenGroup.add(frame)

    screenGroup.position.y = -height / 2
    group.add(screenGroup)
  },
}
