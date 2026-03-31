import React, { useEffect, useState, useRef } from 'react'

function ParticlesLesson() {
  const [particleCount, setParticleCount] = useState(500)
  const [particleSize, setParticleSize] = useState(0.05)
  const [particleColor, setParticleColor] = useState('#4ecdc4')
  const [showCode, setShowCode] = useState(false)
  
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const particlesRef = useRef(null)
  const rendererRef = useRef(null)
  
  const countRef = useRef(particleCount)
  countRef.current = particleCount
  
  const sizeRef = useRef(particleSize)
  sizeRef.current = particleSize
  
  const colorRef = useRef(particleColor)
  colorRef.current = particleColor
  
  useEffect(() => {
    let mounted = true
    
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
    script.async = true
    
    script.onload = () => {
      if (!mounted || !containerRef.current) return
      
      const THREE = window.THREE
      
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x1a1a2e)
      sceneRef.current = scene
      
      const camera = new THREE.PerspectiveCamera(
        75, 
        containerRef.current.clientWidth / containerRef.current.clientHeight, 
        0.1, 
        1000
      )
      camera.position.z = 5
      
      const canvas = document.getElementById('three-canvas')
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      rendererRef.current = renderer
      
      // Create particles function
      const createParticles = (count, size, color) => {
        if (particlesRef.current) {
          scene.remove(particlesRef.current)
          particlesRef.current.geometry.dispose()
          particlesRef.current.material.dispose()
        }
        
        const geometry = new THREE.BufferGeometry()
        const positions = new Float32Array(count * 3)
        
        for (let i = 0; i < count * 3; i++) {
          positions[i] = (Math.random() - 0.5) * 10
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        
        const material = new THREE.PointsMaterial({
          size: size,
          color: color,
          transparent: true,
          opacity: 0.8
        })
        
        const particles = new THREE.Points(geometry, material)
        particlesRef.current = particles
        scene.add(particles)
      }
      
      createParticles(countRef.current, sizeRef.current, colorRef.current)
      
      const animate = () => {
        if (!mounted) return
        requestAnimationFrame(animate)
        
        if (particlesRef.current) {
          particlesRef.current.rotation.y += 0.002
          particlesRef.current.rotation.x += 0.001
        }
        
        renderer.render(scene, camera)
      }
      animate()
    }
    
    document.head.appendChild(script)
    
    return () => { mounted = false }
  }, [])
  
  // Recreate particles when count changes
  useEffect(() => {
    if (!sceneRef.current || !particlesRef.current) return
    
    const THREE = window.THREE
    
    // Remove old particles
    if (particlesRef.current) {
      sceneRef.current.remove(particlesRef.current)
      particlesRef.current.geometry.dispose()
      particlesRef.current.material.dispose()
    }
    
    // Create new particles
    const geometry = new THREE.BufferGeometry()
    const count = particleCount
    const positions = new Float32Array(count * 3)
    
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    
    const material = new THREE.PointsMaterial({
      size: particleSize,
      color: particleColor,
      transparent: true,
      opacity: 0.8
    })
    
    const particles = new THREE.Points(geometry, material)
    particlesRef.current = particles
    sceneRef.current.add(particles)
  }, [particleCount])
  
  // Update size without recreating
  useEffect(() => {
    if (!particlesRef.current) return
    particlesRef.current.material.size = particleSize
  }, [particleSize])
  
  // Update color without recreating
  useEffect(() => {
    if (!particlesRef.current) return
    particlesRef.current.material.color.set(particleColor)
  }, [particleColor])
  
  const codeSnippet = `// Particle system
const geometry = new THREE.BufferGeometry()
const count = ${particleCount}

const positions = new Float32Array(count * 3)
for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 10
}
geometry.setAttribute(
  'position', 
  new THREE.BufferAttribute(positions, 3)
)

const material = new THREE.PointsMaterial({
  size: ${particleSize},
  color: '${particleColor}',
  transparent: true,
  opacity: 0.8
})

const particles = new THREE.Points(geometry, material)
scene.add(particles)

// Animation
function animate() {
  requestAnimationFrame(animate)
  particles.rotation.y += 0.002
  particles.rotation.x += 0.001
  renderer.render(scene, camera)
}
animate()`

  return (
    <div className="lesson-page">
      <div className="canvas-container" ref={containerRef}>
        <canvas id="three-canvas"></canvas>
      </div>
      
      <aside className="sidebar">
        <div className="panel">
          <h3>Particles</h3>
          <div className="control-group">
            <label>Count ({particleCount})</label>
            <input 
              type="range" 
              min="100" 
              max="2000" 
              step="100"
              value={particleCount}
              onChange={(e) => setParticleCount(parseInt(e.target.value))}
            />
          </div>
          <div className="control-group">
            <label>Size ({particleSize.toFixed(2)})</label>
            <input 
              type="range" 
              min="0.01" 
              max="0.2" 
              step="0.01"
              value={particleSize}
              onChange={(e) => setParticleSize(parseFloat(e.target.value))}
            />
          </div>
          <div className="control-group">
            <label>Color</label>
            <input 
              type="color" 
              value={particleColor}
              onChange={(e) => setParticleColor(e.target.value)}
            />
          </div>
        </div>
        
        <div className="panel">
          <h3>
            <span style={{ cursor: 'pointer' }} onClick={() => setShowCode(!showCode)}>
              {showCode ? '▼' : '▶'} Code Example
            </span>
          </h3>
          {showCode && (
            <pre className="code-preview">
              <code>{codeSnippet}</code>
            </pre>
          )}
        </div>
      </aside>
    </div>
  )
}

export default ParticlesLesson