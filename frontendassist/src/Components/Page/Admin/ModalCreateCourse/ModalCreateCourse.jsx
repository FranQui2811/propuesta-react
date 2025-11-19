import React, { useState, useContext, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import Swal from 'sweetalert2';
import { UserDataContext } from '../../Context/UserDataProvider';
import './ModalCreateCourse.css';

export const ModalCreateCourse = ({ isOpen, onClose }) => {
  const { userData } = useContext(UserDataContext);

  // --- ESTADOS ---
  const [professors, setProfessors] = useState([]); 
  const [students, setStudents] = useState([]); 
  
  const [formData, setFormData] = useState({
    courseName: '',
    professorId: ''
  });

  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [studentSearch, setStudentSearch] = useState('');

  // 1. CARGAR DATOS (PROFESORES Y ESTUDIANTES)
  useEffect(() => {
    const fetchData = async () => {
      if (isOpen && userData?.token) {
        try {
          // Configuración del header con el token
          const config = {
            headers: { Authorization: `Bearer ${userData.token}` }
          };

          // Usamos Promise.all para hacer ambas peticiones en paralelo
          const [professorsRes, studentsRes] = await Promise.all([
            // Petición 1: Obtener Profesores (Ruta específica de Admin)
            axios.get('http://localhost:5000/api/userAdmin/professors', config),
            
            // Petición 2: Obtener Estudiantes (Ruta estándar de estudiantes)
            axios.get('http://localhost:5000/api/student', config)
          ]);
          
          // Asignamos los datos directamente a sus estados correspondientes
          setProfessors(professorsRes.data || []);
          setStudents(studentsRes.data || []);

        } catch (error) {
          console.error("Error cargando datos", error);
          // Opcional: Mostrar alerta si falla la carga
          // Swal.fire('Error', 'No se pudieron cargar las listas de usuarios', 'error');
        }
      }
    };

    fetchData();

    // Limpiar estados al cerrar la modal
    if (!isOpen) {
        setFormData({ courseName: '', professorId: '' });
        setSelectedStudentIds([]);
        setStudentSearch('');
    }
  }, [isOpen, userData]);

  // 2. MANEJAR CHECKBOX DE ESTUDIANTES
  const handleStudentToggle = (studentId) => {
    setSelectedStudentIds(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      } else {
        return [...prev, studentId];
      }
    });
  };

  // 3. FILTRAR ESTUDIANTES (Buscador)
  const filteredStudents = students.filter(student => 
    student.fullname?.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.email?.toLowerCase().includes(studentSearch.toLowerCase())
  );

  // 4. ENVIAR FORMULARIO
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.courseName.trim() || !formData.professorId) {
        Swal.fire('Faltan datos', 'El nombre de la materia y el profesor son obligatorios.', 'warning');
        return;
    }

    try {
        Swal.fire({
            title: 'Procesando...',
            text: 'Creando materia y matriculando estudiantes...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        // PASO 1: CREAR EL CURSO
        const createPayload = {
            name: formData.courseName,
            professorId: formData.professorId
        };

        const resCreate = await axios.post('http://localhost:5000/api/course', createPayload, {
            headers: { Authorization: `Bearer ${userData.token}` }
        });

        const newCourseId = resCreate.data._id;

        // PASO 2: MATRICULAR ESTUDIANTES (Si hay seleccionados)
        if (selectedStudentIds.length > 0 && newCourseId) {
             const enrollPayload = {
                 studentId: selectedStudentIds 
             };
             
             await axios.put(`http://localhost:5000/api/course/${newCourseId}/enroll`, enrollPayload, {
                headers: { Authorization: `Bearer ${userData.token}` }
             });
        }

        Swal.fire({
            icon: 'success',
            title: '¡Éxito!',
            text: `Materia creada y ${selectedStudentIds.length} estudiantes matriculados.`,
            timer: 2500
        });

        onClose();

    } catch (error) {
        Swal.close();
        const msg = error.response?.data?.message || 'Ocurrió un error en el proceso.';
        Swal.fire({ icon: 'error', title: 'Error', text: msg });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="mainCont">
      <Modal ariaHideApp={false} isOpen={isOpen} id="create-course-modal" title="Crear Materia" onClose={onClose} className="react-modal-content">
        
        <h1 className="modal-title-course">Nueva Materia</h1>
        
        <form className="create-course-form">
            
            {/* DATOS BÁSICOS */}
            <div className="form-row">
                <div className="form-group-modal">
                    <label>Nombre Asignatura</label>
                    <input type="text" name="courseName" value={formData.courseName} onChange={handleChange} className="modal-input" placeholder="Ej. Física I"/>
                </div>
                <div className="form-group-modal">
                    <label>Profesor Encargado</label>
                    <select name="professorId" value={formData.professorId} onChange={handleChange} className="modal-select">
                        <option value="">-- Seleccionar --</option>
                        {/* Renderizamos la lista que vino del endpoint de Profesores */}
                        {professors.map(p => <option key={p._id} value={p._id}>{p.fullname}</option>)}
                    </select>
                </div>
            </div>

            <hr className="modal-divider" />

            {/* SECCIÓN DE ESTUDIANTES */}
            <div className="students-selection-section">
                <label className="section-label">Matricular Estudiantes (Opcional)</label>
                
                <input 
                    type="text" 
                    placeholder="Buscar estudiante..." 
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="student-search-input"
                />

                <div className="students-checkbox-list">
                    {/* Renderizamos la lista filtrada que vino del endpoint de Estudiantes */}
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map(student => (
                            <div key={student._id} className={`student-checkbox-item ${selectedStudentIds.includes(student._id) ? 'selected' : ''}`}>
                                <input 
                                    type="checkbox" 
                                    id={`st-${student._id}`}
                                    checked={selectedStudentIds.includes(student._id)}
                                    onChange={() => handleStudentToggle(student._id)}
                                />
                                <label htmlFor={`st-${student._id}`}>
                                    <span className="st-name">{student.fullname}</span>
                                    <span className="st-email">{student.email}</span>
                                </label>
                            </div>
                        ))
                    ) : (
                        <p className="no-students-msg">No hay estudiantes disponibles.</p>
                    )}
                </div>
                <p className="selection-count">Seleccionados: {selectedStudentIds.length}</p>
            </div>

            <div className="modal-buttons">
                <button type="button" onClick={onClose} className="modal-btn-cancel">Cancelar</button>
                <button type="button" onClick={handleSubmit} className="modal-btn-submit">Crear y Guardar</button>
            </div>

        </form>
      </Modal>
    </div>
  );
};

export default ModalCreateCourse;