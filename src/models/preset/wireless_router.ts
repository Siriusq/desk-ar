// 路由器
import * as THREE from 'three'
import type { BaseObject } from '@/models/deskObject'

export interface WirelessRouterParams {
  name: string | ''
  width: number
  height: number
  depth: number
  antennaHeight: number
  color: string
  isMountable: boolean
}

export interface WirelessRouterObject extends BaseObject {
  type: 'wireless-router'
  params: WirelessRouterParams
}

export const wirelessRouterModel = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'wireless-router',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      width: 0.22,
      height: 0.047,
      depth: 0.15,
      antennaHeight: 0.16,
      color: '#2b2b2b',
      isMountable: true,
    },
  }),
  buildGeometry: (group: THREE.Group, data: WirelessRouterObject) => {
    const p = data.params

    // 路由器外壳材质（磨砂塑料感）
    const routerShellMaterial = new THREE.MeshStandardMaterial({
      color: p.color,
      metalness: 0.1, // 略带导电金属颗粒感
      roughness: 0.7, // 高粗糙度，磨砂质感
      envMapIntensity: 0.3, // 环境反射较弱
    })

    // 路由器天线材质（光滑塑料或橡胶）
    const routerAntennaMaterial = new THREE.MeshStandardMaterial({
      color: p.color,
      metalness: 0.0, // 无金属属性
      roughness: 0.4, // 中等粗糙度，略带反光
      envMapIntensity: 0.5, // 适中反射
    })

    const body = new THREE.Mesh(
      new THREE.BoxGeometry(p.width, p.height, p.depth),
      routerShellMaterial,
    )
    const posY = p.height * 0.5
    body.position.set(0, posY, 0)
    group.add(body)

    const antennaGeo = new THREE.BoxGeometry(0.006, p.antennaHeight, 0.01)
    const connectorGeo = new THREE.CylinderGeometry(0.003, 0.003, 0.004, 16, 1)
    const createAntenna = (x: number) => {
      const antenna = new THREE.Mesh(antennaGeo, routerAntennaMaterial)
      const connector = new THREE.Mesh(connectorGeo, routerAntennaMaterial)
      connector.rotation.x = Math.PI * 0.5
      connector.position.y = posY + 0.003
      connector.position.z = -0.002
      antenna.position.y = p.antennaHeight * 0.5 + posY
      antenna.position.z = -0.009
      const antennaGroup = new THREE.Group()
      antennaGroup.add(connector, antenna)
      antennaGroup.position.z = -p.depth * 0.5
      antennaGroup.position.x = x
      return antennaGroup
    }

    const antenna1 = createAntenna(p.width * 0.4)
    const antenna2 = createAntenna(0)
    const antenna3 = createAntenna(-p.width * 0.4)

    group.add(antenna1, antenna2, antenna3)
  },
}
