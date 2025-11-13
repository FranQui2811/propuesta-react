import React, { useState } from 'react';
import './MainLogIn.css';
import logo from '../../../images/logo.png'


export const MainLogIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Login attempt with:', formData);
  };

  return (
  <>
    {/* 🔹 Logo global, fuera del contenedor */}
    <div className="page-logo">
      <img src={logo} alt="Logo" />
    </div>

    {/* 🔹 Contenedor principal del login */}
    <div className="login-container">
      <h1 className="page-title">SISTEMA REGISTRO DE ASISTENCIA</h1>

      <div className="login-box">
        <h2>Bienvenido</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input type="email" id="email" name="email" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" name="password" />
          </div>
          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  </>
);

};

export default MainLogIn;