import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
  Chip,
  LinearProgress,
  IconButton,
  Avatar,
  Divider,
  Paper,
  ThemeProvider,
  createTheme,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import {
  CalendarToday,
  People,
  Assignment,
  CheckCircle,
  Schedule,
  Info,
  ChevronRight,
  TrendingUp,
  Bolt,
  Layers,
  NavigateNext,
  Dashboard as DashboardIcon
} from '@mui/icons-material';

import * as batchApi from '../../api/batches.api';
import * as leaveApi from '../../api/leaves.api';

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
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 900,
          borderRadius: 16,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          padding: '10px 20px',
        }
      }
    },
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

const FacilitatorDashboard = ({ user }) => {
  const navigate = useNavigate();

  const { data: batchesRes, isLoading: batchesLoading } = useQuery({
    queryKey: ['facilitatorBatches'],
    queryFn: batchApi.getBatches,
  });

  const { data: leavesRes } = useQuery({
    queryKey: ['facilitatorLeaves'],
    queryFn: () => leaveApi ? leaveApi.getLeaves() : Promise.resolve({ data: [] }),
    enabled: !!user
  });

  if (batchesLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}>
        <CircularProgress color="primary" thickness={6} />
      </Box>
    );
  }

  const batches = batchesRes?.data || [];
  const totalStudents = batches.reduce((sum, b) => sum + (b.students?.length || 0), 0);
  const pendingLeaves = leavesRes?.data?.filter(l => l.status === 'pending').length || 0;

  const QUICK_ACTIONS = [
    { label: 'Mark Attendance', path: '/attendance', icon: <CheckCircle />, color: '#2e7d32' },
    { label: 'Review Leaves', path: '/leaves', icon: <Schedule />, color: '#1976d2' },
    { label: 'Start Scrum', path: '/scrum', icon: <People />, color: '#E8391D' },
    { label: 'Add Score', path: '/interviews', icon: <Assignment />, color: '#9c27b0' },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

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
                width: 48,
                height: 48,
                borderRadius: 2,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 12px rgba(232, 57, 29, 0.2)'
              }}>
                <DashboardIcon />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={900} color="text.primary" sx={{ letterSpacing: '-0.02em', mb: 0.2, fontSize: '1.75rem', textTransform: 'none' }}>
                  Facilitator Dashboard
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Welcome back, <b>{user?.name}</b>. Here's your mission for today.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Chip
            icon={<CalendarToday sx={{ color: 'primary.main !important' }} />}
            label={new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
            sx={{
              fontWeight: 900,
              px: 2,
              bgcolor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: 3,
              fontFamily: 'Outfit'
            }}
          />
        </Box>

        {/* Stats Section */}
        <Grid container spacing={3} justifyContent="center">
          {[
            { label: 'Active Batches', value: batches.filter(b => b.status !== 'completed').length, icon: <Bolt />, color: '#E8391D' },
            { label: 'Total Students', value: totalStudents, icon: <People />, color: '#1976d2' },
            { label: 'Pending Leaves', value: pendingLeaves, icon: <Info />, color: '#ed6c02' },
            { label: 'Network Health', value: '98%', icon: <TrendingUp />, color: '#2e7d32' },
          ].map((stat, i) => (
            <Grid item xs={12} sm={3} md={3} lg={3} key={i}>
              <Card sx={{
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' },
                borderRadius: '24px',
                border: '1px solid rgba(0,0,0,0.05)',
                height: '100%'
              }}>
                <CardContent sx={{ p: 2.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.2em' }}>
                      {stat.label}
                    </Typography>
                    <Typography variant="h3" fontWeight={900} sx={{ mt: 1, fontFamily: 'Outfit' }}>{stat.value}</Typography>
                  </Box>
                  <Box sx={{ p: 2, bgcolor: `${stat.color}10`, color: stat.color, borderRadius: 4 }}>
                    {stat.icon}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Main Grid */}
        <Grid container spacing={6}>
          {/* Batches Overview */}
          <Grid item xs={12} lg={8}>
            <Stack spacing={4}>
              <Typography variant="h6" color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <People sx={{ color: '#E8391D' }} /> Active Cohorts
              </Typography>
              <Grid container spacing={4}>
                {DUMMY_BATCHES.map((batch) => (
                  <Grid item xs={12} md={6} key={batch.id}>
                    <Card sx={{ position: 'relative', '&:hover': { borderColor: 'primary.main' }, border: '2px solid transparent', transition: 'all 0.3s' }}>
                      <CardContent sx={{ p: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                          <Typography variant="h5" fontWeight={900}>{batch.name}</Typography>
                          <Chip label="LIVE" size="small" color="success" sx={{ fontWeight: 900, borderRadius: 2 }} />
                        </Box>

                        <Stack spacing={2}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" fontWeight={900} color="text.secondary">CURRICULUM SYNC</Typography>
                            <Typography variant="caption" fontWeight={900}>{batch.progress}</Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={batch.fill}
                            sx={{ height: 8, borderRadius: 4, bgcolor: 'action.hover', '& .MuiLinearProgress-bar': { bgcolor: 'primary.main' } }}
                          />
                          <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid item xs={6}>
                              <Paper elevation={0} sx={{ bgcolor: 'background.default', p: 2, textAlign: 'center', borderRadius: 4 }}>
                                <Typography variant="caption" fontWeight={900} color="text.secondary">PROFILES</Typography>
                                <Typography variant="h6" fontWeight={900}>{batch.students}</Typography>
                              </Paper>
                            </Grid>
                            <Grid item xs={6}>
                              <Paper elevation={0} sx={{ bgcolor: 'background.default', p: 2, textAlign: 'center', borderRadius: 4 }}>
                                <Typography variant="caption" fontWeight={900} color="text.secondary">PRESENT</Typography>
                                <Typography variant="h6" fontWeight={900} color="success.main">{batch.attendance}</Typography>
                              </Paper>
                            </Grid>
                          </Grid>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </Grid>

          {/* Quick Actions & Schedule */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={6}>
              <Box>
                <Typography variant="h6" color="secondary" gutterBottom>Command Center</Typography>
                <Grid container spacing={2}>
                  {QUICK_ACTIONS.map((action, i) => (
                    <Grid item xs={6} key={i}>
                      <Button
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        onClick={() => navigate(action.path)}
                        sx={{
                          height: 120,
                          flexDirection: 'column',
                          gap: 1,
                          borderColor: 'rgba(0,0,0,0.05)',
                          bgcolor: 'white',
                          '&:hover': { bgcolor: 'primary.main', color: 'white', borderColor: 'primary.main' }
                        }}
                      >
                        <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 3, color: action.color, mb: 1 }}>
                          {action.icon}
                        </Box>
                        <Typography variant="caption" fontWeight={900}>{action.label}</Typography>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Card sx={{ borderTop: '8px solid #E8391D' }}>
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                    <Schedule sx={{ color: '#E8391D' }} /> Scrum Schedule
                  </Typography>
                  <Stack spacing={2}>
                    {DUMMY_BATCHES.map((batch) => (
                      <Box key={batch.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, bgcolor: 'action.hover', borderRadius: 4 }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={900}>{batch.name}</Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight={700}>NEXT SYNC</Typography>
                        </Box>
                        <Typography variant="body2" fontWeight={900} color="primary">{batch.nextScrum}</Typography>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default FacilitatorDashboard;

