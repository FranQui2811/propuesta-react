import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomeUser.css';
import Card from '../../../UI/Card/Card';
import { UserDataContext } from '../../Context/UserDataProvider';

export const HomeUser = () => {
    const { userData } = useContext(UserDataContext);
    const navigate = useNavigate();

    // Simulación de nombre si no hay contexto
    const studentName = userData?.name || 'Nombre del Estudiante';

    const cards = [
        {
            title: 'Mis Cursos',
            description: 'Consulta tus cursos actuales, profesores y materiales disponibles.',
            icon: '📚',
            actions: [
                { label: 'Ver Cursos', onClick: () => navigate('/User/MyCourses') },
            ],
        },
        {
            title: 'Asistencia',
            description: 'Revisa tu historial de asistencias y ausencias por materia.',
            icon: '📅',
            actions: [
                { label: 'Ver Asistencia', onClick: () => navigate('/User/Attendance') },
            ],
        },
        {
            title: 'Perfil y Configuración',
            description: 'Actualiza tu información personal o cambia tu contraseña.',
            icon: '⚙️',
            actions: [
                { label: 'Editar Perfil', onClick: () => navigate('/User/Profile') },
            ],
        },
    ];

    const handleLogout = () => {
        localStorage.removeItem('userData');
        window.location.href = '/login';
    };

    return (
        <>
            <div className="home-user-container">
                <header className="home-user-header">
                    <div className="home-user-header-left">
                        <span style={{ fontSize: '1.7rem' }}>🏠</span>
                        <h1 className="home-user-title">Inicio del Estudiante</h1>
                    </div>
                    <div className="home-user-header-right">
                        <span className="home-user-name">🎓 {studentName}</span>
                        <button onClick={handleLogout} className="home-user-logout">
                            Cerrar sesión
                        </button>
                    </div>
                </header>

                <main className="home-user-main">
                    <div className="home-user-cards">
                        {cards.map((card, i) => (
                            <Card
                                key={i}
                                title={card.title}
                                description={card.description}
                                icon={card.icon}
                                actions={card.actions}
                            />
                        ))}
                    </div>
                </main>
            </div>
        </>
    );
};
