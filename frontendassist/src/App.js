import {Route, Routes} from 'react-router-dom'

// import { Inicio } from './Components/Page/Inicio/Inicio';
import { MainLogIn } from './Components/Page/LogIn/MainLogIn';
import { RecoverPassword } from './Components/Page/RecoverPassword/RecoverPassword';
import { HomeAdmin } from './Components/Page/Admin/HomeAdmin/HomeAdmin';
import { HomeUser } from './Components/Page/User/HomeUser/HomeUser';
import { MyCourses } from './Components/Page/User/MyCourses/MyCourses';
import { AttendanceHistoryUser } from './Components/Page/User/AttendanceHistoryUser/AttendanceHistoryUser';
import { HomeTeacher } from './Components/Page/Teacher/HomeTeacher/HomeTeacher';
import { RegisterAssist } from './Components/Page/Teacher/RegisterAssist/RegisterAssist';
import { ManageCourses } from './Components/Page/Teacher/ManageCourses/ManageCourses';
import { TakeAttendance } from './Components/Page/Teacher/TakeAttendance/TakeAttendance';
import { AttendanceHistory } from './Components/Page/Teacher/AttendanceHistory/AttendanceHistory';
import { StudentsCourse } from './Components/Page/Teacher/ManageCourses/StudentsCourse/StudentsCourse';
function App() {

  return (
    <div>
      <Routes>
        {/* <Route path="/" element={<Inicio/>}></Route> */}

        {/* <Route path="/RegisterAssist" element={<RegisterAssist/>}></Route> */}
        <Route path="/" element={<MainLogIn/>}></Route>
        <Route path="/HomeAdmin" element={<HomeAdmin/>}></Route>
        <Route path="/HomeUser" element={<HomeUser/>}></Route>
        <Route path="/User/MyCourses" element={<MyCourses />} />
        <Route path="/User/AttendanceHistoryUser" element={<AttendanceHistoryUser/>} />
        <Route path="/HomeTeacher" element={<HomeTeacher/>}></Route>
        <Route path="/Teacher/Courses" element={<ManageCourses/>}></Route>
        <Route path="/Teacher/Courses/StudentsCourse" element={<StudentsCourse/>}></Route>
        <Route path="/Teacher/Attendance" element={<TakeAttendance/>}></Route>
        <Route path="/Teacher/History" element={<AttendanceHistory/>}></Route>
        <Route path="/Teacher/Register/Assist" element={<RegisterAssist/>}></Route>
        <Route path="/RecoverPassword" element={<RecoverPassword/>}></Route>
        <Route path="*" element="Not Found"></Route>
      </Routes>
    </div>
  )
}

export default App;