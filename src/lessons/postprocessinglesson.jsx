import React, { useEffect, useState, useRef } from 'react'

function PostProcessingLesson() {
  const [blur, setBlur] = useState(0)
  const [saturation, setSaturation] = useState(1)
  const [color, setColor] = useState('#4ecdc4')
  const [showCode, setShowCode] = useState(false)
  
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const meshRef = useRef(null)
  
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
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      
      // Create scene objects
      const torusGeo = new THREE.TorusGeometry(1.5, 0.5, 32, 100)
      const torusMat = new THREE.MeshStandardMaterial({ color: 0x4ecdc4 })
      const torus = new THREE.Mesh(torusGeo, torusMat)
      scene.add(torus)
      meshRef.current = torus
      
      const boxGeo = new THREE.BoxGeometry(1, 1, 1)
      const boxMat = new THREE.MeshStandardMaterial({ color: 0xff6b6b })
      const box = new THREE.Mesh(boxGeo, boxMat)
      box.position.x = -3
      scene.add(box)
      
      const sphereGeo = new THREE.SphereGeometry(0.8, 32, 32)
      const sphereMat = new THREE.MeshStandardMaterial({ color: 0xffd93d })
      const sphere = new THREE.Mesh(sphereGeo, sphereMat)
      sphere.position.x = 3
      scene.add(sphere)
      
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      scene.add(ambientLight)
      
      const pointLight = new THREE.PointLight(0xffffff, 1)
      pointLight.position.set(5, 5, 5)
      scene.add(pointLight)
      
      const animate = () => {
        if (!mounted) return
        requestAnimationFrame(animate)
        
        torus.rotation.x += 0.01
        torus.rotation.y += 0.01
        box.rotation.y += 0.01
        sphere.rotation.y += 0.01
        
        // Enhanced post-processing effect using CSS filter
        if (canvas && canvas.style) {
          const blurValue = blur * 20  // Stronger blur range: 0-20px
          const saturateValue = 20 + saturation * 180  // Wider saturation range: 20%-200%
          canvas.style.filter = `blur(${blurValue}px) saturate(${saturateValue}%)`
          canvas.style.transform = 'scale(1)' // Force re-render
        }
        
        renderer.render(scene, camera)
      }
      animate()
    }
    
    document.head.appendChild(script)
    
    return () => { mounted = false }
  }, [])
  
  useEffect(() => {
    const canvas = document.getElementById('three-canvas')
    if (canvas && canvas.style) {
      const blurValue = blur * 20  // Stronger blur range: 0-20px
      const saturateValue = 20 + saturation * 180  // Wider saturation range: 20%-200%
      canvas.style.filter = `blur(${blurValue}px) saturate(${saturateValue}%)`
      canvas.style.transform = 'scale(1)' // Force re-render
    }
  }, [blur, saturation])
  
  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.material.color.set(color)
    }
  }, [color])
  
  const codeSnippet = `// Enhanced CSS-based post-processing
// In Three.js, you'd use EffectComposer

// Apply enhanced blur effect (0-20px range)
canvas.style.filter = 'blur(${blur * 20}px)'

// Adjust saturation with wider range (20%-200%)
canvas.style.filter = 'saturate(${20 + saturation * 180}%)'

// Combine effects for stronger visual impact
canvas.style.filter = \` 
  blur(\${blur * 20}px) 
  saturate(\${20 + saturation * 180}%) 
\`

// Force CSS re-render
canvas.style.transform = 'scale(1)'

// For advanced effects, use:
// - Three.js EffectComposer
// - UnrealBloomPass
// - ShaderPass`

  return (
    <div className="lesson-page">
      <div className="canvas-container" ref={containerRef}>
        <canvas id="three-canvas"></canvas>
      </div>
      
      <aside className="sidebar">
        <div className="panel">
          <h3>Effects</h3>
          <div className="control-group">
            <label>Blur ({blur.toFixed(2)})</label>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.05"
              value={blur}
              onChange={(e) => setBlur(parseFloat(e.target.value))}
            />
          </div>
          <div className="control-group">
            <label>Saturation ({saturation.toFixed(1)})</label>
            <input 
              type="range" 
              min="0" 
              max="2" 
              step="0.1"
              value={saturation}
              onChange={(e) => setSaturation(parseFloat(e.target.value))}
            />
          </div>
        </div>
        
        <div className="panel">
          <h3>Scene</h3>
          <div className="control-group">
            <label>Accent Color</label>
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

export default PostProcessingLesson