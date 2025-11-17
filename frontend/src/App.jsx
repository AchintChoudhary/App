import { Routes, Route } from 'react-router-dom';
import './App.css'
import LoginPage from './component/LoginPage'
import RegisterPage from './component/RegisterPage'
import { ToastContainer } from 'react-toastify';
import Home from './component/Home';
import { AuthContextProvider } from './context/AuthContext';
import { VerifyUser } from './utils/VerifyUser';

function App() {
  return (
    <AuthContextProvider>
      <Routes>
        
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route element={<VerifyUser/>} >

          <Route path='/' element={<Home/>}/>
        </Route>
      </Routes>
      <ToastContainer/>
    </AuthContextProvider>
  )
}

export default App;
