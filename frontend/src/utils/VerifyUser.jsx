import {useContext} from 'react';
import {Outlet,Navigate} from 'react-router-dom'

import { AuthContext } from '../context/AuthContext';

//if user are loggedIn then it will access HOME Page. either they will go on login page
export const VerifyUser=()=>{
    const {authUser}=useContext(AuthContext)
    return authUser? <Outlet/> : <Navigate to={'/login'}/>
}


