import React, { useState, useEffect } from 'react'
import Header from './components/header'
import LessonBreadcrumb from './components/lessonbreadcrumb'
import Home from './pages/home'
import { LessonMetaContext } from './contexts/LessonMetaContext'

// Phase 1: Building Blocks
import L01 from './lessons/l01-basic-scene'
import L02 from './lessons/l02-geometry-lab'
import L03 from './lessons/l03-basic-paint'
import L04 from './lessons/l04-lighting'

// Phase 2: Motion & Interactivity
import L05 from './lessons/l05-flow-of-time'
import L06 from './lessons/l06-camera-response'
import L07 from './lessons/l07-family-tree'
import L08 from './lessons/l08-interaction'

// Phase 3: Visual Fidelity
import L09 from './lessons/l09-realistic-surface'
import L10 from './lessons/l10-reflection-skybox'
import L11 from './lessons/l11-atmospheric-fog'

// Phase 4: Complex Systems
import L12 from './lessons/l12-buffer-geometry'
import L13 from './lessons/l13-model-shop'
import L14 from './lessons/l14-media-textures'
import L15 from './lessons/l15-physics-world'

// Phase 5: Bottom & Future
import L16 from './lessons/l16-post-processing'
import L17 from './lessons/l17-pixel-sorcery'
import L18 from './lessons/l18-high-performance'
import L19 from './lessons/l19-next-dimension'
import L20 from './lessons/l20-webgpu-future'

// Phase 6: Finale
import L21 from './lessons/l21-grand-finale'

import './app.css'

const VISITED_KEY = 'tbp_visited'

const LESSON_CONFIG = [
  { id: 'lesson-01', num: 1,  title: 'Hello Three.js',           phase: 'Phase 1 — Building Blocks',       objective: 'Set up a Scene, PerspectiveCamera and WebGLRenderer. Add a rotating cube with lighting.',            component: L01 },
  { id: 'lesson-02', num: 2,  title: 'Geometry Lab',             phase: 'Phase 1 — Building Blocks',       objective: 'Explore every built-in Three.js geometry. Switch shapes at runtime and observe their parameters.',  component: L02 },
  { id: 'lesson-03', num: 3,  title: 'Basic Paint',              phase: 'Phase 1 — Building Blocks',       objective: 'Understand MeshBasicMaterial vs MeshStandardMaterial and how colors and textures are applied.',     component: L03 },
  { id: 'lesson-04', num: 4,  title: 'Let There Be Light',       phase: 'Phase 1 — Building Blocks',       objective: 'Add AmbientLight, DirectionalLight, PointLight and SpotLight. Enable shadow maps.',                 component: L04 },
  { id: 'lesson-05', num: 5,  title: 'The Flow of Time',         phase: 'Phase 2 — Motion & Interactivity', objective: 'Drive animations with THREE.Clock. Understand delta time and the requestAnimationFrame loop.',      component: L05 },
  { id: 'lesson-06', num: 6,  title: 'Camera & Response',        phase: 'Phase 2 — Motion & Interactivity', objective: 'Attach OrbitControls and make the canvas auto-resize on window changes.',                         component: L06 },
  { id: 'lesson-07', num: 7,  title: 'Family Tree',              phase: 'Phase 2 — Motion & Interactivity', objective: 'Build a Sun → Earth → Moon hierarchy with THREE.Group and understand local vs world transforms.',   component: L07 },
  { id: 'lesson-08', num: 8,  title: 'Interaction (Raycaster)',  phase: 'Phase 2 — Motion & Interactivity', objective: 'Cast rays from camera through mouse coordinates to detect hover and click on 3D objects.',          component: L08 },
  { id: 'lesson-09', num: 9,  title: 'Realistic Surface (PBR)',  phase: 'Phase 3 — Visual Fidelity',        objective: 'Use MeshStandardMaterial with metalness, roughness, normal maps and PBR textures.',                component: L09 },
  { id: 'lesson-10', num: 10, title: 'Reflection & Skybox',      phase: 'Phase 3 — Visual Fidelity',        objective: 'Load an HDRI environment map and use it for reflections and skybox lighting.',                     component: L10 },
  { id: 'lesson-11', num: 11, title: 'Atmospheric Fog',          phase: 'Phase 3 — Visual Fidelity',        objective: 'Apply FogExp2 to create atmospheric depth and distance fade on objects.',                         component: L11 },
  { id: 'lesson-12', num: 12, title: 'BufferGeometry (Vertices)',phase: 'Phase 4 — Complex Systems',        objective: 'Directly manipulate vertex position arrays in BufferGeometry to create custom shapes and waves.',    component: L12 },
  { id: 'lesson-13', num: 13, title: 'Model Shop (GLTF)',        phase: 'Phase 4 — Complex Systems',        objective: 'Load GLTF/GLB 3D assets with GLTFLoader, traverse the scene graph and play animations.',            component: L13 },
  { id: 'lesson-14', num: 14, title: 'Media Textures',           phase: 'Phase 4 — Complex Systems',        objective: 'Use HTML5 video and Web Audio API as live textures and visualizers on 3D objects.',                component: L14 },
  { id: 'lesson-15', num: 15, title: 'Physics World',            phase: 'Phase 4 — Complex Systems',        objective: 'Simulate gravity and collision detection manually. Understand velocity integration and restitution.',  component: L15 },
  { id: 'lesson-16', num: 16, title: 'Post-Processing',          phase: 'Phase 5 — Future Tech',            objective: 'Chain EffectComposer passes (Bloom, SSAO, Film grain) to create cinematic rendering.',              component: L16 },
  { id: 'lesson-17', num: 17, title: 'Pixel Sorcery (Shaders)',  phase: 'Phase 5 — Future Tech',            objective: 'Write custom GLSL vertex and fragment shaders with ShaderMaterial and uniform animation.',           component: L17 },
  { id: 'lesson-18', num: 18, title: 'High Performance',         phase: 'Phase 5 — Future Tech',            objective: 'Render thousands of objects with InstancedMesh and use frustum culling for optimization.',           component: L18 },
  { id: 'lesson-19', num: 19, title: 'Next Dimension (XR)',      phase: 'Phase 5 — Future Tech',            objective: 'Enable WebXR for VR and AR. Set up XR sessions, controllers and hit testing.',                    component: L19 },
  { id: 'lesson-20', num: 20, title: 'WebGPU Future',            phase: 'Phase 5 — Future Tech',            objective: 'Preview the WebGPU backend in Three.js. Understand compute shaders and the new API.',               component: L20 },
  { id: 'lesson-21', num: 21, title: 'The Grand Finale',         phase: 'Phase 6 — Finale',                 objective: 'Combine scene graphs, particles, PBR, fog, animation and post-processing in one full project.',      component: L21 },
]

