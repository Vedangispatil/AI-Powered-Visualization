import React, { useRef, useState } from "react"
import { Canvas, } from "@react-three/fiber"
import { OrbitControls, } from "@react-three/drei"
import LineGraph3D from "./LineGraph3D"
import { Box, Checkbox, Container, FormControlLabel, FormGroup } from "@mui/material"
import BarGraph3D from "./BarGraph3D"
import PieGraph3D from "./PieGraph3D"
import ScatterGraph3D from "./ScatterGraph3D"

// Colors for charts
const CHART_COLORS = [
  "rgba(54, 162, 235, 0.8)",
  "rgba(255, 99, 132, 0.8)",
  "rgba(75, 192, 192, 0.8)",
  "rgba(255, 206, 86, 0.8)",
  "rgba(153, 102, 255, 0.8)",
  "rgba(255, 159, 64, 0.8)",
  "rgba(199, 199, 199, 0.8)",
  "rgba(83, 102, 255, 0.8)",
  "rgba(78, 181, 104, 0.8)",
  "rgba(225, 78, 202, 0.8)",
]

// Border colors (slightly darker)
const CHART_BORDER_COLORS = [
  "rgba(54, 162, 235, 1)",
  "rgba(255, 99, 132, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
  "rgba(199, 199, 199, 1)",
  "rgba(83, 102, 255, 1)",
  "rgba(78, 181, 104, 1)",
  "rgba(225, 78, 202, 1)",
]

const isNumeric = (value) => {
  return typeof value === "number" || (typeof value === "string" && !isNaN(Number(value)))
}

const prepareGraphDataset = (data, columns, type) => {
  if (!data || data.length === 0 || !columns || columns.length === 0) {
    return null
  }

  // Always use the first column as labels (x-axis)
  const labelColumn = columns[0]
  const dataColumns = columns.slice(1)

  // Get labels from the first column
  const rawLabels = data.map((item) => item[labelColumn] || "Unknown")

  // Format date labels if they appear to be dates
  // const isDateLabels = rawLabels.some((label) => isDateString(label))
  const labels = rawLabels


  // Prepare datasets for each data column (for bar, line, pie)
  const datasets = dataColumns.map((col, index) => {
    return {
      label: col,
      data: data.map((item) => (isNumeric(item[col]) ? Number(item[col]) : 0)),
      backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
      borderColor: CHART_BORDER_COLORS[index % CHART_BORDER_COLORS.length],
      borderWidth: 1,
    }
  })

  return {
    labels,
    datasets,
    rawLabels,
  }
}

function Scene({ children }) {
  const groupRef = useRef()

  // useFrame(({ clock }) => {
  //   if (groupRef.current) {
  //     groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.1) * 0.2
  //   }
  // })

  return <group ref={groupRef}>{children}</group>
}

function Graphs3D({ graphData, graphConfig, downloadRef }) {
  const data = JSON.parse(graphData)
  let columns = Object.keys(data[0])
  let { type, } = graphConfig
  const graphDataset = prepareGraphDataset(data, columns, type)
  const [showGrid, setShowGrid] = useState(true)


  if (!graphDataset && type !== "scatter") {
    return (
      <div className="">No valid data for chart</div>
    )
  }

  // Render appropriate 3D chart based on type
  const render3DChart = () => {
    return (
      <div  >

        <Box sx={{ width: { xs: '320px', md: '100%' }, height: { xs: 'auto', md: '350px' } }}>

          <Box sx={{ display: 'flex', width: '120px' }}>

            <FormGroup>
              <FormControlLabel control={<Checkbox size="small" checked={showGrid} onChange={() => setShowGrid(prev => !prev)} />} label="Show Grid" />
            </FormGroup>
          </Box>
          <Canvas style={{ display: 'flex', justifyContent: 'center', width: '100%', height: '100%', border: '2px solid gray', overflow: 'hidden' }} camera={{ position: [0, 5, 10], fov: 80 }} gl={{ preserveDrawingBuffer: true }}>

            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Scene>
              {
                graphConfig.type === 'bar' && <BarGraph3D graphDataset={graphDataset} columns={columns} /> ||
                graphConfig.type === 'line' && <LineGraph3D graphDataset={graphDataset} columns={columns} /> ||
                graphConfig.type === 'pie' && <PieGraph3D graphDataset={graphDataset} /> ||
                graphConfig.type === 'scatter' && <ScatterGraph3D data={data} columns={columns} />
              }
            </Scene>
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
            {showGrid && <gridHelper args={[40, 40, "#888888", "#444444"]} />}
          </Canvas>
        </Box>

      </div>
    )
  }

  return (
    <>

      <Container ref={downloadRef} sx={{ height: { xs: 'auto', md: '400px' } }}>
        {render3DChart()}
      </Container>

    </>
  )
}




export default Graphs3D