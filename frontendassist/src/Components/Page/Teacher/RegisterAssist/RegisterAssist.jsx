import React, { useState } from 'react'
import './RegisterAssist.css'
import StudentRow from '../../../UI/TableRow/StudentRow'
import { useNavigate } from 'react-router-dom'

export const RegisterAssist = () => {
  // DATOS QUEMADOS - REEMPLAZAR CON ENDPOINT
  // const response = await fetch('API_URL/attendance/get-students'); // GET para obtener estudiantes
  // const students = response.json();
  
  const [students, setStudents] = useState([
    { id: 1, name: 'Juan Pérez', attendance: 'presente', excuse: '' },
    { id: 2, name: 'María García', attendance: 'presente', excuse: '' },
    { id: 3, name: 'Carlos López', attendance: 'ausente', excuse: '' },
    { id: 4, name: 'Ana Martínez', attendance: 'excusa', excuse: 'Cita médica' },
    { id: 5, name: 'Pedro Rodríguez', attendance: 'presente', excuse: '' },
    { id: 6, name: 'Laura Fernández', attendance: 'ausente', excuse: '' },
    { id: 7, name: 'Miguel Sánchez', attendance: 'presente', excuse: '' },
    { id: 8, name: 'Sofia Díaz', attendance: 'excusa', excuse: 'Problema familiar' },
  ])

  // DATOS QUEMADOS DE LA CLASE - REEMPLAZAR CON ENDPOINT
  // const response = await fetch('API_URL/classes/get-class/:classId'); // GET para obtener datos de la clase
  // const classData = response.json();
  
  const classData = {
    subject: 'Matemáticas',
    teacher: 'Carlos Rodríguez',
    date: new Date().toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const navigate = useNavigate()

  const goHome = () => navigate('/HomeTeacher')

  const handleAttendanceChange = (id, status) => {
    setStudents(students.map(student =>
      student.id === id 
        ? { ...student, attendance: status, excuse: status !== 'excusa' ? '' : student.excuse }
        : student
    ))
  }

  const handleExcuseChange = (id, excuse) => {
    setStudents(students.map(student =>
      student.id === id 
        ? { ...student, excuse }
        : student
    ))
  }

  const handleSubmit = () => {
    // ENDPOINT PARA GUARDAR ASISTENCIA
    // const payload = {
    //   classId: classData.id,
    //   teacherId: classData.teacherId,
    //   date: classData.date,
    //   attendance: students.map(s => ({
    //     studentId: s.id,
    //     status: s.attendance,
    //     excuse: s.excuse || null
    //   }))
    // }
    // const response = await fetch('API_URL/attendance/save', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // });
    
    console.log('Asistencia registrada:', students)
  }

  return (
    <div className="register-assist">
      <div className="assist-header card">
        <button className="home-btn" onClick={goHome} title="Volver al inicio" aria-label="Volver al inicio">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
            <path d="M3 10.5L12 4l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1V10.5z" fill="currentColor" />
          </svg>
        </button>
        <div className="header-info">
          <h1>Toma de Asistencia clase de {classData.subject}</h1>
          <p className="muted-text">Profesor: {classData.teacher}</p>
          <p className="muted-text date">{classData.date}</p>
        </div>
      </div>

      <div className="assist-container">
        <div className="students-list">
          <table className="students-table">
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Presente</th>
                <th>Ausente</th>
                <th>Excusa</th>
                <th>Razón</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <StudentRow
                  key={student.id}
                  student={student}
                  onAttendanceChange={handleAttendanceChange}
                  onExcuseChange={handleExcuseChange}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="assist-actions">
        <button className="btn-submit" onClick={handleSubmit}>
          Guardar Asistencia
        </button>
      </div>
    </div>
  )
}
