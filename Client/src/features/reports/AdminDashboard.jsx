import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Stack, 
  Button, 
  Divider,
  Paper,
  CircularProgress,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { 
  People, 
  Layers, 
  AutoStories, 
  AssignmentInd,
  TrendingUp,
  AccountTree
} from '@mui/icons-material';
import { PieChart } from '@mui/x-charts';

import * as reportApi from '../../api/reports.api';
import { STUDENT_STATUS } from '../../utils/constants';

// Custom theme to match Staxhaus brand
const theme = createTheme({
  palette: {
    primary: { main: '#E8391D' },
    secondary: { main: '#1E2126' },
    background: { default: '#F7F7F5' }
  },
  typography: {
    fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em' },
    h6: { fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' },
  },
  shape: { borderRadius: 24 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 32,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.03)',
        }
      }
    }
  }
});

const AdminDashboard = () => {
  const { data: response, isLoading } = useQuery({
    queryKey: ['adminOverview'],
    queryFn: reportApi.getAdminOverview,
  });

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress color="primary" thickness={6} />
      </Box>
    );
  }

  const { kpis, students, invitations } = response.data;

  // Formatting data for MUI X Charts
  const studentData = [
    { label: 'Active', value: students[STUDENT_STATUS.ACTIVE], color: '#2e7d32' },
    { label: 'Discontinued', value: students[STUDENT_STATUS.DISCONTINUED], color: '#ed6c02' },
    { label: 'Terminated', value: students[STUDENT_STATUS.TERMINATED], color: '#d32f2f' },
  ].filter(d => d.value > 0);

  const inviteData = [
    { label: 'Pending', value: invitations.pending, color: '#9e9e9e' },
    { label: 'Accepted', value: invitations.accepted, color: '#2e7d32' },
    { label: 'Expired', value: invitations.expired, color: '#E8391D' },
  ].filter(d => d.value > 0);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" color="secondary" sx={{ fontSize: '2.5rem' }}>
              Institute Intelligence
            </Typography>
            <Typography variant="body1" color="text.secondary" fontWeight={600}>
              High-level overview of Staxhaus core operations.
            </Typography>
          </Box>
          <Button variant="contained" startIcon={<AccountTree />} disableElevation sx={{ borderRadius: 4 }}>
            System Map
          </Button>
        </Box>

        {/* KPI Grid */}
        <Grid container spacing={3}>
          {[
            { label: 'Total Students', value: kpis.totalStudents, icon: <People />, color: '#1976d2' },
            { label: 'Active Batches', value: kpis.activeBatches, icon: <Layers />, color: '#E8391D' },
            { label: 'Active Courses', value: kpis.totalCourses, icon: <AutoStories />, color: '#9c27b0' },
            { label: 'Facilitators', value: kpis.totalFacilitators, icon: <AssignmentInd />, color: '#2e7d32' },
          ].map((stat, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card sx={{ transition: 'all 0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' } }}>
                <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{ p: 2, bgcolor: `${stat.color}10`, color: stat.color, borderRadius: 4 }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.1em' }}>
                      {stat.label.toUpperCase()}
                    </Typography>
                    <Typography variant="h4" fontWeight={900} sx={{ fontFamily: 'Outfit' }}>{stat.value}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 4, height: 500 }}>
              <Typography variant="h6" color="secondary" gutterBottom>Student Distribution</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ mb: 4, display: 'block' }}>
                Status breakdown across all registered profiles.
              </Typography>
              <Box sx={{ width: '100%', height: 350, display: 'flex', justifyContent: 'center' }}>
                {studentData.length > 0 ? (
                  <PieChart
                    series={[{
                      data: studentData,
                      innerRadius: 80,
                      outerRadius: 120,
                      paddingAngle: 5,
                      cornerRadius: 5,
                    }]}
                    width={400}
                    height={300}
                  />
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'text.secondary' }}>
                    No student data available
                  </Box>
                )}
              </Box>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ p: 4, height: 500 }}>
              <Typography variant="h6" color="secondary" gutterBottom>Invitation Funnel</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ mb: 4, display: 'block' }}>
                Onboarding efficiency and acceptance metrics.
              </Typography>
              <Box sx={{ width: '100%', height: 350, display: 'flex', justifyContent: 'center' }}>
                {inviteData.length > 0 ? (
                  <PieChart
                    series={[{
                      data: inviteData,
                      innerRadius: 80,
                      outerRadius: 120,
                      paddingAngle: 5,
                      cornerRadius: 5,
                    }]}
                    width={400}
                    height={300}
                  />
                ) : (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'text.secondary' }}>
                    No invitation data available
                  </Box>
                )}
              </Box>
            </Card>
          </Grid>
        </Grid>

      </Box>
    </ThemeProvider>
  );
};

export default AdminDashboard;
