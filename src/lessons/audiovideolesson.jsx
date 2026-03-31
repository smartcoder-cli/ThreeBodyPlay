import React, { useEffect, useState, useRef } from 'react'

function AudioVideoLesson() {
  const [color, setColor] = useState('#4ecdc4')
  const [particleSize, setParticleSize] = useState(0.1)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [showCode, setShowCode] = useState(false)
  const [audioLevel, setAudioLevel] = useState(0)
  
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const particlesRef = useRef(null)
  const rendererRef = useRef(null)
  const analyserRef = useRef(null)
  const audioContextRef = useRef(null)
  
  useEffect(() => {
    let mounted = true
    let animationId
    
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
      rendererRef.current = renderer
      
      // Create particles
      const particleCount = 500
      const positions = new Float32Array(particleCount * 3)
      const velocities = []
      
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 10
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10
        positions[i * 3 + 2] = (Math.random() - 0.5) * 5
        velocities.push({
          x: (Math.random() - 0.5) * 0.02,
          y: (Math.random() - 0.5) * 0.02,
          z: (Math.random() - 0.5) * 0.01
        })
      }
      
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      
      const material = new THREE.PointsMaterial({
        color: parseInt(color.replace('#', '0x')),
        size: particleSize,
        transparent: true,
        opacity: 0.8
      })
      
      const particles = new THREE.Points(geometry, material)
      particlesRef.current = particles
      scene.add(particles)
      
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
      scene.add(ambientLight)
      
      let startTime = Date.now()
      
      const animate = () => {
        if (!mounted) return
        animationId = requestAnimationFrame(animate)
        
        const positions = particlesRef.current.geometry.attributes.position.array
        const audioScale = audioEnabled ? 1 + audioLevel * 2 : 1
        
        for (let i = 0; i < particleCount; i++) {
          positions[i * 3] += velocities[i].x * audioScale
          positions[i * 3 + 1] += velocities[i].y * audioScale
          positions[i * 3 + 2] += velocities[i].z * audioScale
          
          // Boundary check
          if (Math.abs(positions[i * 3]) > 5) velocities[i].x *= -1
          if (Math.abs(positions[i * 3 + 1]) > 5) velocities[i].y *= -1
          if (Math.abs(positions[i * 3 + 2]) > 2.5) velocities[i].z *= -1
        }
        
        particlesRef.current.geometry.attributes.position.needsUpdate = true
        
        // Real-time audio analysis with Web Audio API
        if (audioEnabled && analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
          analyserRef.current.getByteFrequencyData(dataArray)
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length
          const level = average / 255
          setAudioLevel(level)
          
          // Update particle size based on real audio level
          if (particlesRef.current) {
            particlesRef.current.material.size = particleSize * (1 + level * 3)
            particlesRef.current.material.needsUpdate = true
          }
        } else if (audioEnabled) {
          // Fallback simulation if analyser not ready
          const simulatedLevel = (Math.sin(Date.now() * 0.005) + 1) * 0.5 * 0.7 + 0.3
          setAudioLevel(simulatedLevel)
          if (particlesRef.current) {
            particlesRef.current.material.size = particleSize * (1 + simulatedLevel * 3)
            particlesRef.current.material.needsUpdate = true
          }
        } else {
          setAudioLevel(0)
          if (particlesRef.current) {
            particlesRef.current.material.size = particleSize
            particlesRef.current.material.needsUpdate = true
          }
        }
        
        particlesRef.current.rotation.y += 0.001
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
    
    document.head.appendChild(script)
  }, [])
  
  useEffect(() => {
    if (particlesRef.current) {
      particlesRef.current.material.color.set(color)
    }
  }, [color])

  // Listen for particleSize changes and update particle size
  useEffect(() => {
    if (particlesRef.current) {
      particlesRef.current.material.size = particleSize
      particlesRef.current.material.needsUpdate = true
    }
  }, [particleSize])

  // Listen for particleSize changes and update particle size
  useEffect(() => {
    if (particlesRef.current) {
      particlesRef.current.material.size = particleSize
      particlesRef.current.material.needsUpdate = true
    }
  }, [particleSize])
  
  const handleEnableAudio = async () => {
    if (!audioEnabled) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const audioContext = new (window.AudioContext || window.webkitAudioContext)()
        const analyser = audioContext.createAnalyser()
        const source = audioContext.createMediaStreamSource(stream)
        source.connect(analyser)
        analyser.fftSize = 256
        analyserRef.current = analyser
        audioContextRef.current = audioContext
        setAudioEnabled(true)
      } catch (err) {
        alert('Microphone access denied. Using simulated audio.')
        setAudioEnabled(true)
      }
    } else {
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
      setAudioEnabled(false)
    }
  }
  
  const codeSnippet = `// Audio Reactivity with Web Audio API
// Note: Requires user permission for microphone

const audioContext = new (window.AudioContext || window.webkitAudioContext)()
const analyser = audioContext.createAnalyser()
analyser.fftSize = 256

navigator.mediaDevices.getUserMedia({ audio: true })
  .then(stream => {
    const source = audioContext.createMediaStreamSource(stream)
    source.connect(analyser)
    
    const dataArray = new Uint8Array(analyser.frequencyBinCount)
    
    function update() {
      analyser.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length
      // Use average to scale particles
      particleMesh.scale.setScalar(1 + average / 255 * 2)
      requestAnimationFrame(update)
    }
    update()
  })

// Video Texture Example
const video = document.createElement('video')
video.src = '/path/to/video.mp4'
video.loop = true
video.muted = true
video.play()

const texture = new THREE.VideoTexture(video)
const material = new THREE.MeshBasicMaterial({ map: texture })`

  return (
    <div className="lesson-page">
      <div className="canvas-container" ref={containerRef}>
        <canvas id="three-canvas"></canvas>
        <div style={{ position: 'absolute', top: '15px', left: '15px', background: 'rgba(0,0,0,0.7)', padding: '10px', borderRadius: '8px' }}>
          <span style={{ color: '#4ecdc4' }}>Audio Visualizer</span>
          <p style={{ color: '#888', fontSize: '0.8rem', marginTop: '5px' }}>
            {audioEnabled ? `Audio Level: ${(audioLevel * 100).toFixed(0)}%` : 'Mic disabled'}
          </p>
        </div>
      </div>
      
      <aside className="sidebar">
        <div className="panel">
          <h3>Visual Settings</h3>
          <div className="control-group">
            <label>Particle Color</label>
            <input 
              type="color" 
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <div className="control-group">
            <label>Base Size ({particleSize.toFixed(2)})</label>
            <input 
              type="range" 
              min="0.02" 
              max="0.3" 
              step="0.01"
              value={particleSize}
              onChange={(e) => setParticleSize(parseFloat(e.target.value))}
            />
          </div>
        </div>
        
        <div className="panel">
          <h3>Audio Input</h3>
          <div className="control-group">
            <button 
              onClick={handleEnableAudio}
              style={{
                background: audioEnabled ? '#ff6b6b' : '#4ecdc4',
                color: '#fff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '6px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              {audioEnabled ? 'Disable Microphone' : 'Enable Microphone'}
            </button>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '8px' }}>
            {audioEnabled ? 'Speak or play music to see particles react!' : 'Click to enable mic for audio reactivity'}
          </p>
        </div>
        
        <div className="panel">
          <h3>Techniques</h3>
          <p style={{ fontSize: '0.8rem', color: '#888', marginBottom: '10px' }}>
            <strong>AudioAnalyser:</strong> FFT frequency data
          </p>
          <p style={{ fontSize: '0.8rem', color: '#666' }}>
            <strong>VideoTexture:</strong> Map video to 3D surfaces
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

export default AudioVideoLesson
