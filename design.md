# ThreeBodyPlay - 设计文档

> Three.js 交互式学习平台 | 最后更新：2026-03-28

---

## 1. 项目概述

**项目目标：** 通过 18 节渐进式交互示例，系统性掌握 Three.js + WebGL 3D 渲染。

**技术栈：**
- 构建工具：Vite 5
- 前端框架：React 19
- 路由：react-router-dom 7 (Hash-based routing via `window.location.hash`)
- 3D 引擎：Three.js r128 (CDN 引入)
- 样式：原生 CSS (CSS Variables)

---

## 2. 项目结构

```
ThreeBodyPlay/
├── index.html                 # 单页入口
├── vite.config.js             # Vite 配置
├── package.json
├── DESIGN.md                  # 本文档
├── README.md
└── src/
    ├── main.jsx               # React 入口
    ├── app.jsx                # 路由 + 页面渲染
    ├── app.css                # 全局样式
    ├── index.css              # Reset 样式
    ├── components/
    │   ├── header.jsx         # 顶部导航栏
    │   └── lessoncard.jsx     # 课程卡片组件
    ├── pages/
    │   └── home.jsx           # 首页（课程列表）
    └── lessons/
        ├── directthree.jsx     # L01: Basic Scene
        ├── geometries.jsx       # L02: Geometries
        ├── materials.jsx        # L03: Materials
        ├── lighting.jsx         # L04: Lighting
        ├── animationlesson.jsx  # L05: Animation
        ├── controlslesson.jsx   # L06: Controls
        ├── particleslesson.jsx   # L07: Particles
        ├── physicslesson.jsx     # L08: Physics
        ├── postprocessinglesson.jsx  # L09: Post Processing
        ├── modelloadinglesson.jsx    # L10: Model Loading
        ├── audiovideolesson.jsx      # L11: Audio & Video
        ├── performancelesson.jsx     # L12: Performance
        ├── shaderslesson.jsx         # L13: Shaders
        ├── vrarlesson.jsx            # L14: VR & AR
        ├── terrainskybox.jsx         # L15: Terrain & Skybox
        ├── webgpulesson.jsx          # L16: WebGPU
        ├── responsivedesignlesson.jsx # L17: Responsive Design
        └── finalproject.jsx          # L18: Final Project
```

---

## 3. 路由设计

Hash-based routing via `window.location.hash`:

| Hash | 页面 |
|------|------|
| `#lesson-01` ~ `#lesson-18` | 各课程页 |
| (default) | 首页 Home |

**app.jsx 中的 renderPage() switch：** 需要覆盖全部 18 个 lesson case。

---

## 4. 课程内容规范

### 4.1 通用组件结构

每个 Lesson 页面采用 **左侧 Canvas + 右侧 Sidebar** 布局：

```
┌─────────────────────────────────┬──────────────┐
│                                 │   Sidebar    │
│         Three.js Canvas         │  ┌────────┐  │
│                                 │  │ Panel  │  │
│                                 │  └────────┘  │
│                                 │  ┌────────┐  │
│                                 │  │ Panel  │  │
│                                 │  └────────┘  │
└─────────────────────────────────┴──────────────┘
```

**Canvas 容器：** `.canvas-container` (flex: 1, 响应式尺寸)
**Sidebar：** `.sidebar` (width: 300px, 可滚动)

### 4.2 Sidebar Panel 类型

- **Controls Panel：** 包含 color picker、range slider、checkbox
- **Code Preview Panel：** 可折叠的代码片段展示
- **Info Panel：** 静态说明文本

### 4.3 通用状态模式

```jsx
const [bgColor, setBgColor] = useState('#1a1a2e')
const [showCode, setShowCode] = useState(false)
const containerRef = useRef(null)

// Three.js refs
const sceneRef = useRef(null)
const rendererRef = useRef(null)

// Cleanup in useEffect return
```

### 4.4 Three.js 初始化模式

```jsx
// 动态加载 CDN Three.js（避免包体积问题）
const script = document.createElement('script')
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
script.async = true
script.onload = () => {
  const THREE = window.THREE
  // Three.js 代码...
}
document.head.appendChild(script)
```

---

## 5. 课程详情

### L01: Basic Scene ✅
- 场景/相机/渲染器基础
- 立方体 + 自动旋转
- 背景色/立方体颜色控制

### L02: Geometries ✅
- 多种几何体展示（Box, Sphere, Cylinder, Cone, Torus 等）
- 几何体切换选择器
- 材质复用

