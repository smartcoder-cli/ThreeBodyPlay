import React, { useState, useEffect } from 'react'
import LessonCard from '../components/lessoncard'

const VISITED_KEY = 'tbp_visited'
const TOTAL = 21

const lessons = [
  { number: 1,  title: 'Hello Three.js',           description: 'Scene, Camera, and Renderer basics',       path: '#lesson-01', tags: ['Basic', 'Scene'] },
  { number: 2,  title: 'Geometry Lab',              description: 'Explore all built-in 3D shapes',           path: '#lesson-02', tags: ['Basic', 'Geometry'] },
  { number: 3,  title: 'Basic Paint',               description: 'Materials and colors',                     path: '#lesson-03', tags: ['Basic', 'Material'] },
  { number: 4,  title: 'Let There Be Light',        description: 'Master lights and shadows',                path: '#lesson-04', tags: ['Basic', 'Lighting'] },
  { number: 5,  title: 'The Flow of Time',          description: 'Animation loops and Clock',                path: '#lesson-05', tags: ['Intermediate', 'Animation'] },
  { number: 6,  title: 'Camera & Response',         description: 'OrbitControls and Resize',                 path: '#lesson-06', tags: ['Intermediate', 'Controls'] },
  { number: 7,  title: 'Family Tree',               description: 'Scene Graph and Hierarchy',                path: '#lesson-07', tags: ['Intermediate', 'Hierarchy'] },
  { number: 8,  title: 'Interaction (Raycaster)',   description: 'Mouse picking and hovering',               path: '#lesson-08', tags: ['Intermediate', 'Interaction'] },
  { number: 9,  title: 'Realistic Surface (PBR)',   description: 'Advanced PBR textures',                    path: '#lesson-09', tags: ['Advanced', 'Textures'] },
  { number: 10, title: 'Reflection & Skybox',       description: 'Environment maps and reflections',         path: '#lesson-10', tags: ['Advanced', 'Environment'] },
  { number: 11, title: 'Atmospheric Fog',           description: 'Exponential fog and depth',                path: '#lesson-11', tags: ['Intermediate', 'Effects'] },
  { number: 12, title: 'BufferGeometry (Vertices)', description: 'Low-level vertex manipulation',            path: '#lesson-12', tags: ['Expert', 'Geometry'] },
  { number: 13, title: 'Model Shop (GLTF)',         description: 'Importing 3D models',                      path: '#lesson-13', tags: ['Advanced', 'Models'] },
  { number: 14, title: 'Media Textures',            description: 'Audio and Video integration',              path: '#lesson-14', tags: ['Advanced', 'Media'] },
  { number: 15, title: 'Physics World',             description: 'Collisions and gravity',                   path: '#lesson-15', tags: ['Intermediate', 'Physics'] },
  { number: 16, title: 'Post-Processing',           description: 'Visual filters and effects',               path: '#lesson-16', tags: ['Advanced', 'Effects'] },
  { number: 17, title: 'Pixel Sorcery (Shaders)',   description: 'Custom GLSL shaders',                      path: '#lesson-17', tags: ['Expert', 'Shaders'] },
  { number: 18, title: 'High Performance',          description: 'Instancing and optimization',              path: '#lesson-18', tags: ['Advanced', 'Performance'] },
  { number: 19, title: 'Next Dimension (XR)',       description: 'Virtual and Augmented Reality',            path: '#lesson-19', tags: ['Expert', 'XR'] },
  { number: 20, title: 'WebGPU Future',             description: 'Next-gen graphics API',                    path: '#lesson-20', tags: ['Expert', 'WebGPU'] },
  { number: 21, title: 'The Grand Finale',          description: 'Complete 3D Application',                  path: '#lesson-21', tags: ['Project', 'Final'] },
]

function getVisited() {
  try {
    return new Set(JSON.parse(localStorage.getItem(VISITED_KEY) || '[]'))
  } catch {
    return new Set()
  }
}

function getDifficulty(tags) {
  if (tags.includes('Basic'))        return 'basic'
  if (tags.includes('Intermediate')) return 'intermediate'
  if (tags.includes('Advanced'))     return 'advanced'
  if (tags.includes('Expert'))       return 'expert'
  if (tags.includes('Project'))      return 'project'
  return 'basic'
}

function Home() {
  const [visited, setVisited] = useState(() => getVisited())

  // Listen for visits recorded by app.jsx
  useEffect(() => {
    const onVisit = () => setVisited(getVisited())
    window.addEventListener('tbp_visited', onVisit)
    return () => window.removeEventListener('tbp_visited', onVisit)
  }, [])

  const count = visited.size
  const pct = Math.round((count / TOTAL) * 100)

  return (
    <div className="home">
      <section className="hero">
        <h1>ThreeBodyPlay 🚀</h1>
        <p>Systematic Three.js Learning Journey</p>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-value">21</span>
            <span className="stat-label">Core Lessons</span>
          </div>
          <div className="stat">
            <span className="stat-value">{count}</span>
            <span className="stat-label">Visited</span>
          </div>
          <div className="stat">
            <span className="stat-value">∞</span>
            <span className="stat-label">Possibilities</span>
          </div>
        </div>

        <div className="progress-bar-wrap">
          <div className="progress-bar-label">{count} / {TOTAL} lessons visited — {pct}%</div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </section>

      <section className="lessons-section" id="lessons">
        <h2>Curriculum</h2>
        <div className="lessons-grid">
          {lessons.map(lesson => (
            <LessonCard
              key={lesson.number}
              lesson={lesson}
              difficulty={getDifficulty(lesson.tags)}
              visited={visited.has(`lesson-${String(lesson.number).padStart(2, '0')}`)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
