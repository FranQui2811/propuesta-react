import React from 'react'

export const ModuleButton = ({ id, title, icon, active, onClick }) => {
  return (
    <button
      type="button"
      className={`module-button ${active ? 'active' : ''}`}
      onClick={() => onClick(id)}
    >
      <span className="module-icon">{icon}</span>
      {title}
    </button>
  )
}

export default ModuleButton
