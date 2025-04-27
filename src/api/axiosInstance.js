import axios from 'axios'

const instance = () =>{
    
}
const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_SERVER,
    
})

export default api