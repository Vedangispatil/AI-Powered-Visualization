import { AppBar, Box, Container, IconButton, Collapse, List, ListItem, ListItemText, Slide, Stack, Toolbar, Typography, ListItemAvatar, Avatar, ListItemIcon, ListItemButton, Button, MenuItem } from '@mui/material'
import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AccountBox, AccountCircle, Analytics, ArrowLeft, ArrowRight, Close, Insights, LockOpen, Logout, Menu, PasswordOutlined, Source } from '@mui/icons-material'
import NavBar from './NavBar';
import SplashCursor from '../SplashCursor';
import { LinearGradient } from 'react-text-gradients'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} timeout={400} />;
});

const navigation = {
    'Home': '/',
    "Products": '/products',
    "Our Partners": '/partners',
    'About Us': '/about',
    "Contact": '/contact'
}

function Home() {
    const location = useLocation()
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const isMenuOpen = Boolean(anchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleMenuClose = () => {
        setAnchorEl(null);
        //handleMobileMenuClose();
    };
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={isMenuOpen}
            onClose={handleMenuClose}
            onClick={handleMenuClose}
            PaperProps={{
                elevation: 0,
                sx: {
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                    mt: 1.5,
                    '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                    },
                    '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                    },
                },
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >


            <MenuItem onClick={() => navigate('/myprofile')}>
                <ListItemIcon>
                    <AccountBox fontSize="small" />
                </ListItemIcon>
                Profile
            </MenuItem>
            <MenuItem onClick={() => navigate('/changepassword')}>
                <ListItemIcon>
                    <LockOpen fontSize="small" />
                </ListItemIcon>
                Change Password
            </MenuItem>

            <MenuItem >
                <ListItemIcon>
                    <Logout fontSize="small" />
                </ListItemIcon>
                Logout
            </MenuItem>
        </Menu>
    );

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    // const [drawerOpen, setDrawerOpen] = useState(false)
    // //const [open, setOpen] = useState(false)

    // const handleClickOpen = () => {
    //     setOpen(true);
    // };



    // const handleNaviagtion = (path) => {
    //     setDrawerOpen(false)
    //     navigate(path)
    // }
    return (
        <>
        <SplashCursor />
            <Box sx={{ width: '100%', minHeight: '100vh', bgcolor: '#f7f8f8', display: 'flex', }}>
                <NavBar />
                
                <Container sx={{mt:10, width: '100%', display: 'flex', flexDirection: { xs: 'column', md: 'row' },justifyContent: {xs:'flex-start',md:'center'}, alignItems:'center'  }}>
                <Box sx={{ width: '100%', display:'flex', justifyContent:'center' ,flexDirection:'column', alignItems:'center' }}>
                        <Typography component={'h2'} variant='p'>Welcome to Visionary – Your Data, Your Insights</Typography>
                        <Typography m={2}  fontSize={'18px'} textAlign={'justify'}>Transform your data into meaningful insights with Visionary. Effortlessly create stunning visualizations, analyze trends, and make data-driven decisions with ease. Whether you're a beginner or a data expert, Visionary empowers you to explore and understand your data like never before.</Typography>
                        <Link to={'/graphs-creation'}>
                        <Button size='large' variant='contained' sx={{textTransform:'none', borderRadius:'20px'}} endIcon={<ArrowRight />}>Get Started</Button>
                        </Link>
                        
                    </Box>
                    <Box sx={{ width: '100%', height: 'auto',  }}>
                    
                        <img src='https://gifdb.com/images/high/2d-bar-graph-data-g9tuj8kubo7dwrx3.gif' alt='graph' style={{ width: '100%', maxHeight: '500px' }} />
                    </Box>
                    
                </Container>
            </Box>
        </>
    )
}

export default Home;