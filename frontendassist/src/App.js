
import {Route, Routes} from 'react-router-dom'

// import { Inicio } from './Components/Page/Inicio/Inicio';
import { MainLogIn } from './Components/Page/LogIn/MainLogIn';
import { RecoverPassword } from './Components/Page/RecoverPassword/RecoverPassword';
import { HomeAdmin } from './Components/Page/Admin/HomeAdmin/HomeAdmin';
import { HomeUser } from './Components/Page/User/HomeUser/HomeUser';
import { HomeTeacher } from './Components/Page/Teacher/HomeTeacher/HomeTeacher';

function App() {

  return (
    <div>
      <Routes>
        {/* <Route path="/" element={<Inicio/>}></Route> */}

        <Route path="/" element={<MainLogIn/>}></Route>
        <Route path="/HomeAdmin" element={<HomeAdmin/>}></Route>
        <Route path="/HomeUser" element={<HomeUser/>}></Route>
        <Route path="/HomeTeacher" element={<HomeTeacher/>}></Route>
        <Route path="/RecoverPassword" element={<RecoverPassword/>}></Route>

        <Route path="*" element="Not Found"></Route>
      </Routes>
    </div>
  )
}

export default App;