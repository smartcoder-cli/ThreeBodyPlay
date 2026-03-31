import React, { useEffect, useState, useRef } from 'react'

function DirectThree() {
  const [bgColor, setBgColor] = useState('#1a1a2e')
  const [cubeColor, setCubeColor] = useState('#4ecdc4')
  const [autoRotate, setAutoRotate] = useState(true)
  const [showCode, setShowCode] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  
  const autoRotateRef = useRef(autoRotate)
  autoRotateRef.current = autoRotate
  
  const sceneRef = useRef(null)
  const cubeRef = useRef(null)
  const rendererRef = useRef(null)
  const containerRef = useRef(null)
  
  useEffect(() => {
    let mounted = true
    
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
    script.async = true
    
    script.onload = () => {
      if (!mounted || !containerRef.current) return
      
      const THREE = window.THREE
      
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(bgColor)
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
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      rendererRef.current = renderer
      
      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.MeshStandardMaterial({ color: cubeColor })
      const cube = new THREE.Mesh(geometry, material)
      cubeRef.current = cube
      scene.add(cube)
      
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      scene.add(ambientLight)
      
      const pointLight = new THREE.PointLight(0xffffff, 1)
      pointLight.position.set(5, 5, 5)
      scene.add(pointLight)
      
      let animationId
      const animate = () => {
        animationId = requestAnimationFrame(animate)
        if (autoRotateRef.current && cubeRef.current) {
          cubeRef.current.rotation.x += 0.01
          cubeRef.current.rotation.y += 0.01
        }
        renderer.render(scene, camera)
      }
      animate()
      
      const handleResize = () => {
        if (!containerRef.current) return
        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      }
      window.addEventListener('resize', handleResize)
      
      setIsLoaded(true)
      
      return () => {
        mounted = false
        window.removeEventListener('resize', handleResize)
        cancelAnimationFrame(animationId)
        geometry.dispose()
        material.dispose()
        renderer.dispose()
      }
    }
    
    document.head.appendChild(script)
  }, [])
  
  useEffect(() => {
    if (sceneRef.current) {
      sceneRef.current.background = new THREE.Color(bgColor)
    }
  }, [bgColor])
  
  useEffect(() => {
    if (cubeRef.current) {
      cubeRef.current.material.color.set(cubeColor)
    }
  }, [cubeColor])
  
  const codeSnippet = `// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color('${bgColor}')

// Camera
const camera = new THREE.PerspectiveCamera(
  75, 
  width / height, 
  0.1, 
  1000
)
camera.position.z = 5

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(width, height)

// Cube
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial({ 
  color: '${cubeColor}' 
})
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// Lights
const ambient = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambient)

const point = new THREE.PointLight(0xffffff, 1)
point.position.set(5, 5, 5)
scene.add(point)

// Animation Loop
function animate() {
  requestAnimationFrame(animate)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  renderer.render(scene, camera)
}
animate()`

  return (
    <div className="lesson-page">
      <div className="canvas-container" ref={containerRef}>
        <canvas id="three-canvas"></canvas>
        {!isLoaded && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white' }}>
            Loading Three.js...
          </div>
        )}
      </div>
      
      <aside className="sidebar">
        <div className="panel">
          <h3>Scene</h3>
          <div className="control-group">
            <label>Background</label>
            <input 
              type="color" 
              value={bgColor} 
              onChange={(e) => setBgColor(e.target.value)} 
            />
          </div>
        </div>
        
        <div className="panel">
          <h3>Cube</h3>
          <div className="control-group">
            <label>Color</label>
            <input 
              type="color" 
              value={cubeColor} 
              onChange={(e) => setCubeColor(e.target.value)} 
            />
          </div>
        </div>
        
        <div className="panel">
          <h3>Controls</h3>
          <div className="control-group">
            <label>
              <input 
                type="checkbox" 
                checked={autoRotate}
                onChange={(e) => setAutoRotate(e.target.checked)}
              />
              Auto Rotate
            </label>
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

export default DirectThree