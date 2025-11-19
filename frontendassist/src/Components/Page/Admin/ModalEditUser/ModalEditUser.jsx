import React, { useState, useContext, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Swal from 'sweetalert2';
import { UserDataContext } from '../../Context/UserDataProvider';
import './ModalEditUser.css'; // CSS Específico

export const ModalEditUser = ({ isOpen, onClose }) => {
  const { userData } = useContext(UserDataContext);
  
  // --- ESTADOS ---
  const [users, setUsers] = useState([]);             // Lista completa
  const [searchTerm, setSearchTerm] = useState('');   // Buscador
  const [selectedUser, setSelectedUser] = useState(null); // Usuario seleccionado para editar
  const [loading, setLoading] = useState(false);

  // Estado del formulario (Solo existe cuando hay un usuario seleccionado)
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  // 1. CARGAR ESTUDIANTES (Al abrir la modal)
  useEffect(() => {
    const fetchUsers = async () => {
      if (isOpen && userData?.token) {
        setLoading(true);
        try {
          const response = await axios.get('http://localhost:5000/api/student', {
            headers: { Authorization: `Bearer ${userData.token}` }
          });
          setUsers(response.data || []);
          setLoading(false);
        } catch (error) {
          console.error("Error cargando estudiantes", error);
          setLoading(false);
        }
      }
    };
    fetchUsers();
    
    // Resetear todo al cerrar
    if (!isOpen) {
        resetStates();
    }
  }, [isOpen, userData]);

  // Función auxiliar para limpiar
  const resetStates = () => {
      setSearchTerm('');
      setSelectedUser(null);
      setFormData({ name: '', email: '' });
  };

  // 2. FILTRADO
  const filteredUsers = users.filter(user => 
    user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. SELECCIONAR USUARIO (Pasa del Modo Lista al Modo Edición)
  const handleSelectUser = (user) => {
      setSelectedUser(user);
      // Pre-llenamos el formulario con los datos actuales del usuario
      setFormData({
          name: user.fullname,
          email: user.email
      });
  };

  // 4. MANEJAR CAMBIOS EN EL FORMULARIO
  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 5. GUARDAR CAMBIOS (UPDATE)
  const handleUpdate = async (e) => {
      e.preventDefault(); // Evitar recarga si usas form

      if (!formData.name || !formData.email) {
          Swal.fire('Error', 'Todos los campos son obligatorios', 'warning');
          return;
      }

      try {
        Swal.fire({ title: 'Actualizando...', didOpen: () => Swal.showLoading() });

        // AJUSTA LA URL A TU RUTA DE EDICIÓN (PUT)
        const updateUrl = `http://localhost:5000/api/student/${selectedUser._id}`;
        
        const payload = {
            fullname: formData.name,
            email: formData.email
            // No enviamos password si no se va a cambiar
        };

        const res = await axios.put(updateUrl, payload, {
            headers: { Authorization: `Bearer ${userData.token}` }
        });

        // Actualizar la lista localmente para reflejar cambios sin recargar
        setUsers(users.map(u => (u._id === selectedUser._id ? res.data : u)));

        Swal.fire('¡Actualizado!', 'La información del estudiante ha sido modificada.', 'success');
        
        // Volver a la lista o cerrar
        resetStates(); 
        // onClose(); // Descomenta si prefieres cerrar la modal tras guardar

      } catch (error) {
        Swal.close();
        const msg = error.response?.data?.message || 'Error al actualizar';
        Swal.fire({ icon: 'error', title: 'Error', text: msg });
      }
  };

  return (
    <div className="mainCont">
      <Modal 
        ariaHideApp={false} 
        isOpen={isOpen} 
        id="edit-user-modal" 
        title="Editar Estudiante" 
        onClose={onClose}
        className="react-modal-content"
      >
        {/* --- VISTA 1: LISTA DE BÚSQUEDA (Se muestra si NO hay usuario seleccionado) --- */}
        {!selectedUser && (
            <>
                <h1 className="modal-title-primary">Editar Estudiante</h1>
                <p className="modal-subtitle">Selecciona un estudiante de la lista para editarlo.</p>
                
                <div className="search-bar-container">
                    <input 
                        type="text" 
                        placeholder="Buscar estudiante..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="search-input-modal"
                    />
                </div>

                <div className="user-list-container">
                    {loading ? <p>Cargando...</p> : filteredUsers.length === 0 ? (
                        <p className="no-results">No se encontraron resultados.</p>
                    ) : (
                        <ul className="user-list">
                            {filteredUsers.map(user => (
                                <li key={user._id} className="user-list-item" onClick={() => handleSelectUser(user)}>
                                    <div className="user-info-row">
                                        <span className="user-name">{user.fullname}</span>
                                        <span className="user-edit-icon">✏️</span>
                                    </div>
                                    <span className="user-email-small">{user.email}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                
                <div className="modal-buttons">
                    <button type="button" onClick={onClose} className="modal-btn-cancel">Cerrar</button>
                </div>
            </>
        )}

        {/* --- VISTA 2: FORMULARIO DE EDICIÓN (Se muestra SI hay usuario seleccionado) --- */}
        {selectedUser && (
            <>
                <h1 className="modal-title-primary">Editando a: {selectedUser.fullname.split(' ')[0]}</h1>
                
                <form className="edit-form-container">
                    <div className="form-group-modal">
                        <label>Nombre Completo</label>
                        <input 
                            type="text" 
                            name="name" 
                            value={formData.name}   
                            onChange={handleChange} 
                            className="modal-input"
                        />
                    </div>
                    
                    <div className="form-group-modal">
                        <label>Correo Electrónico</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            className="modal-input"
                        />
                    </div>

                    <div className="modal-buttons">
                        <button 
                            type="button" 
                            onClick={() => setSelectedUser(null)} // Botón "Volver" limpia la selección
                            className="modal-btn-secondary"
                        >
                            ← Volver a la lista
                        </button>
                        <button type="button" onClick={handleUpdate} className="modal-btn-submit">
                            Guardar Cambios
                        </button>
                    </div>
                </form>
            </>
        )}

      </Modal>
    </div>
  );
};

export default ModalEditUser;