import React, { useEffect, useState, useRef } from 'react'

function Materials() {
  const [materialType, setMaterialType] = useState('standard')
  const [color, setColor] = useState('#4ecdc4')
  const [roughness, setRoughness] = useState(0.5)
  const [metalness, setMetalness] = useState(0.5)
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
      
      const geometry = new THREE.SphereGeometry(1.5, 64, 64)
      let material
      switch(materialType) {
        case 'basic': material = new THREE.MeshBasicMaterial({ color }); break;
        case 'lambert': material = new THREE.MeshLambertMaterial({ color }); break;
        case 'phong': material = new THREE.MeshPhongMaterial({ color, shininess: 100 }); break;
        default: material = new THREE.MeshStandardMaterial({ color, roughness, metalness });
      }
      
      const mesh = new THREE.Mesh(geometry, material)
      meshRef.current = mesh
      scene.add(mesh)
      
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      scene.add(ambientLight)
      
      const pointLight = new THREE.PointLight(0xffffff, 1)
      pointLight.position.set(5, 5, 5)
      scene.add(pointLight)
      
      const animate = () => {
        if (!mounted) return
        requestAnimationFrame(animate)
        mesh.rotation.y += 0.01
        renderer.render(scene, camera)
      }
      animate()
    }
    
    document.head.appendChild(script)
    
    return () => { mounted = false }
  }, [])
  
  useEffect(() => {
    if (!meshRef.current) return
    
    const THREE = window.THREE
    meshRef.current.geometry.dispose()
    meshRef.current.material.dispose()
    
    const geometry = new THREE.SphereGeometry(1.5, 64, 64)
    let material
    switch(materialType) {
      case 'basic': material = new THREE.MeshBasicMaterial({ color }); break;
      case 'lambert': material = new THREE.MeshLambertMaterial({ color }); break;
      case 'phong': material = new THREE.MeshPhongMaterial({ color, shininess: 100 }); break;
      default: material = new THREE.MeshStandardMaterial({ color, roughness, metalness });
    }
    
    meshRef.current.material = material
  }, [materialType, color, roughness, metalness])
  
  const getCodeSnippet = () => {
    const matCode = {
      basic: `new THREE.MeshBasicMaterial({
  color: '${color}'
})`,
      lambert: `new THREE.MeshLambertMaterial({
  color: '${color}'
})`,
      phong: `new THREE.MeshPhongMaterial({
  color: '${color}',
  shininess: 100
})`,
      standard: `new THREE.MeshStandardMaterial({
  color: '${color}',
  roughness: ${roughness},
  metalness: ${metalness}
})`
    }
    
    return `// Create material (${materialType})
const material = ${matCode[materialType]}

// Create sphere geometry
const geometry = new THREE.SphereGeometry(1.5, 64, 64)

// Create mesh
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// ${materialType === 'standard' ? 'PBR material with realistic lighting' : materialType === 'phong' ? 'Phong with specular highlights' : materialType === 'lambert' ? 'Lambert for diffuse lighting' : 'Basic for flat color'}`
  }
  
  return (
    <div className="lesson-page">
      <div className="canvas-container" ref={containerRef}>
        <canvas id="three-canvas"></canvas>
      </div>
      
      <aside className="sidebar">
        <div className="panel">
          <h3>Material Type</h3>
          <div className="control-group">
            <select value={materialType} onChange={(e) => setMaterialType(e.target.value)}>
              <option value="basic">Basic</option>
              <option value="lambert">Lambert</option>
              <option value="phong">Phong</option>
              <option value="standard">Standard (PBR)</option>
            </select>
          </div>
        </div>
        
        <div className="panel">
          <h3>Properties</h3>
          <div className="control-group">
            <label>Color</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </div>
          <div className="control-group">
            <label style={{ opacity: materialType === 'standard' ? 1 : 0.5 }}>Roughness ({roughness.toFixed(2)})</label>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={roughness} 
              disabled={materialType !== 'standard'}
              onChange={(e) => setRoughness(parseFloat(e.target.value))} 
            />
          </div>
          <div className="control-group">
            <label style={{ opacity: materialType === 'standard' ? 1 : 0.5 }}>Metalness ({metalness.toFixed(2)})</label>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={metalness} 
              disabled={materialType !== 'standard'}
              onChange={(e) => setMetalness(parseFloat(e.target.value))} 
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
              <code>{getCodeSnippet()}</code>
            </pre>
          )}
        </div>
      </aside>
    </div>
  )
}

export default Materials