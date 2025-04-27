import { useState, useMemo, useEffect, forwardRef, } from "react"
import { MaterialReactTable, MRT_SelectCheckbox } from "material-react-table"
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
    Grid2,
    Slide,
    Paper,
} from "@mui/material"
import {
    Visibility as VisibilityIcon,
    Delete,

} from "@mui/icons-material"
import NavBar from "./NavBar"
import api from "../../api/axiosInstance"
import AlertPop from "../Common/AlertPop"
import Loader from "../Common/Loader"
import { useNavigate } from "react-router-dom"

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Graphs = () => {
    // Sample data
    const [data, setData] = useState([])
    const [alertConfig, setAlertConfig] = useState({ open: false, type: 'error', message: '' })
    const [loading, setLoading] = useState(false)
    // State for dialogs

    const [viewGraphDialogOpen, setViewGraphDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedRows, setSelectedRows] = useState(null)
    const [viewGraphData, setViewGraphData] = useState({
        id: null,
        graphName: "",
        data: []
    })
    const [openLoader, setOpenLoader] = useState(false)
    const [rowSelection, setRowSelection] = useState({})

    const navigate = useNavigate()


    useEffect(() => {
        const fetchGraphs = async () => {
            try {
                setOpenLoader(true)
                const response = await api.get('/graph/admin/all', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
                //console.log(response)
                setData(response.data)

            } catch (error) {
                setAlertConfig({ open: true, type: 'error', message: error.response.data.message })
            }
            finally {
                setOpenLoader(false)
            }
        }

        fetchGraphs()

    }, [])


    const handleViewGraphClick = (data) => {
        //setSelectedRows(user)
        navigate('/graphs/graph/'+data.id)
       //console.log(data)
    }

    // Handle delete user
    const handleDeleteClick = (rows) => {
        //console.log(rows)
        setSelectedRows(rows.map(data => data.id))
        setDeleteDialogOpen(true)
    }


    // Confirm delete user
    const handleConfirmDelete = async () => {
        try {
            setLoading(true)
            const response = await api.post('/graph/delete-graphs/', { selectedRows }, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
            setAlertConfig({ open: true, type: 'success', message: response.data.message })
            setData(data.filter((Graph) => !selectedRows.includes(Graph.id)))
            setSelectedRows(null)
            setRowSelection({})
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
                accessorKey: "userInfo.name",
                header: "User Name",
            },
            {
                accessorKey: "userInfo.email",
                header: "User Email",
            },
            {
                accessorKey: "title",
                header: "Graph Title",
            },
            {
                accessorKey: "diamentions",
                header: "Diamentions",
                size:50
            },
            {
                accessorKey: "type",
                header: "Type",
                size:50
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
                                    Graphs
                                </Typography>
                                {/* <Box sx={{ display: "flex", gap: 1 }}>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    sx={{
                                        backgroundColor: "#1976d2",
                                        "&:hover": { backgroundColor: "#1565c0" },
                                    }}
                                >
                                    Add User
                                </Button>
                                <Button variant="outlined" startIcon={<RefreshIcon />} sx={{ ml: 1 }}>
                                    Refresh
                                </Button>
                            </Box> */}
                            </Box>
                            <Box sx={{ maxWidth: { xs: '360px', md: '100%' } }}>
                                <MaterialReactTable
                                    columns={columns}
                                    data={data}
                                    enableColumnFilterModes
                                    enableDensityToggle={false}
                                    enableStickyHeader
                                    enableRowSelection
                                    onRowSelectionChange={setRowSelection}
                                    muiToolbarAlertBannerProps={{
                                        color: 'info'
                                    }}
                                    positionToolbarAlertBanner="head-overlay"
                                    renderToolbarAlertBannerContent={({ selectedAlert, table }) =>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            width: '100%',
                                            position: 'sticky'
                                        }}>
                                            <Box sx={{
                                                alignItems: 'center',
                                                display: 'flex',
                                                gap: { xs: 0, md: '6px' },
                                                ml: '8px',
                                                width: '100%',

                                            }}>
                                                <MRT_SelectCheckbox table={table} /> {selectedAlert}{' '}
                                            </Box>
                                            <Box sx={{
                                                display: 'flex',
                                                mr: { xs: 0, md: 2 }
                                            }}>

                                                <Button size="small" endIcon={<Delete />} onClick={() => {

                                                    const selectedRows = table.getSelectedRowModel().rows;
                                                    //console.log(rowSelection)
                                                    handleDeleteClick(selectedRows.map(rows => rows.original))
                                                }} color="error" variant="contained">
                                                    Delete
                                                </Button>
                                            </Box>
                                        </Box>}
                                    enableRowActions
                                    positionActionsColumn="last"
                                    muiTableContainerProps={{ sx: { maxHeight: '280px', p: 0, width:'100%' } }}
                                    renderRowActions={({ row }) => (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                
                                                justifyContent: "flex-start",
                                                

                                            }}

                                        >

                                            <Tooltip title="View graph" arrow>
                                                <IconButton
                                                    onClick={() => handleViewGraphClick(row.original)}
                                                    size="small"

                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>

                                        </Box>
                                    )}
                                    state= { {rowSelection} }
                                    initialState={{
                                        density: "compact",

                                    }}
                                    muiTopToolbarProps={{
                                        sx: { backgroundColor: "#f9f9f9" },
                                    }}
                                    muiBottomToolbarProps={{
                                        sx: { backgroundColor: "#f9f9f9" },
                                    }}

                                />

                                <Dialog
                                    open={viewGraphDialogOpen}
                                    onClose={() => setViewGraphDialogOpen(false)}
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
                                        Graph - {viewGraphData.GraphName}
                                    </DialogTitle>
                                    <DialogContent sx={{ p: 3 }}>
                                        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>

                                            <TextField
                                                label="Graph Data"

                                                value={viewGraphData.data}
                                                multiline
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                            />
                                            <Typography component={'h6'} variant="p" color="red">* Data shown in JSON format</Typography>




                                        </Box>
                                    </DialogContent>
                                    <DialogActions sx={{ p: 2, backgroundColor: "#f9f9f9", borderTop: "1px solid #e0e0e0" }}>
                                        <Button onClick={() => setViewGraphDialogOpen(false)} size="small" variant="contained" sx={{ mr: 1 }}>
                                            Close
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
                                            Are you sure you want to delete Graph? This action cannot be undone.
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
                            </Box>
                        </Paper>
                    </Grid2>
                </Grid2>


            </Box>
            <AlertPop alertConfig={alertConfig} />
            <Loader openLoader={openLoader} />
        </Box>

    )
}

export default Graphs
