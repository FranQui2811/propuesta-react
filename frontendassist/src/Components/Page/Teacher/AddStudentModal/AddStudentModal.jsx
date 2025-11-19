import React, { useState, useEffect, useContext } from 'react';
import './AddStudentModal.css';
import Modal from 'react-modal';
import axios from 'axios';
import Swal from 'sweetalert2';
import { UserDataContext } from '../../Context/UserDataProvider';

export const AddStudentModal = ({ isOpen, onClose }) => {
  const { userData } = useContext(UserDataContext);
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    courseId: '',
  });

  // Esta es la peticion para cargar los cursos cuando se abre la modal
  useEffect(() => {
    const fetchCourses = async () => {
      if (isOpen && userData?.token) {
        try {
          const res = await axios.get('http://localhost:5000/api/course', {
            headers: { Authorization: `Bearer ${userData.token}` },
          });
          setCourses(res.data || []);
        } catch (error) {
          console.error("Error cargando cursos", error);
        }
      }
    };
    fetchCourses();
  }, [isOpen, userData]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createStudent = async () => {
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Contraseñas No Coincidentes',
        text: 'Las contraseñas deben ser idénticas.',
      });
      return;
    }

    if (!formData.courseId) {
        Swal.fire({
            icon: 'warning',
            title: 'Curso Requerido',
            text: 'Por favor selecciona un curso para asignar al estudiante.',
          });
          return;
    }

    // Datos para crear el estudiante
    const studentData = {
      fullname: formData.name,
      email: formData.email,
      password: formData.password
    };

    try {
      Swal.fire({
        title: 'Procesando...',
        text: 'Registrando estudiante y asignando curso...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      const resStudent = await axios.post(`http://localhost:5000/api/student`, studentData,{
        headers: { Authorization: `Bearer ${userData.token}` }
      });

      
      // Por lo general viene en resStudent.data o resStudent.data.user
      const newStudentId = resStudent.data[0]._id

      if (!newStudentId) {
          throw new Error("No se pudo obtener el ID del nuevo estudiante");
      }
      const enrollPayload = {
          studentId: newStudentId
      };

      await axios.put(`http://localhost:5000/api/course/${formData.courseId}/enroll`, enrollPayload,{
        headers: { Authorization: `Bearer ${userData.token}` 
      }}
      );

      // ÉXITO TOTAL
      Swal.fire({
        icon: 'success',
        title: '¡Operación Exitosa!',
        text: `Estudiante creado y asignado al curso correctamente.`,
        timer: 2000
      });

      setFormData({ name: '', email: '', password: '', confirmPassword: '', courseId: '' });
      onClose();

    } catch (error) {
      Swal.close();
      console.error(error);
      const message = error.response?.data?.message || 'Error en el proceso.';
      Swal.fire({ icon: 'error', title: 'Error', text: message });
    }
  };

  return (
    <div className="mainCont">
      <Modal ariaHideApp={false} isOpen={isOpen} id="add-student-modal" title="Agregar Estudiante" onClose={onClose}>
        <h1>Crear y Asignar Estudiante</h1>
        <form className="form-group">
          <div>
            <label htmlFor="name">Nombre del Estudiante</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="email">Correo</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirmar Contraseña</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
          </div>

          <div>
            <label htmlFor="courseId">Asignar a Curso</label>
            <select
              id="courseId"
              name="courseId"
              value={formData.courseId}
              onChange={handleChange}
              required
            >
              <option value="">-- Seleccionar Curso --</option>
              {courses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="modal-btn-cancel">Cancelar</button>
            <button type="button" onClick={createStudent} className="modal-btn-submit">Guardar y Asignar</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AddStudentModal;