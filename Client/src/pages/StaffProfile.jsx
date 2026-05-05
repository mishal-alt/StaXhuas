import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Stack, 
  Avatar, 
  IconButton, 
  Grid, 
  Chip,
  Divider,
  CircularProgress,
  ThemeProvider,
  createTheme,
  Button
} from '@mui/material';
import { 
  ArrowBack, 
  Email, 
  Shield, 
  EventAvailable,
  Badge,
  TrendingUp,
  AssignmentTurnedIn,
  Groups
} from '@mui/icons-material';

import AppShell from '../components/layout/AppShell';
import * as userApi from '../api/users.api';
import { ROLES } from '../utils/constants';

const theme = createTheme({
  palette: {
    primary: { main: '#E8391D' },
    secondary: { main: '#1E2126' },
  },
  typography: {
    fontFamily: '"Outfit", sans-serif',
  },
  shape: { borderRadius: 16 }
});

const StaffProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: userRes, isLoading } = useQuery({
    queryKey: ['staff-profile', id],
    queryFn: () => userApi.getUserById(id)
  });

  if (isLoading) {
    return (
      <AppShell>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
          <CircularProgress color="primary" thickness={6} />
        </Box>
      </AppShell>
    );
  }

  const user = userRes?.data;

  const stats = [
    { label: 'Role', value: user?.role?.toUpperCase(), icon: <Shield sx={{ fontSize: 20 }} />, color: '#1E2126' },
    { label: 'Status', value: 'ACTIVE', icon: <EventAvailable sx={{ fontSize: 20 }} />, color: '#2E7D32' },
    { label: 'Assignments', value: user?.role === ROLES.FACILITATOR ? '4 Batches' : '12 Interviews', icon: <AssignmentTurnedIn sx={{ fontSize: 20 }} />, color: '#E8391D' },
    { label: 'Network', value: 'Verified', icon: <VerifiedUser sx={{ fontSize: 18 }} />, color: '#0288D1' }
  ];

  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ maxWidth: 1200, mx: 'auto', pb: 8 }}>
          
          {/* Header & Back Button */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 6 }}>
            <IconButton onClick={() => navigate(-1)} sx={{ bgcolor: 'white', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: 3 }}>
              <ArrowBack />
            </IconButton>
            <Typography variant="h5" fontWeight={900}>Staff Profile</Typography>
          </Stack>

          <Grid container spacing={4}>
            {/* Left Column: Profile Card */}
            <Grid item xs={12} lg={4}>
              <Card sx={{ borderRadius: 6, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Box sx={{ height: 120, bgcolor: 'secondary.main' }} />
                <CardContent sx={{ textAlign: 'center', mt: -7, px: 3 }}>
                  <Avatar 
                    sx={{ 
                      width: 110, 
                      height: 110, 
                      mx: 'auto', 
                      bgcolor: 'primary.main', 
                      fontSize: '2.5rem', 
                      fontWeight: 900,
                      border: '6px solid white',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                    }}
                  >
                    {user?.name?.[0]}
                  </Avatar>
                  <Typography variant="h5" fontWeight={900} sx={{ mt: 2.5 }}>{user?.name}</Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={800} sx={{ letterSpacing: '0.05em' }}>{user?.role?.toUpperCase()}</Typography>
                  
                  <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ bgcolor: 'rgba(0,0,0,0.02)', p: 2, borderRadius: 3, border: '1px solid rgba(0,0,0,0.03)' }}>
                      <Email color="action" sx={{ fontSize: 20 }} />
                      <Typography variant="body2" fontWeight={700}>{user?.email}</Typography>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ bgcolor: 'rgba(0,0,0,0.02)', p: 2, borderRadius: 3, border: '1px solid rgba(0,0,0,0.03)' }}>
                      <Badge color="action" sx={{ fontSize: 20 }} />
                      <Typography variant="body2" fontWeight={700}>ID: {user?._id?.slice(-6).toUpperCase()}</Typography>
                    </Stack>
                  </Box>

                </CardContent>
              </Card>
            </Grid>

            {/* Right Column: Stats & Activity */}
            <Grid item xs={12} lg={8}>
              <Stack spacing={4}>
                {/* Stats Grid */}
                <Grid container spacing={3}>
                  {stats.map((stat, index) => (
                    <Grid item xs={6} sm={3} key={index}>
                      <Card sx={{ textAlign: 'center', p: 3, height: '100%', borderRadius: 5, border: '1px solid rgba(0,0,0,0.03)', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
                        <Box sx={{ color: stat.color, mb: 1.5, display: 'flex', justifyContent: 'center' }}>{stat.icon}</Box>
                        <Typography variant="subtitle1" fontWeight={900}>{stat.value}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={800} sx={{ letterSpacing: '0.02em' }}>{stat.label}</Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {/* Performance Chart Placeholder */}
                <Card sx={{ borderRadius: 5, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                      <Typography variant="h6" fontWeight={900}>Performance Overview</Typography>
                      <TrendingUp color="primary" />
                    </Stack>
                    <Box sx={{ height: 220, bgcolor: 'rgba(0,0,0,0.01)', borderRadius: 4, border: '1px dashed rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Typography color="text.secondary" fontWeight={700}>Activity metrics visualizer coming soon</Typography>
                    </Box>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card sx={{ borderRadius: 5, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" fontWeight={900} sx={{ mb: 4 }}>Recent Activity</Typography>
                    <Stack spacing={3}>
                      {[1, 2, 3].map((_, i) => (
                        <Stack key={i} direction="row" spacing={3} alignItems="center">
                          <Box sx={{ width: 44, height: 44, borderRadius: 2.5, bgcolor: 'rgba(232, 57, 29, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <EventAvailable color="primary" sx={{ fontSize: 22 }} />
                          </Box>
                          <Box>
                            <Typography variant="body2" fontWeight={900}>Batch Session Completed</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={700}>2 hours ago • Full Stack Web Development</Typography>
                          </Box>
                        </Stack>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

// Internal component for VerifiedUser since it wasn't in imports
const VerifiedUser = (props) => (
  <Shield {...props} />
);

export default StaffProfile;
