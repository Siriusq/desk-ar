import { saveState } from '@/composables/useHistory'
import { isDeskInScene, objects, selectedObjectId } from '@/composables/useObjects'
import { expandedObjectId } from '@/composables/useUIState'
import * as THREE from 'three'

export const addObject = (type: string) => {
  if (type.startsWith('desk-') && isDeskInScene.value) return
  const desk = objects.find((o) => o.type.startsWith('desk-'))
  const yPos = desk ? desk.params.height + (desk.position.y || 0) : 0
  const data = {
    id: THREE.MathUtils.generateUUID(),
    type,
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {},
  }
  switch (type) {
    case 'desk-rect':
      data.position.y = 0
      data.params = {
        width: 1.2,
        depth: 0.6,
        height: 0.75,
        color: '#8B4513',
        showLegs: true,
      }
      break
    case 'desk-l':
      data.position.y = 0
      data.params = {
        widthA: 1.5,
        depthA: 0.7,
        widthB: 1.5,
        depthB: 0.7,
        height: 0.75,
        color: '#8B4513',
        showLegs: true,
      }
      break
    case 'monitor':
      data.params = {
        width: 0.55,
        height: 0.32,
        color: '#222222',
        isMountable: true,
      }
      break
    case 'macbook':
      data.params = {
        width: 0.3,
        height: 0.015,
        depth: 0.21,
        color: '#CCCCCC',
        isMountable: true,
      }
      break
    case 'keyboard':
      data.params = {
        width: 0.44,
        height: 0.02,
        depth: 0.14,
        color: '#333333',
      }
      break
    case 'mouse':
      data.params = {
        width: 0.06,
        height: 0.03,
        depth: 0.1,
        color: '#333333',
      }
      break
    case 'iphone':
      data.params = {
        width: 0.07,
        height: 0.008,
        depth: 0.14,
        color: '#E0E0E0',
        isMountable: true,
      }
      break
    case 'universal-stand':
      data.params = {
        baseSize: 0.25,
        poleHeight: 0.4,
        armLength: 0.3,
        color: '#555555',
        mountedObjectId: null,
      }
      break
    case 'custom-box':
      data.params = {
        width: 0.2,
        height: 0.4,
        depth: 0.5,
        color: '#BEBEBE',
      }
      break
  }
  objects.push(data)
  selectedObjectId.value = data.id
  expandedObjectId.value = data.id
  saveState()
}

export const createObject3D = (data) => {
  const group = new THREE.Group()
  group.userData.id = data.id
  const mat = new THREE.MeshStandardMaterial({
    color: data.params.color || 0xffffff,
    roughness: 0.7,
  })
  switch (data.type) {
    case 'desk-rect': {
      const { width, depth, height, showLegs } = data.params
      const top = new THREE.Mesh(new THREE.BoxGeometry(width, 0.04, depth), mat)
      top.position.y = height - 0.02
      group.add(top)
      if (showLegs) {
        const legGeom = new THREE.CylinderGeometry(0.03, 0.03, height - 0.04, 16)
        ;[
          [width / 2 - 0.05, depth / 2 - 0.05],
          [-width / 2 + 0.05, depth / 2 - 0.05],
          [width / 2 - 0.05, -depth / 2 + 0.05],
          [-width / 2 + 0.05, -depth / 2 + 0.05],
        ].forEach((p) => {
          const leg = new THREE.Mesh(legGeom, mat)
          leg.position.set(p[0] as number, (height - 0.04) / 2, p[1] as number)
          group.add(leg)
        })
      }
      break
    }
    case 'desk-l': {
      const { widthA, depthA, widthB, depthB, height, showLegs } = data.params
      const shape = new THREE.Shape()
      shape.moveTo(-widthA / 2, -depthA / 2)
      shape.lineTo(widthA / 2, -depthA / 2)
      shape.lineTo(widthA / 2, depthA / 2 - depthB)
      shape.lineTo(widthA / 2 - widthB, depthA / 2 - depthB)
      shape.lineTo(widthA / 2 - widthB, depthA / 2)
      shape.lineTo(-widthA / 2, depthA / 2)
      shape.closePath()
      const extrudeSettings = { depth: 0.04, bevelEnabled: false }
      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
      const top = new THREE.Mesh(geometry, mat)
      top.rotation.x = -Math.PI / 2
      top.position.y = height
      group.add(top)
      if (showLegs) {
        /* simplified legs */
      }
      break
    }
    case 'monitor': {
      const { width, height } = data.params
      const screen = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.01), mat)
      screen.position.y = height / 2 + 0.1
      const standBase = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.01, 0.2), mat)
      const standPole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.1), mat)
      standPole.position.y = 0.05
      group.add(screen, standBase, standPole)
      break
    }
    case 'macbook': {
      const { width, height, depth } = data.params
      const body = new THREE.Group()
      const base = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat)
      const screen = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat)
      screen.rotation.x = Math.PI / 1.5
      screen.position.z = -depth / 2
      screen.position.y = height / 2
      body.add(base, screen)
      body.position.y = height / 2
      group.add(body)
      break
    }
    case 'universal-stand': {
      const { baseSize, poleHeight, armLength } = data.params
      const base = new THREE.Mesh(
        new THREE.CylinderGeometry(baseSize / 2, baseSize / 2, 0.02, 32),
        mat,
      )
      base.position.y = 0.01
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, poleHeight, 16), mat)
      pole.position.y = poleHeight / 2 + 0.02
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, armLength, 16), mat)
      arm.rotation.z = Math.PI / 2
      arm.position.x = armLength / 2
      arm.position.y = poleHeight + 0.02
      group.add(base, pole, arm)
      break
    }
    case 'custom-box':
    case 'keyboard':
    case 'mouse':
    case 'iphone': {
      const { width, height, depth } = data.params
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat)
      mesh.position.y = height / 2
      group.add(mesh)
      break
    }
  }
  if (group.children.length > 0) {
    if (!data.mountedToId) {
      group.position.set(data.position.x, data.position.y, data.position.z)
      group.rotation.set(
        THREE.MathUtils.degToRad(data.rotation.x),
        THREE.MathUtils.degToRad(data.rotation.y),
        THREE.MathUtils.degToRad(data.rotation.z),
      )
    }
    group.traverse((c) => {
      c.castShadow = true
      c.receiveShadow = true
    })
    return group
  }
  return null
}
