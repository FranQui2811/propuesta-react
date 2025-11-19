import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './AttendanceHistoryUser.css'; 
import Swal from 'sweetalert2';
import axios from 'axios';
import { UserDataContext } from '../../Context/UserDataProvider';

export const AttendanceHistoryUser = () => {
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const navigate = useNavigate();
    const { userData } = useContext(UserDataContext);

    const formatDate = (isoString) => {
        if (!isoString) return '';
        return isoString.split('T')[0];
    };

useEffect(() => {
const fetchAttendanceRecords = async () => {
    if (!userData?.token) return;
    try {
    Swal.fire({
        title: 'Cargando Asistencias...',
        allowOutsideClick: false,
        didOpen: () => {
        Swal.showLoading();
        
        }
    });

    const res = await axios.get(`http://localhost:5000/api/attendance`, {
    headers: { Authorization: `Bearer ${userData.token}` },
    });
    setAttendanceRecords(res.data || []);
    Swal.close();
    console.log(res);
    
} catch (err) {
    Swal.close();
    const message = err.response?.data?.message || err.message || 'Error al obtener Asistencias';
    Swal.fire({ icon: 'error', title: 'Error', text: message });
    
}
};

    fetchAttendanceRecords();
  }, [userData]);

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
                    {attendanceRecords.length === 0 ? (
                        <p>Aún no hay registros de asistencia disponibles.</p>
                    ) : (
                        <table className="attendance-table-User">
                            <thead>
                                <tr>
                                    <th>Materia</th>
                                    <th>Profesor</th>
                                    <th>Fecha</th>
                                    <th>Estado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceRecords.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.course?.name}</td> 
                                        <td>{item.professor?.fullname}</td>
                                        <td>{formatDate(item.sessionDate)}</td>
                                        <td>{item.myRecord?.status}</td>
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
