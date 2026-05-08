# ThreeBodyPlay - Refined Design Document

> Three.js Interactive Learning Platform | Last Updated: 2026-04-28

---

## 1. Project Overview
**Goal:** Master Three.js through a systematic, 21-lesson interactive curriculum.
**Stack:** Vite 5, React 19, Three.js ^0.184.0.

---

## 2. Curriculum (21 Lessons)

### Phase 1: Building Blocks
*   **L01: Hello Three.js** - Scene, Camera, Renderer basics.
*   **L02: Geometry Lab** - Comprehensive built-in shape switcher.
*   **L03: Basic Paint** - Standard vs. Basic materials.
*   **L04: Let There Be Light** - Dynamic lighting & shadows.

### Phase 2: Motion & Interactivity
*   **L05: The Flow of Time** - Clock-driven animation loops.
*   **L06: Camera & Response** - OrbitControls & Auto-resize.
*   **L07: Family Tree** - Scene Graph & Hierarchy (Sun-Earth-Moon).
*   **L08: Interaction (Raycaster)** - Mouse picking & interaction.

### Phase 3: Visual Fidelity
*   **L09: Realistic Surface (PBR)** - Metalness, Roughness, Normal maps.
*   **L10: Reflection & Skybox** - HDRI environments & mirrors.
*   **L11: Atmospheric Fog** - Depth sensing with Exponential Fog.

### Phase 4: Complex Systems
*   **L12: BufferGeometry (Vertices)** - Direct vertex manipulation & waves.
*   **L13: Model Shop (GLTF)** - Loading external 3D assets.
*   **L14: Media Textures** - Video and Audio visualization.
*   **L15: Physics World** - Basic gravity & collision detection.

### Phase 5: Bottom & Future
*   **L16: Post-Processing** - GL filters & cinematic effects.
*   **L17: Pixel Sorcery (Shaders)** - Custom Vertex & Fragment shaders.
*   **L18: High Performance** - Instancing & Optimization.
*   **L19: Next Dimension (XR)** - WebXR (VR/AR) experiences.
*   **L20: WebGPU Future** - Next-gen API preview.

### Phase 6: Finale
*   **L21: The Grand Finale** - Comprehensive solar system / interactive world project.

---

## 3. Engineering Standards
1. **Independent Hooks:** Use `useThree.js` for lifecycle management.
2. **Strict Cleanup:** Always dispose geometries and materials on unmount.
3. **No Ghosting:** Clear scene children in cleanup to support React Strict Mode.
4. **Responsive:** Canvas must always fill `.canvas-container`.
