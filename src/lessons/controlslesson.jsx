import React, { useEffect, useState, useRef } from 'react'

function ControlsLesson() {
  const [enableDamping, setEnableDamping] = useState(true)
  const [autoRotate, setAutoRotate] = useState(false)
  const [rotateSpeed, setRotateSpeed] = useState(1)
  const [enableZoom, setEnableZoom] = useState(true)
  const [showCode, setShowCode] = useState(false)
  
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const controlsRef = useRef(null)
  const objectsRef = useRef([])
  
  useEffect(() => {
    let mounted = true
    
    // Load Three.js from CDN
    const threeScript = document.createElement('script')
    threeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
    
    // Load OrbitControls from CDN
    const controlsScript = document.createElement('script')
    controlsScript.src = 'https://unpkg.com/three@0.128.0/examples/js/controls/OrbitControls.js'
    
    threeScript.onload = () => {
      controlsScript.onload = () => {
        if (!mounted || !containerRef.current) return
        
        const THREE = window.THREE
        const OrbitControls = window.THREE.OrbitControls
        
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
        cameraRef.current = camera
        
        const canvas = document.getElementById('three-canvas')
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
        rendererRef.current = renderer
        
        // Create multiple objects
        const objects = []
        
        const boxGeo = new THREE.BoxGeometry(1, 1, 1)
        const boxMat = new THREE.MeshStandardMaterial({ color: 0x4ecdc4 })
        const box = new THREE.Mesh(boxGeo, boxMat)
        box.position.x = -2
        scene.add(box)
        objects.push(box)
        
        const sphereGeo = new THREE.SphereGeometry(0.7, 32, 32)
        const sphereMat = new THREE.MeshStandardMaterial({ color: 0xff6b6b })
        const sphere = new THREE.Mesh(sphereGeo, sphereMat)
        scene.add(sphere)
        objects.push(sphere)
        
        const coneGeo = new THREE.ConeGeometry(0.7, 1.5, 32)
        const coneMat = new THREE.MeshStandardMaterial({ color: 0xffd93d })
        const cone = new THREE.Mesh(coneGeo, coneMat)
        cone.position.x = 2
        scene.add(cone)
        objects.push(cone)
        
        objectsRef.current = objects
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        scene.add(ambientLight)
        
        const pointLight = new THREE.PointLight(0xffffff, 1)
        pointLight.position.set(5, 5, 5)
        scene.add(pointLight)
        
        // OrbitControls
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = enableDamping
        controls.autoRotate = autoRotate
        controls.autoRotateSpeed = rotateSpeed
        controls.enableZoom = enableZoom
        controlsRef.current = controls
        
        const animate = () => {
          if (!mounted) return
          requestAnimationFrame(animate)
          controls.update()
          
          objectsRef.current.forEach((obj, i) => {
            obj.rotation.y += 0.005 * (i + 1)
          })
          
          renderer.render(scene, camera)
        }
        animate()
      }
      document.head.appendChild(controlsScript)
    }
    
    document.head.appendChild(threeScript)
    
    return () => { mounted = false }
  }, [])
  
  // Update controls
  useEffect(() => {
    if (!controlsRef.current) return
    controlsRef.current.enableDamping = enableDamping
    controlsRef.current.autoRotate = autoRotate
    controlsRef.current.autoRotateSpeed = rotateSpeed
    controlsRef.current.enableZoom = enableZoom
  }, [enableDamping, autoRotate, rotateSpeed, enableZoom])
  
  const codeSnippet = `// OrbitControls
import { OrbitControls } from 
  'three/examples/jsm/controls/OrbitControls'

const controls = new OrbitControls(
  camera, 
  renderer.domElement
)

// Enable smooth damping
controls.enableDamping = ${enableDamping}
controls.dampingFactor = 0.05

// Auto rotation
controls.autoRotate = ${autoRotate}
controls.autoRotateSpeed = ${rotateSpeed}

// Zoom settings
controls.enableZoom = ${enableZoom}

// Update controls in animation loop
function animate() {
  requestAnimationFrame(animate)
  controls.update()  // Required when damping enabled
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
          <h3>OrbitControls</h3>
          <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '10px' }}>
            Drag to rotate, scroll to zoom
          </p>
          <div className="control-group">
            <label>
              <input 
                type="checkbox" 
                checked={enableDamping}
                onChange={(e) => setEnableDamping(e.target.checked)}
              />
              Enable Damping
            </label>
            <p style={{ fontSize: '0.7rem', color: '#666', marginTop: '5px' }}>
              {enableDamping ? 'On: Camera rotation has inertia, smooth stop' : 'Off: Camera stops immediately when you release'}
            </p>
          </div>
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
          <div className="control-group">
            <label>
              <input 
                type="checkbox" 
                checked={enableZoom}
                onChange={(e) => setEnableZoom(e.target.checked)}
              />
              Enable Zoom
            </label>
          </div>
        </div>
        
        <div className="panel">
          <h3>Settings</h3>
          <div className="control-group">
            <label>Rotate Speed ({rotateSpeed.toFixed(1)})</label>
            <input 
              type="range" 
              min="0.5" 
              max="5" 
              step="0.5" 
              value={rotateSpeed}
              onChange={(e) => setRotateSpeed(parseFloat(e.target.value))}
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

export default ControlsLesson