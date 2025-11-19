import React, { useState, useContext } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Swal from 'sweetalert2';
import { UserDataContext } from '../../Context/UserDataProvider';
import '../../Teacher/AddStudentModal/AddStudentModal.css'


export const CreateUser = ({ isOpen, onClose }) => {
  const { userData } = useContext(UserDataContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });

  // Esta es la peticion para cargar los cursos cuando se abre la modal



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createUser = async () => {
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Contraseñas No Coincidentes',
        text: 'Las contraseñas deben ser idénticas.',
      });
      return;
    }


    // Datos para crear el usuario
    const userDataInfo = {
      fullname: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role
    };

    try {
      Swal.fire({
        title: 'Procesando...',
        text: 'Registrando estudiante y asignando curso...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

    await axios.post(`http://localhost:5000/api/userAdmin/registerAdmin`, userDataInfo,{
        headers: { Authorization: `Bearer ${userData.token}` }
      });
      console.log(userDataInfo);
      

      // ÉXITO TOTAL
      Swal.fire({
        icon: 'success',
        title: '¡Operación Exitosa!',
        text: `Usuario creado correctamente.`,
        timer: 2000
      });

      setFormData({ name: '', email: '', password: '', confirmPassword: '', role: '' });
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
        <h1>Crear Usuario</h1>
        <form className="form-group">
          <div>
            <label htmlFor="name">Nombre Completo</label>
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
            <label htmlFor="rol">Rol</label>
            <select id="rol" name="role" value={formData.role} onChange={handleChange}required>
                <option value="">-- Seleccionar Rol --</option>
                <option value={'Student'}>Estudiante</option>
                <option value={'Professor'}>Profesor</option>
            </select>
          </div>
          <div className="modal-buttons">
            <button type="button" onClick={onClose} className="modal-btn-cancel">Cancelar</button>
            <button type="button" onClick={createUser} className="modal-btn-submit">Crear</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CreateUser;