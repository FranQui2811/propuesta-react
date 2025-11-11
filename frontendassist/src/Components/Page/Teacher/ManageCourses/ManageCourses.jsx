import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ManageCourses.css';

export const ManageCourses = () => {
  const navigate = useNavigate();

  // Datos dummy de cursos
  const courses = [
    { id: 1, name: 'Matemáticas 10A', subject: 'Matemáticas', schedule: 'Lunes y Miércoles 08:00-10:00', students: 25 },
    { id: 2, name: 'Español 10B', subject: 'Español', schedule: 'Martes y Jueves 10:00-12:00', students: 28 },
    { id: 3, name: 'Inglés 10C', subject: 'Inglés', schedule: 'Lunes, Miércoles y Viernes 14:00-15:00', students: 22 },
    { id: 4, name: 'Ciencias 11A', subject: 'Ciencias Naturales', schedule: 'Martes y Jueves 13:00-15:00', students: 30 },
  ];

  return (
    <div className="manage-courses-container">
      <div className="manage-courses-wrapper">
        <button
          onClick={() => navigate(-1)}
          className="back-button"
        >
          ← Volver
        </button>

        <h1>Gestión de Cursos Asignados</h1>

        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              <h3>{course.name}</h3>
              <p className="course-info">
                <strong>Materia:</strong> {course.subject}
              </p>
              <p className="course-info">
                <strong>Horario:</strong> {course.schedule}
              </p>
              <p className="course-info">
                <strong>Estudiantes:</strong> {course.students}
              </p>
              <button
                onClick={() => alert(`Ver estudiantes de ${course.name}`)}
                className="view-students-btn"
              >
                Ver Estudiantes
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageCourses;
