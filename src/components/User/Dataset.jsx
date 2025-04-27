import { useState, useMemo, useEffect, forwardRef, useContext } from "react"
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
    Chip,
    Divider,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Stack,
    Grid2,
    Slide,
    Tabs,
    Tab,
    Collapse,
    Paper,
} from "@mui/material"
import {
    Visibility as VisibilityIcon,
    Delete,
    Add,
    AddCircleOutline,
    Info,
    CloudUpload,
} from "@mui/icons-material"
import NavBar from "./NavBar"
import api from "../../api/axiosInstance"
import AlertPop from "../Common/AlertPop"
import { UserContext } from "../Common/Context/UserContext"
import { useDropzone } from 'react-dropzone';
import { v4 as uuidv4 } from "uuid"
import { TabPanel, TabContext } from '@mui/lab';
import { TransitionGroup } from "react-transition-group"
import Loader from "../Common/Loader"

const baseStyle = {
    flex: 1,
    height: '150px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 4,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    //backgroundColor: '#fafafa',

    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
};

const focusedStyle = {
    borderColor: '#2196f3'
};

const acceptStyle = {
    borderColor: '#00e676'
};

const rejectStyle = {
    borderColor: '#ff1744'
};
const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Dataset = () => {
    const [data, setData] = useState([])
    const [alertConfig, setAlertConfig] = useState({ open: false, type: 'error', message: '' })
    const [loading, setLoading] = useState(false)
    const [createDatasetOpen, setCreateDatasetOpen] = useState(false)
    const [viewDatasetDialogOpen, setViewDatasetDialogOpen] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [selectedRows, setSelectedRows] = useState(null)
    const userContext = useContext(UserContext)
    const [viewDatasetData, setViewDatasetData] = useState({
        id: null,
        datasetName: "",
        data: []
    })
    const colID = uuidv4()
    const rowID = uuidv4()
    const [activeTab, setActiveTab] = useState('manual')
    const [manualColumns, setManualColumns] = useState({ [colID]: { colName: '', colType: 'text', } }) //useState([{ columnId: colID, colName: '', colType: 'text', }])
    const [rows, setRows] = useState({ [rowID]: [{ columnId: colID, rowData: '' }] })
    const [files, setFiles] = useState([]);
    const [datasetName, setDatasetName] = useState('')
    const [update, setUpdate] = useState(0)
    const [openLoader, setOpenLoader] = useState(false)
    const [rowSelection, setRowSelection] = useState({})


    useEffect(() => {
        const fetchDatasets = async () => {
            try {
                setOpenLoader(true)
                const response = await api.get('/dataset/user/' + userContext?.user?.id, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
                //console.log(response)
                setData(response.data)

            } catch (error) {
                setAlertConfig({ open: true, type: 'error', message: error.response.data.message })
            }
            finally{
                setOpenLoader(false)
            }
        }

        fetchDatasets()

    }, [update])

    const handleTabChange = (_, newValue) => {
        setActiveTab(newValue);
        setManualColumns({ [colID]: { colName: '', colType: 'text', } })
        setRows({ [rowID]: [{ columnId: colID, rowData: '' }] })
        setFiles([])
    };

    const handleColunmFields = (id, name, value) => {
        // console.log(id,name,value)
        setManualColumns({ ...manualColumns, [id]: { ...manualColumns[id], [name]: value } })
    }

    const handleRowFields = (rowId, colId, name, value) => {
        setRows({
            ...rows, [rowId]: rows[rowId].map(data => {
                if (data.columnId === colId) {
                    value = manualColumns[data.columnId]['colType'] === 'text' ? String(value) : Number(value)
                    return { ...data, [name]: value }
                }
                else {
                    return data
                }
            })
        })
    }

    const handleAddColumn = () => {
        if (Object.keys(manualColumns).length <= 7) {
            const colId = uuidv4()
            const tempRows = { ...rows }
            Object.keys(rows).forEach(rowId => {
                tempRows[rowId] = [...tempRows[rowId], { columnId: colId, rowData: '' }]
            })
            setRows(tempRows)
            setManualColumns({ ...manualColumns, [colId]: { colName: '', colType: 'number' } })
        }
        else {
            setAlertConfig({ open: true, type: 'error', message: 'Max 8 manualColumns are allowed' })
        }
    }
    const handleDeleteColumn = (id) => {
        const tempCol = { ...manualColumns }
        delete tempCol[id]
        // console.log(tempCol, rows)
        const tempRows = { ...rows }
        Object.keys(tempRows).forEach(rowId => {
            const rowData = tempRows[rowId].filter(info => info.columnId !== id)
            tempRows[rowId] = rowData
        })
        // console.log(id,tempRows)
        setRows(tempRows)
        setManualColumns(tempCol)
        //setManualColumns(manualColumns.filter(col => col.columnId != id))

    }

    const handleAddRow = () => {
        const rowId = uuidv4()
        // console.log(rows, rows[0])
        setRows({ ...rows, [rowId]: rows[Object.keys(rows)[0]].map(data => ({ ...data, rowData: '' })) })
        //setManualData([...manualData, ...manualData.map(data=>({...data, rowData: '',}))])
    }
    const handleDeleteRow = (id) => {
        const tempRows = { ...rows }
        delete tempRows[id]
        setRows(tempRows)
    }

    const handleDatasetSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            if (activeTab === 'manual') {
                let manualData = []
                Object.keys(rows).forEach(rowId => {
                    const row = {}
                    rows[rowId].forEach(data => {
                        row[manualColumns[data.columnId]['colName']] = data.rowData
                    })
                    manualData.push(row)
                })
                const response = await api.post('/dataset/manual', { userId: userContext?.user?.id, name: datasetName, manualData, }, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
                setAlertConfig({ open: true, type: 'success', message: response.data.message })

            }
            else {
                if (files.length === 0) {
                    setAlertConfig({ open: true, type: 'error', message: 'Select file to upload!' })
                    return
                }
                const formData = new FormData();
                formData.append('userId', userContext?.user?.id)
                formData.append('name', datasetName)
                formData.append('file', files[0])
                const response = await api.post('/dataset/upload', formData, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'multipart/form-data' } })
                setAlertConfig({ open: true, type: 'success', message: response.data.message })
            }
            handleCreateDatasetClose()
            setUpdate(prev => prev + 1)


        } catch (error) {
            console.log(error)
            setAlertConfig({ open: true, type: 'error', message: error.response.data.message })

        }
        finally {
            setLoading(false)


        }


        // console.log(manualData)
    }

    const handleCreateDatasetClose = () => {
        setManualColumns({ [colID]: { colName: '', colType: 'text', } })
        setRows({ [rowID]: [{ columnId: colID, rowData: '' }] })
        setFiles([])
        setCreateDatasetOpen(false)
    }

    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        accept: { 'application/vnd.ms-excel': ['.xls'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'] },
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            //console.log(acceptedFiles)
            setFiles(acceptedFiles.map(file => Object.assign(file, {
                preview: URL.createObjectURL(file)
            })));
        }
    });

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [
        isFocused,
        isDragAccept,
        isDragReject
    ]);


    // Handle edit user
    const handleViewDatasetClick = (data) => {
        //setSelectedRows(user)
        setViewDatasetData(data)
        setViewDatasetDialogOpen(true)
    }


    const handleDeleteClick = (rows) => {
        // console.log(rows)
        setSelectedRows(rows.map(data=>data.id))
        setDeleteDialogOpen(true)
    }


    // Confirm delete user
    const handleConfirmDelete = async () => {
        try {
            setLoading(true)
            const response = await api.post('/dataset/user/delete-datasets/',{selectedRows}, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
            setAlertConfig({ open: true, type: 'success', message: response.data.message })
            setData(data.filter((dataset) => !selectedRows.includes(dataset.id)))
            setDeleteDialogOpen(false)
            setRowSelection({})
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
                accessorKey: "datasetName",
                header: "Dataset Name",


            },
            {
                accessorKey: "entryType",
                header: "Entry Type",

            },
            {
                accessorKey: "createdAt",
                header: "Created At",



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
                                    Dataset
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
                                                    
                                                    handleDeleteClick(selectedRows.map(rows => rows.original))
                                                }} color="error" variant="contained">
                                                    Delete
                                                </Button>
                                            </Box>
                                        </Box>}
                                    enableRowActions
                                    positionActionsColumn="last"
                                    muiTableContainerProps={{ sx: { maxHeight: '280px', p: 0 } }}

                                    renderRowActions={({ row }) => (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                gap: "5px",
                                                justifyContent: "flex-start",
                                                width: "100%",

                                            }}

                                        >

                                            <Tooltip title="View Data" arrow>
                                                <IconButton
                                                    onClick={() => handleViewDatasetClick(row.original)}
                                                    size="small"

                                                >
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            
                                        </Box>
                                    )}
                                    renderTopToolbarCustomActions={({ table }) => (
                                        <Button
                                            size="small"
                                            sx={{ textTransform: 'none', mt: 1 }}
                                            variant="outlined"
                                            endIcon={<AddCircleOutline />}
                                            onClick={() => {
                                                setCreateDatasetOpen(true)
                                            }}
                                        >
                                            Create Dataset
                                        </Button>
                                    )}
                                    state={{rowSelection}}
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


                                
                                {/* create dataset */}
                                <Dialog
                                    open={createDatasetOpen}
                                    onClose={handleCreateDatasetClose}
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
                                        Add Dataset
                                    </DialogTitle>
                                    <DialogContent sx={{ p: 3 }}>
                                        <Box id='datasetForm' component="form" onSubmit={handleDatasetSubmit} sx={{ mt: 2, display: "flex", flexDirection: "column", }}>
                                            <TextField
                                                label="Dataset Name"
                                                name="name"
                                                required
                                                value={datasetName}
                                                onChange={(e) => setDatasetName(e.target.value)}
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                sx={{ mb: 1 }}
                                            />


                                            <TabContext value={activeTab}>

                                                <Tabs value={activeTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }} aria-label="data entry tabs">
                                                    <Tab label="Manual Entry" value='manual' />
                                                    <Tab label="Excel Upload" value='upload' />
                                                </Tabs>
                                                <TabPanel value={'manual'} sx={{ p: 0, mt: 2 }}>
                                                    <Box sx={{ p: 0 }}>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                                                            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, justifyContent: "center", alignItems: 'center' }}>
                                                                <Typography variant='p' component={'h4'}>Define Columns </Typography>
                                                                <Tooltip title='Max 8 columns are allowed' placement="right-start"> <Info sx={{ mt: 1 }} color='info' fontSize='20px' /></Tooltip>
                                                            </Box>
                                                            <Button variant='outlined' size='small' startIcon={<Add />} onClick={handleAddColumn}>Add Columns</Button>
                                                        </Box>


                                                        <TransitionGroup>
                                                            {
                                                                Object.keys(manualColumns).map((colId, index) => (
                                                                    <Collapse key={colId}>

                                                                        <Stack mb={2} direction={'row'} spacing={2} alignItems={'center'}>
                                                                            <Typography variant='p' component={'h4'}>{index + 1}.</Typography>
                                                                            <TextField
                                                                                label='Column Name'
                                                                                placeholder='Add column name'
                                                                                name='colName'
                                                                                value={manualColumns[colId]['colName']}
                                                                                onChange={e => handleColunmFields(colId, e.target.name, e.target.value)}
                                                                                size='small'
                                                                                required
                                                                                fullWidth
                                                                            />
                                                                            <FormControl fullWidth>
                                                                                <InputLabel required size='small'>Column Type</InputLabel>
                                                                                <Select required size='small' label='Column Type' name='colType' value={manualColumns[colId].colType} onChange={e => handleColunmFields(colId, e.target.name, e.target.value)}>
                                                                                    <MenuItem value='text'>Text</MenuItem>
                                                                                    <MenuItem value='number'>Number</MenuItem>
                                                                                </Select>
                                                                            </FormControl>
                                                                            <IconButton color='error' disabled={Object.keys(manualColumns).length == 1} size='small' onClick={() => handleDeleteColumn(colId)}>
                                                                                <Delete />
                                                                            </IconButton>
                                                                        </Stack>
                                                                    </Collapse>
                                                                ))
                                                            }
                                                        </TransitionGroup>
                                                        <Divider />

                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, mb: 2, alignItems: 'center' }}>
                                                            <Typography variant='p' component={'h4'}>Add Data</Typography>
                                                            <Button variant='outlined' size='small' startIcon={<Add />} onClick={handleAddRow}>Add Entry</Button>
                                                        </Box>

                                                        <TransitionGroup>
                                                            {
                                                                Object.keys(rows).map((rowID, index) => (
                                                                    <Collapse key={rowID}>

                                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                                                                            <Typography variant='p' component={'h5'} color='gray'>Row {index + 1}.</Typography>
                                                                            <IconButton color='error' disabled={Object.keys(rows).length == 1} size='small' onClick={() => handleDeleteRow(rowID)}>
                                                                                <Delete />
                                                                            </IconButton>
                                                                        </Box>


                                                                        <Stack mb={2} direction={'row'} spacing={2} alignItems={'center'} width={'100%'}>

                                                                            {
                                                                                rows[rowID].slice(0, 4).map((row, index) => (
                                                                                    <TextField

                                                                                        key={index}
                                                                                        label={manualColumns[row.columnId]['colName']}
                                                                                        type={manualColumns[row.columnId]['colType']}
                                                                                        placeholder='Add Data'
                                                                                        name='rowData'
                                                                                        value={row.rowData}
                                                                                        onChange={e => handleRowFields(rowID, row.columnId, e.target.name, e.target.value)}
                                                                                        size='small'
                                                                                        required
                                                                                        fullWidth
                                                                                    />
                                                                                ))
                                                                            }



                                                                        </Stack>
                                                                        <Stack mb={2} key={rowID} direction={'row'} spacing={2} alignItems={'center'}>
                                                                            {
                                                                                rows[rowID].slice(4).map((row, index) => (
                                                                                    <TextField
                                                                                        key={index}
                                                                                        label={manualColumns[row.columnId]['colName']}
                                                                                        type={manualColumns[row.columnId]['colType']}
                                                                                        placeholder='Add Data'
                                                                                        value={row.rowData}
                                                                                        name='rowData'
                                                                                        onChange={e => handleRowFields(rowID, row.columnId, e.target.name, e.target.value)}
                                                                                        size='small'
                                                                                        required
                                                                                        fullWidth
                                                                                    />
                                                                                ))
                                                                            }
                                                                        </Stack>
                                                                        <Divider />
                                                                    </Collapse>
                                                                ))

                                                            }
                                                        </TransitionGroup>
                                                    </Box>
                                                </TabPanel>
                                                <TabPanel value={'upload'}>
                                                    <Box>
                                                        <div className="container">
                                                            <div {...getRootProps({ style })}>
                                                                <input {...getInputProps()} />
                                                                <CloudUpload sx={{ width: 40, height: 40 }} />
                                                                <p>Drag and drop or click to select Excel files (.xlsx, .xls)</p>
                                                            </div>
                                                        </div>

                                                    </Box>
                                                    <Typography m={1} component={'h6'} variant='p' color={'red'}>*Only excel sheet with 8 columns are allowed</Typography>
                                                    <Stack direction={'row'} height={{ xs: 30, md: 20 }} spacing={1} pl={1}>
                                                        {files.length !== 0 &&
                                                            <>
                                                                <Typography component={'h5'} variant='p' >File:</Typography>
                                                                <Chip color="secondary" size='small' label={files[0].name} variant="outlined" onDelete={() => setFiles([])} />
                                                            </>
                                                        }

                                                    </Stack>


                                                </TabPanel>
                                            </TabContext>
                                        </Box>
                                    </DialogContent>
                                    <DialogActions sx={{ p: 2, backgroundColor: "#f9f9f9", borderTop: "1px solid #e0e0e0" }}>
                                        <Button onClick={handleCreateDatasetClose} size="small" variant="contained" color="error" sx={{ mr: 1 }}>
                                            Cancel
                                        </Button>
                                        <Button
                                            form='datasetForm'
                                            loading={loading}
                                            loadingPosition="end"
                                            size="small"
                                            variant="contained"
                                            color="success"
                                            type='submit'
                                        >
                                            Save
                                        </Button>
                                    </DialogActions>
                                </Dialog>


                                <Dialog
                                    open={viewDatasetDialogOpen}
                                    onClose={() => setViewDatasetDialogOpen(false)}
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
                                        Dataset - {viewDatasetData.datasetName}
                                    </DialogTitle>
                                    <DialogContent sx={{ p: 3 }}>
                                        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                                            
                                            <TextField
                                                label="Dataset Data"
                                                
                                                value={viewDatasetData.data}
                                                multiline
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                            />
                                            <Typography component={'h6'} variant="p" color="red">* Data shown in JSON format</Typography>
                                           
                                        </Box>
                                    </DialogContent>
                                    <DialogActions sx={{ p: 2, backgroundColor: "#f9f9f9", borderTop: "1px solid #e0e0e0" }}>
                                        <Button onClick={() => setViewDatasetDialogOpen(false)} size="small" variant="contained"  sx={{ mr: 1 }}>
                                            Close
                                        </Button>
                                       
                                    </DialogActions>
                                </Dialog>


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
                                            Are you sure you want to delete dataset? This action cannot be undone.
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

export default Dataset
