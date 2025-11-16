import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AttendanceHistoryUser.css'; 

export const AttendanceHistoryUser = () => {
    // ... (Tu estado y useEffect se mantienen sin cambios) ...
    const [courseAttendanceSummary, setCourseAttendanceSummary] = useState([
        { materia: 'Cálculo Avanzado', totalClases: 6, asistencias: 3, ausencias: 3, },
        { materia: 'Programación Web', totalClases: 3, asistencias: 3, ausencias: 0,  },
        { materia: 'Bases de Datos', totalClases: 1, asistencias: 1, ausencias: 0,  },
    ]);
    const navigate = useNavigate();

    // ... (Tu lógica de useEffect, isLoading y error se mantienen sin cambios) ...

    return (
        <div className="attendance-history-container-User">
            {/* === Nuevo Wrapper (Contenedor Blanco) === */}
            <div className="attendance-history-wrapper-User"> 
                
                {/* Botón Volver - CLASE MODIFICADA */}
                <button 
                    onClick={() => navigate(-1)} 
                    className="back-button-User" 
                >
                    ← Volver
                </button>
            
                <h1 className="attendance-title-User">Historial de Asistencia</h1>
                {/* Separador de Título */}
                <div className="title-separator-User"></div> 
                
                <div className="attendance-table-container-User">
                    {courseAttendanceSummary.length === 0 ? (
                        <p>Aún no hay registros de asistencia disponibles.</p>
                    ) : (
                        <table className="attendance-table-User">
                            <thead>
                                <tr>
                                    <th>Materia</th>
                                    <th>Total Clases</th>
                                    <th>Asistencias</th>
                                    <th>Ausencias</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courseAttendanceSummary.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.materia}</td> 
                                        <td>{item.totalClases}</td>
                                        <td>{item.asistencias}</td>
                                        <td>{item.ausencias}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            {/* Cierre del Wrapper */}
            </div> 
        </div>
    );
};

export default AttendanceHistoryUser;
