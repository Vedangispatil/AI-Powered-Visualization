import React, { useContext, useState } from 'react'
import { Box, Button, Grid2, CardContent, TextField, Typography, Divider, FormLabel, FormControl, Link, Card, } from '@mui/material'
import Iridescence from './Iridescence'
import { styled } from '@mui/material/styles';
import SvgIcon from '@mui/material/SvgIcon';
import api from '../api/apiInstance'
import AlertPop from './Common/AlertPop'
import { useGoogleLogin } from '@react-oauth/google'
import { LinearGradient } from 'react-text-gradients'
import { Insights } from '@mui/icons-material'
import { Navigate, useNavigate } from 'react-router-dom'
import { UserContext } from './Common/Context/UserContext'



const CustomInput = styled(TextField)(() => ({

    '& label.Mui-focused': {
        color: '#A0AAB4',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#B2BAC2',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: 'gray',
        },
        '&:hover fieldset': {
            borderColor: '#B2BAC2',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#6F7E8C',
        },
    },
}));

const gray = {
    50: 'hsl(220, 35%, 97%)',
    100: 'hsl(220, 30%, 94%)',
    200: 'hsl(220, 20%, 88%)',
    300: 'hsl(220, 20%, 80%)',
    400: 'hsl(220, 20%, 65%)',
    500: 'hsl(220, 20%, 42%)',
    600: 'hsl(220, 20%, 35%)',
    700: 'hsl(220, 20%, 25%)',
    800: 'hsl(220, 30%, 6%)',
    900: 'hsl(220, 35%, 3%)',
};

const ColorButton = styled(Button)(() => ({
    color: 'white',
    backgroundColor: gray[900],
    '&:hover': {
        backgroundColor: gray[700],
    },
}));



