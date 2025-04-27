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
        datasets: Object.keys(data[0]).slice(1,).map((colName, index) => ({
            label: colName,
            data: data.map(rows => rows[colName])//Object.keys(rows).slice(index+1,).map(data=>)

        }))

    };

    const optionsBar = {
        responsive: true,
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
        <Bar ref={downloadRef} data={dataBar} options={optionsBar} />
    )
}

export default BarGraph