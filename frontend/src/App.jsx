import './App.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
// import Home from './pages/home/home.jsx'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from './pages/login/Login.jsx'
import Forget_pass from './pages/login/forget_pass.jsx';
import { Toaster } from 'react-hot-toast';
import { useAuthContext } from './context/AuthContext.jsx';
import Dash from './dashboard/dash.jsx';
function App() {
  const {authUser}= useAuthContext()
  return (
    <>
    {/* <Home /> */}
    <Router>
      <div className="">
         <Routes>
          <Route exact path="/dashboard/*" element={authUser? <Dash />: <Navigate to = {"/"}/>}/>
          <Route exact path="/" element={<Login />}/>
          <Route exact path="/forget_password" element={<Forget_pass />}/>
          {/* <Route exact path="/signup" element={authUser ? <Navigate to="/" /> : <SignUp />}/> */}
         </Routes>
         <Toaster/>
      </div>
      </Router>
    </>
  )
}
export default App
