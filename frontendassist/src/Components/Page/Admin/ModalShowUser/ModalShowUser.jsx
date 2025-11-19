import React, { useState, useContext, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
// import Swal from 'sweetalert2';
import { UserDataContext } from '../../Context/UserDataProvider';
import '../ModalDeleteUser/ModalDeleteUser.css'; // Asegúrate de crear/actualizar este CSS

export const ModalShowUser = ({ isOpen, onClose }) => {
  const { userData } = useContext(UserDataContext);
  
  // Estados para la lista, búsqueda y selección
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Cargar estudiantes cuando la modal se abre
  useEffect(() => {
    const fetchUsers = async () => {
      if (isOpen && userData?.token) {
        setLoading(true);
        try {
          // AJUSTA ESTA URL A TU ENDPOINT QUE TRAE LA LISTA DE ESTUDIANTES
          const response = await axios.get('http://localhost:5000/api/student', {
            headers: { Authorization: `Bearer ${userData.token}` }
          });
          setUsers(response.data || []);
          setLoading(false);
        } catch (error) {
          console.error("Error cargando estudiantes", error);
          setLoading(false);
          // Opcional: Mostrar alerta si falla la carga
        }
      }
    };
    fetchUsers();
    
    // Limpiar selección al cerrar o abrir
    if (!isOpen) {
        setSearchTerm('');
        setSelectedUserId(null);
    }
  }, [isOpen, userData]);

  // 2. Lógica de Filtrado (Buscador)
  const filteredUsers = users.filter(user => 
    user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );


  return (
    <div className="mainCont">
        <Modal ariaHideApp={false}  isOpen={isOpen}  id="delete-user-modal" title="Eliminar Estudiante" onClose={onClose}className="react-modal-content">
        <h1 className="modal-title-danger">Listado De Estudiantes</h1>
        
        <div className="delete-modal-body">
            <div className="search-bar-container">
                <input 
                    type="text" 
                    placeholder="Buscar por nombre o correo..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input-modal"
                />
            </div>

            <div className="user-list-container">
                {loading ? (
                    <p>Cargando lista...</p>
                ) : filteredUsers.length === 0 ? (
                    <p className="no-results">No se encontraron estudiantes.</p>
                ) : (
                    <ul className="user-list">
                        {filteredUsers.map(user => (
                            <li 
                                key={user._id} 
                                className={`user-list-item ${selectedUserId === user._id ? 'selected' : ''}`}
                                onClick={() => setSelectedUserId(user._id)}
                            >
                                <div className="user-info-row">
                                    <span className="user-name">{user.fullname}</span>
                                    <span className="user-email">{user.email}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>

        <div className="modal-buttons">
          <button type="button" onClick={onClose} className="modal-btn-cancel">Cerrar</button>
        </div>
      </Modal>
    </div>
  );
};

export default ModalShowUser;