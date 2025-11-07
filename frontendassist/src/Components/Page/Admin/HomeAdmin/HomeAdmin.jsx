import React, { useState } from 'react';
import './HomeAdmin.css';
import ModuleButton from '../../../UI/ModuleButton/ModuleButton';
import Card from '../../../UI/Card/Card';

export const HomeAdmin = () => {
    const [activeModule, setActiveModule] = useState(null);

    // Módulos de administración (posible fuente de datos o archivo separado si lo deseas)
    const modules = [
        { id: 'users', title: 'Gestión de Usuarios', icon: '👥' },
        { id: 'subjects', title: 'Gestión de Materias', icon: '📚' },
        { id: 'teachers', title: 'Gestión de Profesores', icon: '👨‍🏫' },
        { id: 'classes', title: 'Gestión de Clases', icon: '🏫' },
    ];

    const renderModuleContent = () => {
        if (!activeModule) {
            return <div className="welcome-message">
                <h2>Bienvenido al Panel de Administración</h2>
                <p>Seleccione un módulo para comenzar</p>
            </div>;
        }

        // Cards por módulo (puedes mover esto a un archivo de datos si lo prefieres)
        const cardsByModule = {
            users: [
                { title: 'Agregar Usuario', description: 'Crea un nuevo usuario en el sistema', icon: '➕', actions: [{ label: 'Crear', onClick: () => alert('Crear usuario') }] },
                { title: 'Listar Usuarios', description: 'Ver y administrar usuarios existentes', icon: '👥', actions: [{ label: 'Ver', onClick: () => alert('Listar usuarios') }] },
            ],
            subjects: [
                { title: 'Nueva Materia', description: 'Agregar una materia al catálogo', icon: '📚', actions: [{ label: 'Agregar', onClick: () => alert('Agregar materia') }] },
                { title: 'Materias Activas', description: 'Administrar materias activas', icon: '🗂️', actions: [{ label: 'Administrar', onClick: () => alert('Administrar materias') }] },
            ],
            teachers: [
                { title: 'Agregar Profesor', description: 'Registrar un nuevo docente', icon: '👨‍🏫', actions: [{ label: 'Registrar', onClick: () => alert('Registrar profesor') }] },
                { title: 'Asignaciones', description: 'Ver asignaciones de profesores', icon: '📋', actions: [{ label: 'Ver', onClick: () => alert('Ver asignaciones') }] },
            ],
            classes: [
                { title: 'Crear Clase', description: 'Crear una nueva clase', icon: '🏫', actions: [{ label: 'Crear', onClick: () => alert('Crear clase') }] },
                { title: 'Horarios', description: 'Gestionar horarios y aulas', icon: '🕒', actions: [{ label: 'Gestionar', onClick: () => alert('Gestionar horarios') }] },
            ],
        };

        const cards = cardsByModule[activeModule] || [];

        return (
            <div className="module-content">
                <h2>{modules.find(m => m.id === activeModule)?.title}</h2>
                <div className="cards-grid">
                    {cards.map((c, i) => (
                        <Card key={i} title={c.title} description={c.description} icon={c.icon} actions={c.actions} />
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="admin-container">
            <div className="admin-sidebar">
                <h1>Panel Admin</h1>
                <div className="module-buttons">
                    {modules.map((module) => (
                        <ModuleButton
                            key={module.id}
                            id={module.id}
                            title={module.title}
                            icon={module.icon}
                            active={activeModule === module.id}
                            onClick={setActiveModule}
                        />
                    ))}
                </div>
            </div>
            <div className="admin-content">
                {renderModuleContent()}
            </div>
        </div>
    );
};

export default HomeAdmin;