import React, { useState, useContext, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { UserDataContext } from '../../Context/UserDataProvider';
import './ModalListProfessors.css'; // CSS Específico

export const ModalListProfessors = ({ isOpen, onClose }) => {
  const { userData } = useContext(UserDataContext);

  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // CARGAR PROFESORES AL ABRIR LA MODAL
  useEffect(() => {
    const fetchProfessors = async () => {
      if (isOpen && userData?.token) {
        setLoading(true);
        setError(null);
        try {
          // Usamos la ruta específica optimizada para traer solo profesores
          const response = await axios.get('http://localhost:5000/api/userAdmin/professors', {
            headers: { Authorization: `Bearer ${userData.token}` }
          });
          
          setProfessors(response.data || []);
          setLoading(false);

        } catch (err) {
          console.error("Error cargando profesores", err);
          setError("No se pudo cargar la lista de docentes.");
          setLoading(false);
        }
      }
    };

    fetchProfessors();

    // Limpiar al cerrar
    if (!isOpen) {
        setProfessors([]);
    }
  }, [isOpen, userData]);

  return (
    <div className="mainCont">
      <Modal 
        ariaHideApp={false} 
        isOpen={isOpen} 
        id="list-professors-modal" 
        title="Lista de Profesores" 
        onClose={onClose}
        className="react-modal-content"
      >
        
        <h1 className="modal-title-list">Docentes Registrados</h1>
        <p className="modal-subtitle">Lista completa del cuerpo docente.</p>
        
        <div className="professors-list-container">
            {loading && <p className="status-msg">Cargando docentes...</p>}
            
            {error && <p className="status-msg error-text">{error}</p>}
            
            {!loading && !error && professors.length === 0 && (
                <p className="status-msg">No hay profesores registrados.</p>
            )}

            {!loading && professors.length > 0 && (
                <ul className="prof-list">
                    {professors.map((prof) => (
                        <li key={prof._id} className="prof-list-item">
                            <div className="prof-avatar">
                                👨‍🏫
                            </div>
                            <div className="prof-info">
                                <span className="prof-name">{prof.fullname}</span>
                                <span className="prof-email">{prof.email}</span>
                            </div>
                            <div className="prof-badge">
                                Docente
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>

        <div className="modal-buttons-center">
            <button type="button" onClick={onClose} className="modal-btn-close">
                Cerrar Lista
            </button>
        </div>

      </Modal>
    </div>
  );
};

export default ModalListProfessors;