import React from 'react'
import './StudentRow.css'

const StudentRow = ({ student, onAttendanceChange, onExcuseChange }) => {
  return (
    <tr className={`student-row ${student.attendance}`}>
      <td className="student-name cell-padding">{student.name}</td>

      <td className="attendance-cell cell-padding">
        <input
          type="radio"
          name={`attendance-${student.id}`}
          checked={student.attendance === 'presente'}
          onChange={() => onAttendanceChange(student.id, 'presente')}
          className="attendance-radio"
        />
      </td>

      <td className="attendance-cell cell-padding">
        <input
          type="radio"
          name={`attendance-${student.id}`}
          checked={student.attendance === 'ausente'}
          onChange={() => onAttendanceChange(student.id, 'ausente')}
          className="attendance-radio"
        />
      </td>

      <td className="attendance-cell cell-padding">
        <input
          type="radio"
          name={`attendance-${student.id}`}
          checked={student.attendance === 'excusa'}
          onChange={() => onAttendanceChange(student.id, 'excusa')}
          className="attendance-radio"
        />
      </td>

      <td className="excuse-cell cell-padding">
        {student.attendance === 'excusa' && (
          <input
            type="text"
            placeholder="Ingrese la razón..."
            value={student.excuse}
            onChange={(e) => onExcuseChange(student.id, e.target.value)}
            className="excuse-input"
          />
        )}
      </td>
    </tr>
  )
}

export default StudentRow
