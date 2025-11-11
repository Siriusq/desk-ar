import * as THREE from 'three'
import type { BaseObject } from '@/models/deskObject'

// 鼠标
export interface MouseParams {
  name: string | ''
  width: number
  height: number
  length: number
  color: string
}
export interface MouseObject extends BaseObject {
  type: 'mouse'
  params: MouseParams
}

export const mouseModel = {
  createData: (id: string, yPos: number) => ({
    id: id,
    type: 'mouse',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      name: '',
      width: 0.06,
      height: 0.03,
      length: 0.1,
      color: '#333333',
    },
  }),
  buildGeometry: (group: THREE.Group, data: MouseObject) => {
    const p = data.params
    const bodyHeight = p.height - 0.01

    const mat = new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.7 })
    const wheelMat = new THREE.MeshStandardMaterial({ color: p.color, roughness: 0.3 })
    const buttonMat = new THREE.MeshStandardMaterial({
      color: p.color,
      roughness: 0.8,
      metalness: 0.5,
    })

    const body = new THREE.Mesh(new THREE.BoxGeometry(p.width, bodyHeight, p.length), mat)
    body.position.y = bodyHeight / 2

    const wheel = new THREE.Mesh(
      new THREE.CylinderGeometry(p.length * 0.12, p.length * 0.12, p.width * 0.1, 16),
      wheelMat,
    )
    wheel.rotation.z = Math.PI / 2
    wheel.position.y = bodyHeight
    wheel.position.z = -p.length / 2 + p.length * 0.2

    const leftButton = new THREE.Mesh(
      new THREE.BoxGeometry(p.width * 0.45, 0.01, p.length * 0.45),
      buttonMat,
    )
    leftButton.position.x = -p.width * 0.25

    const rightButton = new THREE.Mesh(
      new THREE.BoxGeometry(p.width * 0.45, 0.01, p.length * 0.45),
      buttonMat,
    )
    rightButton.position.x = p.width * 0.25

    const buttonGroup = new THREE.Group()
    buttonGroup.add(leftButton, rightButton)
    buttonGroup.position.z = -p.length * 0.3
    buttonGroup.position.y = bodyHeight + 0.001
    buttonGroup.rotation.x = -Math.PI / 20

    const rearPanel = new THREE.Mesh(
      new THREE.BoxGeometry(p.width * 0.95, 0.01, p.length * 0.58),
      buttonMat,
    )
    rearPanel.position.y = bodyHeight + 0.001
    rearPanel.position.z = p.length * 0.215
    rearPanel.rotation.x = Math.PI / 25

    group.add(rearPanel)

    group.add(buttonGroup)
    group.add(body, wheel)
  },
}
