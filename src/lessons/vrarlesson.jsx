import React, { useEffect, useState, useRef } from 'react'

function VrArLesson() {
  const [color, setColor] = useState('#4ecdc4')
  const [autoRotate, setAutoRotate] = useState(true)
  const [showCode, setShowCode] = useState(false)
  const [vrSupported, setVrSupported] = useState(false)
  const [vrActive, setVrActive] = useState(false)
  
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const cubesRef = useRef([])
  const rendererRef = useRef(null)
  const autoRotateRef = useRef(autoRotate)  // Ref for animation loop
  
  useEffect(() => {
    let mounted = true
    
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
    script.async = true
    
    script.onload = () => {
      if (!mounted || !containerRef.current) return
      
      const THREE = window.THREE
      
      // Check VR support
      if ('xr' in navigator) {
        navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
          setVrSupported(supported)
        })
      }
      
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
      rendererRef.current = renderer
      
      // Create floating cubes in a 3D grid
      const cubeSize = 0.4
      const gridSize = 3
      const spacing = 1.2
      const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
      
      for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
          for (let z = 0; z < gridSize; z++) {
            const material = new THREE.MeshStandardMaterial({
              color: new THREE.Color().setHSL((x + y + z) / 9 * 0.3 + 0.5, 0.7, 0.5),
              metalness: 0.5,
              roughness: 0.3
            })
            const cube = new THREE.Mesh(geometry, material)
            cube.position.set(
              (x - gridSize / 2) * spacing,
              (y - gridSize / 2) * spacing,
              (z - gridSize / 2) * spacing
            )
            cube.userData.basePosition = cube.position.clone()
            cube.userData.phase = (x + y * 3 + z * 9) * 0.3
            scene.add(cube)
            cubesRef.current.push(cube)
          }
        }
      }
      
      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
      scene.add(ambientLight)
      
      const pointLight1 = new THREE.PointLight(0x4ecdc4, 1, 20)
      pointLight1.position.set(5, 5, 5)
      scene.add(pointLight1)
      
      const pointLight2 = new THREE.PointLight(0xff6b6b, 0.8, 20)
      pointLight2.position.set(-5, 3, -5)
      scene.add(pointLight2)
      
      // Add VR button if supported
      if ('xr' in navigator) {
        navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
          if (supported && containerRef.current) {
            // VR button would be added here in production
            console.log('VR supported')
          }
        })
      }
      
      let animationId
      const animate = () => {
        if (!mounted) return
        animationId = requestAnimationFrame(animate)
        
        const time = Date.now() * 0.001
        
        cubesRef.current.forEach((cube) => {
          if (autoRotateRef.current) {
            cube.rotation.x += 0.01
            cube.rotation.y += 0.01
          }
          // Floating animation
          cube.position.y = cube.userData.basePosition.y + Math.sin(time + cube.userData.phase) * 0.2
        })
        
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
      
      return () => {
        mounted = false
        window.removeEventListener('resize', handleResize)
        cancelAnimationFrame(animationId)
        geometry.dispose()
      }
    }
    
    document.head.appendChild(script)
  }, [])
  
  const codeSnippet = `// WebXR VR/AR Setup with Three.js
// Check for VR/AR support
if ('xr' in navigator) {
  const supported = await navigator.xr.isSessionSupported('immersive-vr')
  console.log('VR supported:', supported)
}

// VR Session
const session = await navigator.xr.requestSession('immersive-vr', {
  optionalFeatures: ['local-floor', 'bounded-floor']
})

// Create VR renderer
renderer.xr.enabled = true
renderer.xr.setSession(session)

// Animation loop for VR (no need for requestAnimationFrame in VR mode)
// renderer.setAnimationLoop(animate)

// For AR (Augmented Reality)
const arSession = await navigator.xr.requestSession('immersive-ar', {
  requiredFeatures: ['hit-test']
})

// Hit testing for AR placement
session.addEventListener('select', () => {
  // Place object at hit test position
})

// Three.js WebXR Button
import { VRButton } from 'three/examples/jsm/webxr/VRButton'
document.body.appendChild(VRButton.createButton(renderer))`

  return (
    <div className="lesson-page">
      <div className="canvas-container" ref={containerRef}>
        <canvas id="three-canvas"></canvas>
        <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '8px' }}>
          <span style={{ color: '#4ecdc4' }}>VR & AR</span>
          <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '5px' }}>
            {vrSupported ? '✓ VR Supported on this device' : 'VR not detected'}
          </p>
          {vrActive && (
            <p style={{ color: '#4ecdc4', fontSize: '0.8rem' }}>
              VR Session Active
            </p>
          )}
        </div>
      </div>
      
      <aside className="sidebar">
        <div className="panel">
          <h3>Scene Settings</h3>
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
          <h3>VR Info</h3>
          <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '10px' }}>
            WebXR enables immersive VR and AR experiences in the browser.
          </p>
          <p style={{ fontSize: '0.8rem', color: '#666' }}>
            <strong>VR:</strong> Virtual reality headsets<br/>
            <strong>AR:</strong> Augmented reality (camera passthrough)
          </p>
        </div>
        
        <div className="panel">
          <h3>Requirements</h3>
          <p style={{ fontSize: '0.8rem', color: vrSupported ? '#4ecdc4' : '#ff6b6b' }}>
            {vrSupported ? '✓ WebXR Runtime Detected' : '✗ No WebXR Runtime'}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#666', marginTop: '8px' }}>
            Requires VR headset with browser extension (Quest Browser, Firefox Reality, etc.)
          </p>
        </div>
        
        <div className="panel">
          <h3>Supported Devices</h3>
          <p style={{ fontSize: '0.8rem', color: '#888' }}>
            ✓ Meta Quest 2/3<br/>
            ✓ SteamVR headsets<br/>
            ✓ HoloLens 2 (AR)<br/>
            ✓ Mobile AR (ARKit/ARCore)
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

export default VrArLesson
