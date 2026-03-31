import React, { useEffect, useState, useRef } from 'react'

function ResponsiveDesignLesson() {
  const [color, setColor] = useState('#4ecdc4')
  const [sidebarPosition, setSidebarPosition] = useState('right')
  const [showGrid, setShowGrid] = useState(true)
  const [showCode, setShowCode] = useState(false)
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 })
  
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const meshRef = useRef(null)
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
      
      const updateViewport = () => {
        if (containerRef.current) {
          setViewportSize({
            width: containerRef.current.clientWidth,
            height: containerRef.current.clientHeight
          })
        }
      }
      
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
      updateViewport()
      
      // Create scene with multiple objects
      const group = new THREE.Group()
      
      // Central sphere
      const sphereGeo = new THREE.SphereGeometry(0.8, 32, 32)
      const sphereMat = new THREE.MeshStandardMaterial({ color: color, metalness: 0.5, roughness: 0.3 })
      const sphere = new THREE.Mesh(sphereGeo, sphereMat)
      sphere.name = 'mainSphere'
      group.add(sphere)
      
      // Orbiting small cubes
      for (let i = 0; i < 6; i++) {
        const cubeGeo = new THREE.BoxGeometry(0.2, 0.2, 0.2)
        const cubeMat = new THREE.MeshStandardMaterial({ color: 0xff6b6b })
        const cube = new THREE.Mesh(cubeGeo, cubeMat)
        cube.userData.orbitIndex = i
        cube.userData.orbitRadius = 2
        cube.userData.orbitSpeed = 0.5 + i * 0.1
        group.add(cube)
      }
      
      // Floor grid
      const gridHelper = new THREE.GridHelper(10, 10, 0x333333, 0x222222)
      gridHelper.name = 'grid'
      gridHelper.visible = showGrid
      scene.add(gridHelper)
      
      scene.add(group)
      meshRef.current = group
      
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      scene.add(ambientLight)
      
      const pointLight = new THREE.PointLight(0xffffff, 1)
      pointLight.position.set(5, 5, 5)
      scene.add(pointLight)
      
      let animationId
      const animate = () => {
        if (!mounted) return
        animationId = requestAnimationFrame(animate)
        
        if (meshRef.current) {
          meshRef.current.rotation.y += 0.005
          
          meshRef.current.children.forEach((child, i) => {
            if (child.userData.orbitIndex !== undefined) {
              const angle = Date.now() * 0.001 * child.userData.orbitSpeed
              child.position.x = Math.cos(angle) * child.userData.orbitRadius
              child.position.z = Math.sin(angle) * child.userData.orbitRadius
              child.position.y = Math.sin(angle * 2) * 0.5
              child.rotation.x += 0.02
              child.rotation.y += 0.02
            }
          })
        }
        
        renderer.render(scene, camera)
      }
      animate()
      
      const handleResize = () => {
        if (!containerRef.current) return
        const width = containerRef.current.clientWidth
        const height = containerRef.current.clientHeight
        
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
        updateViewport()
      }
      
      window.addEventListener('resize', handleResize)
      
      return () => {
        mounted = false
        window.removeEventListener('resize', handleResize)
        cancelAnimationFrame(animationId)
        sphereGeo.dispose()
        sphereMat.dispose()
      }
    }
    
    document.head.appendChild(script)
  }, [])
  
  useEffect(() => {
    if (meshRef.current) {
      const sphere = meshRef.current.getObjectByName('mainSphere')
      if (sphere) {
        sphere.material.color.set(color)
      }
    }
  }, [color])
  
  useEffect(() => {
    if (sceneRef.current) {
      const grid = sceneRef.current.getObjectByName('grid')
      if (grid) {
        grid.visible = showGrid
      }
    }
  }, [showGrid])
  
  const codeSnippet = `// Three.js Responsive Design

// 1. Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// 2. Use devicePixelRatio for sharp rendering
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// 3. Make canvas fill container
canvas.style.width = '100%'
canvas.style.height = '100%'

// 4. Touch support for mobile
canvas.addEventListener('touchstart', onTouchStart, false)
canvas.addEventListener('touchmove', onTouchMove, false)
canvas.addEventListener('touchend', onTouchEnd, false)

// 5. Orientation change (mobile)
window.addEventListener('orientationchange', () => {
  setTimeout(handleResize, 100)
})

// 6. Responsive camera FOV
const updateCamera = () => {
  const aspect = container.clientWidth / container.clientHeight
  if (aspect < 1) {
    // Portrait mode
    camera.fov = 90
  } else {
    // Landscape
    camera.fov = 75
  }
  camera.updateProjectionMatrix()
}`

  return (
    <div className="lesson-page" style={{ flexDirection: sidebarPosition === 'top' ? 'column' : 'row' }}>
      <div className="canvas-container" ref={containerRef}>
        <canvas id="three-canvas"></canvas>
        <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '8px' }}>
          <span style={{ color: '#4ecdc4' }}>Responsive Design</span>
          <p style={{ color: '#888', fontSize: '0.75rem', marginTop: '5px' }}>
            {viewportSize.width} × {viewportSize.height}px
          </p>
        </div>
        <div style={{ position: 'absolute', bottom: '15px', left: '15px', background: 'rgba(0,0,0,0.7)', padding: '8px 12px', borderRadius: '8px' }}>
          <span style={{ color: '#888', fontSize: '0.7rem' }}>
            Try resizing your browser window!
          </span>
        </div>
      </div>
      
      <aside className="sidebar" style={{ 
        width: sidebarPosition === 'top' ? '100%' : '300px',
        maxHeight: sidebarPosition === 'top' ? '200px' : '100%',
        flexDirection: sidebarPosition === 'top' ? 'row' : 'column',
        display: 'flex',
        gap: '10px'
      }}>
        <div className="panel" style={{ flex: 1 }}>
          <h3>Visual Settings</h3>
          <div className="control-group">
            <label>Sphere Color</label>
            <input 
              type="color" 
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <div className="control-group">
            <label>
              <input 
                type="checkbox" 
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
              />
              Show Grid
            </label>
          </div>
        </div>
        
        <div className="panel" style={{ flex: 1 }}>
          <h3>Layout</h3>
          <div className="control-group">
            <label>Sidebar Position</label>
            <select 
              value={sidebarPosition}
              onChange={(e) => setSidebarPosition(e.target.value)}
              style={{ width: '100%', padding: '6px', background: '#1a1a2e', color: '#eee', border: '1px solid #333', borderRadius: '4px' }}
            >
              <option value="right">Right (Desktop)</option>
              <option value="top">Top (Mobile)</option>
            </select>
          </div>
          <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '8px' }}>
            Mobile: Sidebar moves to top
          </p>
        </div>
        
        <div className="panel" style={{ flex: 1 }}>
          <h3>Responsive Tips</h3>
          <p style={{ fontSize: '0.75rem', color: '#888', marginBottom: '6px' }}>
            <strong>1.</strong> Use CSS Flexbox/Grid<br/>
            <strong>2.</strong> Handle resize events<br/>
            <strong>3.</strong> Check aspect ratio<br/>
            <strong>4.</strong> Support touch input<br/>
            <strong>5.</strong> Limit pixel ratio
          </p>
        </div>
        
        <div className="panel" style={{ flex: 1 }}>
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

export default ResponsiveDesignLesson
