import React, { useState,useEffect, useContext } from 'react';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import './AttendanceHistory.css';
import Swal from 'sweetalert2';
import axios from 'axios';
import { UserDataContext } from '../../Context/UserDataProvider';

const getStudentCounts = (records = []) => {
  let present = 0;
  let absent = 0;
  let excused = 0;

  records.forEach(r => {
    switch (r.status) {
      case 'presente':
          present++;
          break;
      case 'ausente':
          absent++;
          break;
      case 'excusa':
          excused++;
          break;
      default:
          break;
    }
});

return { present, absent, excused };
}

const formatDate = (isoString) => {
  if (!isoString) return '';
  return isoString.split('T')[0];
};

export const AttendanceHistory = () => {
  const navigate = useNavigate();
  const { userData } = useContext(UserDataContext);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');


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
    } catch (err) {
      Swal.close();
      const message = err.response?.data?.message || err.message || 'Error al obtener Asistencias';
      Swal.fire({ icon: 'error', title: 'Error', text: message });
      
    }
  };

    fetchAttendanceRecords();
  }, [userData]);
  

const filteredRecords = attendanceRecords.filter(
    (record) =>{
      const courseName = record.course?.name || '';
      const sessionDate = record.sessionDate ? formatDate(record.sessionDate) : '';

      return (
      courseName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      sessionDate.includes(searchTerm)
      );
    }
);

  // Exportar solo el registro de una clase (cliente) — genera XLSX con lista de estudiantes
  const handleExportRecord = (record) => {
    const courseName = record.course?.name || 'Curso Desconocido';
    const dateFormatted = formatDate(record.sessionDate);
    const { present, absent, excused } = getStudentCounts(record.records);
    // Estructura de datos para la hoja principal
    const metaData = [
      ['Fecha', dateFormatted],
      ['Curso', courseName],
      ['Presentes', present],
      ['Ausentes',absent],
      ['Justificados', excused],
      [],
    ];
    // Encabezado y filas de estudiantes
    const studentHeader = ['Nombre Estudiante', 'Estado', 'Razón de Excusa'];
    const studentsRows = (record.records || []).map((r) => [
      r.student?.fullname,
      r.status,
      r.excuseReason || ''
    ]);

    // Se une todo en una sola hoja
    const wsData = [...metaData, studentHeader, ...studentsRows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Asistencia');
    // Generamos el archivo xlsx
    const fileName = `historial_${courseName.replace(/\s+/g, '_')}_${dateFormatted}.xlsx`;
    XLSX.writeFile(wb, fileName);
    alert(`Archivo descargado: ${fileName}`);
  };

  return (
    <div className="attendance-history-container">
      <div className="attendance-history-wrapper">
        <button
          onClick={() => navigate(-1)}
          className="back-button"
        >
          ← Volver
        </button>

        <div className="history-header">
          <h1>Historial de Asistencias</h1>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar por curso o fecha..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="table-container">
          <table className="attendance-table">
            <thead className="table-header">
              <tr>
                <th>Fecha</th>
                <th>Curso</th>
                <th>Presentes</th>
                <th>Ausentes</th>
                <th>Justificados</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredRecords.map((record) => {
                const { present, absent, excused } = getStudentCounts(record.records);
                return (
                <tr key={record.id}>
                  <td>{formatDate(record.sessionDate)}</td>
                  <td>{record.course?.name}</td>
                  <td className="present-count">{present}</td>
                  <td className="absent-count">{absent}</td>
                  <td className="excused-count">{excused}</td>
                  <td className="action-buttons">
                    <button
                      onClick={() => handleExportRecord(record)}
                      className="action-btn"
                      title="Exportar"
                    >
                      📥
                    </button>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="no-records-message">
            No se encontraron registros de asistencia.
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceHistory;
