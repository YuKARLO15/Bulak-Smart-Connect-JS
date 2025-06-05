// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import {
//   Box,
//   Card,
//   CardContent,
//   Typography,
//   Button,
//   List,
//   ListItem,
//   CircularProgress,
//   Divider,
//   Chip
// } from '@mui/material';
// import { getApplications } from '../../UserBulakSmartConnect/ApplicationComponents/ApplicationData';
// import './RecentApplicationsAdmin.css';

// const RecentApplicationsAdmin = () => {
//   const [applications, setApplications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchApplications = async () => {
//       try {
//         setLoading(true);
//         const fetchedApplications = getApplications();
//         // Sort by date (newest first) and take only the 5 most recent
//         const sortedApplications = [...fetchedApplications]
//           .sort((a, b) => new Date(b.date) - new Date(a.date))
//           .slice(0, 5);
        
//         setApplications(sortedApplications);
//       } catch (err) {
//         setError('Error loading applications: ' + err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchApplications();
//   }, []);

//   const handleReviewApplication = (application) => {
//     navigate('/ApplicationDetails/' + application.id);
//   };

//   const StatusColor = status => {
//     switch (status) {
//       case 'Approved':
//         return '#4caf50'; // Green
//       case 'Pending':
//         return '#ff9800'; // Orange
//       case 'Declined':
//       case 'Denied':
//         return '#f44336'; // Red
//       default:
//         return '#184a5b'; // Default blue
//     }
//   };

//   const StatusBgColor = status => {
//     switch (status) {
//       case 'Approved':
//         return 'rgba(76, 175, 80, 0.1)'; // Light green
//       case 'Pending':
//         return 'rgba(255, 152, 0, 0.1)'; // Light orange
//       case 'Declined':
//       case 'Denied':
//         return 'rgba(244, 67, 54, 0.1)'; // Light red
//       default:
//         return 'rgba(24, 74, 91, 0.1)'; // Light blue
//     }
//   };

//   if (loading) {
//     return (
//       <Box className="RecentAppsAdminLoading">
//         <CircularProgress size={24} sx={{ color: '#184a5b' }} />
//         <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
//           Loading applications...
//         </Typography>
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box className="RecentAppsAdminError">
//         <Typography variant="body2" color="error">{error}</Typography>
//       </Box>
//     );
//   }

//   return (
//     <Card className="RecentAppsAdminCard">
//       <CardContent>
    
        
//         {applications.length === 0 ? (
//           <Typography variant="body2" sx={{ color: '#666', py: 2, textAlign: 'center' }}>
//             No recent applications found.
//           </Typography>
//         ) : (
//           <List disablePadding className="RecentAppsAdminList">
//             {applications.map((app, index) => (
//               <ListItem key={app.id || index} disablePadding sx={{ mb: 1 }} className="RecentAppsAdminItem">
//                 <Card
//                   className="RecentAppsAdminItemCard"
//                   elevation={0}
//                   sx={{
//                     borderLeft: `3px solid ${StatusColor(app.status)}`,
//                     width: '100%',
//                     backgroundColor: '#fff',
//                   }}
//                 >
//                   <CardContent sx={{ py: 1, px: 1.5 }}>
//                     <Box display="flex" justifyContent="space-between" alignItems="center">
//                       <Box>
//                         <Box display="flex" alignItems="center" mb={0.5}>
//                           <Typography
//                             className="RecentAppsAdminType"
//                             sx={{
//                               fontSize: '0.9rem',
//                               fontWeight: 500,
//                               color: '#184a5b',
//                             }}
//                           >
//                             {app.type}
//                           </Typography>
//                           <Chip
//                             label={app.status}
//                             size="small"
//                             sx={{
//                               ml: 1,
//                               height: '20px',
//                               fontSize: '0.7rem',
//                               fontWeight: 500,
//                               backgroundColor: StatusBgColor(app.status),
//                               color: StatusColor(app.status),
//                               borderRadius: '4px',
//                               '& .MuiChip-label': { px: 1 }
//                             }}
//                           />
//                         </Box>
                        
//                         <Typography className="RecentAppsAdminId" sx={{ fontSize: '0.75rem', color: '#666' }}>
//                           ID: {app.id || 'N/A'} • {app.date}
//                         </Typography>
//                       </Box>
                      
//                       <Button
//                         size="small"
//                         className="RecentAppsAdminReviewBtn"
//                         onClick={() => handleReviewApplication(app)}
//                         sx={{
//                           color: '#184a5b',
//                           border: '1px solid #8aacb5',
//                           textTransform: 'none',
//                           fontSize: '0.7rem',
//                           py: 0.3,
//                           px: 1,
//                           minWidth: '70px',
//                           '&:hover': {
//                             backgroundColor: 'rgba(24, 74, 91, 0.04)'
//                           }
//                         }}
//                       >
//                         Review
//                       </Button>
//                     </Box>
//                   </CardContent>
//                 </Card>
//               </ListItem>
//             ))}
//           </List>
//         )}
        
//         <Box display="flex" justifyContent="center" mt={1}>
//           <Button
//             size="small"
//             onClick={() => navigate('/ApplicationAdmin')}
//             sx={{
//               color: '#184a5b',
//               fontSize: '0.8rem',
//               textTransform: 'none',
//               '&:hover': {
//                 backgroundColor: 'rgba(24, 74, 91, 0.04)'
//               }
//             }}
//           >
//             View All Applications
//           </Button>
//         </Box>
//       </CardContent>
//     </Card>
//   );
// };

