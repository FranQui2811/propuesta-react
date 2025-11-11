import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import './AttendanceHistory.css';

export const AttendanceHistory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  // Datos dummy de historial (ahora incluyen lista de estudiantes por registro)
  const attendanceRecords = [
    {
      id: 1,
      date: '2024-11-10',
      course: 'Matemáticas 10A',
      presentStudents: 22,
      absentStudents: 3,
      excused: 0,
      students: [
        { name: 'Juan Pérez', status: 'P' },
        { name: 'María Gómez', status: 'P' },
        { name: 'Luis Rodríguez', status: 'A' },
        { name: 'Ana López', status: 'P' },
        { name: 'Sofía Torres', status: 'J' },
      ],
    },
    {
      id: 2,
      date: '2024-11-09',
      course: 'Español 10B',
      presentStudents: 25,
      absentStudents: 2,
      excused: 1,
      students: [
        { name: 'Carlos Díaz', status: 'P' },
        { name: 'Lucía Martínez', status: 'P' },
        { name: 'Pedro Ruiz', status: 'A' },
        { name: 'Marta Gil', status: 'P' },
      ],
    },
    {
      id: 3,
      date: '2024-11-08',
      course: 'Inglés 10C',
      presentStudents: 20,
      absentStudents: 1,
      excused: 1,
      students: [
        { name: 'Diego Vega', status: 'P' },
        { name: 'Irene Salas', status: 'P' },
        { name: 'Pablo Navarro', status: 'P' },
        { name: 'Laura Molina', status: 'A' },
      ],
    },
    {
      id: 4,
      date: '2024-11-07',
      course: 'Matemáticas 10A',
      presentStudents: 23,
      absentStudents: 2,
      excused: 0,
      students: [
        { name: 'Juan Pérez', status: 'P' },
        { name: 'María Gómez', status: 'P' },
        { name: 'Luis Rodríguez', status: 'P' },
        { name: 'Ana López', status: 'A' },
      ],
    },
    {
      id: 5,
      date: '2024-11-06',
      course: 'Ciencias 11A',
      presentStudents: 28,
      absentStudents: 2,
      excused: 0,
      students: [
        { name: 'Carla Ruiz', status: 'P' },
        { name: 'Óscar Peña', status: 'P' },
        { name: 'Sandra Ríos', status: 'P' },
      ],
    },
  ];

  const filteredRecords = attendanceRecords.filter(
    (record) =>
      record.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.date.includes(searchTerm)
  );

  // Exportar solo el registro de una clase (cliente) — genera XLSX con lista de estudiantes
  const handleExportRecord = (record) => {
    // Estructura de datos para la hoja principal
    const metaData = [
      ['Fecha', record.date],
      ['Curso', record.course],
      ['Presentes', record.presentStudents],
      ['Ausentes', record.absentStudents],
      ['Justificados', record.excused],
      [],
    ];
    // Encabezado y filas de estudiantes
    const studentHeader = ['Nombre Estudiante', 'Estado'];
    const studentsRows = (record.students || []).map((s) => [s.name, s.status]);
    // Unimos todo en una sola hoja
    const wsData = [...metaData, studentHeader, ...studentsRows];
    // Creamos la hoja y el libro
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Asistencia');
    // Generamos el archivo xlsx
    const fileName = `historial_${record.course.replace(/\s+/g, '_')}_${record.date}.xlsx`;
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
              {filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.date}</td>
                  <td>{record.course}</td>
                  <td className="present-count">{record.presentStudents}</td>
                  <td className="absent-count">{record.absentStudents}</td>
                  <td className="excused-count">{record.excused}</td>
                  <td className="action-buttons">
                    <button
                      onClick={() => alert(`Ver detalles de ${record.course} - ${record.date}`)}
                      className="action-btn"
                      title="Ver"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => alert(`Editar ${record.course} - ${record.date}`)}
                      className="action-btn"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleExportRecord(record)}
                      className="action-btn"
                      title="Exportar"
                    >
                      📥
                    </button>
                  </td>
                </tr>
              ))}
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
