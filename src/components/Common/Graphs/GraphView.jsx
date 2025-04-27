import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Box, Button, Collapse, Container, Grid2, Paper, Skeleton,Typography } from '@mui/material'
import { AutoAwesome, Download, } from '@mui/icons-material';
import Graphs3D from '../3DGraphs/Graphs3D';
import api from "../../api/axiosInstance";
import Graphs2D from '../2DGraphs/Graphs2D';
import { useParams } from 'react-router-dom';
import { default as UserNavBar } from '../../User/NavBar'
import { LinearGradient } from 'react-text-gradients';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


function GraphView() {
  const [alertConfig, setAlertConfig] = useState({ open: false, type: 'error', message: '' })
  const [showGraph, setShowGraph] = useState(false)
  const canvasRef = useRef(null)
  const graphRef = useRef(null)
  const [graphData, setGraphData] = useState({ diamention: '', type: '', title: '', data: '[]' })
  const [openLoader, setOpenLoader] = useState(false)
  const [aiInsights, setAiInsights] = useState('')

  const params = useParams()
  useEffect(() => {
    const fetchGraph = async () => {
      try {
        setOpenLoader(true)
        const response = await api.get('/graph/' + params.id, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
        const aiResponse = await api.get('/ai/analyze/' + response.data?.datasetId, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
        setGraphData(response.data)
        setAiInsights(aiResponse.data)
        setShowGraph(true)

      } catch (error) {
        setAlertConfig({ open: true, type: 'error', message: error.response.data.message })
      }
      finally {
        //setTimeout(()=>setOpenLoader(false),5000)
        setOpenLoader(false)

      }
    }

    fetchGraph()

  }, [params]);




  const getChartImage = useCallback(() => {
    if (graphData.diamention === '2d') {
      if (graphRef.current) {
        // Get the canvas element
        const canvas = graphRef.current.canvas
        return canvas.toDataURL("image/png")
      }
      return null
    }
    else if (graphData.diamention === '3d') {

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

  }, [graphData.diamention])


  const handleDownload = useCallback(() => {
    const imageData = getChartImage()
    if (imageData) {
      // Create a temporary link element
      const link = document.createElement("a")
      link.download = `${graphData.title.replace(/\s+/g, "-").toLowerCase()}-graph.png`
      link.href = imageData
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }, [graphData.title, getChartImage])

  return (
    <Box sx={{ display: 'flex', }}>
      <UserNavBar />
      <Box component='main' sx={{ flexGrow: 1, p: 3, mt: 8, }}>
        <Grid2 container spacing={2} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Grid2 size={{ xs: 12, md: 8 }}>
            <Collapse in={showGraph || openLoader} unmountOnExit timeout={'auto'}>
              <Paper elevation={8}>
                {openLoader &&
                  <Box position={'relative'} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} width={'100%'} height={'400px'}>
                    <Typography position={'absolute'} component={'p'} sx={{ opacity: 0.1, fontSize: { xs: "40px", md: '80px' } }}>Visualizing Data</Typography>
                    <Skeleton animation='wave' variant="rounded" width={'100%'} height={'100%'} >
                    </Skeleton>
                  </Box>}
                {(JSON.parse(graphData.data).length !== 0 && !openLoader) &&
                  <Box sx={{ p: 2, height: { xs: '100%', md: '420px' } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                      <Typography component='h4' variant='p'>Title: {graphData.title}</Typography>
                      <Button color='warning' size='small' variant='outlined' endIcon={<Download />} onClick={handleDownload}>
                        Download
                      </Button>
                    </Box>
                    <Box sx={{ width: '100%', height: { xs: '100%', md: '400px' }, display: 'flex', justifyContent: 'center', alignItems: 'center', overFlow:'hidden' }}>
                      {
                        graphData.diamention === '2d' ? <Graphs2D graphData={graphData.data} graphConfig={{ title: graphData.title, type: graphData.type }} downloadRef={graphRef} /> : graphData.diamention === '3d' ? <Graphs3D graphData={graphData.data} graphConfig={{ title: graphData.title, type: graphData.type }} downloadRef={canvasRef} /> : null
                      }
                    </Box>
                  </Box>
                }
              </Paper>
            </Collapse>

          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <Collapse in={openLoader || showGraph} unmountOnExit timeout={'auto'}>
              <Paper elevation={8}>
                {openLoader &&
                  <Box sx={{ p: 2 }} height={'370px'} >
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
                {(JSON.parse(graphData.data).length !== 0 && !openLoader) &&
                 <Box sx={{ overflow: 'auto' }} height={'450px'} >
                  <Typography component={'h3'} m={2} variant='p' gap={0.5} display={'flex'} justifyContent={'center'} alignItems={'center'} sx={{ color: '#444cd1' }}><LinearGradient gradient={['to left', '#0d61ec ,#de0f82']}>AI-Insights <AutoAwesome fontSize='small' /> </LinearGradient></Typography>
                  <Container>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiInsights}</ReactMarkdown>
                  </Container>
                </Box>}
              </Paper>

            </Collapse>
          </Grid2>
          {
            <Collapse in={alertConfig.open && !openLoader} unmountOnExit timeout={'auto'}>
              <Grid2 size={12}>
                <Paper sx={{ border: '1px solid red', width: '100%', }} elevation={8}>
                  <Typography m={2} textAlign={'center'} component='p' variant='h4'>{alertConfig.message}</Typography>
                </Paper>
              </Grid2>
            </Collapse>
          }
        </Grid2>
      </Box>
      {/* <AlertPop alertConfig={alertConfig} /> */}
      {/* <Loader openLoader={openLoader} /> */}
    </Box>
  )
}

export default GraphView