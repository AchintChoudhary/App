import { useState,createContext } from "react";

export  const AuthContext=createContext()




export const AuthContextProvider=({children})=>{
const[authUser,setAuthUser]=useState(JSON.parse(localStorage.getItem('chatApp')) || null  )  //get data from token in localStorage

return <AuthContext.Provider value={{authUser,setAuthUser}}>
    {children}
</AuthContext.Provider>



}





