import React, { useState, useContext} from 'react'
import './RegisterAssist.css'
import StudentRow from '../../../UI/TableRow/StudentRow'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import { UserDataContext } from '../../Context/UserDataProvider';


export const RegisterAssist = () => {
  const location = useLocation();
  const { course } = location.state || {};
  const { userData } = useContext(UserDataContext);
  const date = new Date().toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  // const isoDate = new Date(classData.date).toISOString();

  const correct = () => {
    Swal.fire({
      icon: 'success',
      title: 'Asistencia guardada',
      text: 'La asistencia ha sido registrada correctamente.',
      confirmButtonText: 'Aceptar'
    });
  }

  const incorrect = () => {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Hubo un problema al registrar la asistencia.',
      confirmButtonText: 'Aceptar'
    });
  }

  const [students, setStudents] = useState(course?.students?.map(s => ({
    id: s._id,
    name: s.fullname,
    attendance: 'presente',
    excuse: ''
    })) || []);

 const classData = {
    subject: course?.name || 'Nombre de la asignatura',
    teacher: course?.professor?.fullname || 'Profesor',
    date: new Date().toISOString()
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

  const handleSubmit = async () => {
    // ENDPOINT PARA GUARDAR ASISTENCIA
    const payload = {
      courseId: course._id,
      // teacherId: course.professor._id,
      sessionDate: classData.date,
      attendanceRecords: students.map(s => ({
        student: s.id,
        status: s.attendance,
        excuseReason: s.excuse || null
      }))
    }
    // const response = axios.post('API_URL/attendance/save', payload);
try {
  await axios.post("http://localhost:5000/api/attendance",payload,{
    headers: {Authorization: `Bearer ${userData?.token}`},
  });
  correct()
  console.log(payload);


} catch (error) {
  console.error("ERROR:", error);
  incorrect()
}
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
          <p className="muted-text date">{date}</p>
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
