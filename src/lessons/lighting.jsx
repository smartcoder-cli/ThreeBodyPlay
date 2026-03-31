import React, { useEffect, useState, useRef } from 'react'

function Lighting() {
  const [lightType, setLightType] = useState('point')
  const [lightColor, setLightColor] = useState('#ffffff')
  const [intensity, setIntensity] = useState(1)
  const [showCode, setShowCode] = useState(false)
  
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const lightRef = useRef(null)
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
      
      const groundGeo = new THREE.PlaneGeometry(10, 10)
      const groundMat = new THREE.MeshStandardMaterial({ color: 0x333333 })
      const ground = new THREE.Mesh(groundGeo, groundMat)
      ground.rotation.x = -Math.PI / 2
      ground.position.y = -1
      ground.receiveShadow = true
      scene.add(ground)
      
      const cubeGeo = new THREE.BoxGeometry(1.5, 1.5, 1.5)
      const cubeMat = new THREE.MeshStandardMaterial({ color: 0x4ecdc4 })
      const cube = new THREE.Mesh(cubeGeo, cubeMat)
      cube.position.y = 0.5
      cube.castShadow = true
      meshRef.current = cube
      scene.add(cube)
      
      const camera = new THREE.PerspectiveCamera(
        75, 
        containerRef.current.clientWidth / containerRef.current.clientHeight, 
        0.1, 
        1000
      )
      camera.position.set(3, 3, 5)
      camera.lookAt(0, 0, 0)
      
      const canvas = document.getElementById('three-canvas')
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      
      const ambient = new THREE.AmbientLight(0xffffff, 0.3)
      scene.add(ambient)
      
      // Create light based on type
      let light
      switch(lightType) {
        case 'ambient':
          light = new THREE.AmbientLight(lightColor, intensity)
          break
        case 'directional':
          light = new THREE.DirectionalLight(lightColor, intensity)
          light.position.set(5, 10, 7.5)
          light.castShadow = true
          break
        case 'spot':
          light = new THREE.SpotLight(lightColor, intensity)
          light.position.set(3, 5, 3)
          light.angle = Math.PI / 4
          light.penumbra = 0.3
          light.castShadow = true
          break
        default: // point
          light = new THREE.PointLight(lightColor, intensity)
          light.position.set(3, 5, 3)
          light.castShadow = true
      }
      lightRef.current = light
      scene.add(light)
      
      const animate = () => {
        if (!mounted) return
        requestAnimationFrame(animate)
        cube.rotation.y += 0.01
        renderer.render(scene, camera)
      }
      animate()
    }
    
    document.head.appendChild(script)
    
    return () => { mounted = false }
  }, [])
  
  // Update light type
  useEffect(() => {
    if (!sceneRef.current || !lightRef.current) return
    
    const THREE = window.THREE
    const scene = sceneRef.current
    
    // Remove old light
    scene.remove(lightRef.current)
    
    // Create new light
    let light
    switch(lightType) {
      case 'ambient':
        light = new THREE.AmbientLight(lightColor, intensity)
        break
      case 'directional':
        light = new THREE.DirectionalLight(lightColor, intensity)
        light.position.set(5, 10, 7.5)
        light.castShadow = true
        break
      case 'spot':
        light = new THREE.SpotLight(lightColor, intensity)
        light.position.set(3, 5, 3)
        light.angle = Math.PI / 4
        light.penumbra = 0.3
        light.castShadow = true
        break
      default: // point
        light = new THREE.PointLight(lightColor, intensity)
        light.position.set(3, 5, 3)
        light.castShadow = true
    }
    lightRef.current = light
    scene.add(light)
  }, [lightType])
  
  // Update light color and intensity
  useEffect(() => {
    if (!lightRef.current) return
    lightRef.current.color.set(lightColor)
    lightRef.current.intensity = intensity
  }, [lightColor, intensity])
  
  const codeSnippet = `// Create ${lightType} light
const light = new THREE.${lightType.charAt(0).toUpperCase() + lightType.slice(1)}Light(
  '${lightColor}', 
  ${intensity}
)
${lightType === 'point' || lightType === 'spot' ? `light.position.set(3, 5, 3)` : 
  lightType === 'directional' ? `light.position.set(5, 10, 7.5)
light.castShadow = true` : ''}
scene.add(light)`

  return (
    <div className="lesson-page">
      <div className="canvas-container" ref={containerRef}>
        <canvas id="three-canvas"></canvas>
      </div>
      
      <aside className="sidebar">
        <div className="panel">
          <h3>Light Type: {lightType}</h3>
          <div className="control-group">
            <select value={lightType} onChange={(e) => setLightType(e.target.value)}>
              <option value="ambient">Ambient</option>
              <option value="directional">Directional</option>
              <option value="point">Point</option>
              <option value="spot">Spot</option>
            </select>
          </div>
        </div>
        
        <div className="panel">
          <h3>Light Settings</h3>
          <div className="control-group">
            <label>Color</label>
            <input type="color" value={lightColor} onChange={(e) => setLightColor(e.target.value)} />
          </div>
          <div className="control-group">
            <label>Intensity ({intensity.toFixed(1)})</label>
            <input type="range" min="0" max="3" step="0.1" value={intensity} onChange={(e) => setIntensity(parseFloat(e.target.value))} />
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

export default Lighting