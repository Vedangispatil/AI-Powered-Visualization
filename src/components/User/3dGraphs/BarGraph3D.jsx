import { Text } from "@react-three/drei"


function BarGraph3D({ graphDataset, columns }) {
  if (!graphDataset || !graphDataset.labels || !graphDataset.datasets) return null

  const { labels, datasets, } = graphDataset
  // console.log(datasets)
  const maxValue = Math.max(...datasets.flatMap((dataset) => dataset.data))
  const barWidth = 0.8
  const groupSpacing = 2
  const barSpacing = 0.2
  const totalWidth = labels.length * (datasets.length * barWidth + (datasets.length - 1) * barSpacing + groupSpacing) - groupSpacing


  return (
    <group position={[-totalWidth / 2, 0, 0]}>
      {labels.map((label, labelIndex) => (
        <group
          key={labelIndex}
          position={[
            labelIndex * (datasets.length * barWidth + (datasets.length - 1) * barSpacing + groupSpacing),
            0,
            0,
          ]}
        >
          {datasets.map((dataset, datasetIndex) => {
            const height = (dataset.data[labelIndex] / maxValue) * 5 || 0.1
            const color = dataset.backgroundColor.replace("rgba(", "").replace(")", "").split(",")
            const rgbColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`


            return (
              <group key={datasetIndex} position={[datasetIndex * (barWidth + barSpacing), 0, 0]}>
                <mesh position={[0, height / 2, 0]}>
                  <boxGeometry args={[barWidth, height, barWidth]} />
                  <meshStandardMaterial color={rgbColor} />
                </mesh>
              </group>
            )
          })}
          <Text
            position={[(datasets.length * (barWidth + barSpacing) - barSpacing) / 2, -0.5, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={0.3}
            color="black"
            anchorX="center"
            anchorY="middle"
            maxWidth={2}
          >
            {String(labels[labelIndex]).substring(0, 10)}
          </Text>
        </group>
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
export default BarGraph3D