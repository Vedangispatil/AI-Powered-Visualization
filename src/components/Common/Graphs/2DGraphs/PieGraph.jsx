import { Box } from '@mui/material';
import React from 'react'
import { Pie } from 'react-chartjs-2';

function PieGraph({ downloadRef, graphData, graphTitle }) {
    const data = JSON.parse(graphData)
    const pieGraphOptions = {
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
                text: graphTitle,
            }
        },
    };
    const pieGraphData = {
        labels: Object.keys(data[0]),
        datasets: [{
            data: Object.keys(data[0]).map((colName) => data.reduce((acc, curr) => acc + curr[colName], 0))
        }]

    };
    return (
        <Box sx={{ width: '100%', height: '380px' }}>
            <Pie ref={downloadRef} height={'100%'} width={'100%'} options={pieGraphOptions} data={pieGraphData} />
        </Box>
    )

}

export default PieGraph