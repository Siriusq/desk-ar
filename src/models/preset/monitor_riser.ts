// 桌面增高架
import * as THREE from 'three'
import type { BaseObject } from '../deskObject'

export interface MonitorRiserParams {
  name: string | ''
  width: number
  depth: number
  height: number
  panelThickness: number
  color: string
  isMountable: boolean
}
export interface MonitorRiserObject extends BaseObject {
  type: 'monitor-riser'
  params: MonitorRiserParams
}

export const monitorRiserModel = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'monitor-riser',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      width: 0.5,
      depth: 0.255,
      height: 0.07,
      panelThickness: 0.02,
      color: '#eeeeee',
      isMountable: false,
    },
  }),
  buildGeometry: (group: THREE.Group, data: MonitorRiserObject) => {
    const p = data.params
    const mat = new THREE.MeshStandardMaterial({
      color: p.color,
      roughness: 0.7,
      metalness: 0.2,
    })

    const panel = new THREE.Mesh(new THREE.BoxGeometry(p.width, p.panelThickness, p.depth), mat)
    panel.position.y = p.height - p.panelThickness / 2
    group.add(panel)

    // 支架
    const legGeom = new THREE.BoxGeometry(0.015, p.height - p.panelThickness, p.depth * 0.2)
    const createLeg = (x: number, z: number) => {
      const leg = new THREE.Mesh(legGeom, mat)
      leg.position.set(x, (p.height - p.panelThickness) / 2, z)
      return leg
    }
    const leg1 = createLeg(-p.width / 2 + 0.0075, -p.depth * 0.4)
    const leg2 = createLeg(p.width / 2 - 0.0075, -p.depth * 0.4)
    const leg3 = createLeg(-p.width / 2 + 0.0075, p.depth * 0.4)
    const leg4 = createLeg(p.width / 2 - 0.0075, p.depth * 0.4)

    group.add(leg1, leg2, leg3, leg4)
  },
}
