import * as THREE from 'three'
import type { MonitorObject } from '@/models/deskObject'

export const monitorModel = {
  createData: (id: string, yPos: number) => ({
    id,
    type: 'monitor',
    position: { x: 0, y: yPos, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    mountedToId: null,
    params: {
      width: 0.54, // 屏幕整体宽度
      height: 0.32, // 屏幕整体高度
      depth: 0.03, // 屏幕厚度
      color: '#333333', // 外壳颜色

      baseWidth: 0.243,
      baseDepth: 0.18,
      baseHeight: 0.01,

      standWidth: 0.102,
      standDepth: 0.027,
      standHeight: 0.34,

      standRotationY: 0, // 支架旋转（Y轴）
      screenTiltX: 0, // 屏幕俯仰角（X轴）
      screenSlideY: -0.05, // 屏幕上下滑动距离（顶部为0）
      screenRotateZ: 0,

      curvatureR: 0,

      isMountable: true,
    },
  }),

  buildGeometry: (group: THREE.Group, data: MonitorObject) => {
    const {
      width,
      height,
      depth,
      color,
      baseWidth,
      baseDepth,
      baseHeight,
      standWidth,
      standDepth,
      standHeight,
      standRotationY,
      screenSlideY,
      screenTiltX,
      screenRotateZ,
      curvatureR,
    } = data.params as MonitorObject['params']

    const border = 0.015
    const pivotBlockDepth = 0.04
    const pivotBlockHeight = 0.04
    const panelSubdivisions = 90

    const matBody = new THREE.MeshStandardMaterial({ color, roughness: 0.6, metalness: 0.1 })
    const matPanel = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.2,
      metalness: 0.8,
    })

    while (group.children.length) group.remove(group.children[0]!)

    // === 底座 ===
    const base = new THREE.Mesh(new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth), matBody)
    base.position.y = baseHeight / 2
    group.add(base)

    // === 支架 ===
    const stand = new THREE.Mesh(
      new THREE.BoxGeometry(standWidth, standHeight, standDepth),
      matBody,
    )
    stand.position.y = baseHeight + standHeight / 2
    stand.position.z = -baseDepth / 2 + standDepth / 2 + 0.02
    stand.rotation.y = standRotationY
    group.add(stand)

    // === 滑动组（带动pivot和屏幕整体移动）===
    const slideGroup = new THREE.Group()
    slideGroup.position.set(0, baseHeight + standHeight + screenSlideY, stand.position.z)
    slideGroup.rotation.y = standRotationY
    group.add(slideGroup)

    // === pivot组 ===
    const pivotGroup = new THREE.Group()
    slideGroup.add(pivotGroup)

    // pivot连接块
    const pivotBlock = new THREE.Mesh(
      new THREE.BoxGeometry(standWidth * 0.7, pivotBlockHeight, pivotBlockDepth),
      matBody,
    )
    pivotBlock.position.set(0, 0, -depth / 2 - pivotBlockDepth / 2)
    pivotGroup.add(pivotBlock)

    // === 屏幕旋转组（横竖屏）===
    const rotateGroup = new THREE.Group()
    rotateGroup.rotation.z = screenRotateZ
    pivotGroup.add(rotateGroup)

    // === 屏幕组（俯仰）===
    const screenGroup = new THREE.Group()
    // screenGroup.position.set(
    //   0,
    //   -pivotBlockHeight / 2,
    //   pivotBlock.position.z + pivotBlockDepth / 2 + depth / 2,
    // )
    screenGroup.rotation.x = screenTiltX
    rotateGroup.add(screenGroup)
    pivotGroup.position.set(0, 0, pivotBlockDepth + standDepth)

    // === 曲面屏生成 ===
    const widthSeg = panelSubdivisions
    const heightSeg = 1

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

    // 面板
    const panelGeo = new THREE.BoxGeometry(
      width - 2 * border,
      height - 2 * border,
      0.002,
      widthSeg,
      heightSeg,
      1,
    )
    deformGeometry(panelGeo)
    const panel = new THREE.Mesh(panelGeo, matPanel)
    panel.position.z = depth / 2 - 0.002 / 2 + 0.001
    screenGroup.add(panel)

    // 外框（可稍微前移一点）
    const frameGeo = new THREE.BoxGeometry(width, height, depth, widthSeg, heightSeg, 1)
    deformGeometry(frameGeo)
    const frame = new THREE.Mesh(frameGeo, matBody)
    screenGroup.add(frame)

    group.position.y = 0
  },
}
