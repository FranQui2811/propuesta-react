import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TakeAttendance.css';

export const TakeAttendance = () => {
  const navigate = useNavigate();

  // Datos dummy de cursos
  const courses = [
    { id: 1, name: 'Matemáticas 10A', subject: 'Matemáticas' },
    { id: 2, name: 'Español 10B', subject: 'Español' },
    { id: 3, name: 'Inglés 10C', subject: 'Inglés' },
    { id: 4, name: 'Ciencias 11A', subject: 'Ciencias Naturales' },
  ];

  const handleSelectCourse = (course) => {
    navigate('/Teacher/Register/Assist', { state: { course } });
  };

  return (
    <div className="take-attendance-container">
      <div className="take-attendance-wrapper">
        <button
          onClick={() => navigate(-1)}
          className="back-button"
        >
          ← Volver
        </button>

        <h1>Toma de Asistencia</h1>
        <p>Selecciona el curso para el cual deseas tomar asistencia:</p>

        <div className="courses-selector-grid">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => handleSelectCourse(course)}
              className="course-selector-btn"
            >
              <h3>{course.name}</h3>
              <p>{course.subject}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TakeAttendance;
