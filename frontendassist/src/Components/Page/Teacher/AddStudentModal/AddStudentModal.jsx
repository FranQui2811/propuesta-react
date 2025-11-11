import React, { useState } from 'react';
import './AddStudentModal.css';
import Modal from '../../../UI/Modal/Modal';

export const AddStudentModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Estudiante agregado: ${formData.name}`);
    setFormData({ name: '', email: '', subject: '' });
    onClose();
  };

  const footerButtons = (
    <div className="modal-buttons">
      <button
        onClick={onClose}
        className="modal-btn-cancel"
      >
        Cancelar
      </button>
      <button
        onClick={handleSubmit}
        className="modal-btn-submit"
      >
        Agregar
      </button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} title="Agregar Estudiante" onClose={onClose} footer={footerButtons}>
      <form onSubmit={handleSubmit} className="form-group">
        <div>
          <label htmlFor="name">Nombre del Estudiante</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="subject">Materia a Asignar</label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar materia</option>
            <option value="math">Matemáticas</option>
            <option value="spanish">Español</option>
            <option value="english">Inglés</option>
            <option value="science">Ciencias</option>
          </select>
        </div>
      </form>
    </Modal>
  );
};

export default AddStudentModal;
