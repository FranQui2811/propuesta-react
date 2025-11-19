

import React, { useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeTeacher.css';
import Card from '../../../UI/Card/Card';
import AddStudentModal from '../AddStudentModal/AddStudentModal';
import { UserDataContext } from '../../Context/UserDataProvider';

export const HomeTeacher = () => {
    const { userData } = useContext(UserDataContext);
    const navigate = useNavigate();
    const [isAddStudentModalOpen, setIsAddStudentModalOpen] = useState(false);

    // Simulación de nombre si no hay contexto
    const teacherName = userData?.fullname || 'Nombre del Profesor';

    const cards = [
        {
            title: 'Gestión de Cursos Asignados',
            description: 'Consulte el listado de cursos que tiene asignados, detalles y estudiantes.',
            icon: '📋',
            onClick: () => navigate('/Teacher/Courses'),
            actions: [
                { label: 'Ver Cursos', 
                onClick: () => navigate('/Teacher/Courses') },
            ],
            
        },
        {
            title: 'Agregar Estudiantes',
            description: 'Registre un nuevo estudiante y asígnelo a materias.',
            icon: '🧑‍🎓',
            onClick: () => setIsAddStudentModalOpen(true),
            actions: [
                { label: 'Agregar', onClick: () => setIsAddStudentModalOpen(true) },
            ],
        },
        {
            title: 'Toma de Asistencia',
            description: 'Seleccione el curso/materia antes de registrar la asistencia.',
            icon: '✅',
            onClick: () => navigate('/Teacher/Attendance'),
            actions: [
                { label: 'Tomar Asistencia', onClick: () => navigate('/Teacher/Attendance') },
            ],
        },
        {
            title: 'Historial de Asistencias',
            description: 'Consulte, edite o exporte el historial de asistencias en formato tabla.',
            icon: '📊',
            onClick: () => navigate('/Teacher/History'),
            actions: [
                { label: 'Ver Historial', onClick: () => navigate('/Teacher/History') },
            ],
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem('userData');
        window.location.href = '/';
    };

    // useEffect(() => {
    //     // Asumiendo que `userData` está vacío o no tiene `token` si el usuario no está logueado
    //     if (!userData || !userData.token) {
    //         // Redirige al usuario a la página de login si no hay token
    //         navigate('/');
    //     }
    // }, [userData, navigate]);

    return (
        <>
            <div className="teacher-container">
                <header className="teacher-header">
                    <p className="teacher-header-title"> 🏠 Inicio Docente</p>
                    <p className="teacher-header-name">👨‍🏫 {teacherName}</p>
                    <button onClick={handleLogout} className="btn-sesion" >Cerrar sesión</button>
                </header>
                <div className="admin-content">
                    <div className="cards-grid">
                        {cards.map((c, i) => (
                            <Card className={'btnTeacher'} key={i} title={c.title} description={c.description} icon={c.icon} actions={c.actions} onClick={c.onClick} />
                        ))}
                    </div>
                </div>
            </div>
            <AddStudentModal isOpen={isAddStudentModalOpen} onClose={() => setIsAddStudentModalOpen(false)} />
        </>
    );
};
