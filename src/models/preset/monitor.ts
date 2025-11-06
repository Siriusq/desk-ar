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

    // 清空 group
    while (group.children.length) group.remove(group.children[0]!)

    // === 底座（固定，不旋转）===
    const base = new THREE.Mesh(new THREE.BoxGeometry(baseWidth, baseHeight, baseDepth), matBody)
    base.position.y = baseHeight / 2
    group.add(base)

    // === 旋转底盘组（以此组的局部 y 轴作为旋转轴）===
    // 把旋转中心（圆盘中心）放在 base 顶面（y = baseHeight）
    const rotatingBaseGroup = new THREE.Group()
    rotatingBaseGroup.position.set(0, baseHeight, 0) // 旋转基准点移到 base 顶面
    rotatingBaseGroup.rotation.y = standRotationY
    group.add(rotatingBaseGroup)

    // 旋转圆盘（可视化）——不要旋转它自身的旋转.x
    const discRadius = baseWidth * 0.35
    const discThickness = 0.001
    const rotationDisc = new THREE.Mesh(
      new THREE.CylinderGeometry(discRadius, discRadius, discThickness, 32),
      matBody,
    )
    // 圆盘平放：CylinderGeometry 默认轴为 Y 轴，面朝上下，位置需上移 discThickness/2
    rotationDisc.position.y = discThickness / 2 - 0.001 // 使圆盘轻微嵌入底座表面
    rotatingBaseGroup.add(rotationDisc)

    // 计算支架在 rotatingBaseGroup 局部的 z 位移（与之前保持一致的偏移量）
    const standZ = -baseDepth / 2 + standDepth / 2 + 0.02

    // === 支架（作为圆盘的子对象）===
    const stand = new THREE.Mesh(
      new THREE.BoxGeometry(standWidth, standHeight, standDepth),
      matBody,
    )
    // 局部 y: 圆盘顶面 + standHeight/2
    stand.position.set(0, discThickness + standHeight / 2, standZ)
    rotatingBaseGroup.add(stand)

    // === 滑动组：移动应当随旋转一起（所以也挂在 rotatingBaseGroup 下）===
    // slideGroup 的局部 y = 圆盘顶面 + standHeight + screenSlideY
    const slideGroup = new THREE.Group()
    slideGroup.position.set(0, discThickness + standHeight + screenSlideY, standZ)
    rotatingBaseGroup.add(slideGroup)
    // === pivotGroup（pivot 与屏幕一起）===
    const pivotGroup = new THREE.Group()
    // pivotGroup 放在 slideGroup 的局部原点（即紧贴 stand 对齐的那个位置）
    pivotGroup.position.set(0, 0, 0)
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

    // 外框
    const frameGeo = new THREE.BoxGeometry(width, height, depth, widthSeg, heightSeg, 1)
    deformGeometry(frameGeo)
    const frame = new THREE.Mesh(frameGeo, matBody)
    screenGroup.add(frame)

    group.position.y = 0
  },
}

// todo:无支架显示器
export const monitorScreenModal = {}
