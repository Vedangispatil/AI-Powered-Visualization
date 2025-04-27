import { Text } from "@react-three/drei"
import * as THREE from "three"


function LineGraph3D({ graphDataset, columns }) {
  if (!graphDataset || !graphDataset.labels || !graphDataset.datasets) return null

  const { labels, datasets } = graphDataset
  const maxValue = Math.max(...datasets.flatMap((dataset) => dataset.data))
  const pointSpacing = 1.5
  const totalWidth = (labels.length - 1) * pointSpacing

  return (
    <group position={[-totalWidth / 2, 0, 0]}>
      {datasets.map((dataset, datasetIndex) => {
        const color = dataset.backgroundColor.replace("rgba(", "").replace(")", "").split(",")
        const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`
        const points = dataset.data.map((value, index) => [index * pointSpacing, (value / maxValue) * 5 || 0.1, 0])

        return (
          <group key={datasetIndex} position={[0, 0, datasetIndex * 1]}>
            {/* Line segments */}
            {points.map((point, index) => {
              if (index === 0) return null
              const prevPoint = points[index - 1]

              // Create a line between points
              const linePoints = []
              linePoints.push(new THREE.Vector3(prevPoint[0], prevPoint[1], prevPoint[2]))
              linePoints.push(new THREE.Vector3(point[0], point[1], point[2]))
              const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePoints)

              return (
                <line key={`line-${index}`} geometry={lineGeometry}>
                  <lineBasicMaterial color={rgbColor} linewidth={3} />
                </line>
              )
            })}

            {/* Points */}
            {points.map((point, index) => (
              <group key={`point-${index}`} position={point}>
                <mesh>
                  <sphereGeometry args={[0.15, 16, 16]} />
                  <meshStandardMaterial color={rgbColor} />
                </mesh>
              </group>
            ))}
          </group>
        )
      })}

      {/* X-axis labels */}
      {labels.map((label, index) => (
        <Text
          key={index}
          position={[index * pointSpacing, -0.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.3}
          color="black"
          anchorX="center"
          anchorY="middle"
          maxWidth={2}
        >
          {String(label).substring(0, 10)}
        </Text>
      ))}

      {/* Legend */}
      <group position={[totalWidth / 2 + 2, 2, 0]}>
        {datasets.map((dataset, index) => {
          const color = dataset.backgroundColor.replace("rgba(", "").replace(")", "").split(",")
          const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`

          return (
            <group key={index} position={[0, -index * 0.5, 0]}>
              <mesh position={[-0.5, 0, 0]}>
                <boxGeometry args={[0.3, 0.3, 0.3]} />
                <meshStandardMaterial color={rgbColor} />
              </mesh>
              <Text position={[0.2, 0, 0]} fontSize={0.25} color="black" anchorX="left" anchorY="middle">
                {dataset.label}
              </Text>
            </group>
          )
        })}
      </group>

      {/* X-axis label */}
      <Text
        position={[totalWidth / 2 - totalWidth / 2, -1.5, 0]}
        rotation={[0, 0, 0]}
        fontSize={0.4}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {columns[0]}
      </Text>
    </group>
  )
}

export default LineGraph3D