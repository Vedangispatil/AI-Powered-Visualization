import { Avatar, Box, Button, FormControl, Grid2, IconButton, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react';
import { default as UserNavBar } from '../User/NavBar'
import { default as AdminNavBar } from '../Admin/NavBar';
import { UserContext } from './Context/UserContext';
import AlertPop from './AlertPop';
import api from '../../api/apiInstance';
import { LockReset, Visibility, VisibilityOff } from '@mui/icons-material';

function ChangePassword() {
    const userContext = useContext(UserContext)
    const [password, setPassword] = useState({ newPassword: '', confirmNewPassword: '' })
    const [passwordError, setPasswordError] = useState({ error: false, message: '' })
    const [confirmPasswordError, setConfirmPasswordError] = useState({ error: false, message: '' })
    const [visible, setVisible] = useState({ newPassword: false, confirmNewPassword: false })
    const [alertConfig, setAlertConfig] = useState({ open: false, type: 'error', message: '' })
    const [loading, setLoading] = useState(false)
    const { user } = userContext

    const validateInputs = () => {

        let isValid = true;

        if ((!password.newPassword || password.newPassword.length < 6) || (!password.confirmNewPassword || password.confirmNewPassword.length < 6)) {
            setPasswordError({ error: true, message: 'Password must be at least 6 characters long.' });
            setConfirmPasswordError({ error: true, message: 'Password must be at least 6 characters long.' })
            isValid = false;
        } else {
            setPasswordError({ error: false, message: '' });
            setConfirmPasswordError({ error: false, message: '' })
        }

        return isValid;
    };

    const handleFieldChange = (e) => {

        const { name, value } = e.target
        if (name === 'confirmNewPassword' && value !== password.newPassword) {
            setConfirmPasswordError({ error: true, message: 'New Password and Confirm New Passwor must match!' })
        }
        else if (name === 'newPassword' && password.confirmNewPassword !== '' && value !== password.confirmNewPassword) {
            setConfirmPasswordError({ error: true, message: 'New Password and Confirm New Passwor must match!' })
        }
        else {
            setPasswordError({ error: false, message: '' })
            setConfirmPasswordError({ error: false, message: '' })
        }


        setPassword({ ...password, [name]: value })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        const validatePassword = validateInputs()
        if (validatePassword) {
            try {
                setLoading(true)
                const response = await api.put('/user/update-password/' + user.id, password, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
                setAlertConfig({ open: true, type: 'success', message: response.data.message })
                setPassword({ newPassword: '', confirmNewPassword: '' })

            }
            catch (error) {
                console.log(error)
                setAlertConfig({ open: true, type: 'error', message: error.response.data.message })

            }
            finally {
                setLoading(false)
            }

        }

    }
    return (
        <>
            <AlertPop alertConfig={alertConfig} />
            <Box sx={{ display: 'flex', }}>
                {user === null ? null : user.role === 'admin' ? <AdminNavBar /> : <UserNavBar />}
                <Box component='main' sx={{ flexGrow: 1, p: 3, mt: 8, }}>
                    <Grid2 container spacing={3} sx={{ mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                            <Paper>
                                <Box component={'form'} onSubmit={handleSubmit} sx={{ display: 'flex', gap: 3, flexDirection: 'column', p: 4, justifyContent: 'center', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                        <LockReset color='secondary' sx={{ width: 62, height: 62, }} />
                                        <Typography>Change your password</Typography>
                                    </Box>
                                    <TextField
                                        label='New Password'
                                        size='small'
                                        type={visible.newPassword ? 'text' : 'password'}
                                        name='newPassword'
                                        required
                                        fullWidth
                                        value={password.newPassword}
                                        onChange={handleFieldChange}
                                        error={passwordError.error}
                                        helperText={passwordError.message}
                                        slotProps={{
                                            input: {
                                                endAdornment: <IconButton onClick={() => setVisible({ ...visible, newPassword: !visible.newPassword })}>{visible.newPassword ? <VisibilityOff /> : <Visibility />}</IconButton>,
                                            },
                                        }}

                                    />
                                    <TextField
                                        label='Confirm New Password'
                                        size='small'
                                        type={visible.confirmNewPassword ? 'text' : 'password'}
                                        name='confirmNewPassword'
                                        required
                                        fullWidth
                                        value={password.confirmNewPassword}
                                        onChange={handleFieldChange}
                                        error={confirmPasswordError.error}
                                        helperText={confirmPasswordError.message}
                                        slotProps={{
                                            input: {
                                                endAdornment: <IconButton onClick={() => setVisible({ ...visible, confirmNewPassword: !visible.confirmNewPassword })}>{visible.confirmNewPassword ? <VisibilityOff /> : <Visibility />}</IconButton>,
                                            },
                                        }}

                                    />

                                    <Button type='submit' color='success' variant='contained' loading={loading} loadingPosition='end'>Submit</Button>

                                </Box>

                            </Paper>
                        </Grid2>

                    </Grid2>
                </Box>
            </Box>

        </>
    )
}

export default ChangePassword