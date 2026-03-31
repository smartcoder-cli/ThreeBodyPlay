import React from 'react'

function LessonCard({ lesson, difficulty = 'basic' }) {
  return (
    <div className={`lesson-card difficulty-${difficulty}`}>
      <div className="card-left-bar"></div>
      <div className="card-inner">
        <div className="lesson-number">
          Lesson {String(lesson.number).padStart(2, '0')}
        </div>
        <h3 className="lesson-title">{lesson.title}</h3>
        <p className="lesson-description">{lesson.description}</p>
        <div className="lesson-tags">
          {lesson.tags?.map((tag, i) => (
            <span key={i} className={`tag tag-${tag.toLowerCase().replace(/ /g, '-')}`}>{tag}</span>
          ))}
        </div>
        <a href={lesson.path} className="lesson-link">START →</a>
      </div>
    </div>
  )
}

export default LessonCard
