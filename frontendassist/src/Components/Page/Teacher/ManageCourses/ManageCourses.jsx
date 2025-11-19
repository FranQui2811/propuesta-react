import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import './ManageCourses.css';
import { UserDataContext } from '../../Context/UserDataProvider';

export const ManageCourses = () => {
  const navigate = useNavigate();
  const { userData } = useContext(UserDataContext);
  const [courses, setCourses] = useState([]);


    const handleSelectCourse = (course) => {
    navigate(`/Teacher/Courses/StudentsCourse`, { state: { course } });

  };

  useEffect(() => {
    const fetchCourses = async () => {
      if (!userData?.token) return;
      try {
        Swal.fire({
          title: 'Cargando cursos...',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        const res = await axios.get(`http://localhost:5000/api/course`, {
          headers: { Authorization: `Bearer ${userData.token}` },
        });
        setCourses(res.data || []);
        Swal.close();
      } catch (err) {
        Swal.close();
        const message = err.response?.data?.message || err.message || 'Error al obtener cursos';
        Swal.fire({ icon: 'error', title: 'Error', text: message });
      }
    };

    fetchCourses();
  }, [userData]);

  return (
    <div className="manage-courses-container">
      <div className="manage-courses-wrapper">
        <button
          onClick={() => navigate('/HomeTeacher')}
          className="back-button"
        >
          ← Volver
        </button>

        <h1>Gestión de Cursos Asignados</h1>

        <div className="courses-grid">
          {courses.length === 0 && <p>No se encontraron cursos asignados.</p>}

          {courses.map((course) => (
            <div key={course._id || course.id} className="course-card">
              <h3>{course.name}</h3>
              <p className="course-info">
                <strong>Profesor:</strong> {course.professor?.fullname || '—'}
              </p>
              {course.subject && (
                <p className="course-info">
                  <strong>Materia:</strong> {course.subject}
                </p>
              )}
              {course.schedule && (
                <p className="course-info">
                  <strong>Horario:</strong> {course.schedule}
                </p>
              )}
              <p className="course-info">
                <strong>Estudiantes:</strong> {Array.isArray(course.students) ? course.students.length : (course.students || 0)}
              </p>
              <button
                onClick={() => handleSelectCourse(course)}
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
