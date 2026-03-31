import React, { useState, useEffect } from 'react'
import Header from './components/header'
import LessonBreadcrumb from './components/lessonbreadcrumb'
import Home from './pages/home'
import DirectThree from './lessons/directthree'
import Geometries from './lessons/geometries'
import Materials from './lessons/materials'
import Lighting from './lessons/lighting'
import AnimationLesson from './lessons/animationlesson'
import ControlsLesson from './lessons/controlslesson'
import ParticlesLesson from './lessons/particleslesson'
import PhysicsLesson from './lessons/physicslesson'
import PostProcessingLesson from './lessons/postprocessinglesson'
import ModelLoadingLesson from './lessons/modelloadinglesson'
import AudioVideoLesson from './lessons/audiovideolesson'
import PerformanceLesson from './lessons/performancelesson'
import ShadersLesson from './lessons/shaderslesson'
import VrArLesson from './lessons/vrarlesson'
import TerrainSkyboxLesson from './lessons/terrainskybox'
import WebGPULesson from './lessons/webgpulesson'
import ResponsiveDesignLesson from './lessons/responsivedesignlesson'
import FinalProject from './lessons/finalproject'
import ComingSoon from './lessons/comingsoon'
import './app.css'

const LESSON_MAP = {
  'lesson-01': { num: 1,  title: 'Basic Scene' },
  'lesson-02': { num: 2,  title: 'Geometries' },
  'lesson-03': { num: 3,  title: 'Materials' },
  'lesson-04': { num: 4,  title: 'Lighting' },
  'lesson-05': { num: 5,  title: 'Animation' },
  'lesson-06': { num: 6,  title: 'Controls' },
  'lesson-07': { num: 7,  title: 'Particles' },
  'lesson-08': { num: 8,  title: 'Physics' },
  'lesson-09': { num: 9,  title: 'Post Processing' },
  'lesson-10': { num: 10, title: 'Model Loading' },
  'lesson-11': { num: 11, title: 'Audio & Video' },
  'lesson-12': { num: 12, title: 'Performance' },
  'lesson-13': { num: 13, title: 'Shaders' },
  'lesson-14': { num: 14, title: 'VR & AR' },
  'lesson-15': { num: 15, title: 'Terrain & Skybox' },
  'lesson-16': { num: 16, title: 'WebGPU' },
  'lesson-17': { num: 17, title: 'Responsive Design' },
  'lesson-18': { num: 18, title: 'Final Project' },
}

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash.startsWith('#lesson-')) {
        setCurrentPage(hash.substring(1))
      } else {
        setCurrentPage('home')
      }
    }
    
    window.addEventListener('hashchange', handleHashChange)
    handleHashChange()
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [])
  
  const renderPage = () => {
    switch(currentPage) {
      case 'lesson-01': return <DirectThree />
      case 'lesson-02': return <Geometries />
      case 'lesson-03': return <Materials />
      case 'lesson-04': return <Lighting />
      case 'lesson-05': return <AnimationLesson />
      case 'lesson-06': return <ControlsLesson />
      case 'lesson-07': return <ParticlesLesson />
      case 'lesson-08': return <PhysicsLesson />
      case 'lesson-09': return <PostProcessingLesson />
      case 'lesson-10': return <ModelLoadingLesson />
      case 'lesson-11': return <AudioVideoLesson />
      case 'lesson-12': return <PerformanceLesson />
      case 'lesson-13': return <ShadersLesson />
      case 'lesson-14': return <VrArLesson />
      case 'lesson-15': return <TerrainSkyboxLesson />
      case 'lesson-16': return <WebGPULesson />
      case 'lesson-17': return <ResponsiveDesignLesson />
      case 'lesson-18': return <FinalProject />
      default: return <Home />
    }
  }
  
  const isLesson = currentPage.startsWith('lesson-')
  const lessonInfo = LESSON_MAP[currentPage]
  
  return (
    <div className="app">
      <Header />
      <main>
        {isLesson && lessonInfo && (
          <LessonBreadcrumb 
            lessonNumber={lessonInfo.num} 
            lessonTitle={lessonInfo.title} 
          />
        )}
        {renderPage()}
      </main>
    </div>
  )
}

export default App
