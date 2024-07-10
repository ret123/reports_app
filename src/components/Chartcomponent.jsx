// components/ReportBarChart.js
import React, { useRef } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { Box, Button, Grid } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ReportChart= ({ data, xAxisKey, yAxisKey }) => {
  const chartRef = useRef(null);

  const exportAsImage = async () => {
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'chart.png';
    link.click();
  };

  const exportAsPDF = async () => {
    const canvas = await html2canvas(chartRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 0, 0);
    pdf.save('chart.pdf');
  };

  return (
    <Box>
      <Grid container spacing={2} marginBottom={2}>
        <Grid item>
          <Button variant="contained" onClick={exportAsImage}>Export as Image</Button>
        </Grid>
        <Grid item>
          <Button variant="contained" onClick={exportAsPDF}>Export as PDF</Button>
        </Grid>
      </Grid>
      <Box ref={chartRef} sx={{ height: 400, width: '100%' }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yAxisKey} fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default ReportChart;
