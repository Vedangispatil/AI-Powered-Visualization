import { Box } from '@mui/material';
import React from 'react'
import { Scatter } from 'react-chartjs-2';

function ScatterGraph({ downloadRef, graphData,graphTitle }) {
  const data = JSON.parse(graphData)
      const scatterGraphOptions = {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
              datalabels: {
                  display: false
              },
              legend: {
                  position: 'bottom',
              },
              title: {
                  display: true,
                  text:graphTitle,
              }
          },
      };
      const scatterGraphData = {
          labels: data.map(rows => rows[Object.keys(rows)[0]]),
          datasets: Object.keys(data[0]).map((colName) => ({
              label: colName,
              data: data.map((rows, index) => ({x:index, y:rows[colName]}))
          }))
      };
  return (
    <Box sx={{width:'100%', height:'360px'}}>
        <Scatter ref={downloadRef} height={'100%'} width={'100%'} options={scatterGraphOptions} data={scatterGraphData} />
    </Box>
     
  )
}

export default ScatterGraph