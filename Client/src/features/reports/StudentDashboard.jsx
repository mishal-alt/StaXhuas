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
  CircularProgress,
  ThemeProvider,
  createTheme,
  Divider,
  Paper
} from '@mui/material';
import { 
  School, 
  CalendarToday, 
  Assignment, 
  WorkspacePremium, 
  Schedule, 
  Message,
  TrendingUp,
  Stars,
  GroupWork,
  CheckCircle
} from '@mui/icons-material';
import { PieChart } from '@mui/x-charts';

import * as reportApi from '../../api/reports.api';

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

const ATTENDANCE_DATA = [
  { label: 'Present', value: 85, color: '#2e7d32' },
  { label: 'Late', value: 5, color: '#ed6c02' },
  { label: 'Half Day', value: 3, color: '#ff9800' },
  { label: 'Excused', value: 2, color: '#d32f2f' },
  { label: 'Unexcused', value: 1, color: '#f44336' },
  { label: 'No Status', value: 4, color: '#9e9e9e' },
];

const StudentDashboard = ({ user }) => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, pb: 12 }}>
        
        {/* Welcome Header */}
        <Card sx={{ bgcolor: 'white', overflow: 'hidden', position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: 0, right: 0, width: 250, height: 250, bgcolor: 'rgba(232, 57, 29, 0.03)', borderRadius: '0 0 0 100%' }} />
          <CardContent sx={{ p: 6, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6, alignItems: 'center', position: 'relative' }}>
             <Avatar sx={{ width: 100, height: 100, bgcolor: 'secondary.main', fontSize: '2.5rem', fontWeight: 900, borderRadius: 5 }}>{user?.name?.[0]}</Avatar>
             <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
               <Typography variant="caption" color="primary" fontWeight={900} sx={{ letterSpacing: '0.2em' }}>WELCOME TO STAXHAUS</Typography>
               <Typography variant="h4" color="secondary" sx={{ mt: 0.5 }}>Hi {user?.name.split(' ')[0]},</Typography>
               <Stack direction="row" spacing={3} sx={{ mt: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Chip icon={<GroupWork sx={{ fontSize: 16 }} />} label="BATCH: C58" size="small" variant="outlined" sx={{ fontWeight: 900, borderRadius: 2 }} />
                  <Chip icon={<CalendarToday sx={{ fontSize: 16 }} />} label="WEEK: 23" size="small" variant="outlined" sx={{ fontWeight: 900, borderRadius: 2 }} />
                  <Chip label="ACTIVE" size="small" color="success" sx={{ fontWeight: 900, borderRadius: 2 }} />
               </Stack>
             </Box>
          </CardContent>
        </Card>

        <Grid container spacing={4}>
           {/* Left Column: Stats & Lists */}
           <Grid item xs={12} lg={8}>
              <Stack spacing={4}>
                <Grid container spacing={3}>
                   <Grid item xs={12} md={6}>
                      <Card sx={{ transition: 'all 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
                        <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                           <Box sx={{ p: 2, bgcolor: 'rgba(25, 118, 210, 0.05)', color: '#1976d2', borderRadius: 4 }}><Schedule /></Box>
                           <Box>
                             <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.1em' }}>ATTENDANCE SCORE</Typography>
                             <Typography variant="h4" fontWeight={900} color="secondary">92%</Typography>
                           </Box>
                        </CardContent>
                      </Card>
                   </Grid>
                   <Grid item xs={12} md={6}>
                      <Card sx={{ transition: 'all 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
                        <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                           <Box sx={{ p: 2, bgcolor: 'rgba(76, 175, 80, 0.05)', color: '#2e7d32', borderRadius: 4 }}><WorkspacePremium /></Box>
                           <Box>
                             <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.1em' }}>AVG. INTERVIEW SCORE</Typography>
                             <Typography variant="h4" fontWeight={900} color="secondary">8.5 <span style={{ fontSize: '1rem', opacity: 0.5 }}>/ 10</span></Typography>
                           </Box>
                        </CardContent>
                      </Card>
                   </Grid>
                </Grid>

                <Grid container spacing={4}>
                   <Grid item xs={12} md={6}>
                      <Stack spacing={3}>
                        <Typography variant="h6" color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Assignment color="primary" /> Upcoming Sessions
                        </Typography>
                        <Card sx={{ borderStyle: 'dashed', border: '1px solid', borderColor: 'divider' }}>
                          <CardContent sx={{ p: 3 }}>
                             <Box sx={{ p: 2.5, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 4, mb: 2 }}>
                               <Typography variant="subtitle2" fontWeight={900}>Technical Interview #3</Typography>
                               <Typography variant="caption" color="text.secondary" fontWeight={700}>MAY 15, 2026 • 10:00 AM</Typography>
                               <Box sx={{ mt: 1.5 }}><Chip label="SCHEDULED" size="small" variant="outlined" sx={{ fontWeight: 900, borderRadius: 2 }} /></Box>
                             </Box>
                             <Typography variant="caption" color="text.disabled" sx={{ textAlign: 'center', display: 'block' }}>No other interviews scheduled yet.</Typography>
                          </CardContent>
                        </Card>
                      </Stack>
                   </Grid>

                   <Grid item xs={12} md={6}>
                      <Stack spacing={3}>
                        <Typography variant="h6" color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Message color="primary" /> Recent Feedback
                        </Typography>
                        <Card sx={{ bgcolor: 'secondary.main', color: 'white' }}>
                          <CardContent sx={{ p: 3 }}>
                             <Box sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 4 }}>
                               <Typography variant="body2" sx={{ fontStyle: 'italic', opacity: 0.8, mb: 3 }}>
                                 "Great understanding of React hooks. Need to work more on CSS Grid layouts."
                               </Typography>
                               <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <Typography variant="caption" fontWeight={900}>— FACILITATOR JOHN</Typography>
                                  <Chip label="8 / 10" size="small" color="primary" sx={{ fontWeight: 900 }} />
                               </Stack>
                             </Box>
                          </CardContent>
                        </Card>
                      </Stack>
                   </Grid>
                </Grid>
              </Stack>
           </Grid>

           {/* Right Column: Attendance Pie Chart */}
           <Grid item xs={12} lg={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 4, borderBottom: '1px solid', borderColor: 'divider' }}>
                   <Typography variant="h6" fontWeight={900} color="secondary">Attendance Insight</Typography>
                   <Typography variant="caption" fontWeight={700} color="text.secondary">7-DAY HISTORICAL SNAPSHOT</Typography>
                </Box>
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                   <Box sx={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center', position: 'relative' }}>
                      <PieChart
                        series={[{
                          data: ATTENDANCE_DATA,
                          innerRadius: 60,
                          outerRadius: 100,
                          paddingAngle: 5,
                          cornerRadius: 5,
                        }]}
                        width={300}
                        height={250}
                      />
                      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
                         <Typography variant="caption" fontWeight={900} color="text.disabled" sx={{ display: 'block' }}>RECORDS</Typography>
                         <Typography variant="h4" fontWeight={900} color="secondary">92</Typography>
                      </Box>
                   </Box>
                   <Stack spacing={1.5} sx={{ width: '100%', mt: 4 }}>
                      <Grid container spacing={1}>
                        {ATTENDANCE_DATA.map(d => (
                          <Grid item xs={6} key={d.label}>
                             <Stack direction="row" spacing={1} alignItems="center">
                                <Box sx={{ width: 8, height: 8, bgcolor: d.color, borderRadius: '50%' }} />
                                <Typography variant="caption" fontWeight={900} color="text.secondary">{d.label.toUpperCase()}</Typography>
                             </Stack>
                          </Grid>
                        ))}
                      </Grid>
                   </Stack>
                </CardContent>
              </Card>
           </Grid>
        </Grid>

      </Box>
    </ThemeProvider>
  );
};

export default StudentDashboard;
