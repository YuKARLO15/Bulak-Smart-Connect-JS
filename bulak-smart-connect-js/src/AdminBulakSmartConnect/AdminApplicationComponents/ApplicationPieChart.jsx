import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { documentApplicationService } from '../../services/documentApplicationService';
import './ApplicationPieChart.css';
import logger from '../../utils/logger';

const ApplicationPieChart = ({ applications: propApplications }) => {
  const [applications, setApplications] = useState(propApplications || []);
  const [loading, setLoading] = useState(!propApplications);
  const [error, setError] = useState(null);

  // Fetch applications from backend if not provided as props
  useEffect(() => {
    const fetchApplications = async () => {
      // If applications are provided as props, use them
      if (propApplications) {
        setApplications(propApplications);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        logger.log('Fetching applications for pie chart...');
        
        const data = await documentApplicationService.getAllApplications();
        logger.log('Fetched applications:', data);
        
        setApplications(data || []);
      } catch (err) {
        logger.error('Error fetching applications for pie chart:', err);
        setError('Failed to load application data');
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [propApplications]);

  // Calculate counts for different application statuses by type
 const getStatusCounts = () => {
  logger.log('Processing applications for pie chart:', applications);

  const stats = {
    birthCertificate: {
      pending: 0,
      approved: 0,
      declined: 0,
    },
    marriage: {
      pending: 0,
      approved: 0,
      declined: 0,
    },
  };

  applications.forEach(app => {
    logger.log(`Pie Chart - Application: Type=${app.type || app.applicationType}, Status=${app.status}`);

    // Check application type - make case-insensitive checks to improve matching
    const appType = (app.type || app.applicationType || '').toLowerCase();
    let docCategory = null;

    // Determine the category based on application type (same logic as RecentApplicationsAdmin)
    if (appType.includes('marriage')) {
      docCategory = 'marriage';
    } else if (appType.includes('birth') || appType.includes('certificate')) {
      docCategory = 'birthCertificate';
    }

    // If we identified a category, update stats
    if (docCategory) {
      // Process status - normalize to handle different status formats (same logic as RecentApplicationsAdmin)
      const status = (app.status || '').toLowerCase();

      if (status.includes('pending') || status.includes('submitted') || status === '') {
        stats[docCategory].pending++;
      } else if (status.includes('approved') || status.includes('accept')) {
        stats[docCategory].approved++;
      } else if (
        status.includes('declined') ||
        status.includes('decline') ||
        status.includes('denied') ||
        status.includes('reject')
      ) {
        stats[docCategory].declined++;
      } else {
        // Default to pending for any other status
        stats[docCategory].pending++;
      }
    }
  });

  logger.log('Pie Chart - Calculated statistics:', stats);

  return [
    { name: 'Birth - Pending', value: stats.birthCertificate.pending, color: '#FFA726' },
    { name: 'Birth - Approved', value: stats.birthCertificate.approved, color: '#66BB6A' },
    { name: 'Birth - Declined', value: stats.birthCertificate.declined, color: '#EF5350' },
    { name: 'Marriage - Pending', value: stats.marriage.pending, color: '#F7CB73' },
    { name: 'Marriage - Approved', value: stats.marriage.approved, color: '#8DC3A7' },
    { name: 'Marriage - Declined', value: stats.marriage.declined, color: '#D9512C' },
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

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
  }) => {
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

  if (loading) {
    return (
      <div className="ApplicationPieChartContainer">
        <h4 className="ApplicationPieChartTitle">Application Status Distribution</h4>
        <div className="ApplicationPieChartNoData">
          <p>Loading application data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ApplicationPieChartContainer">
        <h4 className="ApplicationPieChartTitle">Application Status Distribution</h4>
        <div className="ApplicationPieChartNoData">
          <p>{error}</p>
        </div>
      </div>
    );
  }

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