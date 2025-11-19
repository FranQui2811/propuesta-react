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
      name: 'Calculo Avanzado', 
      teacher: 'Prof. Ana López', 
      materials: 5 
    },
    { 
      id: 2, 
      name: 'Programación Web', 
      teacher: 'Prof. Carlos García', 
      materials: 8 
    },
    { 
      id: 3, 
      name: 'Bases de Datos', 
      teacher: 'Prof. Laura Smith', 
      materials: 3 
    },
    { 
      id: 4, 
      name: 'Estructuras de Datos', 
      teacher: 'Prof. Juan Pérez', 
      materials: 10 
    },
    { 
      id: 5, 
      name: 'Álgebra Lineal', 
      teacher: 'Prof. Elena Ríos', 
      materials: 4 
    },
  ];

  return (
    <div className="my-courses-container-user">
      <div className="my-courses-wrapper-user">
        <button
          onClick={() => navigate(-1)}
          className="back-button-user"
        >
          ← Volver
        </button>

        <h1 className='tittle'>Mis Cursos Inscritos</h1>
        <div className="title-separator-user"></div>

        {/* Verifica si hay cursos para mostrar */}
        {courses.length === 0 ? (
          <p className="no-courses-user">No estás inscrito en ningún curso actualmente.</p>
        ) : (
          /* === CONTENEDOR HORIZONTAL === */
          <div className="courses-row-user">
            {courses.map((course) => (
              <div key={course.id} className="course-card-user">
                <h3>{course.name}</h3>
                
                <p className="course-info-user">
                  <strong>Profesor:</strong> {course.teacher}
                </p>

                <p className="course-info-user">
                  <strong>Materiales:</strong> {course.materials} archivos
                </p>
              </div>
            ))}
          </div>
          /* === FIN CONTENEDOR HORIZONTAL === */
        )}
      </div>
    </div>
  );
};

export default MyCourses;