import React from 'react'
import LessonCard from '../components/lessoncard'

const lessons = [
  { number: 1, title: 'Basic Scene', description: 'Create your first Three.js scene', path: '#lesson-01', tags: ['Basic', 'Getting Started'] },
  { number: 2, title: 'Geometries', description: 'Create various 3D shapes', path: '#lesson-02', tags: ['Basic', 'Geometry'] },
  { number: 3, title: 'Materials', description: 'Explore different material types', path: '#lesson-03', tags: ['Basic', 'Material'] },
  { number: 4, title: 'Lighting', description: 'Master light sources and shadows', path: '#lesson-04', tags: ['Basic', 'Lighting'] },
  { number: 5, title: 'Animation', description: 'Learn animation basics', path: '#lesson-05', tags: ['Intermediate', 'Animation'] },
  { number: 6, title: 'Controls', description: 'Interactive camera controls', path: '#lesson-06', tags: ['Intermediate', 'Controls'] },
  { number: 7, title: 'Particles', description: 'Particle system basics', path: '#lesson-07', tags: ['Intermediate', 'Particles'] },
  { number: 8, title: 'Physics', description: 'Basic physics simulation', path: '#lesson-08', tags: ['Intermediate', 'Physics'] },
  { number: 9, title: 'Post Processing', description: 'Visual effects and post-processing', path: '#lesson-09', tags: ['Advanced', 'Effects'] },
  { number: 10, title: 'Model Loading', description: 'Import 3D models', path: '#lesson-10', tags: ['Advanced', 'Models'] },
  { number: 11, title: 'Audio & Video', description: 'Integrate audio and video', path: '#lesson-11', tags: ['Advanced', 'Media'] },
  { number: 12, title: 'Performance', description: 'Optimization techniques', path: '#lesson-12', tags: ['Advanced', 'Performance'] },
  { number: 13, title: 'Shaders', description: 'Custom shader programming', path: '#lesson-13', tags: ['Expert', 'Shaders'] },
  { number: 14, title: 'VR & AR', description: 'Virtual and augmented reality', path: '#lesson-14', tags: ['Expert', 'VR/AR'] },
  { number: 15, title: 'Terrain & Skybox', description: 'Terrain generation and sky', path: '#lesson-15', tags: ['Expert', 'Environment'] },
  { number: 16, title: 'WebGPU', description: 'Next-gen graphics API', path: '#lesson-16', tags: ['Expert', 'WebGPU'] },
  { number: 17, title: 'Responsive Design', description: 'Multi-platform适配', path: '#lesson-17', tags: ['Expert', 'Responsive'] },
  { number: 18, title: 'Final Project', description: 'Build a complete 3D app', path: '#lesson-18', tags: ['Project', 'Final'] },
]

function Home() {
  const getDifficulty = (tags) => {
    if (!tags) return 'basic'
    if (tags.includes('Basic')) return 'basic'
    if (tags.includes('Intermediate')) return 'intermediate'
    if (tags.includes('Advanced')) return 'advanced'
    if (tags.includes('Expert')) return 'expert'
    if (tags.includes('Project')) return 'project'
    return 'basic'
  }
  
  return (
    <div className="home">
      <section className="hero">
        <h1>ThreeBodyPlay 🚀</h1>
        <p>Learn Three.js through interactive examples</p>
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-value">18</span>
            <span className="stat-label">Lessons</span>
          </div>
          <div className="stat">
            <span className="stat-value">100%</span>
            <span className="stat-label">Interactive</span>
          </div>
          <div className="stat">
            <span className="stat-value">∞</span>
            <span className="stat-label">Possibilities</span>
          </div>
        </div>
      </section>
      
      <section className="lessons-section" id="lessons">
        <h2>Start Learning</h2>
        <div className="lessons-grid">
          {lessons.map(lesson => (
            <LessonCard 
              key={lesson.number} 
              lesson={lesson} 
              difficulty={getDifficulty(lesson.tags)}
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