### L03: Materials ✅
- MeshStandardMaterial / MeshBasicMaterial / MeshPhongMaterial
- 金属度/粗糙度控制
- 颜色/透明度控制

### L04: Lighting ✅
- AmbientLight / PointLight / DirectionalLight / SpotLight
- 光照强度/位置控制
- 实时阴影开关

### L05: Animation ✅
- requestAnimationFrame 动画循环
- 缓动动画（Easing）
- 动画参数控制（速度/方向）

### L06: Controls ✅
- OrbitControls（鼠标拖拽旋转/缩放）
- 阻尼系数控制
- 自动旋转开关

### L07: Particles ✅
- BufferGeometry + Points
- 粒子数量/大小/颜色控制
- 粒子运动动画

### L08: Physics ✅
- 简单重力模拟
- 碰撞检测（球体/地面）
- 物理参数控制

### L09: Post Processing ✅
- CSS filter 模拟后期效果（blur/saturate）
- 颜色调整
- 多个几何体场景

### L10: Model Loading 🆕
- GLTFLoader 加载外部模型
- 支持拖放 .gltf/.glb 文件
- 材质/动画预览
- 使用 Three.js r128 内置 GLTFLoader

### L11: Audio & Video 🆕
- 音频可视化（AudioAnalyser + 粒子反应）
- 视频纹理（VideoTexture）
- 麦克风输入支持

### L12: Performance ✅ (需修复路由)
- FPS 计数器
- InstancedMesh vs 单独 Mesh 对比
- 对象数量滑块

### L13: Shaders ✅ (需修复路由)
- 自定义 Vertex/Fragment Shader
- ShaderMaterial 使用
- Uniforms 动画

### L14: VR & AR 🆕
- WebXR VRButton 集成
- VR 环境场景
- 简单的 VR 交互

### L15: Terrain & Skybox ✅
- 程序化地形生成（噪声）
- 自定义 Sky Shader（渐变天空）
- 树木等装饰物

### L16: WebGPU 🆕
- WebGPU vs WebGL 对比说明
- WebGPURenderer 基础示例（如 Three.js 版本支持）
- 降级处理（WebGPU 不可用时回退）

### L17: Responsive Design 🆕
- 响应式 Canvas（窗口 resize 处理）
- 移动端触摸控制
- 不同屏幕尺寸适配

### L18: Final Project ✅
- 综合场景：动画 + 材质 + 粒子
- 太阳系模型 / 艺术装置等
- 参数控制面板

---

## 6. CSS 设计系统

```css
:root {
  --primary: #4ecdc4;      /* 主色调（青色）*/
  --secondary: #ff6b6b;    /* 强调色（珊瑚红）*/
  --bg-dark: #1a1a2e;      /* 深色背景 */
  --bg-card: rgba(255, 255, 255, 0.05);
  --text: #eee;
  --text-dim: rgba(255, 255, 255, 0.6);
}
```

**布局规则：**
- `html, body { height: 100%; overflow: hidden; }` 全屏应用
- `.app { height: 100vh; display: flex; flex-direction: column; }`
- `.lesson-page { display: flex; height: calc(100vh - 60px); }`
- Canvas 区域 flex: 1，Sidebar width: 300px

---

## 7. 组件清单

| 组件 | 文件 | 说明 |
|------|------|------|
| Header | components/header.jsx | 顶部导航 |
| LessonCard | components/lessoncard.jsx | 首页课程卡片 |
| Home | pages/home.jsx | 首页 |
| App | app.jsx | 根组件 + 路由 |

---

## 8. 已知问题 & 待优化

- [ ] Model Loading 需要实际 .glb 文件或使用 CDN 示例模型
- [ ] Audio & Video 依赖用户授权麦克风，需降级处理
- [ ] WebGPU 依赖浏览器支持，需要 feature detection
- [ ] 所有 lesson 使用 CDN r128，可考虑升级到更新版本
- [ ] app.jsx 中有两个重复的 switch case（需要清理）

---

## 9. 开发规范

1. **每个 Lesson 独立：** 不共享状态，通过 URL hash 隔离
2. **CDN Three.js：** 继续使用 r128 CDN，不打包进 bundle
3. **响应式优先：** Canvas 始终填满可用空间
4. **代码展示：** 每个 lesson 都有可折叠的代码片段
5. **无障碍：** Canvas 需要 fallback 内容提示 Loading 状态
