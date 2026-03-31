import React from 'react'

function LessonBreadcrumb({ lessonNumber, lessonTitle }) {
  return (
    <div className="lesson-breadcrumb">
      <a href="/ThreeBodyPlay/" className="lesson-breadcrumb-home">Home</a>
      <span className="lesson-breadcrumb-sep">/</span>
      <span className="lesson-breadcrumb-num">L{String(lessonNumber).padStart(2, '0')}</span>
      <span className="lesson-breadcrumb-sep">—</span>
      <span className="lesson-breadcrumb-title">{lessonTitle}</span>
    </div>
  )
}

export default LessonBreadcrumb
