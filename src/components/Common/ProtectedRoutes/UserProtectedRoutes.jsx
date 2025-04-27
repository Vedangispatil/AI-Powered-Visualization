import React, { useContext } from "react";
import { UserContext } from "../Context/UserContext";
import { Navigate } from "react-router-dom";

const UserProtectedRoute = ({children}) =>{
    const userContext = useContext(UserContext)
    const accessToken = localStorage.getItem('token')
    const role = userContext.user?.role
    if(!userContext.user && accessToken){
        return null
    }
    
    return accessToken && role === 'user' ? children :<Navigate to={'/login'} />

}

export default UserProtectedRoute