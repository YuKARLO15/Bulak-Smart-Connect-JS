import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './ApplicationPieChart.css';

const ApplicationPieChart = ({ applications }) => {
  // Calculate counts for different application statuses by type
  const getStatusCounts = () => {
    const birthPending = applications.filter(app => app.type === 'Birth Certificate' && app.status === 'Pending').length;
    const birthApproved = applications.filter(app => app.type === 'Birth Certificate' && app.status === 'Approved').length;
    const birthDenied = applications.filter(app => app.type === 'Birth Certificate' && (app.status === 'Denied' || app.status === 'Decline')).length;
    
    const marriagePending = applications.filter(app => app.type === 'Marriage Certificate' || "Marriage License" && app.status === 'Pending').length;
    const marriageApproved = applications.filter(app => app.type === 'Marriage Certificate'|| "Marriage License"   && app.status === 'Approved').length;
    const marriageDenied = applications.filter(app => app.type === 'Marriage Certificate'  || "Marriage License"   && (app.status === 'Denied' || app.status === 'Decline')).length;
    
    return [
      { name: 'Birth - Pending', value: birthPending, color: '#FFA726' }, // Orange for pending
      { name: 'Birth - Approved', value: birthApproved, color: '#66BB6A' }, // Green for approved
      { name: 'Birth - Denied', value: birthDenied, color: '#EF5350' }, // Red for denied
      { name: 'Marriage - Pending', value: marriagePending, color: '#F7CB73' }, // Blue for pending
      { name: 'Marriage - Approved', value: marriageApproved, color: '#8DC3A7' }, // Teal for approved
      { name: 'Marriage - Denied', value: marriageDenied, color: '#D9512C' }, // Pink for denied
    ].filter(item => item.value > 0); // Only show segments that have data
  };

  const data = getStatusCounts();
  
  const COLORS = ['#FFA726', '#66BB6A', '#EF5350', '#42A5F5', '#26C6DA', '#EC407A'];
  
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0];
      
      return (
        <div className="CustomTooltip">
          <p className="TooltipLabel">{`${name}`}</p>
          <p className="TooltipData">{`Count: ${value}`}</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return percent > 0.08 ? (
      <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  return (
    <div className="ApplicationPieChartContainer">
      <h4 className="ApplicationPieChartTitle">Application Status Distribution</h4>
      {data.length === 0 ? (
        <div className="ApplicationPieChartNoData">
          <p>No application data to display</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend layout="vertical" align="right" verticalAlign="middle" />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ApplicationPieChart;