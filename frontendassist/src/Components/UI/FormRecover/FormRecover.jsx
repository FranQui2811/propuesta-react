import React from 'react'
import { FormGroup } from '../FormGroup/FormGroup'
// import { useNavigate } from 'react-router-dom';
// import Swal from 'sweetalert2';
// import axios from 'axios';
import { useState } from 'react';


export const FormRecover = () => {

  // Alerta de confirmacion
  // const accountCreate = () =>{
  //   Swal.fire({
  //     icon: 'success',
  //     title: 'Se ha enviado la nueva contraseña a tu correo',
  //     // text: 'Datos incorrectos',
  //     // footer: '<a href="">Why do I have this issue?</a>'
  //   })
  // }

// const navigate = useNavigate();


const [inputs, setInputs] = useState({
  email: "", 
});

// const [mensaje, setMensaje] = useState();
// const [loading, setLoading] = useState(false);

// const { email } = inputs;

const onChange = (e) => {
  setInputs({...inputs, [e.target.name]: e.target.value})
};

const onSubmit = async(e) => {
  e.preventDefault()
  // const Usuario = {
  //   email
  // };
  // setLoading(true)
  // try{
  //   const response = await axios.patch("https://backend-space-parking.onrender.com/api/users/recoverPassword", Usuario)
  //   console.log(response.data);
  //   accountCreate()
  //   navigate('/')

  // }catch{
  //   Swal.fire({
  //     icon: 'error',
  //     title: 'No se encuentra la cuenta',
  //     // text: 'Datos incorrectos',
  //     // footer: '<a href="">Why do I have this issue?</a>'
  //   })
  // }
}

  return (
    <form onSubmit={(e) => onSubmit(e)} id='formRecover' action="">
        <h2>¿Olvidaste Tu Contraseña?</h2>
        <p>No te preocupes, digita tu correo y haremos lo posible por recuperarla</p>
        <div className="contGroup">
            <FormGroup onChange={(e) => onChange(e)} nameInput="email"  contLabel="Correo" place="Correo" inputType="email"/>
        </div>
        <button id='btnRecover' type='submit' >Enviar</button>
    </form>
  )
}

