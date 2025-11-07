import React from 'react'
import styles from "../RecoverPassword/RecoverPassword.css"
import { FormRecover } from '../../UI/FormRecover/FormRecover';
// import { Img } from '../../UI/Img/Img';
// import { Logo } from '../../UI/Logo/Logo'

export const RecoverPassword = () => {
  console.log(styles);
  return (
    <main id='mainRecover'>
      <div className="containerLogo">
        {/* <Logo classLogo="logoRecover"/> */}
      </div>
      <div className="contPassword">
      {/* <Img styleImg="ImgRecover" url="https://res.cloudinary.com/miguelgo205/image/upload/v1682230467/SpaceParking/Forgot_password-bro_wjmfb8.png"/> */}
      <FormRecover/>
      </div>

    </main>
  )
}
