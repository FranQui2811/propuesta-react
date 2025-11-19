import {React} from 'react'
import { useNavigate } from 'react-router-dom'

import { useLocation} from 'react-router-dom'
import './StudentsCourse.css'


export const StudentsCourse = () => {
    const location = useLocation();
    const { course } = location.state || {};
    const navigate = useNavigate();
    
    const students = course?.students?.map(s => ({
        id: s._id,
        name: s.fullname,
        email: s.email
    }))


  return (
<div className="student-list-page">
      <div className="list-container card">
        
        {/* Título de la Materia */}
        <div className="list-header">
            <button onClick={() => navigate('/Teacher/Courses')}className="back-button-students">← Volver</button>
          <h1>Lista de Estudiantes de {course?.name}</h1>
        </div>

        {/* Lista de Estudiantes */}
        <ul className="students-ul">
            <li className="student-item-header">
                <div className='header-info-student'>
                    <span>Nombre</span>
                    <span>Email</span>
                </div>
            </li>
          {students.map(student => (
            <li key={student.id} className="student-item">
              <div className="student-info">
                <span className="student-name">{student.name}</span>
                <span className="student-email">{student.email}</span>
              </div>
            </li>
          ))}
        </ul>
        
      </div>
    </div>
  )
}
