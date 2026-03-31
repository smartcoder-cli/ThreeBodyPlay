import React, { useEffect, useState, useRef } from 'react'

function Geometries() {
  const [geometry, setGeometry] = useState('box')
  const [wireframe, setWireframe] = useState(false)
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
      
      let geom
      switch(geometry) {
        case 'sphere': geom = new THREE.SphereGeometry(1.5, 32, 32); break;
        case 'cylinder': geom = new THREE.CylinderGeometry(1, 1, 2, 32); break;
        case 'cone': geom = new THREE.ConeGeometry(1, 2, 32); break;
        case 'torus': geom = new THREE.TorusGeometry(1, 0.4, 16, 100); break;
        default: geom = new THREE.BoxGeometry(1.5, 1.5, 1.5);
      }
      
      const mat = new THREE.MeshStandardMaterial({ 
        color: color,
        wireframe: wireframe 
      })
      const mesh = new THREE.Mesh(geom, mat)
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
        if (meshRef.current) {
          meshRef.current.rotation.x += 0.01
          meshRef.current.rotation.y += 0.01
        }
        renderer.render(scene, camera)
      }
      animate()
    }
    
    document.head.appendChild(script)
    
    return () => { mounted = false }
  }, [])
  
  useEffect(() => {
    if (!sceneRef.current || !meshRef.current) return
    
    const THREE = window.THREE
    let geom
    switch(geometry) {
      case 'sphere': geom = new THREE.SphereGeometry(1.5, 32, 32); break;
      case 'cylinder': geom = new THREE.CylinderGeometry(1, 1, 2, 32); break;
      case 'cone': geom = new THREE.ConeGeometry(1, 2, 32); break;
      case 'torus': geom = new THREE.TorusGeometry(1, 0.4, 16, 100); break;
      default: geom = new THREE.BoxGeometry(1.5, 1.5, 1.5);
    }
    
    const oldMesh = meshRef.current
    oldMesh.geometry.dispose()
    oldMesh.material.dispose()
    sceneRef.current.remove(oldMesh)
    
    const newMat = new THREE.MeshStandardMaterial({ 
      color: color,
      wireframe: wireframe 
    })
    const newMesh = new THREE.Mesh(geom, newMat)
    meshRef.current = newMesh
    sceneRef.current.add(newMesh)
  }, [geometry])
  
  useEffect(() => {
    if (!meshRef.current) return
    meshRef.current.material.color.set(color)
    meshRef.current.material.wireframe = wireframe
  }, [color, wireframe])
  
  const getCodeSnippet = () => {
    return `// Create ${geometry}
const geometry = new THREE.${geometry.charAt(0).toUpperCase() + geometry.slice(1)}Geometry(
  ${geometry === 'box' ? '1.5, 1.5, 1.5' : 
    geometry === 'sphere' ? '1.5, 32, 32' :
    geometry === 'cylinder' ? '1, 1, 2, 32' :
    geometry === 'cone' ? '1, 2, 32' :
    '1, 0.4, 16, 100'}
)

const material = new THREE.MeshStandardMaterial({
  color: '${color}',
  wireframe: ${wireframe}
})

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Animation loop
function animate() {
  requestAnimationFrame(animate)
  mesh.rotation.x += 0.01
  mesh.rotation.y += 0.01
  renderer.render(scene, camera)
}
animate()`
  }
  
  return (
    <div className="lesson-page">
      <div className="canvas-container" ref={containerRef}>
        <canvas id="three-canvas"></canvas>
      </div>
      
      <aside className="sidebar">
        <div className="panel">
          <h3>Geometry</h3>
          <div className="control-group">
            <label>Shape</label>
            <select value={geometry} onChange={(e) => setGeometry(e.target.value)}>
              <option value="box">Box</option>
              <option value="sphere">Sphere</option>
              <option value="cylinder">Cylinder</option>
              <option value="cone">Cone</option>
              <option value="torus">Torus</option>
            </select>
          </div>
        </div>
        
        <div className="panel">
          <h3>Material</h3>
          <div className="control-group">
            <label>Color</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
          </div>
          <div className="control-group">
            <label>
              <input type="checkbox" checked={wireframe} onChange={(e) => setWireframe(e.target.checked)} />
              Wireframe
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
              <code>{getCodeSnippet()}</code>
            </pre>
          )}
        </div>
      </aside>
    </div>
  )
}

export default Geometries