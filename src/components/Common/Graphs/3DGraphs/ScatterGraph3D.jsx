import React from 'react'
import { Text } from "@react-three/drei"

const isNumeric = (value) => {
  return typeof value === "number" || (typeof value === "string" && !isNaN(Number(value)))
}

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


function ScatterGraph3D({ data, columns }) {
  if (!data || data.length === 0 || !columns || columns.length < 2) return null
  // Use first column for labels, all other columns for data points
  const labelColumn = columns[0]
  const dataColumns = columns.slice(1)

  // Create a mapping of label values to positions
  const uniqueLabels = [...new Set(data.map((item) => item[labelColumn]))]
  const labelPositions = {}
  uniqueLabels.forEach((label, index) => {
    labelPositions[label] = index
  })

  // Find max value for scaling
  const maxValue = Math.max(
    ...data.flatMap((item) => dataColumns.map((col) => (isNumeric(item[col]) ? Number(item[col]) : 0))),
  )

  // Calculate grid size based on data dimensions
  //const gridSize = Math.max(uniqueLabels.length * 2, dataColumns.length * 2, 20)

  return (
    <group>
      {/* Scatter plot points */}
      {data.map((item, itemIndex) => {
        return dataColumns.map((col, colIndex) => {
          const x = labelPositions[item[labelColumn]] * 2 - uniqueLabels.length
          const y = isNumeric(item[col]) ? (Number(item[col]) / maxValue) * 10 : 0
          const z = colIndex * 2 - dataColumns.length

          return (
            <group key={`${itemIndex}-${colIndex}`} position={[x, y, z]}>
              <mesh>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshStandardMaterial color={CHART_COLORS[colIndex % CHART_COLORS.length]} />
              </mesh>
            </group>
          )
        })
      })}

      {/* Axes */}
      <group position={[0, 0, 0]}>
        {/* X-axis */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[uniqueLabels.length * 2 + 2, 0.05, 0.05]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <Text position={[uniqueLabels.length + 1, 0, 0]} fontSize={0.4} color="black">
          {columns[0]}
        </Text>

        {/* Y-axis */}
        <mesh position={[0, 5, 0]}>
          <boxGeometry args={[0.05, 10.5, 0.05]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <Text position={[0, 11, 0]} fontSize={0.4} color="black">
          Values
        </Text>

        {/* Z-axis */}
        <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[dataColumns.length * 2 + 2, 0.05, 0.05]} />
          <meshStandardMaterial color="black" />
        </mesh>
        <Text position={[0, 0, dataColumns.length + 1]} fontSize={0.4} color="black">
          Data Series
        </Text>

        {/* X-axis labels */}
        {uniqueLabels.map((label, index) => (
          <Text
            key={`label-${index}`}
            position={[index * 2 - uniqueLabels.length + 1, -0.5, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.3}
            color="black"
            anchorX="center"
            anchorY="middle"
          >
            {String(label).substring(0, 8)}
          </Text>
        ))}

        {/* Column labels at the top */}
        <group position={[0, 12, 0]}>
          {dataColumns.map((col, index) => {
            const xPos = (index - (dataColumns.length - 1) / 2) * 2

            return (
              <group key={`col-${index}`} position={[xPos, 0, 0]}>
                <mesh position={[-0.5, 0, 0]}>
                  <boxGeometry args={[0.3, 0.3, 0.3]} />
                  <meshStandardMaterial color={CHART_COLORS[index % CHART_COLORS.length]} />
                </mesh>
                <Text position={[0.2, 0, 0]} fontSize={0.3} color="black" anchorX="left" anchorY="middle">
                  {String(col)}
                </Text>
              </group>
            )
          })}
        </group>
      </group>

      {/* Dynamic grid helper */}
      {/* <DynamicGridHelper size={gridSize} /> */}
    </group>
  )
}

export default ScatterGraph3D