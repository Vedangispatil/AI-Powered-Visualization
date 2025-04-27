import { Avatar, Box, Button, FormControl, Grid2, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react';
import {default as UserNavBar}  from '../User/NavBar'
import {default as AdminNavBar} from '../Admin/NavBar';
import { UserContext } from './Context/UserContext';
import AlertPop from './AlertPop';
import api from '../../api/apiInstance';

function Profile() {
    const userContext = useContext(UserContext)
    const [userData, setUserData] = useState({name:'', email:'', joinDate:''})
    const [alertConfig, setAlertConfig] = useState({ open: false, type: 'error', message: '' })
    const [loading, setLoading] = useState(false)
    const {user, setUser} = userContext

    useEffect(()=>{
        //console.log(user)
        user!==null && setUserData(user)
    },[user])

    const handleFieldChange =(e)=>{
        const {name, value} = e.target
        setUserData({...userData, [name]:value})
    }
    const handleSubmit = async(e)=>{
        e.preventDefault()
        try{
            setLoading(true)
            const response = await api.put('/user/update/' + user.id, userData, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
            setAlertConfig({ open: true, type: 'success', message: response.data.message })
            setUser(userData)

        }
        catch(error){
            console.log(error)
            setAlertConfig({ open: true, type: 'error', message: error.response.data.message })

        }
        finally{
            setLoading(false)
        }
    }
    return (
        <>
        <AlertPop alertConfig={alertConfig} />
            <Box sx={{ display: 'flex', }}>
                {user===null?null:user.role==='admin'?<AdminNavBar />:<UserNavBar /> }
                <Box component='main' sx={{ flexGrow: 1, p: 3, mt: 8, }}>
                    <Grid2 container spacing={3} sx={{ mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Paper>
                                <Box component={'form'} onSubmit={handleSubmit} sx={{ display: 'flex', gap: 3, flexDirection: 'column', p: 4, justifyContent: 'center', alignItems: 'center' }}>
                                    <Avatar sx={{ width: 62, height: 62, bgcolor: '#ff0e99', fontSize: '42px' }} >{userData.name[0]}</Avatar>
                                    <TextField
                                        label='Name'
                                        size='small'
                                        type='text'
                                        name='name'
                                        required
                                        fullWidth
                                        value={userData?.name}
                                        onChange={handleFieldChange}
                                        slotProps={{ inputLabel: { shrink: true } }}

                                    />
                                    <TextField
                                        label='Email'
                                        size='small'
                                        type='text'
                                        name='email'
                                        required
                                        fullWidth
                                        value={userData?.email}
                                        onChange={handleFieldChange}
                                        slotProps={{ inputLabel: { shrink: true } }}

                                    />
                                    {/* <Stack direction={{ xs: "column", md: "row" }} width={'100%'} spacing={2}>
                                        <TextField
                                            label='Date of Birth'
                                            size='small'
                                            type='date'
                                            name='date'
                                            required
                                            fullWidth
                                            slotProps={{ inputLabel: { shrink: true } }}


                                        />
                                        <FormControl fullWidth variant="outlined">
                                            <InputLabel size='small'>Gender</InputLabel>
                                            <Select

                                                label="Gender"
                                                name="gender"
                                                size="small"
                                            // value={editFormData.role}
                                            // onChange={handleInputChange}
                                            >
                                                <MenuItem value="male">Male</MenuItem>
                                                <MenuItem value="female">Female</MenuItem>
                                            </Select>
                                        </FormControl>

                                    </Stack> */}
                                    <TextField
                                        label='Join Date'
                                        size='small'
                                        type='date'
                                        name='date'
                                        required
                                        fullWidth
                                        slotProps={{ inputLabel: { shrink: true } }}
                                        value={userData?.joinDate}
                                        disabled


                                    />
                                    <Button type='submit' color='info' variant='contained' loading={loading} loadingPosition='end'>Update Profile</Button>

                                </Box>

                            </Paper>
                        </Grid2>

                    </Grid2>
                </Box>
            </Box>

        </>
    )
}

export default Profile