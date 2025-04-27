import React from 'react'
import { Pie } from 'react-chartjs-2';

function PieGraph({ downloadRef, graphData, graphTitle }) {
    const data = JSON.parse(graphData)
    const pieGraphOptions = {
        responsive: true,
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
        <Pie ref={downloadRef} options={pieGraphOptions} data={pieGraphData} />
    )
}

export default PieGraph