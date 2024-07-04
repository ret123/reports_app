import React from 'react';
import { Bar } from 'react-chartjs-2';
import './ChartSetup'; // Import the ChartSetup file to ensure components are registered

const ChartComponent = ({ data }) => {
    console.log(data)
  const chartData = {
    labels: data.map(row => row.label),
    datasets: [
      {
        label: 'Sample Data',
        data: data.map(row => row.value),
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart Title',
      },
    },
  };

  return (
    <div>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ChartComponent;
