import React, { useEffect, useState, useRef } from 'react'

function TerrainSkyboxLesson() {
  const [terrainColor, setTerrainColor] = useState('#3a5f0b')
  const [skyType, setSkyType] = useState('gradient')
  const [wireframe, setWireframe] = useState(false)
  const [showCode, setShowCode] = useState(false)
  
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const terrainRef = useRef(null)
  
  useEffect(() => {
    let mounted = true
    
    const script = document.createElement('script')
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'
    script.async = true
    
    script.onload = () => {
      if (!mounted || !containerRef.current) return
      
      const THREE = window.THREE
      
      const scene = new THREE.Scene()
      sceneRef.current = scene
      
      // Sky gradient
      const skyGeo = new THREE.SphereGeometry(500, 32, 32)
      const skyMat = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        uniforms: {
          topColor: { value: new THREE.Color(0x0077ff) },
          bottomColor: { value: new THREE.Color(0xffffff) }
        },
        vertexShader: `
          varying vec3 vWorldPosition;
          void main() {
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 topColor;
          uniform vec3 bottomColor;
          varying vec3 vWorldPosition;
          void main() {
            float h = normalize(vWorldPosition).y;
            gl_FragColor = vec4(mix(bottomColor, topColor, max(h, 0.0)), 1.0);
          }
        `
      })
      const sky = new THREE.Mesh(skyGeo, skyMat)
      scene.add(sky)
      
      // Terrain
      const terrainGeo = new THREE.PlaneGeometry(50, 50, 64, 64)
      const positions = terrainGeo.attributes.position.array
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i]
        const y = positions[i + 1]
        positions[i + 2] = Math.sin(x * 0.2) * Math.cos(y * 0.2) * 3 + Math.random() * 0.5
      }
      terrainGeo.computeVertexNormals()
      
      const terrainMat = new THREE.MeshStandardMaterial({ 
        color: terrainColor,
        wireframe: wireframe
      })
      const terrain = new THREE.Mesh(terrainGeo, terrainMat)
      terrain.rotation.x = -Math.PI / 2
      terrainRef.current = terrain
      scene.add(terrain)
      
      // Trees
      for (let i = 0; i < 30; i++) {
        const treeGeo = new THREE.ConeGeometry(0.5, 2, 8)
        const treeMat = new THREE.MeshStandardMaterial({ color: 0x228b22 })
        const tree = new THREE.Mesh(treeGeo, treeMat)
        tree.position.x = (Math.random() - 0.5) * 40
        tree.position.z = (Math.random() - 0.5) * 40
        tree.position.y = 0.5
        scene.add(tree)
      }
      
      const camera = new THREE.PerspectiveCamera(
        75, 
        containerRef.current.clientWidth / containerRef.current.clientHeight, 
        0.1, 
        1000
      )
      camera.position.set(10, 10, 10)
      camera.lookAt(0, 0, 0)
      
      const canvas = document.getElementById('three-canvas')
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      scene.add(ambientLight)
      
      const sunLight = new THREE.DirectionalLight(0xffffff, 1)
      sunLight.position.set(10, 20, 10)
      scene.add(sunLight)
      
      const animate = () => {
        if (!mounted) return
        requestAnimationFrame(animate)
        
        camera.position.x = Math.cos(Date.now() * 0.0005) * 15
        camera.position.z = Math.sin(Date.now() * 0.0005) * 15
        camera.lookAt(0, 0, 0)
        
        renderer.render(scene, camera)
      }
      animate()
    }
    
    document.head.appendChild(script)
    
    return () => { mounted = false }
  }, [])
  
  useEffect(() => {
    if (terrainRef.current) {
      terrainRef.current.material.color.set(terrainColor)
    }
  }, [terrainColor])
  
  useEffect(() => {
    if (terrainRef.current) {
      terrainRef.current.material.wireframe = wireframe
    }
  }, [wireframe])
  
  const codeSnippet = `// Procedural terrain generation
const geometry = new THREE.PlaneGeometry(50, 50, 64, 64)
const positions = geometry.attributes.position.array

for (let i = 0; i < positions.length; i += 3) {
  const x = positions[i]
  const y = positions[i + 1]
  // Generate height using sine waves
  positions[i + 2] = 
    Math.sin(x * 0.2) * Math.cos(y * 0.2) * 3 + 
    Math.random() * 0.5
}

geometry.computeVertexNormals()

// Sky gradient shader
const skyMat = new THREE.ShaderMaterial({
  uniforms: {
    topColor: { value: new THREE.Color(0x0077ff) },
    bottomColor: { value: new THREE.Color(0xffffff) }
  },
  vertexShader: \`...\`,
  fragmentShader: \`...\`,
  side: THREE.BackSide
})`

  return (
    <div className="lesson-page">
      <div className="canvas-container" ref={containerRef}>
        <canvas id="three-canvas"></canvas>
      </div>
      
      <aside className="sidebar">
        <div className="panel">
          <h3>Terrain Settings</h3>
          <div className="control-group">
            <label>Terrain Color</label>
            <input 
              type="color" 
              value={terrainColor}
              onChange={(e) => setTerrainColor(e.target.value)}
            />
          </div>
          <div className="control-group">
            <label>
              <input 
                type="checkbox" 
                checked={wireframe}
                onChange={(e) => setWireframe(e.target.checked)}
              />
              Wireframe
            </label>
          </div>
        </div>
        
        <div className="panel">
          <h3>Scene</h3>
          <p style={{ fontSize: '0.8rem', color: '#888' }}>
            Procedural terrain with trees and gradient sky
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

export default TerrainSkyboxLesson