import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Box, Typography } from '@mui/material';

const ApplicationLineChart = ({ data }) => {

  const chartData = data || [
    { name: 'Jan', Birth: 15, Marriage: 20 },
    { name: 'Feb', Birth: 20, Marriage: 25 },
    { name: 'Mar', Birth: 10, Marriage: 15 },
    { name: 'Apr', Birth: 25, Marriage: 18 },
    { name: 'May', Birth: 30, Marriage: 20 },
    { name: 'Jun', Birth: 22, Marriage: 25 },
    { name: 'Jul', Birth: 28, Marriage: 22 },
    { name: 'Aug', Birth: 35, Marriage: 28 },
    { name: 'Sep', Birth: 32, Marriage: 30 },
    { name: 'Oct', Birth: 40, Marriage: 32 },
    { name: 'Nov', Birth: 45, Marriage: 28 },
    { name: 'Dec', Birth: 50, Marriage: 35 },
  ];

  return (
    <Box className="ApplicationDashChartContainer">
      <Box className="ApplicationDashChartHeader">
        <Typography variant="caption" color="textSecondary">
          Stats overview
        </Typography>
        <Box className="ApplicationDashChartLegend">
          <Box className="ApplicationDashChartLegendItem">
            <Box className="ApplicationDashChartLegendDot approved"></Box>
            <Typography variant="caption">Birth</Typography>
          </Box>
          <Box className="ApplicationDashChartLegendItem">
            <Box className="ApplicationDashChartLegendDot pending"></Box>
            <Typography variant="caption">Marriage</Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ width: '100%', height: 250, py: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: 'rgba(0,0,0,0.5)' }}
              axisLine={{ stroke: '#f0f0f0' }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: 'rgba(0,0,0,0.5)' }}
              axisLine={{ stroke: '#f0f0f0' }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                border: 'none',
              }}
            />
            <Line
              type="monotone"
              dataKey="Birth"
              stroke="green"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={{ r: 4, strokeWidth: 2 }}
            />
            <Line
              type="monotone"
              dataKey="Marriage"
              stroke="orange"
              strokeWidth={2}
              activeDot={{ r: 6 }}
              dot={{ r: 4, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
};

export default ApplicationLineChart;