// export default RecentApplicationsAdmin;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  CircularProgress,
  Grid,
  Paper,
  Container
} from '@mui/material';
import { getApplications } from '../../UserBulakSmartConnect/ApplicationComponents/ApplicationData';
import './RecentApplicationsAdmin.css';
import BirthCertLogo from "./AdminDashboardAssets/BirthCertificate.png";

const RecentApplicationsAdmin = () => {
  const [applications, setApplications] = useState([]);
  const [statistics, setStatistics] = useState({
    birthCertificate: {
      pending: 0,
      approved: 0,
      declined: 0,
      total: 0
    },
    marriage: {
      pending: 0,
      approved: 0,
      declined: 0,
      total: 0
    },
    overall: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const fetchedApplications = getApplications();
        setApplications(fetchedApplications);
        
        // Calculate statistics
        const stats = {
          birthCertificate: {
            pending: 0,
            approved: 0,
            declined: 0,
            total: 0
          },
          marriage: {
            pending: 0,
            approved: 0,
            declined: 0,
            total: 0
          },
          overall: fetchedApplications.length
        };
        
        fetchedApplications.forEach(app => {
          // Check if application type is birth certificate
          if (app.type.toLowerCase().includes('birth certificate')) {
            stats.birthCertificate.total++;
            
            if (app.status.toLowerCase() === 'pending') {
              stats.birthCertificate.pending++;
            } else if (app.status.toLowerCase() === 'approved') {
              stats.birthCertificate.approved++;
            } else if (['declined', 'denied'].includes(app.status.toLowerCase())) {
              stats.birthCertificate.declined++;
            }
          }
          
          // Check if application type is marriage
          else if (app.type.toLowerCase().includes('marriage')) {
            stats.marriage.total++;
            
            if (app.status.toLowerCase() === 'pending') {
              stats.marriage.pending++;
            } else if (app.status.toLowerCase() === 'approved') {
              stats.marriage.approved++;
            } else if (['declined', 'denied'].includes(app.status.toLowerCase())) {
              stats.marriage.declined++;
            }
          }
        });
        
        setStatistics(stats);
      } catch (err) {
        setError('Error loading applications: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, []);

  const StatusColor = status => {
    switch (status) {
      case 'approved':
        return '#4caf50'; // Green
      case 'pending':
        return '#ff9800'; // Orange
      case 'declined':
        return '#f44336'; // Red
      default:
        return '#184a5b'; // Default blue
    }
  };

  if (loading) {
    return (
      <Box className="RecentAppsAdminLoading">
        <CircularProgress size={24} sx={{ color: '#184a5b' }} />
        <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
          Loading applications...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="RecentAppsAdminError">
        <Typography variant="body2" color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Card className="RecentAppsAdminCard">
      <CardContent>
        <Box mb={2} className="RecentAppsAdminHeader">
          <Typography variant="h6" className="ApplicationStatsTitle">
            Document Application 
          </Typography>
             <Box display="flex" justifyContent="end" mt={2}>
          <Button
            size="small"
              onClick={() => navigate('/ApplicationAdmin')}
              className='ApplicationStatsViewAllButton'
       
          >
            View All Applications
          </Button>
        </Box>
        </Box>
        
        <Container className="ApplicationStatsMainContainer">
        
        
        <Container className='StatAppointmentTypeContainer'>
           {/* Overall Stats */}

          {/* Birth Certificate Stats */}
            <Grid  className='StatsBirthContainer'>
    
              <Paper className="StatCard" elevation={1}>
                
              <Typography variant="subtitle1" className="StatCardTitle">
                Birth Certificate Applications
                </Typography>
                
              <Box className="StatNumbers">
                <Box className="StatItem">
                  <Typography variant="body2">Pending:</Typography>
                  <Typography variant="h6" sx={{ color: StatusColor('pending') }}>
                    {statistics.birthCertificate.pending}
                  </Typography>
                </Box>
                <Box className="StatItem">
                  <Typography variant="body2">Approved:</Typography>
                  <Typography variant="h6" sx={{ color: StatusColor('approved') }}>
                    {statistics.birthCertificate.approved}
                  </Typography>
                </Box>
                <Box className="StatItem">
                  <Typography variant="body2">Declined:</Typography>
                  <Typography variant="h6" sx={{ color: StatusColor('declined') }}>
                    {statistics.birthCertificate.declined}
                  </Typography>
                </Box>
             
              </Box>
            </Paper>
          </Grid>

          {/* Marriage Application Stats */}
             <Grid item xs={120} md={60} className='StatsMarriageContainer'>
            <Paper className="StatCard" elevation={1}>
              <Typography variant="subtitle1" className="StatCardTitle">
                Marriage Applications
              </Typography>
              <Box className="StatNumbers">
                <Box className="StatItem">
                  <Typography variant="body2">Pending:</Typography>
                  <Typography variant="h6" sx={{ color: StatusColor('pending') }}>
                    {statistics.marriage.pending}
                  </Typography>
                </Box>
                <Box className="StatItem">
                  <Typography variant="body2">Approved:</Typography>
                  <Typography variant="h6" sx={{ color: StatusColor('approved') }}>
                    {statistics.marriage.approved}
                  </Typography>
                </Box>
                <Box className="StatItem">
                  <Typography variant="body2">Declined:</Typography>
                  <Typography variant="h6" sx={{ color: StatusColor('declined') }}>
                    {statistics.marriage.declined}
                  </Typography>
                </Box>
          
              </Box>
            </Paper>
          </Grid>

         
          </Container>
            
          </Container>
        
     
      </CardContent>
    </Card>
  );
};

export default RecentApplicationsAdmin;