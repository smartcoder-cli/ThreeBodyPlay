import React, { useEffect, useState, useRef } from 'react'

function WebGPULesson() {
  const [color, setColor] = useState('#4ecdc4')
  const [rotationSpeed, setRotationSpeed] = useState(0.5)
  const [showCode, setShowCode] = useState(false)
  const [webgpuSupported, setWebgpuSupported] = useState(false)
  const [renderMode, setRenderMode] = useState('webgl')
  
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const meshRef = useRef(null)
  const rendererRef = useRef(null)
  const rotationSpeedRef = useRef(rotationSpeed)  // Ref for animation loop
  
  useEffect(() => {
    let mounted = true
    
    // Check WebGPU support
    if ('gpu' in navigator) {
      navigator.gpu.requestAdapter().then((adapter) => {
        if (adapter) {
          setWebgpuSupported(true)
        }
      }).catch(() => {
        setWebgpuSupported(false)
      })
    }
    
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
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      rendererRef.current = renderer
      
      // Complex torus knot geometry
      const geometry = new THREE.TorusKnotGeometry(1.5, 0.4, 128, 32)
      const material = new THREE.MeshStandardMaterial({
        color: color,
        metalness: 0.7,
        roughness: 0.2,
        envMapIntensity: 1
      })
      const mesh = new THREE.Mesh(geometry, material)
      meshRef.current = mesh
      scene.add(mesh)
      
      // Wireframe overlay
      const wireGeo = new THREE.TorusKnotGeometry(1.55, 0.42, 128, 32)
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x4ecdc4,
        wireframe: true,
        transparent: true,
        opacity: 0.3
      })
      const wireMesh = new THREE.Mesh(wireGeo, wireMat)
      wireMesh.name = 'wireframe'
      scene.add(wireMesh)
      
      // Environment lighting simulation with multiple lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
      scene.add(ambientLight)
      
      const pointLight1 = new THREE.PointLight(0x4ecdc4, 2, 15)
      pointLight1.position.set(3, 3, 3)
      scene.add(pointLight1)
      
      const pointLight2 = new THREE.PointLight(0xff6b6b, 1.5, 15)
      pointLight2.position.set(-3, -3, 3)
      scene.add(pointLight2)
      
      const pointLight3 = new THREE.PointLight(0xffffff, 1, 15)
      pointLight3.position.set(0, 5, 0)
      scene.add(pointLight3)
      
      let animationId
      const animate = () => {
        if (!mounted) return
        animationId = requestAnimationFrame(animate)
        
        if (meshRef.current) {
          meshRef.current.rotation.x += 0.005 * rotationSpeed
          meshRef.current.rotation.y += 0.01 * rotationSpeed
          
          const wireframe = scene.getObjectByName('wireframe')
          if (wireframe) {
            wireframe.rotation.x = meshRef.current.rotation.x
            wireframe.rotation.y = meshRef.current.rotation.y
          }
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
      
      return () => {
        mounted = false
        window.removeEventListener('resize', handleResize)
        cancelAnimationFrame(animationId)
        geometry.dispose()
        material.dispose()
        wireGeo.dispose()
        wireMat.dispose()
      }
    }
    
    document.head.appendChild(script)
  }, [])
  
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.material.color.set(color)
    }
  }, [color])
  
  const codeSnippet = `// WebGPU - The Next Generation Graphics API
// Note: Browser support is still limited

// Check WebGPU support
if ('gpu' in navigator) {
  const adapter = await navigator.gpu.requestAdapter()
  if (adapter) {
    console.log('WebGPU is supported!')
    const device = await adapter.requestDevice()
  }
}

// WebGPU vs WebGL comparison
// WebGL: Single thread, state machine, immediate mode
// WebGPU: Explicit sync, compute shaders, multi-threaded friendly

// Three.js with WebGPU (future)
import { WebGPURenderer } from 'three/examples/jsm/renderers/WebGPURenderer'

const renderer = new WebGPURenderer({
  canvas,
  antialias: true
})
await renderer.init()

// For now, WebGL remains the standard
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  powerPreference: 'high-performance'
})

// WebGPU advantages:
// - Compute shaders (GPU particle simulations)
// - Better multi-threading
// - Lower CPU overhead
// - Better mobile support`

  return (
    <div className="lesson-page">
      <div className="canvas-container" ref={containerRef}>
        <canvas id="three-canvas"></canvas>
        <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '8px' }}>
          <span style={{ color: '#4ecdc4' }}>WebGPU</span>
          <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '5px' }}>
            {renderMode === 'webgpu' ? 'WebGPU Renderer' : 'WebGL Renderer (Current)'}
          </p>
        </div>
        <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(0,0,0,0.7)', padding: '8px 12px', borderRadius: '8px' }}>
          <span style={{ color: webgpuSupported ? '#4ecdc4' : '#ff6b6b', fontSize: '0.8rem' }}>
            {webgpuSupported ? '✓ WebGPU Available' : 'WebGPU Not Supported'}
          </span>
        </div>
      </div>
      
      <aside className="sidebar">
        <div className="panel">
          <h3>Visual Settings</h3>
          <div className="control-group">
            <label>Model Color</label>
            <input 
              type="color" 
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
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
          <h3>WebGPU vs WebGL</h3>
          <table style={{ fontSize: '0.75rem', color: '#888', width: '100%' }}>
            <tbody>
              <tr>
                <td style={{ padding: '4px 0' }}></td>
                <td style={{ color: '#4ecdc4', fontWeight: 'bold' }}>WebGL</td>
                <td style={{ color: '#ff6b6b', fontWeight: 'bold' }}>WebGPU</td>
              </tr>
              <tr><td style={{ padding: '2px 0' }}>Browser Support</td><td>98%</td><td>~70%</td></tr>
              <tr><td style={{ padding: '2px 0' }}>Compute Shaders</td><td>✗</td><td>✓</td></tr>
              <tr><td style={{ padding: '2px 0' }}>CPU Overhead</td><td>Higher</td><td>Lower</td></tr>
              <tr><td style={{ padding: '2px 0' }}>Multi-threading</td><td>Limited</td><td>Native</td></tr>
            </tbody>
          </table>
        </div>
        
        <div className="panel">
          <h3>Browser Support</h3>
          <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '8px' }}>
            WebGPU is available in:
          </p>
          <p style={{ fontSize: '0.8rem', color: '#4ecdc4' }}>
            ✓ Chrome 113+ (with flag)<br/>
            ✓ Edge 113+<br/>
            ✓ Safari Technology Preview<br/>
            ✗ Firefox (in development)
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

export default WebGPULesson
