import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

function BasicScene() {
  const containerRef = useRef(null)
  const sceneRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    controls: null,
    cube: null,
    geometry: null,
    material: null,
    animationId: null
  })
  
  // State
  const [bgColor, setBgColor] = useState('#1a1a2e')
  const [cubeColor, setCubeColor] = useState('#4ecdc4')
  const [cubeSize, setCubeSize] = useState(1)
  const [autoRotate, setAutoRotate] = useState(true)
  const [fov, setFov] = useState(75)
  const [stats, setStats] = useState({ fps: 60, triangles: 0 })

  // Initialize Three.js scene
  const initScene = () => {
    if (!containerRef.current) return

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(bgColor)

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.z = 5

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.innerHTML = '' // Clear container
    containerRef.current.appendChild(renderer.domElement)

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.autoRotate = autoRotate

    // Cube
    const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
    const material = new THREE.MeshStandardMaterial({ color: cubeColor })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(5, 5, 5)
    scene.add(pointLight)

    // Store references
    sceneRef.current = {
      scene,
      camera,
      renderer,
      controls,
      cube,
      geometry,
      material,
      animationId: null
    }

    // Animation
    let frameCount = 0
    let lastTime = performance.now()
    
    const animate = () => {
      sceneRef.current.animationId = requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
      
      frameCount++
      const currentTime = performance.now()
      if (currentTime - lastTime >= 1000) {
        setStats({ 
          fps: frameCount, 
          triangles: renderer.info.render.triangles 
        })
        frameCount = 0
        lastTime = currentTime
      }
    }
    animate()

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current || !sceneRef.current.camera || !sceneRef.current.renderer) return
      
      sceneRef.current.camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight
      sceneRef.current.camera.updateProjectionMatrix()
      sceneRef.current.renderer.setSize(
        containerRef.current.clientWidth,
        containerRef.current.clientHeight
      )
    }
    window.addEventListener('resize', handleResize)
    
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }

  // Cleanup Three.js resources
  const cleanupScene = () => {
    if (sceneRef.current.animationId) {
      cancelAnimationFrame(sceneRef.current.animationId)
    }
    if (sceneRef.current.renderer) {
      sceneRef.current.renderer.dispose()
    }
    if (sceneRef.current.geometry) {
      sceneRef.current.geometry.dispose()
    }
    if (sceneRef.current.material) {
      sceneRef.current.material.dispose()
    }
    if (sceneRef.current.controls) {
      sceneRef.current.controls.dispose()
    }
  }

  // Main useEffect
  useEffect(() => {
    console.log('BasicScene useEffect running')
    
    // Initialize scene
    const cleanupResize = initScene()
    
    // Return cleanup function
    return () => {
      console.log('BasicScene cleanup')
      cleanupResize?.()
      cleanupScene()
    }
  }, []) // Run only once on mount

  // Update scene when state changes
  useEffect(() => {
    if (!sceneRef.current.scene || !sceneRef.current.cube) return
    
    // Update background color
    sceneRef.current.scene.background = new THREE.Color(bgColor)
    
    // Update cube color
    sceneRef.current.cube.material.color.set(cubeColor)
    
    // Update cube size
    sceneRef.current.cube.geometry.dispose()
    sceneRef.current.cube.geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
    
    // Update auto rotation
    if (sceneRef.current.controls) {
      sceneRef.current.controls.autoRotate = autoRotate
    }
  }, [bgColor, cubeColor, cubeSize, autoRotate])

  return (
    <div className="lesson-page">
      <div className="canvas-container" ref={containerRef}>
        <div className="stats-panel">
          <span>FPS: {stats.fps}</span>
          <span>Triangles: {stats.triangles}</span>
        </div>
      </div>
      
      <aside className="sidebar">
        <div className="panel">
          <h3>Scene</h3>
          <div className="control-row">
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
          <div className="control-row">
            <label>Color</label>
            <input 
              type="color" 
              value={cubeColor} 
              onChange={(e) => setCubeColor(e.target.value)} 
            />
          </div>
          
          <div className="control-row">
            <label>Size ({cubeSize})</label>
            <input 
              type="range" 
              min="0.5" 
              max="3" 
              step="0.1"
              value={cubeSize}
              onChange={(e) => setCubeSize(parseFloat(e.target.value))}
            />
          </div>
        </div>
        
        <div className="panel">
          <h3>Controls</h3>
          <div className="control-row">
            <label>Auto Rotate</label>
            <input 
              type="checkbox" 
              checked={autoRotate}
              onChange={(e) => setAutoRotate(e.target.checked)}
            />
          </div>
          
          <div className="control-row">
            <label>FOV ({fov}°)</label>
            <input 
              type="range" 
              min="30" 
              max="120" 
              value={fov}
              onChange={(e) => setFov(parseInt(e.target.value))}
            />
          </div>
        </div>
      </aside>
    </div>
  )
}

export default BasicScene