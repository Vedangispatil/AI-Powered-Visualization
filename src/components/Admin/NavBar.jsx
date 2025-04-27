import React, { useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import MailIcon from '@mui/icons-material/Mail';
import { LinearGradient } from 'react-text-gradients';
import { AccountBox, BarChart, Dashboard, Dataset, Insights, LockOpen, Logout, MenuOpen, People } from '@mui/icons-material';
import { Avatar, IconButton, Menu, MenuItem, Stack, useTheme } from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { UserContext } from '../Common/Context/UserContext';



const drawerWidth = 240;
const menuItems = [
  { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
  { text: "Users", icon: <People />, path: "/users" },
  { text: "Datasets", icon: <Dataset />, path: "/datasets" },
  { text: "Graphs", icon: <BarChart />, path: "/graphs" },

]

export default function NavBar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDrawer, setOpenDrawer] = useState(false);
  const userContext = useContext(UserContext)
  const pathname = useLocation().pathname
  const theme = useTheme()
  const navigate = useNavigate()

  const open = Boolean(anchorEl);

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }


  const handleDrawerOpen = () => {
    setOpenDrawer(!openDrawer);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', }}>
        <Toolbar>
          <IconButton

            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ display: { xs: 'flex', md: 'none' } }}
          >
            {openDrawer ? <MenuOpen /> : <MenuIcon />}
          </IconButton>
          <Link to='/dashboard' style={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography className='logo' variant="h5" component="p" display={'flex'} alignItems={'center'} sx={{ color: '#ff68f0 ', flexGrow: 1, fontWeight: 'bolder' }}>
              <Insights />
              <LinearGradient gradient={['to left', '#17acff ,#ff68f0']}>
                Visionary
              </LinearGradient>
            </Typography>
          </Link>
          <Box>

            <IconButton
              onClick={handleClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: '#ff0e99' }}>{userContext?.user?.name[0]}</Avatar>
            </IconButton>

          </Box>

        </Toolbar>

      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
          display: { xs: 'none', md: 'flex' }
        }}

      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>


          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={pathname === item.path}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: theme.palette.primary.main + "20",
                      color: theme.palette.primary.main,
                      "& .MuiListItemIcon-root": {
                        color: theme.palette.primary.main,
                      },

                    },
                    "&:hover": {
                      color: theme.palette.primary.main
                    }
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

        </Box>
      </Drawer>
      <Drawer
        variant='temporary'
        open={openDrawer}
        anchor="left"
        onClose={handleDrawerOpen}
        sx={{
          width: drawerWidth - 20,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth - 20, boxSizing: 'border-box' },
          display: { xs: 'flex', md: 'none' }
        }}

      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>


          <Divider />
          <List>
            {menuItems.map((item) => (
              <ListItem key={item.text} disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={pathname === item.path}
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: theme.palette.primary.main + "20",
                      color: theme.palette.primary.main,
                      "& .MuiListItemIcon-root": {
                        color: theme.palette.primary.main,
                      },

                    },
                    "&:hover": {
                      color: theme.palette.primary.main
                    }
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

        </Box>
      </Drawer>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
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
              '&::before': {
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
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => navigate('/profile')}>
          <ListItemIcon>
            <AccountBox fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => navigate('/change-password')}>
          <ListItemIcon>
            <LockOpen fontSize="small" />
          </ListItemIcon>
          Change Password
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
}