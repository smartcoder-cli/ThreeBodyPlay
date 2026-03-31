import React, { useEffect, useState, useRef } from 'react'

function AnimationLesson() {
  const [rotationSpeed, setRotationSpeed] = useState(0.01)
  const [scale, setScale] = useState(1)
  const [bounce, setBounce] = useState(true)
  const [color, setColor] = useState('#4ecdc4')
  const [showCode, setShowCode] = useState(false)
  
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const meshRef = useRef(null)
  
  const speedRef = useRef(rotationSpeed)
  speedRef.current = rotationSpeed
  
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
      
      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.MeshStandardMaterial({ color: color })
      const mesh = new THREE.Mesh(geometry, material)
      meshRef.current = mesh
      scene.add(mesh)
      
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      scene.add(ambientLight)
      
      const pointLight = new THREE.PointLight(0xffffff, 1)
      pointLight.position.set(5, 5, 5)
      scene.add(pointLight)
      
      const animate = () => {
        if (!mounted) return
        requestAnimationFrame(animate)
        
        if (meshRef.current) {
          const speed = speedRef.current
          meshRef.current.rotation.x += speed
          meshRef.current.rotation.y += speed
          
          if (bounce) {
            meshRef.current.position.y = Math.sin(Date.now() * 0.003) * 0.5
          }
        }
        
        renderer.render(scene, camera)
      }
      animate()
    }
    
    document.head.appendChild(script)
    
    return () => { mounted = false }
  }, [])
  
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.material.color.set(color)
    }
  }, [color])
  
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.scale.set(scale, scale, scale)
    }
  }, [scale])
  
  const codeSnippet = `// Animation with dynamic speed
const speedRef = useRef(${rotationSpeed})

function animate() {
  requestAnimationFrame(animate)
  
  // Use ref to get current speed
  const speed = speedRef.current
  mesh.rotation.x += speed
  mesh.rotation.y += speed
  
  ${bounce ? '// Bounce animation'
  + '\n  mesh.position.y = Math.sin(Date.now() * 0.003) * 0.5' : ''}
  
  renderer.render(scene, camera)
}
animate()

// Update speed via ref
speedRef.current = ${rotationSpeed}`

  return (
    <div className="lesson-page">
      <div className="canvas-container" ref={containerRef}>
        <canvas id="three-canvas"></canvas>
      </div>
      
      <aside className="sidebar">
        <div className="panel">
          <h3>Animation</h3>
          <div className="control-group">
            <label>Rotation Speed ({rotationSpeed.toFixed(3)})</label>
            <input 
              type="range" 
              min="0" 
              max="0.1" 
              step="0.001" 
              value={rotationSpeed} 
              onChange={(e) => setRotationSpeed(parseFloat(e.target.value))} 
            />
          </div>
          <div className="control-group">
            <label>Scale ({scale.toFixed(2)})</label>
            <input 
              type="range" 
              min="0.5" 
              max="2" 
              step="0.1" 
              value={scale} 
              onChange={(e) => setScale(parseFloat(e.target.value))} 
            />
          </div>
          <div className="control-group">
            <label>
              <input 
                type="checkbox" 
                checked={bounce}
                onChange={(e) => setBounce(e.target.checked)}
              />
              Bounce Animation
            </label>
          </div>
          <div className="control-group">
            <label>Color</label>
            <input 
              type="color" 
              value={color} 
              onChange={(e) => setColor(e.target.value)} 
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

export default AnimationLesson