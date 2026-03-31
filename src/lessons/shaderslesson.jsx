import React, { useEffect, useState, useRef } from 'react'

function ShadersLesson() {
  const [time, setTime] = useState(0)
  const [color1, setColor1] = useState('#ff6b6b')
  const [color2, setColor2] = useState('#4ecdc4')
  const [showCode, setShowCode] = useState(false)
  
  const containerRef = useRef(null)
  const materialRef = useRef(null)
  
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
      
      const camera = new THREE.PerspectiveCamera(
        75, 
        containerRef.current.clientWidth / containerRef.current.clientHeight, 
        0.1, 
        1000
      )
      camera.position.z = 3
      
      const canvas = document.getElementById('three-canvas')
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      
      // Custom shader material
      const vertexShader = `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
          vUv = uv;
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `
      
      const fragmentShader = `
        uniform float uTime;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vec3 color = mix(uColor1, uColor2, sin(vPosition.y * 3.0 + uTime) * 0.5 + 0.5);
          gl_FragColor = vec4(color, 1.0);
        }
      `
      
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uColor1: { value: new THREE.Color(color1) },
          uColor2: { value: new THREE.Color(color2) }
        },
        vertexShader,
        fragmentShader
      })
      
      materialRef.current = material
      
      const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 32)
      const mesh = new THREE.Mesh(geometry, material)
      scene.add(mesh)
      
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
      scene.add(ambientLight)
      
      let startTime = Date.now()
      
      const animate = () => {
        if (!mounted) return
        requestAnimationFrame(animate)
        
        const elapsedTime = (Date.now() - startTime) / 1000
        material.uniforms.uTime.value = elapsedTime
        setTime(elapsedTime)
        
        mesh.rotation.x += 0.01
        mesh.rotation.y += 0.01
        
        renderer.render(scene, camera)
      }
      animate()
    }
    
    document.head.appendChild(script)
    
    return () => { mounted = false }
  }, [])
  
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uColor1.value.set(color1)
    }
  }, [color1])
  
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uColor2.value.set(color2)
    }
  }, [color2])
  
  const codeSnippet = `// Custom ShaderMaterial
const vertexShader = \`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
\`

const fragmentShader = \`
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  varying vec3 vPosition;
  
  void main() {
    vec3 color = mix(
      uColor1, 
      uColor2, 
      sin(vPosition.y * 3.0 + uTime) * 0.5 + 0.5
    );
    gl_FragColor = vec4(color, 1.0);
  }
\`

const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color('${color1}') },
    uColor2: { value: new THREE.Color('${color2}') }
  },
  vertexShader,
  fragmentShader
})`

  return (
    <div className="lesson-page">
      <div className="canvas-container" ref={containerRef}>
        <canvas id="three-canvas"></canvas>
        <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '8px' }}>
          <span style={{ color: '#4ecdc4' }}>Shader Demo</span>
          <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '5px' }}>
            Time: {time.toFixed(2)}s
          </p>
        </div>
      </div>
      
      <aside className="sidebar">
        <div className="panel">
          <h3>Shader Colors</h3>
          <div className="control-group">
            <label>Color 1</label>
            <input 
              type="color" 
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
            />
          </div>
          <div className="control-group">
            <label>Color 2</label>
            <input 
              type="color" 
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
            />
          </div>
        </div>
        
        <div className="panel">
          <h3>Shader Tutorial</h3>
          <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '10px' }}>
            Shaders are programs that run on the GPU
          </p>
          <p style={{ fontSize: '0.8rem', color: '#666' }}>
            <strong>Vertex Shader:</strong> Positions vertices<br/>
            <strong>Fragment Shader:</strong> Colors each pixel
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

export default ShadersLesson