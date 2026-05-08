import React, { useState, useEffect } from 'react'
import Header from './components/header'
import LessonBreadcrumb from './components/lessonbreadcrumb'
import Home from './pages/home'

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

const LESSON_CONFIG = [
  { id: 'lesson-01', num: 1,  title: 'Hello Three.js', component: L01 },
  { id: 'lesson-02', num: 2,  title: 'Geometry Lab', component: L02 },
  { id: 'lesson-03', num: 3,  title: 'Basic Paint', component: L03 },
  { id: 'lesson-04', num: 4,  title: 'Let There Be Light', component: L04 },
  { id: 'lesson-05', num: 5,  title: 'The Flow of Time', component: L05 },
  { id: 'lesson-06', num: 6,  title: 'Camera & Response', component: L06 },
  { id: 'lesson-07', num: 7,  title: 'Family Tree', component: L07 },
  { id: 'lesson-08', num: 8,  title: 'Interaction (Raycaster)', component: L08 },
  { id: 'lesson-09', num: 9,  title: 'Realistic Surface (PBR)', component: L09 },
  { id: 'lesson-10', num: 10, title: 'Reflection & Skybox', component: L10 },
  { id: 'lesson-11', num: 11, title: 'Atmospheric Fog', component: L11 },
  { id: 'lesson-12', num: 12, title: 'BufferGeometry (Vertices)', component: L12 },
  { id: 'lesson-13', num: 13, title: 'Model Shop (GLTF)', component: L13 },
  { id: 'lesson-14', num: 14, title: 'Media Textures', component: L14 },
  { id: 'lesson-15', num: 15, title: 'Physics World', component: L15 },
  { id: 'lesson-16', num: 16, title: 'Post-Processing', component: L16 },
  { id: 'lesson-17', num: 17, title: 'Pixel Sorcery (Shaders)', component: L17 },
  { id: 'lesson-18', num: 18, title: 'High Performance', component: L18 },
  { id: 'lesson-19', num: 19, title: 'Next Dimension (XR)', component: L19 },
  { id: 'lesson-20', num: 20, title: 'WebGPU Future', component: L20 },
  { id: 'lesson-21', num: 21, title: 'The Grand Finale', component: L21 },
]

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash.startsWith('#lesson-')) {
        setCurrentPage(hash.substring(1))
      } else {
        setCurrentPage('home')
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])
  
  const currentLessonIndex = LESSON_CONFIG.findIndex(l => l.id === currentPage)
  const nextLesson = currentLessonIndex < LESSON_CONFIG.length - 1 
    ? LESSON_CONFIG[currentLessonIndex + 1] 
    : (currentPage === 'home' ? LESSON_CONFIG[0] : null)

  const currentLesson = LESSON_CONFIG.find(l => l.id === currentPage)
  const LessonComponent = currentLesson ? currentLesson.component : Home
  
  return (
    <div className="app">
      <Header nextLesson={nextLesson} />
      <main>
        {currentLesson && (
          <LessonBreadcrumb 
            lessonNumber={currentLesson.num} 
            lessonTitle={currentLesson.title} 
          />
        )}
        <LessonComponent />
      </main>
    </div>
  )
}

export default App
