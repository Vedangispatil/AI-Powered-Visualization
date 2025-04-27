import React from 'react'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    BarElement,
    Colors
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Box } from '@mui/material';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    BarElement,
    Legend, PointElement, LineElement, ArcElement, Colors
);

function BarGraph({ downloadRef, graphData, graphTitle }) {
    const data = JSON.parse(graphData)

    const dataBar = {
        labels: data.map(rows => rows[Object.keys(rows)[0]]),
        datasets: Object.keys(data[0]).slice(1,).map((colName,) => ({
            label: colName,
            data: data.map(rows => rows[colName])

        }))

    };

    const optionsBar = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            datalabels: false,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: graphTitle,
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    title: (tooltipItems) => {
                        return tooltipItems[0].label;
                    },
                    label: (tooltipItem) => {
                        return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                    },
                },
            },
        },
        hover: {
            mode: 'index',
            intersect: false,

        },
    };

    return (
        <Box sx={{ width: '100%', height: '360px' }}>
            <Bar ref={downloadRef} height={'100%'} width={'100%'} options={optionsBar} data={dataBar} />
        </Box>
    )
}

export default BarGraph