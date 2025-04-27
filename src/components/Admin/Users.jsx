import { useState, useMemo, useEffect, forwardRef } from "react"
import { MaterialReactTable } from "material-react-table"
import {
    Box,
    Button,
    IconButton,
    Tooltip,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Chip,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Grid2,
    Slide,
    Paper,
} from "@mui/material"
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
} from "@mui/icons-material"
import NavBar from "./NavBar"
import api from "../../api/axiosInstance"
import AlertPop from "../Common/AlertPop"
import Loader from "../Common/Loader"


const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Users = () => {
    const [data, setData] = useState([])
    const [alertConfig, setAlertConfig] = useState({ open: false, type: 'error', message: '' })
    const [loading, setLoading] = useState(false)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [editFormData, setEditFormData] = useState({
        id: null,
        name: "",
        email: "",
        role: "",
        department: "",
        joinDate: "",
    })
    const [openLoader, setOpenLoader] = useState(false)


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setOpenLoader(true)
                const response = await api.get('/user/profiles', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
                //console.log(response)
                setData(response.data)

            } catch (error) {
                setAlertConfig({ open: true, type: 'error', message: error.response.data.message })
            }
            finally{
                setOpenLoader(false)
            }
        }

        fetchUsers()

    }, [])



    // Handle edit user
    const handleEditClick = (user) => {
        //setSelectedUser(user)
        setEditFormData({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            joinDate: user.joinDate,
        })
        setEditDialogOpen(true)
    }

    // Handle delete user
    const handleDeleteClick = (user) => {
        setSelectedUser(user)
        setDeleteDialogOpen(true)
    }

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target
        setEditFormData({
            ...editFormData,
            [name]: value,
        })
    }

    // Save edited user
    const handleSaveEdit = async () => {
        try {
            setLoading(true)
            const response = await api.put('/user/profile/' + editFormData.id, editFormData, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
            setAlertConfig({ open: true, type: 'success', message: response.data.message })
            setData(data.map((user) => (user.id === editFormData.id ? { ...user, ...editFormData } : user)))
            setEditDialogOpen(false)

        }
        catch (error) {
            setAlertConfig({ open: true, type: 'error', message: error.response.data.message })
        }
        finally {
            setLoading(false)
        }

    }

    // Confirm delete user
    const handleConfirmDelete = async () => {
        try {
            setLoading(true)
            const response = await api.delete('/user/profile/' + selectedUser.id, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
            setAlertConfig({ open: true, type: 'success', message: response.data.message })
            setData(data.filter((user) => user.id !== selectedUser.id))
            setDeleteDialogOpen(false)
        }
        catch (error) {
            setAlertConfig({ open: true, type: 'error', message: error.response.data.message })
        }
        finally {
            setLoading(false)
        }


    }

    // Define columns
    const columns = useMemo(
        () => [
            {
                accessorKey: "name",
                header: "Name",
                size: 150,

            },
            {
                accessorKey: "email",
                header: "Email",
                size: 200,
            },
            {
                accessorKey: "role",
                header: "Role",
                size: 80,

                Cell: ({ cell }) => (
                    <Chip
                        label={cell.getValue()}
                        color={cell.getValue() === "admin" ? "primary" : "default"}
                        variant={cell.getValue() === "admin" ? "filled" : "outlined"}
                        sx={{
                            fontWeight: cell.getValue() === "admin" ? "bold" : "normal",
                            textTransform: "capitalize",
                        }}
                    />
                ),
            },


        ],
        [],
    )

    return (
        <Box sx={{ display: 'flex', }}>
            <NavBar />
            <Box component='main' sx={{ flexGrow: 1, p: 3, mt: 8, }}>
                <Grid2 container>
                    <Grid2 size={12}>
                        <Paper>
                            <Box
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    borderBottom: "1px solid #e0e0e0",
                                    height: '100%'
                                }}
                            >
                                <Typography textAlign={'center'} variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
                                    User Management
                                </Typography>
                            </Box>
                            <Box sx={{ maxWidth: { xs: '360px', md: '100%' } }}>
                                <MaterialReactTable
                                    columns={columns}
                                    data={data}
                                    enableColumnFilterModes
                                    enableDensityToggle={false}
                                    enableStickyHeader
                                    enableRowActions
                                    positionActionsColumn="last"
                                    muiTableContainerProps={{ sx: { maxHeight: '280px' } }}
                                    muiTablePaperProps={{
                                        elevation: 0,
                                        sx: { borderRadius: 0 },
                                    }}
                                    muiTableBodyRowProps={({ row }) => ({
                                        sx: {
                                            backgroundColor: row.original.role === "admin" ? "rgba(25, 118, 210, 0.04)" : "inherit",
                                            "&:hover": {
                                                backgroundColor:
                                                    row.original.role === "admin" ? "rgba(25, 118, 210, 0.08)" : "rgba(0, 0, 0, 0.04)",
                                            },
                                        },
                                    })}
                                    renderRowActions={({ row }) => (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: "5px",
                                                justifyContent: "flex-start",
                                                width: "100%",

                                            }}

                                        >

                                            <Tooltip title="Edit User" arrow>
                                                <IconButton
                                                    onClick={() => handleEditClick(row.original)}
                                                    size="small"
                                                    sx={{
                                                        color: "#2196f3",
                                                        "&:hover": { backgroundColor: "rgba(33, 150, 243, 0.08)" },
                                                    }}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete User" arrow>
                                                <IconButton
                                                    onClick={() => handleDeleteClick(row.original)}
                                                    size="small"
                                                    sx={{
                                                        color: "#f44336",
                                                        "&:hover": { backgroundColor: "rgba(244, 67, 54, 0.08)" },
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    )}
                                    initialState={{
                                        density: "compact",
                                        columnVisibility: { joinDate: true },
                                    }}
                                    muiTopToolbarProps={{
                                        sx: { backgroundColor: "#f9f9f9" },
                                    }}
                                    muiBottomToolbarProps={{
                                        sx: { backgroundColor: "#f9f9f9" },
                                    }}

                                />
                            </Box>
                        </Paper>
                        {/* Edit User Dialog */}
                        <Dialog
                            open={editDialogOpen}
                            onClose={() => setEditDialogOpen(false)}
                            TransitionComponent={Transition}
                            keepMounted
                            maxWidth="sm"
                            fullWidth
                        >
                            <DialogTitle
                                sx={{
                                    backgroundColor: "#f5f5f5",
                                    borderBottom: "1px solid #e0e0e0",
                                    fontWeight: "bold",
                                }}
                            >
                                Edit User
                            </DialogTitle>
                            <DialogContent sx={{ p: 3 }}>
                                <Box component="form" sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 3 }}>
                                    <TextField
                                        label="Name"
                                        name="name"
                                        value={editFormData.name}
                                        onChange={handleInputChange}
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                    />
                                    <TextField
                                        label="Email"
                                        name="email"
                                        value={editFormData.email}
                                        onChange={handleInputChange}
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                    />
                                    <FormControl fullWidth variant="outlined">
                                        <InputLabel id="user-type-label">Role</InputLabel>
                                        <Select
                                            labelId="user-type-label"
                                            label="User Type"
                                            name="role"
                                            size="small"
                                            value={editFormData.role}
                                            onChange={handleInputChange}
                                        >
                                            <MenuItem value="admin">Admin</MenuItem>
                                            <MenuItem value="user">User</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <TextField
                                        label="Join Date"
                                        name="joinDate"
                                        type="date"
                                        value={editFormData.joinDate}
                                        disabled
                                        //onChange={handleInputChange}
                                        fullWidth
                                        variant="outlined"
                                        size="small"
                                        slotProps={{ inputLabel: { shrink: true } }}
                                    />
                                </Box>
                            </DialogContent>
                            <DialogActions sx={{ p: 2, backgroundColor: "#f9f9f9", borderTop: "1px solid #e0e0e0" }}>
                                <Button onClick={() => setEditDialogOpen(false)} size="small" variant="contained" color="error" sx={{ mr: 1 }}>
                                    Cancel
                                </Button>
                                <Button
                                    loading={loading}
                                    loadingPosition="end"
                                    size="small"
                                    onClick={handleSaveEdit}
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "#1976d2",
                                        "&:hover": { backgroundColor: "#1565c0" },
                                    }}
                                >
                                    Save Changes
                                </Button>
                            </DialogActions>
                        </Dialog>

                        {/* Delete User Dialog */}
                        <Dialog
                            open={deleteDialogOpen}
                            onClose={() => setDeleteDialogOpen(false)}
                            TransitionComponent={Transition}
                            keepMounted
                            maxWidth="sm"
                        >
                            <DialogTitle
                                sx={{
                                    backgroundColor: "#f5f5f5",
                                    borderBottom: "1px solid #e0e0e0",
                                    color: "#d32f2f",
                                    fontWeight: "bold",
                                }}
                            >
                                Confirm Delete
                            </DialogTitle>
                            <DialogContent sx={{ mt: 2, p: 3 }}>
                                <DialogContentText>
                                    Are you sure you want to delete <strong>{selectedUser?.name}'s</strong> record? This action cannot be undone.
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions sx={{ p: 2, backgroundColor: "#f9f9f9", borderTop: "1px solid #e0e0e0" }}>
                                <Button onClick={() => setDeleteDialogOpen(false)} variant="contained" sx={{ mr: 1 }}>
                                    Cancel
                                </Button>
                                <Button
                                    loading={loading}
                                    onClick={handleConfirmDelete}
                                    color="error"
                                    variant="contained"
                                    loadingPosition="end"
                                    sx={{
                                        backgroundColor: "#d32f2f",
                                        "&:hover": { backgroundColor: "#b71c1c" },
                                    }}
                                >
                                    Delete
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Grid2>
                </Grid2>
            </Box>
            <AlertPop alertConfig={alertConfig} />
            <Loader openLoader={openLoader} />
        </Box>

    )
}

export default Users
