import React from 'react'
import { Text } from "@react-three/drei"

function PieGraph3D({ graphDataset, columns }) {
  if (!graphDataset || !graphDataset.labels || !graphDataset.datasets || graphDataset.datasets.length === 0) return null

  let { datasets } = graphDataset
  datasets = datasets.map(value=>({...value, data:value.data.reduce((acc, curr)=>acc+curr,0) }))
  const labels = datasets.map(data=>data.label)
  const dataset = datasets.map(data=>data.data) // Use the first dataset for pie chart
  const total = dataset.reduce((sum, value) => sum + value, 0)
  const radius = 3
  const height = 0.8
  const explodeOffset = 0.15 // Offset for exploded segments
  // console.log(datasets, dataset, labels)

  let startAngle = 0

  return (
    <group>
      {dataset.map((value, index) => {
        const angle = (value / total) * Math.PI * 2
        const midAngle = startAngle + angle / 2

        // Calculate position for exploded effect
        const explodeX = Math.sin(midAngle) * explodeOffset
        const explodeZ = Math.cos(midAngle) * explodeOffset

        const color = datasets[index].backgroundColor.replace("rgba(", "").replace(")", "").split(",")
            const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
        console.log(color, rgbColor)

        const segment = (
          <group key={index} position={[explodeX, 0, explodeZ]}>
            <mesh>
              <cylinderGeometry args={[radius, radius, height, 32, 1, false, startAngle, angle]} />
              <meshStandardMaterial color={rgbColor} />
            </mesh>

            {/* Add segment label at the edge */}
            <group position={[Math.sin(midAngle) * (radius + 0.5), 0, Math.cos(midAngle) * (radius + 0.5)]}>
              <Text
                position={[0, 0, 0]}
                fontSize={0.3}
                color="black"
                anchorX="center"
                anchorY="middle"
                rotation={[0, -midAngle, 0]}
              >
                {`${labels[index]}`}
              </Text>
            </group>
          </group>
        )

        startAngle += angle
        return segment
      })}

      {/* Top face of the pie */}
      {/* <group position={[0, height / 2 + 0.01, 0]}>
        {dataset.map((value, index) => {
          const angle = (value / total) * Math.PI * 2
          const midAngle = startAngle + angle / 2

          // Calculate position for exploded effect
          const explodeX = Math.sin(midAngle) * explodeOffset
          const explodeZ = Math.cos(midAngle) * explodeOffset

          const color = datasets[index].backgroundColor.replace("rgba(", "").replace(")", "").split(",")
            const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`

          // Create a shape for the top face of each segment
          const shape = new THREE.Shape()
          shape.moveTo(0, 0)
          shape.lineTo(Math.sin(startAngle) * radius, Math.cos(startAngle) * radius)

          // Add the arc
          const arcCurve = new THREE.EllipseCurve(0, 0, radius, radius, startAngle, startAngle + angle, false, 0)

          const arcPoints = arcCurve.getPoints(32)
          arcPoints.forEach((point) => {
            shape.lineTo(point.x, point.y)
          })

          shape.lineTo(0, 0)

          const segment = (
            <group key={`top-${index}`} position={[explodeX, 0, explodeZ]}>
              <mesh rotation={[-Math.PI / 2, 0, 0]}>
                <shapeGeometry args={[shape]} />
                <meshStandardMaterial color={rgbColor} side={THREE.DoubleSide} />
              </mesh>
            </group>
          )

          startAngle += angle
          return segment
        })}
      </group> */}

     
      <group position={[0, 5, 0]} >
        {labels.map((label, index) => {
          const color = datasets[index].backgroundColor.replace("rgba(", "").replace(")", "").split(",")
            const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
          const xPos = (index - (graphDataset.labels.length - 1) / 2) * 1.5

          return (
            <group key={index} position={[xPos, 0, 0]}>
              <mesh position={[-0.200, 0, 0]}>
                <boxGeometry args={[0.3, 0.3, 0.3]} />
                <meshStandardMaterial color={rgbColor} />
              </mesh>
              <Text position={[0.2, 0, 0]} fontSize={0.25} color="black" anchorX="left" anchorY="middle">
                {`${label}`}
              </Text>
            </group>
          )
        })}
      </group>
    </group>
  )
}

export default PieGraph3D