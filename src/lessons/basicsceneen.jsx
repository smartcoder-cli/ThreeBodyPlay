import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

function BasicScene() {
  const containerRef = useRef(null)
  const [stats, setStats] = useState({ fps: 60, triangles: 0 })
  const [bgColor, setBgColor] = useState('#1a1a2e')
  const [cubeColor, setCubeColor] = useState('#4ecdc4')
  const [autoRotate, setAutoRotate] = useState(true)

  useEffect(() => {
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(bgColor)

    const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    containerRef.current.appendChild(renderer.domElement)

    const controls = new THREE.OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.autoRotate = autoRotate

    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshStandardMaterial({ color: cubeColor })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 1)
    pointLight.position.set(5, 5, 5)
    scene.add(pointLight)

    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      renderer.dispose()
      geometry.dispose()
      material.dispose()
    }
  }, [bgColor, cubeColor, autoRotate])

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div ref={containerRef} style={{ flex: 1 }}></div>
      <aside style={{ width: '300px', background: '#222', padding: '20px', color: 'white' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3>Scene</h3>
          <div>
            <label>Background</label>
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
          </div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <h3>Cube</h3>
          <div>
            <label>Color</label>
            <input type="color" value={cubeColor} onChange={(e) => setCubeColor(e.target.value)} />
          </div>
        </div>
        <div style={{ marginBottom: '20px' }}>
          <h3>Controls</h3>
          <div>
            <label>Auto Rotate</label>
            <input type="checkbox" checked={autoRotate} onChange={(e) => setAutoRotate(e.target.checked)} />
          </div>
        </div>
      </aside>
    </div>
  )
}

export default BasicScene