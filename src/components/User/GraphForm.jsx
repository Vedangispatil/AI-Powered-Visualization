import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import NavBar from './NavBar'
import { Autocomplete, Box, Button, Collapse, Container, FormControl, FormControlLabel, FormLabel, Grid2, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, Skeleton, Stack, TextField, Typography } from '@mui/material'
import { Analytics, AutoAwesome, Download, Save } from '@mui/icons-material';
import AlertPop from '../Common/AlertPop';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { LinearGradient } from 'react-text-gradients';
import Graphs3D from './3dGraphs/Graphs3D';
import api from '../../api/axiosInstance';
import { UserContext } from '../Common/Context/UserContext';
import Graphs2D from './2DGraphs/Graphs2D';
import Loader from '../Common/Loader';

function GraphForm() {
  const [alertConfig, setAlertConfig] = useState({ open: false, type: 'error', message: '' })
  const [graphFormFields, setgraphFormFields] = useState({ title: '', diamention: '2d', type: '' })
  const [loading, setLoading] = useState(false)
  const [showGraph, setShowGraph] = useState(false)
  const canvasRef = useRef(null)
  const graphRef = useRef(null)
  const userContext = useContext(UserContext)
  const [graphData, setGraphData] = useState({})
  const [usersDatasets, setUsersDatasets] = useState([])
  const [selectedDataset, setSelectedDataset] = useState({ datasetName: '', datasetId: '' })
  const [inputValue, setInputValue] = useState('');
  const [openLoader, setOpenLoader] = useState(false)
  const [saveGraphLoader, setSaveGraphLoader] = useState(false)
  const [aiInsights, setAiInsights] = useState('')

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        setOpenLoader(true)
        const response = await api.get('/dataset/selection/' + userContext?.user?.id, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
        //console.log(response)
        setUsersDatasets(response.data)

      } catch (error) {
        setAlertConfig({ open: true, type: 'error', message: error.response.data.message })
      }
      finally {
        setOpenLoader(false)
      }
    }

    fetchDatasets()

  }, []);



  const handleGraphFormFieldsChange = (e) => {
    setgraphFormFields({ ...graphFormFields, [e.target.name]: e.target.value })
  }

  const getChartImage = useCallback(() => {

    if (graphFormFields.diamention === '2d') {
      if (graphRef.current) {
        // Get the canvas element
        const canvas = graphRef.current.canvas
        return canvas.toDataURL("image/png")
      }
      return null
    }
    else if (graphFormFields.diamention === '3d') {

      if (canvasRef.current) {
        // Get the canvas element from the ref
        const canvas = canvasRef.current.querySelector("canvas")
        if (canvas) {
          try {
            // For WebGL canvas, we need to use toDataURL directly with preserveDrawingBuffer enabled
            return canvas.toDataURL("image/png")
          } catch (error) {
            console.error("Error getting chart image:", error)
            return null
          }
        }
      }
      return null

    }
    else {
      return null
    }

  }, [graphFormFields.diamention])


  const handleDownload = useCallback(() => {
    const imageData = getChartImage()
    if (imageData) {
      // Create a temporary link element
      const link = document.createElement("a")
      link.download = `${graphFormFields.title.replace(/\s+/g, "-").toLowerCase()}-graph.png`
      link.href = imageData
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    // if (graphRef.current) {
    //   // Get the canvas element
    //   const canvas = graphRef.current.canvas
    //   // Create a temporary link element
    //   const link = document.createElement("a")
    //   link.download = `${graphFormFields.title.toLowerCase()}-Graph.png`
    //   link.href = canvas.toDataURL("image/png")
    //   link.click()
    // }
  }, [graphFormFields.title, getChartImage])

  const handleDatasetSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await api.get('/dataset/' + selectedDataset.datasetId, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      const aiResponse = await api.get('/ai/analyze/' + selectedDataset.datasetId, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      setAiInsights(aiResponse.data)
      setGraphData(response.data)
      setShowGraph(true)
      window.scrollTo({ top:document.documentElement.scrollHeight, behavior: 'smooth' });


    } catch (error) {
      // console.log(error)
      setAlertConfig({ open: true, type: 'error', message: error.response.data.message })

    }
    finally {
      setLoading(false)

    }

  }


  const handleSaveGraph = async () => {
    try {
      setSaveGraphLoader(true)
      const response = await api.post('/graph/create', { datasetId: selectedDataset.datasetId, graphType: graphFormFields.type, graphConfig: { title: graphFormFields.title, diamentions: graphFormFields.diamention }, graphPreview: getChartImage() }, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
      setAlertConfig({ open: true, type: 'success', message: response.data?.message })
    } catch (error) {
      setAlertConfig({ open: true, type: 'error', message: error.response.data?.message })

    }
    finally {
      setSaveGraphLoader(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', }}>
      <NavBar />
      <Box component='main' sx={{ flexGrow: 1, p: 3, mt: 8, }}>
        <Grid2 container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Grid2 size={{ xs: 12, sm: 6, md: 6 }}>
            <Paper sx={{ p: 3, borderRadius: '20px', mb: 2 }} elevation={15}>
              <Typography textAlign={'center'} sx={{ mb: 2 }} variant='p' component={'h2'}>Graph Configuration</Typography>
              <Box component={'form'} onSubmit={handleDatasetSubmit} sx={{ display: 'flex', flexDirection: 'column' }}>
                <Autocomplete
                  disablePortal
                  options={usersDatasets}
                  fullWidth
                  sx={{ mb: 2 }}
                  size='small'
                  isOptionEqualToValue={(option, value) => option.datasetId === value.datasetId}
                  getOptionLabel={(option) => option.datasetName || ""}
                  inputValue={inputValue}
                  onInputChange={(_, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                  value={selectedDataset}
                  onChange={(_, newValue) => {
                    if (newValue) {
                      setSelectedDataset(newValue);
                    }
                    else {
                      setSelectedDataset({ datasetId: '', datasetName: '' });
                    }

                  }}
                  renderInput={(params) => <TextField required {...params} label="Dataset" />}
                />
                <TextField
                  label='Graph Title'
                  required
                  sx={{ mb: 3 }}
                  size='small'
                  name='title'
                  value={graphFormFields.title}
                  onChange={handleGraphFormFieldsChange}
                />
                <Stack direction={{ xs: 'column', md: 'row' }} alignItems={'center'} spacing={2} mb={2}>
                  <FormControl sx={{ minWidth: { xs: "100%", md: "150px" } }} component="fieldset" margin="normal">
                    <FormLabel required component="legend">Graph Dimension</FormLabel>
                    <RadioGroup
                      row
                      name='diamention'
                      value={graphFormFields.diamention}
                      onChange={handleGraphFormFieldsChange}
                    >
                      <FormControlLabel value="2d" control={<Radio size="small" />} label="2D" />
                      <FormControlLabel value="3d" control={<Radio size="small" />} label="3D" />
                    </RadioGroup>
                  </FormControl>
                  <FormControl fullWidth margin="normal">
                    <InputLabel size='small' id="Graph-type-label">Graph Type</InputLabel>
                    <Select
                      size='small'
                      labelId="Graph-type-label"
                      required
                      label="Graph Type"
                      name='type'
                      value={graphFormFields.type}
                      onChange={handleGraphFormFieldsChange}
                    >
                      <MenuItem value="bar">Bar Graph</MenuItem>
                      <MenuItem value="line">Line Graph</MenuItem>
                      <MenuItem value="pie">Pie Graph</MenuItem>
                      <MenuItem value="scatter">Scatter Graph</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
                  <Button sx={{ textTransform: 'none' }} loading={loading} type='submit' variant='contained' color='success' endIcon={<Analytics />}>Generate Graph</Button>
                </Box>
              </Box>

            </Paper>
          </Grid2>

          <Grid2 size={{ xs: 12, md: 8 }}>
            <Collapse in={showGraph} unmountOnExit timeout={'auto'}>
              <Paper elevation={8}>
                {loading && <Box position={'relative'} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} width={'100%'} height={'400px'}>
                  <Typography position={'absolute'} variant={'h1'} sx={{ opacity: 0.1 }}>Visualizing Data</Typography>
                  <Skeleton animation='wave' variant="rounded" width={'100%'} height={'100%'} >
                  </Skeleton>
                </Box>}
                {!loading && <Box sx={{ p: 2, height: { xs: '100%', md: '420px' } }}>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <Button loading={saveGraphLoader} color='success' size='small' variant='outlined' endIcon={<Save />} onClick={handleSaveGraph}>
                      Save
                    </Button>
                    <Button color='warning' size='small' variant='outlined' endIcon={<Download />} onClick={handleDownload}>
                      Download
                    </Button>
                  </Box>
                  <Box sx={{ width: '100%', height: { xs: '100%', md: '400px' }, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', }}>

                    {
                      graphFormFields.diamention === '2d' ? <Graphs2D graphData={graphData.data} graphConfig={{ title: graphFormFields.title, type: graphFormFields.type }} downloadRef={graphRef} /> : <Graphs3D graphData={graphData.data} graphConfig={{ title: graphFormFields.title, type: graphFormFields.type }} downloadRef={canvasRef} />
                    }
                  </Box>

                </Box>}
              </Paper>
            </Collapse>

          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Collapse in={showGraph} unmountOnExit timeout={'auto'}>
              <Paper elevation={8}>

                {loading && <Box sx={{ p: 2 }} height={'370px'} >
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                  <Skeleton animation='wave' />
                </Box>}
                {!loading && <Box sx={{ overflow: 'auto' }} height={'450px'} >
                  <Typography component={'h3'} m={2} variant='p' gap={0.5} display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{ color: '#444cd1' }}><LinearGradient gradient={['to left', '#0d61ec ,#de0f82']}>AI-Insights <AutoAwesome fontSize='small' /> </LinearGradient></Typography>
                  <Container>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiInsights}</ReactMarkdown>
                  </Container>
                </Box>}
              </Paper>

            </Collapse>
          </Grid2>


        </Grid2>
      </Box>
      <AlertPop alertConfig={alertConfig} />
      <Loader openLoader={openLoader} />
    </Box>
  )
}

export default GraphForm