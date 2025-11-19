import React, {useState, useEffect, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import './MyCourses.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { UserDataContext } from '../../Context/UserDataProvider';

/**
 * Componente para que el estudiante vea sus cursos inscritos.
 */
export const MyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const { userData } = useContext(UserDataContext);

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
    <div className="my-courses-container-user">
      <div className="my-courses-wrapper-user">
        <button onClick={() => navigate(-1)} className="back-button-user">← Volver</button>

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
                <h3>{course?.name}</h3>
                <p className="course-info-user"><strong>👨‍🏫 Profesor:</strong> {course.professor?.fullname}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCourses;