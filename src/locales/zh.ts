export default {
  // 欢迎页面UI
  welcomeTitle: '欢迎使用 Desk AR',
  welcomeCreate: '创建新布局',
  welcomeOpen: '从文件打开',
  // 预览页面UI
  modelFileNotFound: '未找到模型文件。请返回编辑页面并尝试重新进入预览页面。',
  noModelViewerInstance: '未找到 model-viewer 实例。',
  arMode: 'AR 模式',
  warning: '错误！',
  // 预览前模型导出选项
  previewOptionTitle: '是否需要包含桌子？',
  includeDesk: '包含桌子',
  noDeskIncluded: '不含桌子',
  // 添加模型
  addItem: '添加物品',
  // 导入模型
  unableToReadFile: '无法读取文件',
  failedToAddImportedModel: '添加导入的模型失败：',
  fileReadError: '文件读取错误：',
  importModelFailed: '导入模型失败：{error}',
  invalidFileType: '文件类型无效。请选择 .glb 文件。',
  // 场景UI
  menu: '菜单',
  add: '添加',
  back: '返回',
  cancel: '取消',
  ok: '好的',
  // 场景标题
  layoutNamePlaceholder: '桌面布局',
  saveLayoutName: '保存布局名称',
  editLayoutName: '编辑布局名称',
  // 按钮组合
  helps: '帮助',
  save: '保存',
  exit: '退出',
  exitConfirm: '您确定要退出吗？所有未保存的更改将丢失。',
  preview: '预览',
  camera: '相机',
  default: '默认',
  top: '顶部',
  front: '正前',
  left: '左侧',
  orthographic: '正交',
  measure: '测量',
  stop: '停止',
  // 测量UI
  selectStartPoint: '请选择测量的起点',
  selectEndPoint: '请选择测量的终点',
  reselectStartPoint: '再次单击以重新选择测量的起点',
  // 物品列表
  sceneItems: '物品清单',
  emptyScene: '场景为空，请点击左上角的 + 添加物品',
  // 物品详情
  // 变换
  position: '位置 (mm)',
  rotation: '旋转 (°)',
  dropToSurface: '垂直下落',
  // 编辑面板参数UI
  // 通用参数
  name: '名称',
  length: '长度',
  width: '宽度',
  thickness: '厚度',
  depth: '深度',
  height: '高度',
  color: '颜色',
  // 转角桌
  lengthA: '长度 (A)',
  widthA: '宽度 (A)',
  depthA: '进深 (A)',
  lengthB: '长度 (B)',
  widthB: '宽度 (B)',
  depthB: '进深 (B)',
  // 支架
  mountedItem: '已挂载：',
  unmount: '卸载',
  mountItem: '挂载物品',
  noMountableItems: '场景中没有可以被挂载的物品',
  // 话筒
  capsuleRadius: '拾音头半径',
  capsuleHeight: '拾音头高度',
  standRadius: '支架半径',
  // 键盘
  isBlack: '白色/黑色',
  // 显示器
  baseWidth: '底座宽度',
  baseDepth: '底座进深',
  baseHeight: '底座厚度',
  standWidth: '支架宽度',
  standDepth: '支架厚度',
  standHeight: '支架高度',
  standRotationY: '支架旋转角度',
  screenSlideY: '屏幕升降',
  screenTiltX: '屏幕俯仰',
  screenRotateZ: '屏幕旋转',
  curvatureR: '屏幕曲率',
  // 笔记本
  lidAngle: '屏幕开合角度',
  // 屏幕尺寸
  '6-inch': '6 寸',
  '6.5-inch': '6.5 寸',
  '7-inch': '7 寸',
  '10-inch': '10 寸',
  '11-inch': '11 寸',
  '12-inch': '12 寸',
  '13-inch': '13 寸',
  '14-inch': '14 寸',
  '15-inch': '15 寸',
  '16-inch': '16 寸',
  '24-inch': '24 寸',
  '27-inch': '27 寸',
  '32-inch': '32 寸',
  '34-inch': '34 寸 21:9',
  '40-inch': '40 寸 21:9',
  '43-inch': '43 寸',
  '49-inch': '49 寸 32:9',
  // 机箱尺寸
  itx: 'ITX',
  matx: 'mATX',
  atx: 'ATX',
  eatx: 'EATX',
  // 机箱预设
  c24: 'C24',
  'rider-r2': 'Rider R2',
  // 鼠标垫尺寸
  small: '小号',
  medium: '中号',
  large: '大号',
  xl: '加大号',
  xxl: '超大号',
  xxxl: '特大号',
  xxxxl: '巨大号',
  // 自定义
  custom: '自定义',
  preset: '预设（部分参数将不可调节）',
  // 自定义图形
  radiusTop: '顶部半径',
  radiusBottom: '底部半径',
  radius: '半径',
  // 圆形底座支架
  baseRadius: '底座半径',
  poleRadius: '支撑杆半径',
  poleHeight: '支撑杆高度',
  tilterSize: '倾斜平台尺寸',
  tilterAngleX: '倾斜平台X轴角度',
  tilterAngleY: '倾斜平台Y轴角度',
  tilterAngleZ: '倾斜平台Z轴角度',
  // 方形底座支架
  poleWidth: '支撑杆宽度',
  poleDepth: '支撑杆深度',
  // 桌面增高架
  panelThickness: '顶板厚度',
  // 台灯
  shellWidth: '外壳宽度',
  shellLength: '外壳长度',
  shellThickness: '外壳厚度',
  openAngle: '开合角度',
  // 路由器
  antennaHeight: '天线高度',

  // 模型分类目录
  categories: {
    desks: '桌子',
    computingDevices: '核心设备',
    inputDevices: '输入设备',
    audioDevices: '音频设备',
    lighting: '照明灯具',
    stands: '支架',
    customGeometry: '自定义几何体',
  },

  // 模型名称
  unknown: '未知',
  item: '物品',
  models: {
    'desk-rect': '矩形桌',
    'desk-l': 'L形转角桌',
    monitor: '显示器',
    'monitor-without-stand': '显示器-不含底座',
    macbook: '笔记本电脑',
    phone: '手机',
    tablet: '平板电脑',
    'pc-case': '电脑主机',
    'mouse-pad': '鼠标垫',
    microphone: '话筒',
    keyboard: '键盘',
    'keyboard-108': '108键键盘',
    'keyboard-87': '87键键盘',
    'keyboard-68': '68键键盘',
    'keyboard-60': '60键键盘',
    mouse: '鼠标',
    stylus: '手写笔',
    speaker: '音响',
    'sound-bar': '条形音箱',
    headphone: '头戴式耳机',
    webcam: '摄像头',
    'universal-stand': '通用支架',
    'round-base-stand': '圆形底座支架',
    'rectangle-base-stand': '方形底座支架',
    'monitor-riser': '桌面增高架',
    'monitor-light': '屏幕挂灯',
    'round-base-table-light': '圆形底座台灯',
    'rectangle-base-table-light': '方形底座台灯',
    'water-glass': '玻璃杯',
    'wireless-router': '无线路由器',
    'custom-box': '自定义立方体',
    'custom-cylinder': '自定义圆柱体',
    'custom-sphere': '自定义球体',
  },

  // --- 集中管理链接 (Links) ---
  link: {
    sketchfab: 'https://sketchfab.com/feed',
    githubRepo: 'https://github.com/Siriusq/desk-ar',
    githubPages: 'https://pages.github.com/',
    vue: 'https://cn.vuejs.org/',
    three: 'https://threejs.org/',
    modelViewer: 'https://modelviewer.dev/',
    bvNext: 'https://github.com/bootstrap-vue-next/bootstrap-vue-next',
    bootswatch: 'https://bootswatch.com/brite/',
    polyHaven: 'https://polyhaven.com/a/qwantani_dusk_2_puresky',
    patternCraft: 'https://patterncraft.fun/',
    freepikSpeaker:
      'https://www.freepik.com/free-photo/background-with-metallic-mesh-round-holes_40199170.htm#fromView=search&page=1&position=7&uuid=e8a75a42-32e5-4663-9001-07de579e2018&query=Metal+circular+grid+texture',
    freepikMic:
      'https://www.freepik.com/free-vector/net-shape-texture-design_853770.htm#fromView=search&page=1&position=0&uuid=d55db6e8-61a6-4741-aa90-654865721a6e&query=microphone+texture',
    githubCorner: 'https://tholman.com/github-corners/',
  },

  help: {
    // --- 🕹 操作 (Controls) ---
    controls: {
      title: '🕹 操作',
      list: {
        rotate: '<strong>鼠标左键 / 单指拖动</strong>：旋转相机',
        zoom: '<strong>鼠标滚轮 / 双指捏合</strong>：缩放相机远近',
        pan: '<strong>鼠标右键 / 双指拖动</strong>：平移相机',
        select: '<strong>左键单击 / 单指轻触物体</strong>：选中物品',
        toggleGizmo:
          '<strong>选中状态下，再次左键单击 / 单指轻触该物体</strong>：切换移动 / 旋转 Gizmo',
        deselect: '<strong>左键单击 / 单指轻触空白处</strong>：取消选中',
      },
    },

    // --- ⌨️ 快捷键 (Shortcuts) ---
    shortcuts: {
      title: '⌨️ 快捷键',
      list: {
        undo: '<strong>Ctrl / Command + Z</strong>：撤销',
        redo: '<strong>Ctrl / Command + Y</strong>：重做',
        save: '<strong>Ctrl / Command + S</strong>：保存场景为 JSON 文件',
        add: '<strong>Add / +</strong>：添加物品',
        delete: '<strong>Del</strong>：删除选中物品',
        exit: '<strong>Backspace</strong>：退出',
        help: '<strong>H</strong>：打开帮助',
        menu: '<strong>M</strong>：打开菜单',
        preview: '<strong>P</strong>：进入（AR）预览模式',
      },
    },

    // --- 🌐 AR 预览 (AR Preview) ---
    arPreview: {
      title: '🌐 AR 预览',
      list: {
        step1:
          '点击菜单中的<strong>预览</strong>按钮，选择导出模型中是否包含桌子，然后跳转到预览页面。',
        step2:
          '若当前设备支持 AR，将在右上角显示 <strong>AR 模式</strong> 按钮，点击后即可调用相机进行 AR 预览。',
        step3: '若设备不支持 AR，则可进行普通的 3D 预览。',
      },
    },

    // --- 🧭 菜单功能 (Menu Features) ---
    menu: {
      title: '🧭 菜单功能',
      list: {
        itemSelect:
          '可在场景中选中物品，或通过<strong>物品清单</strong>选择物品，打开其详情菜单以调整更多参数。',
        sceneName:
          '<strong>场景名称</strong>：点击菜单顶部场景名称后的按钮可修改名称。保存场景时，JSON 文件将使用此名称。',
        positionRotation:
          '<strong>位置与旋转</strong>：Gizmo 颜色与坐标轴对应关系：X 轴 = 红色、Y 轴 = 绿色、Z 轴 = 蓝色。',
        verticalDrop: '<strong>垂直下落按钮</strong>：可使物品自动贴合至最近物体的顶面。',
        name: '<strong>名称</strong>：部分物品支持自定义名称；留空则使用默认名称。',
        preset: '<strong>预设</strong>：部分物品带有尺寸预设，启用后预设中的数值不可单独调整。',
        numericInput:
          '<strong>数值输入</strong>：数字框右侧按钮可快速加减数值，支持长按。默认长度单位为毫米（mm），角度单位为度（°）。',
        mounting:
          '<strong>挂载物品</strong>：部分模型支持挂载到自定义支架上。支持的物品会显示在支架详情页的<strong>挂载物品</strong>下拉列表中。挂载后，部分位置与旋转参数可能不会生效。',
      },
    },

    // --- 📦 模型导入 (Model Import) ---
    import: {
      title: '📦 模型导入',
      list: {
        format: '支持导入 <strong>GLB</strong> 格式的模型文件。',
        download:
          '可前往 <a href="{sketchfabLink}" target="_blank">Sketchfab</a> 等模型网站下载模型。',
        scale:
          '下载的模型比例可能与场景不一致，可使用 <strong>Blender</strong> 等软件进行缩放后再导入。',
      },
    },

    // --- ℹ️ 关于 (About) ---
    about: {
      title: 'ℹ️ 关于',
      intro: '本项目的基础信息：',
      list: {
        github:
          '本项目开源于 <a href="{githubLink}" target="_blank">GitHub - Siriusq/desk-ar</a>，基于 <strong>MIT License</strong>',
        githubPages: '网站托管于 <a href="{ghPagesLink}" target="_blank">GitHub Pages</a>',
        vue: '前端框架： <a href="{vueLink}" target="_blank">Vue.js</a>',
        three: '3D 场景： <a href="{threeLink}" target="_blank">Three.js</a>',
        modelViewer: 'AR 预览： <a href="{modelViewerLink}" target="_blank">model-viewer</a>',
        bootstrap:
          'UI 框架与主题： <a href="{bvNextLink}" target="_blank">Bootstrap Vue Next</a> + <a href="{bootswatchLink}" target="_blank">Bootswatch: Brite</a>',
        hdr: '场景 HDR 背景来自 <a href="{polyHavenLink}" target="_blank">Qwantani Dusk 2 (Pure Sky) HDRI • Poly Haven</a>',
        pattern:
          '欢迎页背景图案来自 <a href="{patternCraftLink}" target="_blank">Pattern Craft - Modern Background Patterns & Gradients Snippets</a>',
        speakerMesh:
          '条形音响铁网材质来自 <a href="{freepikSpeakerLink}" target="_blank">Image by freepik</a>',
        micMesh:
          '话筒铁网材质来自 <a href="{freepikMicLink}" target="_blank">Image by dotstudio on Freepik</a>',
        githubCorner:
          'GitHub 角标来自 <a href="{githubCornerLink}" target="_blank">GitHub Corners</a>',
      },
    },
  },
}
