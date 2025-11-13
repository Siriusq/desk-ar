import * as THREE from 'three'
import type { BaseObject } from '@/models/deskObject'

// 麦克风
export interface MicrophoneParams {
  name: string | ''
  capsuleRadius: number
  capsuleHeight: number
  standRadius: number
  standHeight: number
  color: string
  isMountable: boolean
}

export interface MicrophoneObject extends BaseObject {
  type: 'microphone'
  params: MicrophoneParams
}

// === 纹理缓存 ===
let cachedMicrophoneTexture: THREE.Texture | null = null

export const microphoneModel = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'microphone',
    position: { x: 0, y: yPos + 0.015, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      capsuleRadius: 0.03,
      capsuleHeight: 0.1,
      standRadius: 0.015,
      standHeight: 0.15,
      color: '#444444',
      isMountable: true,
    },
  }),
  buildGeometry: (group: THREE.Group, data: MicrophoneObject) => {
    if (!cachedMicrophoneTexture) {
      const loader = new THREE.TextureLoader()
      cachedMicrophoneTexture = loader.load('/textures/microphone/microphone-mesh.jpg')
      cachedMicrophoneTexture.colorSpace = THREE.SRGBColorSpace
    }

    const p = data.params
    const c = new THREE.Color(p.color)

    const microphoneMat = new THREE.MeshStandardMaterial({
      map: cachedMicrophoneTexture,
      color: c.lerp(new THREE.Color(0xffffff), 0.5),
      metalness: 0.8,
      roughness: 0.3,
    })
    const bodyMat = new THREE.MeshStandardMaterial({
      color: p.color,
      metalness: 0.4,
      roughness: 0.5,
    })

    // 话筒胶囊体
    const capsuleGeom = new THREE.CapsuleGeometry(p.capsuleRadius, p.capsuleHeight, 8, 16)
    const capsule = new THREE.Mesh(capsuleGeom, microphoneMat)
    capsule.position.y = p.capsuleHeight / 2
    group.add(capsule)

    // 话筒支架
    const standGeom = new THREE.CylinderGeometry(p.standRadius, p.standRadius, p.standHeight, 16)
    const stand = new THREE.Mesh(standGeom, bodyMat)
    stand.position.y = -p.standHeight / 2

    const micGroup = new THREE.Group()
    micGroup.add(capsule, stand)
    micGroup.rotateX(-Math.PI / 2)
    micGroup.position.y = p.standRadius
    micGroup.position.z = -p.standHeight * 0.3
    group.add(micGroup)
  },
}