function recordVisit(id) {
  try {
    const raw = JSON.parse(localStorage.getItem(VISITED_KEY) || '[]')
    if (!raw.includes(id)) {
      raw.push(id)
      localStorage.setItem(VISITED_KEY, JSON.stringify(raw))
      window.dispatchEvent(new Event('tbp_visited'))
    }
  } catch {}
}

function App() {
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash.startsWith('#lesson-')) {
        const id = hash.substring(1)
        setCurrentPage(id)
        recordVisit(id)
      } else {
        setCurrentPage('home')
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  // Keyboard ← → navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') {
        const idx = LESSON_CONFIG.findIndex(l => l.id === currentPage)
        if (idx >= 0 && idx < LESSON_CONFIG.length - 1) {
          window.location.hash = LESSON_CONFIG[idx + 1].id
        } else if (currentPage === 'home') {
          window.location.hash = LESSON_CONFIG[0].id
        }
      }
      if (e.key === 'ArrowLeft') {
        const idx = LESSON_CONFIG.findIndex(l => l.id === currentPage)
        if (idx > 0) {
          window.location.hash = LESSON_CONFIG[idx - 1].id
        } else if (idx === 0) {
          window.location.hash = ''
        }
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [currentPage])

  const currentLessonIndex = LESSON_CONFIG.findIndex(l => l.id === currentPage)
  const currentLesson = currentLessonIndex >= 0 ? LESSON_CONFIG[currentLessonIndex] : null
  const nextLesson = currentLesson && currentLessonIndex < LESSON_CONFIG.length - 1
    ? LESSON_CONFIG[currentLessonIndex + 1]
    : (!currentLesson ? LESSON_CONFIG[0] : null)
  const prevLesson = currentLessonIndex > 0 ? LESSON_CONFIG[currentLessonIndex - 1] : null

  const LessonComponent = currentLesson ? currentLesson.component : Home

  return (
    <div className="app">
      <Header nextLesson={nextLesson} prevLesson={prevLesson} />
      <main>
        {currentLesson && (
          <LessonBreadcrumb
            lessonNumber={currentLesson.num}
            lessonTitle={currentLesson.title}
          />
        )}
        <LessonMetaContext.Provider value={currentLesson}>
          <LessonComponent lessonMeta={currentLesson} />
        </LessonMetaContext.Provider>
      </main>
      {currentLesson && (
        <div className="kbd-hint">
          <span className="kbd">←</span> prev
          &nbsp;·&nbsp;
          next <span className="kbd">→</span>
        </div>
      )}
    </div>
  )
}

export default App
