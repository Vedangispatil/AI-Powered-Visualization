import { Box } from '@mui/material';
import React from 'react'
import { Line } from 'react-chartjs-2';

function LineGraph({ downloadRef, graphData, graphTitle }) {
    const data = JSON.parse(graphData)
    const lineGraphOptions = {
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
    const lineGraphData = {
        labels: data.map(rows => rows[Object.keys(rows)[0]]),
        datasets: Object.keys(data[0]).slice(1,).map((colName) => ({
            label: colName,
            data: data.map(rows => rows[colName])
        }))
    };

    return (
        <Box sx={{ width: '100%', height: '380px' }}>
            <Line height={'100%'} width={'100%'} ref={downloadRef} options={lineGraphOptions} data={lineGraphData} />
        </Box>
    )
}

export default LineGraph