const RegisterCard = styled(Card)(({ theme }) => ({
    backgroundColor: ' rgba(255, 255, 255, 0.5)',
    backdropFilter: 'blur(15px) saturate(180%)',
    borderRadius: '20px',
    border: '1px solid rgba(209, 213, 219, 0.3)',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));



function Register() {
    const [fields, setFields] = useState({ name: '', email: '', password: '' })
    const [loadingButton, setLoadingButton] = useState(false)
    const [emailError, setEmailError] = React.useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
    const [passwordError, setPasswordError] = React.useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
    const [alertConfig, setAlertConfig] = useState({ open: false, type: 'error', message: '' })

    const userContext = useContext(UserContext)

    const navigate = useNavigate()

    const handleFieldChange = (e) => {
        setFields({ ...fields, [e.target.name]: e.target.value })
    }

    const googleLogin = useGoogleLogin({
        flow: 'auth-code',
        onSuccess: async (codeResponse) => {

            try {
                // localStorage.setItem('accessToken', 121313)
                const response = await api.post("/auth/google", { token: codeResponse.code, });
                const { token, user } = response.data
                localStorage.setItem('token', token)
                userContext.setUser(user)
                if (user.role === 'admin') {
                    navigate('/dashbord', { replace: true })
                }
                else {
                    navigate('/home', { replace: true })
                }



            }
            catch (error) {
                setAlertConfig({ open: true, type: 'error', message: 'Not able to login please try again after some time!' })
            }
        },
        onError: () => setAlertConfig({ open: true, type: 'error', message: 'Unable to login with google. Try again later!' }),
    });

    const handleSubmit = async (event) => {
        event.preventDefault()
        const validate = validateInputs()
        // console.log(validate)
        if (validate) {
            try {
                setLoadingButton(true)
                const response = await api.post('/auth/register', fields)
                // console.log(response)
                setAlertConfig({ open: true, type: 'success', message: response.data.message })



            }
            catch (error) {
                // console.log(error)
                setAlertConfig({ open: true, type: 'error', message: error.response.data.message })

            }
            finally {
                setLoadingButton(false)
            }

        }
    };

    const validateInputs = () => {
        const email = fields.email;
        const password = fields.password;

        let isValid = true;

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            setEmailError(true);
            setEmailErrorMessage('Please enter a valid email address.');
            isValid = false;
        } else {
            setEmailError(false);
            setEmailErrorMessage('');
        }

        if (!password || password.length < 6) {
            setPasswordError(true);
            setPasswordErrorMessage('Password must be at least 6 characters long.');
            isValid = false;
        } else {
            setPasswordError(false);
            setPasswordErrorMessage('');
        }

        return isValid;
    };


    if (localStorage.getItem('token')) {
        if (userContext?.user?.role === 'admin') {
            return <Navigate to='/dashboard' />

        }
        if (userContext?.user?.role === 'user') {
            return <Navigate to='/home' />
        }
        return
    }

    return (
        <>

            <AlertPop alertConfig={alertConfig} />
            <Grid2 container sx={{ position: 'relative', display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', height: '100vh', overflow: 'hidden' }}>
                <Grid2 size={12} sx={{ position: 'absolute', height: '100%' }}>
                    <Iridescence />
                </Grid2>
                <Grid2 size={{ xs: 12, md: 4 }} sx={{ position: 'absolute' }}  >
                    <RegisterCard sx={{ width: '100%', height: 'auto' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography component={'h2'} variant='p' justifyContent={'center'} display={'flex'} alignItems={'center'} sx={{ color: '#ff68f0 ', }}>
                                <Insights />
                                <LinearGradient gradient={['to left', '#17acff ,#ff68f0']}>
                                    Visionary
                                </LinearGradient>
                            </Typography>
                            <Typography
                                component="h4"
                                variant="p"
                                sx={{ width: '100%', mt: 2, mb: 2 }}
                            >
                                Register Here
                            </Typography>
                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                                noValidate
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    width: '100%',
                                    gap: 2,
                                }}
                            >

                                <FormControl>
                                    <FormLabel htmlFor="name" sx={{ mb: 1 }}>Name</FormLabel>
                                    <CustomInput

                                        name="name"
                                        placeholder="Enter your full name"
                                        type="text"
                                        id="name"
                                        size='small'
                                        required
                                        fullWidth
                                        variant="outlined"
                                        onChange={handleFieldChange}
                                        value={fields.name}
                                        

                                    />
                                </FormControl>

                                <FormControl>
                                    <FormLabel htmlFor="email" sx={{ mb: 1 }}>Email</FormLabel>
                                    <CustomInput
                                        error={emailError}
                                        helperText={emailErrorMessage}
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="your@email.com"
                                        size='small'
                                        required
                                        fullWidth
                                        variant="outlined"
                                        color={emailError ? 'error' : 'primary'}
                                        value={fields.email}
                                        onChange={handleFieldChange}
                                    />
                                </FormControl>
                                <FormControl>
                                    <FormLabel htmlFor="password" sx={{ mb: 1 }}>Password</FormLabel>
                                    <CustomInput
                                        error={passwordError}
                                        helperText={passwordErrorMessage}
                                        name="password"
                                        placeholder="••••••"
                                        type="password"
                                        id="password"
                                        size='small'
                                        required
                                        fullWidth
                                        variant="outlined"
                                        color={passwordError ? 'error' : 'primary'}
                                        value={fields.password}
                                        onChange={handleFieldChange}
                                    />
                                </FormControl>

                                <ColorButton
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    loading={loadingButton}

                                >
                                    Register
                                </ColorButton>

                            </Box>
                            <Divider sx={{ mt: 2, mb: 2 }}>OR</Divider>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    onClick={googleLogin}
                                    sx={{ textTransform: 'none', fontFamily: 'Inter, sans-serif', color: 'black', border: '1px solid gray', '&:hover': { backgroundColor: gray[100], border: '1px solid gray' }, '&:active': { border: '1px solid gray' } }}
                                    startIcon={<SvgIcon>
                                        <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                d="M15.68 8.18182C15.68 7.61455 15.6291 7.06909 15.5345 6.54545H8V9.64364H12.3055C12.1164 10.64 11.5491 11.4836 10.6982 12.0509V14.0655H13.2945C14.8073 12.6691 15.68 10.6182 15.68 8.18182Z"
                                                fill="#4285F4"
                                            />
                                            <path
                                                d="M8 16C10.16 16 11.9709 15.2873 13.2945 14.0655L10.6982 12.0509C9.98545 12.5309 9.07636 12.8218 8 12.8218C5.92 12.8218 4.15273 11.4182 3.52 9.52727H0.858182V11.5927C2.17455 14.2036 4.87273 16 8 16Z"
                                                fill="#34A853"
                                            />
                                            <path
                                                d="M3.52 9.52C3.36 9.04 3.26545 8.53091 3.26545 8C3.26545 7.46909 3.36 6.96 3.52 6.48V4.41455H0.858182C0.312727 5.49091 0 6.70545 0 8C0 9.29455 0.312727 10.5091 0.858182 11.5855L2.93091 9.97091L3.52 9.52Z"
                                                fill="#FBBC05"
                                            />
                                            <path
                                                d="M8 3.18545C9.17818 3.18545 10.2255 3.59273 11.0618 4.37818L13.3527 2.08727C11.9636 0.792727 10.16 0 8 0C4.87273 0 2.17455 1.79636 0.858182 4.41455L3.52 6.48C4.15273 4.58909 5.92 3.18545 8 3.18545Z"
                                                fill="#EA4335"
                                            />
                                        </svg>
                                    </SvgIcon>}

                                >
                                    Login with Google
                                </Button>

                                <Typography sx={{ textAlign: 'center', }}>
                                    Already have an account?{' '}
                                    <Link
                                        href="/login"
                                        variant="body2"
                                        sx={{ alignSelf: 'center', textDecoration: 'none', fontWeight: 'bold' }}
                                    >
                                        Login
                                    </Link>
                                </Typography>
                            </Box>

                        </CardContent>

                    </RegisterCard>
                </Grid2>
            </Grid2>
        </>
    )
}

export default Register