import React, { useEffect, useState, useRef } from 'react'

function PerformanceLesson() {
  const [objectCount, setObjectCount] = useState(100)
  const [fps, setFps] = useState(60)
  const [showCode, setShowCode] = useState(false)
  
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const meshesRef = useRef([])
  const rendererRef = useRef(null)
  
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
      camera.position.z = 30
      
      const canvas = document.getElementById('three-canvas')
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: false })
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      rendererRef.current = renderer
      
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      scene.add(ambientLight)
      
      // Create instanced mesh for performance
      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
      const material = new THREE.MeshStandardMaterial({ color: 0x4ecdc4 })
      
      const createInstances = (count) => {
        meshesRef.current.forEach(mesh => scene.remove(mesh))
        meshesRef.current = []
        
        for (let i = 0; i < count; i++) {
          const mesh = new THREE.Mesh(geometry, material)
          mesh.position.x = (Math.random() - 0.5) * 40
          mesh.position.y = (Math.random() - 0.5) * 20
          mesh.position.z = (Math.random() - 0.5) * 20
          scene.add(mesh)
          meshesRef.current.push(mesh)
        }
      }
      
      createInstances(objectCount)
      
      let frameCount = 0
      let lastTime = performance.now()
      
      const animate = () => {
        if (!mounted) return
        requestAnimationFrame(animate)
        
        meshesRef.current.forEach((mesh, i) => {
          mesh.rotation.x += 0.01 * (i % 3 + 1)
          mesh.rotation.y += 0.02 * (i % 3 + 1)
        })
        
        renderer.render(scene, camera)
        
        frameCount++
        const currentTime = performance.now()
        if (currentTime - lastTime >= 1000) {
          setFps(frameCount)
          frameCount = 0
          lastTime = currentTime
        }
      }
      animate()
    }
    
    document.head.appendChild(script)
    
    return () => { mounted = false }
  }, [])
  
  useEffect(() => {
    if (!sceneRef.current) return
    
    const THREE = window.THREE
    
    meshesRef.current.forEach(mesh => sceneRef.current.remove(mesh))
    meshesRef.current = []
    
    for (let i = 0; i < objectCount; i++) {
      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
      const material = new THREE.MeshStandardMaterial({ color: 0x4ecdc4 })
      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.x = (Math.random() - 0.5) * 40
      mesh.position.y = (Math.random() - 0.5) * 20
      mesh.position.z = (Math.random() - 0.5) * 20
      sceneRef.current.add(mesh)
      meshesRef.current.push(mesh)
    }
  }, [objectCount])
  
  const codeSnippet = `// Performance optimization techniques:
// 1. InstancedMesh - draw many objects efficiently
// 2. Object pooling - reuse objects
// 3. Frustum culling - don't render off-screen
// 4. Level of Detail (LOD) - fewer details far away
// 5. Reduce draw calls

// InstancedMesh example:
const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5)
const material = new THREE.MeshStandardMaterial({ color: 0x4ecdc4 })
const count = ${objectCount}

for (let i = 0; i < count; i++) {
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(
    (Math.random() - 0.5) * 40,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20
  )
  scene.add(mesh)
}`

  return (
    <div className="lesson-page">
      <div className="canvas-container" ref={containerRef}>
        <canvas id="three-canvas"></canvas>
        <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '8px' }}>
          <span style={{ color: fps < 30 ? '#ff6b6b' : fps < 50 ? '#ffd93d' : '#4ecdc4', fontSize: '1.2rem', fontWeight: 'bold' }}>
            {fps} FPS
          </span>
          <span style={{ color: '#888', marginLeft: '10px' }}>
            Objects: {objectCount}
          </span>
        </div>
      </div>
      
      <aside className="sidebar">
        <div className="panel">
          <h3>Performance Test</h3>
          <div className="control-group">
            <label>Object Count ({objectCount})</label>
            <input 
              type="range" 
              min="10" 
              max="500" 
              step="10"
              value={objectCount}
              onChange={(e) => setObjectCount(parseInt(e.target.value))}
            />
          </div>
          <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '10px' }}>
            Watch FPS change as you increase objects
          </p>
        </div>
        
        <div className="panel">
          <h3>FPS Guide</h3>
          <p style={{ fontSize: '0.8rem', color: '#4ecdc4' }}>60+ FPS = Excellent</p>
          <p style={{ fontSize: '0.8rem', color: '#ffd93d' }}>30-50 FPS = Good</p>
          <p style={{ fontSize: '0.8rem', color: '#ff6b6b' }}>&lt;30 FPS = Poor</p>
        </div>
        
        <div className="panel">
          <h3>
            <span style={{ cursor: 'pointer' }} onClick={() => setShowCode(!showCode)}>
              {showCode ? '▼' : '▶'} Optimization Tips
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

export default PerformanceLesson