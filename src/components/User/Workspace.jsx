import { Box, Card, CardActionArea, CardContent, CardMedia, Grid2, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import NavBar from './NavBar'
import { UserContext } from '../Common/Context/UserContext'
import api from '../../api/axiosInstance'
import AlertPop from '../Common/AlertPop'
import Loader from '../Common/Loader'
import { useNavigate } from 'react-router-dom'

function Workspace() {
    const userContext = useContext(UserContext)
    const [graphs, setGraphs] = useState([])
    const [openLoader, setOpenLoader] = useState(false)
    const [alertConfig, setAlertConfig] = useState({ open: false, type: 'error', message: '' })
    const navigate = useNavigate()

    useEffect(() => {
        const fetchGraphs = async () => {
            try {
                setOpenLoader(true)
                const response = await api.get('/graph/user/' + userContext?.user?.id, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
                //console.log(response)
                setGraphs(response.data)

            }
            catch (error) {
                setAlertConfig({ open: true, type: 'error', message: error.response.data.message })

            }
            finally {
                setOpenLoader(false)
            }


        }
        fetchGraphs()
    }, [])
    return (
        <Box sx={{ display: 'flex', }}>
            <NavBar />
            <Box component='main' sx={{ flexGrow: 1, p: 3, mt: 8, }}>
                <Typography textAlign={'center'} mb={2} component='h2' variant='p'>Workspace</Typography>
                <Grid2 container spacing={3}>
                    {
                        graphs.map(graphData=>(
                            <Grid2 key={graphData._id} size={{xs:12,md:3}}>
                        <Card >
                            <CardActionArea sx={{ maxWidth: '100%',height:'250px' }} onClick={()=> navigate('/workspace/graph/'+graphData._id)}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    sx={{objectFit:'contain'}}
                                    image={import.meta.env.VITE_BACKEND_SERVER+graphData.graphPreview}
                                    alt={graphData.graphConfig.title}
                                />
                                <CardContent >
                                    <Typography gutterBottom variant="h6" component="div">
                                        {graphData.graphConfig.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                        Created At : {new Date(graphData.createdAt).toLocaleString()}
                                       
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid2>
                        ))
                    }
                    
                </Grid2>
            </Box>
            <AlertPop alertConfig={alertConfig} />
            <Loader openLoader={openLoader} />
        </Box>
    )
}

export default Workspace