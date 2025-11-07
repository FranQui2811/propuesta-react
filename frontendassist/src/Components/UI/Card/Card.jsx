import React from 'react'
import './Card.css'

export const Card = ({ title, description, icon, actions }) => {
  return (
    <div className="admin-card">
      <div className="admin-card-head">
        {icon && <span className="admin-card-icon">{icon}</span>}
        <h3 className="admin-card-title">{title}</h3>
      </div>
      <p className="admin-card-desc">{description}</p>
      {actions && actions.length > 0 && (
        <div className="admin-card-actions">
          {actions.map((a, i) => (
            <button key={i} className="admin-card-action" onClick={a.onClick}>{a.label}</button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Card
