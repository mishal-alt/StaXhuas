import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  CircularProgress,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Button,
  Divider,
  Paper,
  ThemeProvider,
  createTheme,
  Breadcrumbs,
  Link as MuiLink,
  useMediaQuery
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  People,
  Layers,
  AutoStories,
  AssignmentInd,
  TrendingUp,
  AccountTree,
  Dashboard as DashboardIcon,
  NavigateNext
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

const AdminDashboardContent = () => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 4, md: 6 } }}>

      {/* Header */}
      <Box sx={{
        pt: 4,
        pb: 3,
        px: 6,
        mx: -6,
        mt: -6,
        background: 'white',
        borderBottom: '1px solid #E5E7EB',
        mb: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" sx={{ opacity: 0.5 }} />}
            sx={{ mb: 1.5 }}
          >
            <MuiLink
              component={RouterLink}
              to="/dashboard"
              underline="none"
              color="text.secondary"
              sx={{ fontSize: '0.75rem', fontWeight: 700, '&:hover': { color: 'primary.main' } }}
            >
              STAXHAUS
            </MuiLink>
            <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.primary' }}>
              DASHBOARD
            </Typography>
          </Breadcrumbs>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              bgcolor: 'primary.main',
              color: 'white',
              p: 1,
              borderRadius: 2,
              display: 'flex',
              boxShadow: '0 4px 12px rgba(232, 57, 29, 0.2)'
            }}>
              <DashboardIcon fontSize="medium" />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={900} color="text.primary" sx={{
                letterSpacing: '-0.02em',
                mb: 0.2,
                fontSize: '1.75rem',
                textTransform: 'none'
              }}>
                Institute Intelligence
              </Typography>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                High-level overview of Staxhaus core operations
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* KPI Grid - Strictly 4-column layout */}
      <Box sx={{ 
        width: '100%',
        display: 'grid',
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
        gap: { xs: 1.5, md: 2 },
        mb: 2
      }}>
        {[
          { label: 'Students', value: kpis.totalStudents, icon: <People />, color: '#1976d2' },
          { label: 'Batches', value: kpis.activeBatches, icon: <Layers />, color: '#E8391D' },
          { label: 'Courses', value: kpis.totalCourses, icon: <AutoStories />, color: '#9c27b0' },
          { label: 'Facilitators', value: kpis.totalFacilitators, icon: <AssignmentInd />, color: '#2e7d32' },
        ].map((stat, i) => (
          <Card key={i} sx={{
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' },
            borderRadius: '24px',
            border: '1px solid rgba(0,0,0,0.05)',
            height: { xs: 80, sm: 100 },
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            display: 'flex',
            alignItems: 'center',
            minWidth: 0,
            overflow: 'hidden'
          }}>
            <CardContent sx={{
              p: { xs: 1.5, sm: 2 },
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, sm: 1.5, md: 2 },
              width: '100%',
              '&:last-child': { pb: { xs: 1.5, sm: 2 } }
            }}>
              <Box sx={{
                p: { xs: 1, sm: 1.2, md: 1.5 },
                bgcolor: `${stat.color}10`,
                color: stat.color,
                borderRadius: 2.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {React.cloneElement(stat.icon, { sx: { fontSize: { xs: 18, sm: 20, md: 22 } } })}
              </Box>
              <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                <Typography 
                  variant="caption" 
                  fontWeight={900} 
                  color="text.secondary" 
                  sx={{ 
                    letterSpacing: '0.05em', 
                    display: 'block',
                    fontSize: { xs: '0.55rem', sm: '0.65rem', md: '0.7rem' },
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    lineHeight: 1
                  }}
                >
                  {stat.label.toUpperCase()}
                </Typography>
                <Typography 
                  variant="h4" 
                  fontWeight={900} 
                  sx={{ 
                    fontFamily: 'Outfit', 
                    color: 'secondary.main',
                    fontSize: { xs: '1.1rem', sm: '1.5rem', md: '1.8rem' },
                    mt: 0.3,
                    lineHeight: 1
                  }}
                >
                  {stat.value}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Charts Section */}
      <Grid container spacing={{ xs: 0, md: 6 }}>
        <Grid item xs={12} md={6}>
          <Card sx={{
            p: { xs: 3, md: 4 },
            height: { xs: 'auto', md: 500 },
            mx: { xs: -2, md: 0 },
            borderRadius: { xs: 0, md: '24px' },
            boxShadow: 'none',
            border: '1px solid rgba(0,0,0,0.05)',
            borderBottom: '1px solid #eee'
          }}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h6" color="secondary" gutterBottom>Student Distribution</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ mb: 4, display: 'block' }}>
                Status breakdown across all registered profiles.
              </Typography>
            </Box>
            <Box sx={{ width: '100%', height: { xs: 300, md: 350 }, display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
              {studentData.length > 0 ? (
                <PieChart
                  series={[{
                    data: studentData,
                    innerRadius: isMobile ? 60 : 80,
                    outerRadius: isMobile ? 90 : 120,
                    paddingAngle: 5,
                    cornerRadius: 5,
                  }]}
                  width={350}
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
          <Card sx={{
            p: { xs: 3, md: 4 },
            height: { xs: 'auto', md: 500 },
            mx: { xs: -2, md: 0 },
            borderRadius: { xs: 0, md: '24px' },
            boxShadow: 'none',
            border: '1px solid rgba(0,0,0,0.05)',
            borderBottom: '1px solid #eee'
          }}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h6" color="secondary" gutterBottom>Invitation Funnel</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ mb: 4, display: 'block' }}>
                Onboarding efficiency and acceptance metrics.
              </Typography>
            </Box>
            <Box sx={{ width: '100%', height: { xs: 300, md: 350 }, display: 'flex', justifyContent: 'center', overflow: 'hidden' }}>
              {inviteData.length > 0 ? (
                <PieChart
                  series={[{
                    data: inviteData,
                    innerRadius: isMobile ? 60 : 80,
                    outerRadius: isMobile ? 90 : 120,
                    paddingAngle: 5,
                    cornerRadius: 5,
                  }]}
                  width={350}
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
  );
};

const AdminDashboard = () => {
  return (
    <ThemeProvider theme={theme}>
      <AdminDashboardContent />
    </ThemeProvider>
  );
};
export default AdminDashboard;
