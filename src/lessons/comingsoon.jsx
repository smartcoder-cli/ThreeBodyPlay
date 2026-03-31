import React, { useEffect, useState, useRef } from 'react'

function ComingSoon({ lessonName = 'This Lesson', codeSnippet = '// Coming soon...\n// Code example will be added.' }) {
  const [time, setTime] = useState(0)
  const [showCode, setShowCode] = useState(false)
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
      scene.background = new THREE.Color(0x1a1a2e)
      
      const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000)
      camera.position.z = 5
      
      const canvas = document.getElementById('three-canvas')
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      
      const torusGeo = new THREE.TorusGeometry(2, 0.3, 16, 100)
      const torusMat = new THREE.MeshStandardMaterial({ color: 0x4ecdc4 })
      const torus = new THREE.Mesh(torusGeo, torusMat)
      scene.add(torus)
      
      const cubeGeo = new THREE.BoxGeometry(1, 1, 1)
      const cubeMat = new THREE.MeshStandardMaterial({ color: 0xff6b6b })
      const cube = new THREE.Mesh(cubeGeo, cubeMat)
      scene.add(cube)
      
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      scene.add(ambientLight)
      
      const pointLight = new THREE.PointLight(0xffffff, 1)
      pointLight.position.set(5, 5, 5)
      scene.add(pointLight)
      
      const animate = () => {
        if (!mounted) return
        requestAnimationFrame(animate)
        torus.rotation.x = time * 0.01
        torus.rotation.y = time * 0.02
        cube.rotation.x = time * 0.02
        cube.rotation.y = time * 0.01
        renderer.render(scene, camera)
        setTime(t => t + 1)
      }
      animate()
    }
    
    document.head.appendChild(script)
    
    return () => { mounted = false }
  }, [])
  
  return (
    <div className="lesson-page">
      <div className="canvas-container" ref={containerRef}>
        <canvas id="three-canvas"></canvas>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', color: 'white' }}>
          <h2 style={{ color: '#4ecdc4' }}>{lessonName}</h2>
          <p style={{ color: '#888' }}>Coming Soon...</p>
        </div>
      </div>
      
      <aside className="sidebar">
        <div className="panel">
          <h3>Status</h3>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>
            This lesson is currently under development.
          </p>
        </div>
        
        <div className="panel">
          <h3>Preview</h3>
          <p style={{ color: '#4ecdc4', fontSize: '0.9rem' }}>
            Basic 3D scene is rendering.
          </p>
        </div>
        
        <div className="panel">
          <h3>
            <span style={{ cursor: 'pointer' }} onClick={() => setShowCode(!showCode)}>
              {showCode ? '▼' : '▶'} Code Preview
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

export default ComingSoon