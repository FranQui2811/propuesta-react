import React, { useState, useContext, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Swal from 'sweetalert2';
import { UserDataContext } from '../../Context/UserDataProvider';
import './ModalDeleteUser.css'; // Asegúrate de crear/actualizar este CSS

export const ModalDeleteUser = ({ isOpen, onClose }) => {
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

  // 3. Función para Eliminar
  const handleDelete = async () => {
    if (!selectedUserId) {
        Swal.fire({ icon: 'warning', title: 'Atención', text: 'Por favor selecciona un estudiante de la lista.' });
        return;
    }

    // Confirmación antes de borrar
    const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esta acción. El estudiante será eliminado.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
        try {
            Swal.fire({ title: 'Eliminando...', didOpen: () => Swal.showLoading() });
            
            // AJUSTA LA URL DE ELIMINACIÓN
            await axios.delete(`http://localhost:5000/api/student/${selectedUserId}`, {
                headers: { Authorization: `Bearer ${userData.token}` }
            });

            Swal.fire('Eliminado', 'El estudiante ha sido eliminado.', 'success');
            
            // Actualizar la lista localmente sin recargar
            setUsers(users.filter(u => u._id !== selectedUserId));
            setSelectedUserId(null); // Resetear selección
            
        } catch (error) {
            Swal.close();
            const msg = error.response?.data?.message || 'Error al eliminar';
            Swal.fire({ icon: 'error', title: 'Error', text: msg });
        }
    }
  };

  return (
    <div className="mainCont">
        <Modal ariaHideApp={false}  isOpen={isOpen}  id="delete-user-modal" title="Eliminar Estudiante" onClose={onClose}className="react-modal-content">
        <h1 className="modal-title-danger">Eliminar Estudiante</h1>
        
        <div className="delete-modal-body">
            {/* Barra de Búsqueda */}
            <div className="search-bar-container">
                <input 
                    type="text" 
                    placeholder="Buscar por nombre o correo..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input-modal"
                />
            </div>

            {/* Lista de Estudiantes */}
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
          <button 
            type="button" 
            onClick={handleDelete} 
            className="modal-btn-delete"
            disabled={!selectedUserId} // Deshabilitar si no hay selección
          >
            Eliminar
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ModalDeleteUser;