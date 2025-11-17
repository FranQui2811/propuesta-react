import React from 'react';
import { useNavigate } from 'react-router-dom';
import './TakeAttendance.css';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { UserDataContext } from '../../Context/UserDataProvider';


export const TakeAttendance = () => {
  const navigate = useNavigate();
  const { userData } = useContext(UserDataContext);
  const [courses, setCourses] = useState([]);

  const handleSelectCourse = (course) => {
    navigate('/Teacher/Register/Assist', { state: { course } });
  };

    useEffect(() => {
    const fetchCourses = async () => {
      if (!userData?.token) return;
      try {
        // Mostrar SweetAlert de carga
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
    <div className="take-attendance-container">
      <div className="take-attendance-wrapper">
        <button
          onClick={() => navigate('/HomeTeacher')}className="back-button">← Volver al inicio</button>
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
              <p>Numero de estudiantes: {course.students.length}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TakeAttendance;
