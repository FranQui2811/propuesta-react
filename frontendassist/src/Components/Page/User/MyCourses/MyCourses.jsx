import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MyCourses.css';

/**
 * Componente para que el estudiante vea sus cursos inscritos.
 */
export const MyCourses = () => {
  const navigate = useNavigate();

  // Datos dummy de cursos inscritos por el estudiante
  const courses = [
    { 
      id: 1, 
      name: 'Matemáticas 10A', 
      teacher: 'Prof. Ana López', 
      schedule: 'Lunes y Miércoles 08:00-10:00', 
      materials: 5 
    },
    { 
      id: 2, 
      name: 'Español 10B', 
      teacher: 'Prof. Carlos García', 
      schedule: 'Martes y Jueves 10:00-12:00', 
      materials: 8 
    },
    { 
      id: 3, 
      name: 'Inglés 10C', 
      teacher: 'Prof. Laura Smith', 
      schedule: 'Lunes, Miércoles y Viernes 14:00-15:00', 
      materials: 3 
    },
    // {
    //   id: 3, 
    //   name: 'Inglés 10C', 
    //   teacher: 'Prof. Laura Smith', 
    //   schedule: 'Lunes, Miércoles y Viernes 14:00-15:00', 
    //   materials: 3 
    // },
  ];

  return (
    <div className="my-courses-container">
      <div className="my-courses-wrapper">
        <button
          onClick={() => navigate(-1)}
          className="back-button"
        >
          ← Volver
        </button>

        <h1>Mis Cursos Inscritos</h1>

        {/* Verifica si hay cursos para mostrar */}
        {courses.length === 0 ? (
          <p className="no-courses">No estás inscrito en ningún curso actualmente.</p>
        ) : (
          <div className="courses-grid">
            {courses.map((course) => (
              <div key={course.id} className="course-card">
                <h3>{course.name}</h3>
                
                <p className="course-info">
                  <strong>Profesor:</strong> {course.teacher}
                </p>
                <p className="course-info">
                  <strong>Horario:</strong> {course.schedule}
                </p>
                <p className="course-info">
                  <strong>Materiales:</strong> {course.materials} archivos
                </p>
                
                {/* Botón para ver los materiales del curso */}
                {/* <button
                  onClick={() => alert(`Navegando a materiales de ${course.name}`)}
                  className="view-materials-btn"
                >
                  Ver Materiales
                </button> */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;