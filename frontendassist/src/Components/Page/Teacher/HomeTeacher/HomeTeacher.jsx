

import React, { useState, useContext } from 'react';
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
    const teacherName = userData?.name || 'Nombre del Profesor';

    const cards = [
        {
            title: 'Gestión de Cursos Asignados',
            description: 'Consulte el listado de cursos que tiene asignados, detalles y estudiantes.',
            icon: '📋',
            actions: [
                { label: 'Ver Cursos', onClick: () => navigate('/Teacher/Courses') },
            ],
        },
        {
            title: 'Agregar Estudiantes',
            description: 'Registre un nuevo estudiante y asígnelo a materias.',
            icon: '🧑‍🎓',
            actions: [
                { label: 'Agregar', onClick: () => setIsAddStudentModalOpen(true) },
            ],
        },
        {
            title: 'Toma de Asistencia',
            description: 'Seleccione el curso/materia antes de registrar la asistencia.',
            icon: '✅',
            actions: [
                { label: 'Tomar Asistencia', onClick: () => navigate('/Teacher/Attendance') },
            ],
        },
        {
            title: 'Historial de Asistencias',
            description: 'Consulte, edite o exporte el historial de asistencias en formato tabla.',
            icon: '📊',
            actions: [
                { label: 'Ver Historial', onClick: () => navigate('/Teacher/History') },
            ],
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem('userData');
        window.location.href = '/login';
    };

    return (
        <>
            <div className="admin-container">
                <header className="teacher-header">
                    <div className="teacher-header-left">
                        <span style={{fontSize: '1.7rem'}}>🏠</span>
                        <h1 className="teacher-header-title">Home Docente</h1>
                    </div>
                    <div className="teacher-header-right">
                        <span className="teacher-header-name">👨‍🏫 {teacherName}</span>
                        <button onClick={handleLogout} className="admin-button" style={{fontWeight: 500}}>Cerrar sesión</button>
                    </div>
                </header>
                <div className="admin-content">
                    <div className="cards-grid">
                        {cards.map((c, i) => (
                            <Card key={i} title={c.title} description={c.description} icon={c.icon} actions={c.actions} />
                        ))}
                    </div>
                </div>
            </div>
            <AddStudentModal isOpen={isAddStudentModalOpen} onClose={() => setIsAddStudentModalOpen(false)} />
        </>
    );
};
