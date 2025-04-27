import React, { createContext, useContext, useEffect, useState} from "react";
import api from "../../../api/axiosInstance";
import { Navigate, useNavigate } from "react-router-dom";
import AlertPop from "../AlertPop";
import Loader from "../Loader";


export const UserContext = createContext()

export const UserProvider = ({children}) =>{
    const [user, setUser] = useState(null)
    const [alertConfig, setAlertConfig] = useState({ open: false, type: 'error', message: '' })
    const [openLoader, setOpenLoader] = useState(false)
    const navigate = useNavigate()

    const accessToken = localStorage.getItem('token')
    

    useEffect(()=>{
        const userProfile =  async() =>{
            try{
                setOpenLoader(true)
                const response = await api.get('/user/profile',{headers:{
                    'Authorization':`Bearer ${localStorage.getItem('token')}`
                }})
                setUser(response.data)
                //console.log(response)
            }
            catch(error){
                // console.log(error.response.data.message)
                setAlertConfig({ open: true, type: 'error', message: error.response.data.message })
                localStorage.removeItem('token')
            }   
            finally{
                setOpenLoader(false)
            }            
        }
        if(accessToken){
            userProfile()
        }        

    },[accessToken])




    return(
        <UserContext.Provider value={{user, setUser}}>
            <AlertPop alertConfig={alertConfig} />
            {children}
            <Loader openLoader={openLoader} />
        </UserContext.Provider>
    )
}

