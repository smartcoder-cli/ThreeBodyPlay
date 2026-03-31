import React, { useEffect, useState, useRef } from 'react'

function FinalProject() {
  const [rotationSpeed, setRotationSpeed] = useState(0.5)
  const [objectType, setObjectType] = useState('combined')
  const [color1, setColor1] = useState('#4ecdc4')
  const [color2, setColor2] = useState('#ff6b6b')
  const [showCode, setShowCode] = useState(false)
  
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const groupRef = useRef(null)
  
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
      camera.position.z = 8
      
      const canvas = document.getElementById('three-canvas')
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      
      const group = new THREE.Group()
      groupRef.current = group
      
      // Central sphere
      const sphereGeo = new THREE.SphereGeometry(1, 32, 32)
      const sphereMat = new THREE.MeshStandardMaterial({ color: color1, metalness: 0.5, roughness: 0.3 })
      const sphere = new THREE.Mesh(sphereGeo, sphereMat)
      group.add(sphere)
      
      // Orbiting cubes
      for (let i = 0; i < 6; i++) {
        const cubeGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4)
        const cubeMat = new THREE.MeshStandardMaterial({ color: color2 })
        const cube = new THREE.Mesh(cubeGeo, cubeMat)
        cube.position.x = Math.cos(i * Math.PI / 3) * 3
        cube.position.z = Math.sin(i * Math.PI / 3) * 3
        cube.userData.orbitAngle = i * Math.PI / 3
        group.add(cube)
      }
      
      // Particle ring
      const particlesGeo = new THREE.BufferGeometry()
      const particleCount = 100
      const positions = new Float32Array(particleCount * 3)
      for (let i = 0; i < particleCount; i++) {
        const angle = (i / particleCount) * Math.PI * 2
        positions[i * 3] = Math.cos(angle) * 4
        positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5
        positions[i * 3 + 2] = Math.sin(angle) * 4
      }
      particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      const particlesMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 })
      const particles = new THREE.Points(particlesGeo, particlesMat)
      group.add(particles)
      
      scene.add(group)
      
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
      scene.add(ambientLight)
      
      const pointLight = new THREE.PointLight(0xffffff, 1)
      pointLight.position.set(5, 5, 5)
      scene.add(pointLight)
      
      const animate = () => {
        if (!mounted) return
        requestAnimationFrame(animate)
        
        if (groupRef.current) {
          groupRef.current.rotation.y += rotationSpeed * 0.01
          
          // Orbit cubes around center
          groupRef.current.children.forEach((child, i) => {
            if (i > 0 && i <= 6) {
              child.userData.orbitAngle += rotationSpeed * 0.02
              child.position.x = Math.cos(child.userData.orbitAngle) * 3
              child.position.z = Math.sin(child.userData.orbitAngle) * 3
            }
          })
        }
        
        renderer.render(scene, camera)
      }
      animate()
    }
    
    document.head.appendChild(script)
    
    return () => { mounted = false }
  }, [])
  
  useEffect(() => {
    if (groupRef.current && groupRef.current.children[0]) {
      groupRef.current.children[0].material.color.set(color1)
    }
  }, [color1])
  
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        if (i > 0 && i <= 6) {
          child.material.color.set(color2)
        }
      })
    }
  }, [color2])
  
  const codeSnippet = `// Final Project - Combined Scene
// Features: Animation, Materials, Particles

const group = new THREE.Group()

// Central sphere with PBR material
const sphereMat = new THREE.MeshStandardMaterial({
  color: '${color1}',
  metalness: 0.5,
  roughness: 0.3
})
const sphere = new THREE.Mesh(sphereGeo, sphereMat)
group.add(sphere)

// Orbiting cubes
for (let i = 0; i < 6; i++) {
  const cube = new THREE.Mesh(cubeGeo, cubeMat)
  cube.userData.orbitAngle = i * Math.PI / 3
  group.add(cube)
}

// Particle ring
const particles = new THREE.Points(particlesGeo, particlesMat)
group.add(particles)

// Animation
function animate() {
  requestAnimationFrame(animate)
  
  group.rotation.y += ${rotationSpeed} * 0.01
  
  // Orbit cubes
  group.children.forEach((child, i) => {
    if (i > 0 && i <= 6) {
      child.userData.orbitAngle += ${rotationSpeed} * 0.02
      child.position.x = Math.cos(child.userData.orbitAngle) * 3
      child.position.z = Math.sin(child.userData.orbitAngle) * 3
    }
  })
  
  renderer.render(scene, camera)
}
animate()`

  return (
    <div className="lesson-page">
      <div className="canvas-container" ref={containerRef}>
        <canvas id="three-canvas"></canvas>
        <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '8px' }}>
          <span style={{ color: '#4ecdc4' }}>Final Project</span>
          <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '5px' }}>
            Combined: Animation + Materials + Particles
          </p>
        </div>
      </div>
      
      <aside className="sidebar">
        <div className="panel">
          <h3>Controls</h3>
          <div className="control-group">
            <label>Rotation Speed ({rotationSpeed.toFixed(1)})</label>
            <input 
              type="range" 
              min="0" 
              max="2" 
              step="0.1"
              value={rotationSpeed}
              onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
            />
          </div>
        </div>
        
        <div className="panel">
          <h3>Colors</h3>
          <div className="control-group">
            <label>Center Sphere</label>
            <input 
              type="color" 
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
            />
          </div>
          <div className="control-group">
            <label>Orbiting Cubes</label>
            <input 
              type="color" 
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
            />
          </div>
        </div>
        
        <div className="panel">
          <h3>Features</h3>
          <p style={{ fontSize: '0.8rem', color: '#888' }}>
            ✓ PBR Materials<br/>
            ✓ Orbiting Animation<br/>
            ✓ Particle System<br/>
            ✓ Combined Scene
          </p>
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

export default FinalProject