import React, { useState, useContext } from 'react';
import './MainLogIn.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2'
import { UserDataContext } from '../../Page/Context/UserDataProvider';



export const MainLogIn = () => {
  const {updateUserData} = useContext(UserDataContext);
  const navigate = useNavigate();

      // Ventanas de validación 
    const incorrect = () =>{
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Verifica los datos',
          })
    }
    const correct = () => {
      let timerInterval;
      Swal.fire({
        icon: "success",
        title: 'Bienvenido',
        timer: 1000,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          const b = Swal.getPopup().querySelector('b');
          if (b) {
            timerInterval = setInterval(() => {
              b.textContent = Swal.getTimerLeft();
            }, 100);
          }
        },
        willClose: () => {
          clearInterval(timerInterval);
        }
      }).then((result) => {
        if (result.dismiss === Swal.DismissReason.timer) {
          // Lógica adicional después de que se cierre la alerta
        }
      });
    };

  const [inputs, setInputs] = useState({
    email: '',
    password: ''
  });
  const { email, password } = inputs;

  const onChange = (e) => {
    setInputs({...inputs, [e.target.name]: e.target.value})
  };

  const getData = async(e) =>{
    e.preventDefault()
    const Usuario = {
    email, password
  };
      
    try {
      // const response = await axios.post("https://backend-space-parking.onrender.com/api/users/rolUser", Usuario);
      const response = await axios.post("http://localhost:5000/api/userAdmin/loginAdmin", Usuario);
      let userRole = response.data.role
      if (userRole === 'Admin') {
            navigate(`/HomeAdmin/`);
      } else if (userRole === 'Professor') {
            navigate(`/HomeTeacher/`);
      } else{
          navigate(`/HomeStudent/`);
        }
      correct();
      updateUserData(response.data);
      // onSubmitLogin(typerole)
      console.log(userRole);
      console.log(response.data);
      
      
    } catch (error) {
      incorrect()
    }
    }


  return (
  <div className="MainLogin">
    {/* 🔹 Logo global, fuera del contenedor */}
    <div className="page-logo">
      <img src='https://res.cloudinary.com/miguelgo205/image/upload/v1763329833/ListUr/LogoT.png' alt="Logo" />
    </div>

    {/* 🔹 Contenedor principal del login */}
    <div className="login-container">
      <h1 className="page-title">SISTEMA REGISTRO DE ASISTENCIA</h1>

      <div className="login-box">
        <h2>Bienvenido</h2>
        <form onSubmit={(e) => getData(e)}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input onChange={(e) => onChange(e)} type="email" id="email" name="email" required />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input onChange={(e) => onChange(e)} type="password" id="password" name="password" required />
          </div>
          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  </div>
);

};

export default MainLogIn;