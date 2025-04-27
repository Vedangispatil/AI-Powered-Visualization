import React from 'react'
import LineGraph from './LineGraph'
import BarGraph from './BarGraph'
import PieGraph from './PieGraph'
import ScatterGraph from './ScatterGraph'
import { Box } from '@mui/material'

function Graphs2D({ graphData, graphConfig, downloadRef }) {
  return (
    <>
      <Box sx={{ width: '100%', height: '400px' }}>
        {
          graphConfig.type === 'bar' && <BarGraph ref={downloadRef} downloadRef={downloadRef} graphTitle={graphConfig.title} graphData={graphData} /> ||
          graphConfig.type === 'line' && <LineGraph downloadRef={downloadRef} graphTitle={graphConfig.title} graphData={graphData} /> ||
          graphConfig.type === 'pie' && <PieGraph downloadRef={downloadRef} graphTitle={graphConfig.title} graphData={graphData} /> ||
          graphConfig.type === 'scatter' && <ScatterGraph downloadRef={downloadRef} graphTitle={graphConfig.title} graphData={graphData} />
        }
      </Box>
    </>
  )
}

export default Graphs2D