import React, { useEffect, useState, useRef } from 'react'

function ModelLoadingLesson() {
  const [modelColor, setModelColor] = useState('#4ecdc4')
  const [autoRotate, setAutoRotate] = useState(true)
  const [showCode, setShowCode] = useState(false)
  const [loading, setLoading] = useState(true)
  const [scale, setScale] = useState(1)
  
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const modelRef = useRef(null)
  const rendererRef = useRef(null)
  
  useEffect(() => {
    let mounted = true
    
    // Step 1: Load Three.js first
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
    script.async = true
    
    script.onload = () => {
      if (!mounted || !containerRef.current) return
      
      const THREE = window.THREE
      
      // Step 2: Load GLTFLoader AFTER Three.js is ready
      const gltfScript = document.createElement('script')
      gltfScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js'
      gltfScript.async = true
      
      gltfScript.onload = () => {
        if (!mounted || !containerRef.current) return
        
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0x1a1a2e)
        sceneRef.current = scene
        
        const camera = new THREE.PerspectiveCamera(
          75, 
          containerRef.current.clientWidth / containerRef.current.clientHeight, 
          0.1, 
          1000
        )
        camera.position.set(0, 1.5, 3)
        
        const canvas = document.getElementById('three-canvas')
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        renderer.toneMapping = THREE.ACESFilmicToneMapping
        renderer.toneMappingExposure = 1
        rendererRef.current = renderer
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        scene.add(ambientLight)
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
        directionalLight.position.set(5, 10, 5)
        scene.add(directionalLight)
        
        // Procedural robot model
        const createRobotModel = () => {
          const group = new THREE.Group()
          
          const bodyGeo = new THREE.BoxGeometry(0.8, 1, 0.5)
          const bodyMat = new THREE.MeshStandardMaterial({ color: modelColor, metalness: 0.3, roughness: 0.7 })
          const body = new THREE.Mesh(bodyGeo, bodyMat)
          body.position.y = 0.5
          body.name = 'body'
          group.add(body)
          
          const headGeo = new THREE.BoxGeometry(0.5, 0.4, 0.4)
          const headMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.5, roughness: 0.5 })
          const head = new THREE.Mesh(headGeo, headMat)
          head.position.y = 1.2
          head.name = 'head'
          group.add(head)
          
          const eyeGeo = new THREE.SphereGeometry(0.06, 16, 16)
          const eyeMat = new THREE.MeshBasicMaterial({ color: 0x00ffff })
          const leftEye = new THREE.Mesh(eyeGeo, eyeMat)
          leftEye.position.set(-0.12, 1.25, 0.2)
          group.add(leftEye)
          const rightEye = new THREE.Mesh(eyeGeo, eyeMat)
          rightEye.position.set(0.12, 1.25, 0.2)
          group.add(rightEye)
          
          const armGeo = new THREE.BoxGeometry(0.15, 0.7, 0.15)
          const armMat = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.4, roughness: 0.6 })
          const leftArm = new THREE.Mesh(armGeo, armMat)
          leftArm.position.set(-0.55, 0.5, 0)
          leftArm.name = 'leftArm'
          group.add(leftArm)
          const rightArm = new THREE.Mesh(armGeo, armMat)
          rightArm.position.set(0.55, 0.5, 0)
          rightArm.name = 'rightArm'
          group.add(rightArm)
          
          const legGeo = new THREE.BoxGeometry(0.2, 0.5, 0.2)
          const legMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.3, roughness: 0.8 })
          const leftLeg = new THREE.Mesh(legGeo, legMat)
          leftLeg.position.set(-0.2, -0.25, 0)
          leftLeg.name = 'leftLeg'
          group.add(leftLeg)
          const rightLeg = new THREE.Mesh(legGeo, legMat)
          rightLeg.position.set(0.2, -0.25, 0)
          rightLeg.name = 'rightLeg'
          group.add(rightLeg)
          
          return group
        }
        
        const model = createRobotModel()
        modelRef.current = model
        scene.add(model)
        setLoading(false)
        
        const gridHelper = new THREE.GridHelper(10, 10, 0x333333, 0x222222)
        scene.add(gridHelper)
        
        let animationId
        const animate = () => {
          if (!mounted) return
          animationId = requestAnimationFrame(animate)
          
          if (autoRotate && modelRef.current) {
            modelRef.current.rotation.y += 0.01
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
        }
      }
      
      document.head.appendChild(gltfScript)
    }
    
    document.head.appendChild(script)
    
    return () => { mounted = false }
  }, [])
  
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.traverse((child) => {
        if (child.name === 'body') {
          child.material.color.set(modelColor)
        }
      })
    }
  }, [modelColor])
  
  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.scale.setScalar(scale)
    }
  }, [scale])
  
  const codeSnippet = `// GLTFLoader - load 3D models in glTF/GLB format
// Order matters: load THREE.js first, then GLTFLoader

// 1. Load Three.js
const script = document.createElement('script')
script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
script.onload = () => {
  // 2. Load GLTFLoader AFTER Three.js is ready
  const gltfScript = document.createElement('script')
  gltfScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/loaders/GLTFLoader.js'
  gltfScript.onload = () => {
    const THREE = window.THREE
    const { GLTFLoader } = window
    // Now you can use GLTFLoader
  }
  document.head.appendChild(gltfScript)
}
document.head.appendChild(script)

// 3. Usage with GLTFLoader
const loader = new GLTFLoader()
loader.load(
  '/path/to/model.glb',
  (gltf) => { scene.add(gltf.scene) },
  (progress) => { console.log(progress) },
  (error) => { console.error(error) }
)`

  return (
    <div className="lesson-page">
      <div className="canvas-container" ref={containerRef}>
        <canvas id="three-canvas"></canvas>
        {loading && (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'white' }}>
            Loading Model...
          </div>
        )}
        <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '8px' }}>
          <span style={{ color: '#4ecdc4' }}>Model Loading</span>
          <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '5px' }}>
            Procedural Robot Model
          </p>
        </div>
      </div>
      
      <aside className="sidebar">
        <div className="panel">
          <h3>Model Settings</h3>
          <div className="control-group">
            <label>Body Color</label>
            <input 
              type="color" 
              value={modelColor}
              onChange={(e) => setModelColor(e.target.value)}
            />
          </div>
          <div className="control-group">
            <label>Scale ({scale.toFixed(1)})</label>
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
                checked={autoRotate}
                onChange={(e) => setAutoRotate(e.target.checked)}
              />
              Auto Rotate
            </label>
          </div>
        </div>
        
        <div className="panel">
          <h3>Model Info</h3>
          <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '10px' }}>
            This demo uses a procedural robot model since external file loading requires a local server.
          </p>
          <p style={{ fontSize: '0.8rem', color: '#666' }}>
            In production, use <strong>GLTFLoader</strong> to load .glb/.gltf files.
          </p>
        </div>
        
        <div className="panel">
          <h3>Supported Formats</h3>
          <p style={{ fontSize: '0.8rem', color: '#4ecdc4' }}>
            ✓ GLB (binary glTF)<br/>
            ✓ glTF (JSON)<br/>
            ✓ OBJ (legacy)<br/>
            ✓ FBX (with loader)
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

export default ModelLoadingLesson
