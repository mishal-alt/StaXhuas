import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Stack, 
  Chip, 
  Avatar, 
  Divider,
  Paper,
  LinearProgress,
  ThemeProvider,
  createTheme,
  Button,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  BarChart as BarChartIcon, 
  School, 
  Assignment, 
  Schedule, 
  CheckCircle, 
  TrendingUp, 
  Message,
  Assessment,
  CalendarToday,
  GroupWork,
  NavigateNext
} from '@mui/icons-material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

import AppShell from '../components/layout/AppShell';
import { useAuth } from '../context/AuthContext';
import * as interviewApi from '../api/interviews.api';

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

const PERFORMANCE_DATA = [
  { module: 'Module 10', score: 83, status: 'Good' },
  { module: 'Module 9', score: 80, status: 'Good' },
  { module: 'Module 8', score: 76, status: 'Average' },
  { module: 'Module 7', score: 58, status: 'WeekBack' },
  { module: 'Module 6', score: 80, status: 'Good' },
  { module: 'Module 5', score: 72, status: 'Average' },
  { module: 'Module 4', score: 80, status: 'Good' },
  { module: 'Module 3', score: 80, status: 'Good' },
  { module: 'Module 2', score: 80, status: 'Good' },
  { module: 'Module 1', score: 85, status: 'Good' },
];

const StudentAcademics = () => {
  const { user } = useAuth();
  const { data: interviewsRes } = useQuery({
    queryKey: ['my-interviews'],
    queryFn: () => interviewApi.getInterviews()
  });

  const getColor = (score) => {
    if (score >= 80) return '#2e7d32'; // Good - Green
    if (score >= 70) return '#ed6c02'; // Average - Yellow
    if (score >= 60) return '#e8391d'; // Below Average - Orange
    return '#d32f2f'; // WeekBack - Red
  };

  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, pb: 12 }}>
          
          {/* Header */}
          <Box sx={{
            pt: 4,
            pb: 3,
            px: 6,
            mx: -6,
            mt: -6,
            background: 'white',
            borderBottom: '1px solid #E5E7EB',
            mb: 3
          }}>
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
                DASHBOARD
              </MuiLink>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.primary' }}>
                ACADEMICS
              </Typography>
            </Breadcrumbs>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                bgcolor: 'rgba(232, 57, 29, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.main'
              }}>
                <School />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={900} sx={{ fontSize: '1.5rem', color: '#1E2126', lineHeight: 1.2 }}>
                  My Academic Profile
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Review your module-wise performance and evaluation history.
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Current Module Highlight */}
          <Card sx={{ borderLeft: '10px solid', borderColor: '#1976d2', bgcolor: 'white' }}>
            <CardContent sx={{ p: 4 }}>
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={5}>
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Box sx={{ p: 2, bgcolor: 'rgba(25, 118, 210, 0.05)', color: '#1976d2', borderRadius: 4 }}>
                      <GroupWork sx={{ fontSize: 32 }} />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={900} color="secondary">Group Project Module 1</Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                        <Chip label="MODULE 4" size="small" color="primary" sx={{ fontWeight: 900, borderRadius: 2, fontSize: '0.65rem' }} />
                        <Chip label="ACTIVE COHORT" size="small" variant="outlined" sx={{ fontWeight: 900, borderRadius: 2, fontSize: '0.65rem' }} />
                      </Stack>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={6} md={2}>
                  <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, letterSpacing: '0.1em' }}>
                    <CalendarToday sx={{ fontSize: 14 }} /> DATE
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={900}>05 MAY 2026</Typography>
                </Grid>

                <Grid item xs={6} md={2}>
                  <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, letterSpacing: '0.1em' }}>
                    <Schedule sx={{ fontSize: 14 }} /> TIME
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={900}>NIL</Typography>
                </Grid>

                <Grid item xs={12} md={3}>
                  <Button fullWidth variant="outlined" color="secondary" disabled sx={{ borderStyle: 'dashed', borderRadius: 4 }}>
                    Link Pending
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Mini Analytics */}
          <Grid container spacing={4}>
            {[
              { label: 'Attendance', score: '91%', icon: <Schedule color="primary" />, color: '#1976d2' },
              { label: 'Discipline', score: '82%', icon: <Assessment color="primary" />, color: '#ed6c02' },
              { label: 'Task Completion', score: '64%', icon: <CheckCircle color="primary" />, color: '#2e7d32' },
              { label: 'Review Score', score: '74%', icon: <Message color="primary" />, color: '#673ab7' },
            ].map((stat, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card sx={{ transition: 'all 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" spacing={3} alignItems="center" sx={{ mb: 3 }}>
                       <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: '50%' }}>{stat.icon}</Box>
                       <Box>
                         <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.1em' }}>{stat.label.toUpperCase()}</Typography>
                         <Typography variant="h4" fontWeight={900} color="secondary" sx={{ fontFamily: 'Outfit' }}>{stat.score}</Typography>
                       </Box>
                    </Stack>
                    <Box sx={{ width: '100%', height: 4, bgcolor: 'action.hover', borderRadius: 2, overflow: 'hidden' }}>
                       <Box sx={{ width: stat.score, height: '100%', bgcolor: stat.color }} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Performance Chart Card */}
          <Card>
            <Box sx={{ p: 4, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <Box>
                 <Typography variant="h6" fontWeight={900} color="secondary">Module Performance Analytics</Typography>
                 <Typography variant="caption" fontWeight={700} color="text.secondary">HISTORICAL DATA FROM LAST 10 EVALUATIONS</Typography>
               </Box>
               <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
                  {['GOOD', 'AVERAGE', 'BELOW AVG', 'WEEKBACK'].map((tag, i) => (
                    <Box key={tag} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                       <Box sx={{ width: 8, height: 8, bgcolor: i === 0 ? '#2e7d32' : i === 1 ? '#ed6c02' : i === 2 ? '#e8391d' : '#d32f2f', borderRadius: '50%' }} />
                       <Typography variant="caption" fontWeight={900} color="text.secondary">{tag}</Typography>
                    </Box>
                  ))}
               </Stack>
            </Box>
            <CardContent sx={{ p: 6 }}>
               <Box sx={{ height: 400, width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={PERFORMANCE_DATA}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="module" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9ca3af' }}
                        dy={10}
                      />
                      <YAxis 
                        domain={[0, 100]} 
                        axisLine={false} 
                        tickLine={false}
                        tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9ca3af' }}
                      />
                      <RechartsTooltip 
                        cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                        contentStyle={{ borderRadius: 16, border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', padding: 16 }}
                      />
                      <Bar dataKey="score" radius={[8, 8, 0, 0]} barSize={40}>
                        {PERFORMANCE_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getColor(entry.score)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
               </Box>
               <Typography variant="caption" fontWeight={900} color="text.disabled" sx={{ display: 'block', textAlign: 'center', mt: 4, letterSpacing: '0.4em' }}>
                  ACADEMIC PROGRESSION TIMELINE
               </Typography>
            </CardContent>
          </Card>

        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default StudentAcademics;
