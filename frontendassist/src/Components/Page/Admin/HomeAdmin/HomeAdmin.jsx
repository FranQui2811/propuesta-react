import React, { useState } from 'react';
import './HomeAdmin.css';
import ModuleButton from '../../../UI/ModuleButton/ModuleButton';
import Card from '../../../UI/Card/Card';
import CreateUser from '../CreateUser/CreateUser';
import ModalDeleteUser from '../ModalDeleteUser/ModalDeleteUser';
import ModalShowUser from '../ModalShowUser/ModalShowUser';
import ModalEditUser from '../ModalEditUser/ModalEditUser';
import ModalCreateCourse from '../ModalCreateCourse/ModalCreateCourse';
import ModalListProfessors from '../ModalListProfessors/ModalListProfessors';

export const HomeAdmin = () => {
    const [activeModule, setActiveModule] = useState(null);
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
    const [isShowUserModalOpen, setIsShowUserModalOpen] = useState(false);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
    const [isListProfessorsModalOpen, setIsListProfessorsModalOpen] = useState(false);

    // Módulos de administración (posible fuente de datos o archivo separado si lo deseas)
    const modules = [
        { id: 'users', title: 'Gestión de Usuarios', icon: '👥' },
        { id: 'subjects', title: 'Gestión de Materias', icon: '📚' },
        { id: 'teachers', title: 'Gestión de Profesores', icon: '👨‍🏫' },
        // { id: 'classes', title: 'Gestión de Clases', icon: '🏫' },
    ];

    const renderModuleContent = () => {
      if (!activeModule) {
        return (
            <div className="welcome-message">
                <div className="welcome-icon">👋</div>
                <h2>¡Bienvenido al Panel de Administración!</h2>
                <p>Por favor, selecciona una opción del menú lateral para comenzar a gestionar el sistema.</p>
                {/* <p className="welcome-hint">👈 Puedes gestionar usuarios, materias o profesores.</p> */}
            </div>
        );
    }

        // Cards por módulo (puedes mover esto a un archivo de datos si lo prefieres)
        const cardsByModule = {
            users: [
                { title: 'Agregar Usuario', description: 'Crea un nuevo usuario en el sistema', icon: '➕', actions: [{ label: 'Crear', onClick: () => setIsAddUserModalOpen(true) }] },
                {title: 'Eliminar Usuario', description: 'Eliminar un usuario existente', icon: '❌', actions: [{ label: 'Eliminar', onClick: () => setIsDeleteUserModalOpen(true) }] },
                {title: 'Modificar Usuario', description: 'Actualizar información de usuario', icon: '✏️', actions: [{ label: 'Modificar', onClick: () => setIsEditUserModalOpen(true) }] },
                { title: 'Listar Usuarios', description: 'Ver usuarios existentes', icon: '👥', actions: [{ label: 'Ver', onClick: () => setIsShowUserModalOpen(true) }] },
            ],
            subjects: [
                { title: 'Nueva Materia', description: 'Agregar una materia al catálogo', icon: '📚', actions: [{ label: 'Agregar', onClick: () =>setIsCreateCourseModalOpen(true) }] },
                { title: 'Materias Activas', description: 'Administrar materias activas', icon: '🗂️', actions: [{ label: 'Administrar', onClick: () => alert('Administrar materias') }] },
            ],
            teachers: [
                { title: 'Listar Profesores', description: 'Ver lista de profesores registrados', icon: '👩‍🏫', actions: [{ label: 'Ver', onClick: () => setIsListProfessorsModalOpen(true) }]},
                { title: 'Asignaciones', description: 'Ver asignaciones de profesores', icon: '📋', actions: [{ label: 'Ver', onClick: () => alert('Ver asignaciones') }] },
            ],
        };

        const cards = cardsByModule[activeModule] || [];

        return (
            <div className="module-content">
                <h2>{modules.find(m => m.id === activeModule)?.title}</h2>
                <div className="cards-grid">
                    {cards.map((c, i) => (
                        <Card className={'btnCardAdmin'} key={i} title={c.title} description={c.description} icon={c.icon} actions={c.actions} />
                    ))}
                </div>
            </div>
        );
    };

return (
    <div className="admin-container">
        <header className="admin-header">
            <p className="admin-header-title"> 🏠 Inicio Administrador</p>
            <button onClick={() => {localStorage.removeItem('userData'); window.location.href = '/';}} className="btn-sesion" >Cerrar sesión</button>
        </header>
        <div className='contMainAdmin'>
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
        <CreateUser isOpen={isAddUserModalOpen} onClose={() => setIsAddUserModalOpen(false)} />
        <ModalDeleteUser isOpen={isDeleteUserModalOpen} onClose={() => setIsDeleteUserModalOpen(false)} />
        <ModalShowUser isOpen={isShowUserModalOpen} onClose={() => setIsShowUserModalOpen(false)} />
        <ModalEditUser isOpen={isEditUserModalOpen} onClose={() => setIsEditUserModalOpen(false)} />
        <ModalCreateCourse isOpen={isCreateCourseModalOpen} onClose={() => setIsCreateCourseModalOpen(false)} />
        <ModalListProfessors isOpen={isListProfessorsModalOpen} onClose={() => setIsListProfessorsModalOpen(false)} />
    </div>
    );
};

export default HomeAdmin;