import React from 'react'
import LineGraph from './LineGraph'
import BarGraph from './BarGraph'
import PieGraph from './PieGraph'
import ScatterGraph from './ScatterGraph'

function Graphs2D({graphData, graphConfig, downloadRef}) {
  return (
    <>
    {
        graphConfig.type ==='bar' && <BarGraph ref={downloadRef} downloadRef={downloadRef} graphTitle={graphConfig.title} graphData={graphData} /> ||
        graphConfig.type ==='line' && <LineGraph downloadRef={downloadRef} graphTitle={graphConfig.title} graphData={graphData} /> ||
        graphConfig.type ==='pie' && <PieGraph downloadRef={downloadRef} graphTitle={graphConfig.title} graphData={graphData} /> ||
        graphConfig.type ==='scatter' && <ScatterGraph downloadRef={downloadRef} graphTitle={graphConfig.title} graphData={graphData} />
    }
    </>
  )
}

export default Graphs2D