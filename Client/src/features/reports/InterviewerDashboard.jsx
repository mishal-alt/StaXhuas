import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Stack, 
  Chip, 
  Avatar, 
  Button, 
  Paper,
  CircularProgress,
  ThemeProvider,
  createTheme,
  IconButton
} from '@mui/material';
import { 
  People, 
  CheckCircle, 
  Schedule, 
  Assessment, 
  ArrowForward, 
  CalendarToday,
  BarChart,
  AssignmentInd
} from '@mui/icons-material';

import * as interviewApi from '../../api/interviews.api';

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

const InterviewerDashboard = ({ user }) => {
  const navigate = useNavigate();
  const { data: interviewsRes, isLoading } = useQuery({
    queryKey: ['my-assigned-interviews'],
    queryFn: () => interviewApi.getInterviews()
  });

  const interviews = interviewsRes?.data || [];
  const pendingInterviews = interviews.filter(i => i.status !== 'scored');
  const completedInterviews = interviews.filter(i => i.status === 'scored');

  const stats = [
    { label: 'Assigned Total', value: interviews.length, icon: <People />, color: '#1976d2' },
    { label: 'Completed', value: completedInterviews.length, icon: <CheckCircle />, color: '#2e7d32' },
    { label: 'Pending Assessment', value: pendingInterviews.length, icon: <Schedule />, color: '#E8391D' },
  ];

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
        <CircularProgress color="primary" thickness={6} />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        
        {/* Welcome Hero */}
        <Card sx={{ bgcolor: 'white', overflow: 'hidden', position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: 0, right: 0, width: 200, height: 200, bgcolor: 'rgba(232, 57, 29, 0.03)', borderRadius: '0 0 0 100%' }} />
          <CardContent sx={{ p: 6, display: 'flex', alignItems: 'center', gap: 4, position: 'relative' }}>
             <Avatar sx={{ width: 80, height: 80, bgcolor: 'secondary.main', fontSize: '2rem', fontWeight: 900, borderRadius: 4 }}>{user?.name?.[0]}</Avatar>
             <Box>
               <Typography variant="caption" color="primary" fontWeight={900} sx={{ letterSpacing: '0.2em' }}>EVALUATOR PORTAL</Typography>
               <Typography variant="h4" color="secondary">Welcome, {user?.name}</Typography>
               <Typography variant="body2" color="text.secondary" fontWeight={600}>You have {pendingInterviews.length} pending evaluations to process today.</Typography>
             </Box>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Grid container spacing={3}>
           {stats.map((stat, i) => (
             <Grid item xs={12} md={4} key={i}>
               <Card sx={{ transition: 'all 0.3s', '&:hover': { transform: 'translateY(-5px)' } }}>
                 <CardContent sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3 }}>
                   <Box sx={{ p: 2, bgcolor: `${stat.color}10`, color: stat.color, borderRadius: 4 }}>{stat.icon}</Box>
                   <Box>
                      <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.1em' }}>{stat.label.toUpperCase()}</Typography>
                      <Typography variant="h4" fontWeight={900} color="secondary">{stat.value}</Typography>
                   </Box>
                 </CardContent>
               </Card>
             </Grid>
           ))}
        </Grid>

        <Grid container spacing={6}>
          {/* Action List */}
          <Grid item xs={12} lg={6}>
            <Stack spacing={4}>
               <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <Typography variant="h6" color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                   <AssignmentInd color="primary" /> UPCOMING SESSIONS
                 </Typography>
                 <Button size="small" onClick={() => navigate('/my-interviews')} endIcon={<ArrowForward />} sx={{ fontWeight: 900 }}>View All</Button>
               </Box>

               <Stack spacing={2}>
                 {pendingInterviews.slice(0, 4).map(interview => (
                   <Card 
                     key={interview._id} 
                     sx={{ cursor: 'pointer', transition: 'all 0.2s', '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(232, 57, 29, 0.02)' } }}
                     onClick={() => navigate(`/interviews/${interview._id}`)}
                   >
                     <CardContent sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Stack direction="row" spacing={3} alignItems="center">
                          <Avatar sx={{ bgcolor: 'action.hover', color: 'secondary.main', fontWeight: 900, borderRadius: 2 }}>{interview.student?.name?.[0]}</Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={900}>{interview.student?.name}</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={700}>{interview.module?.name}</Typography>
                          </Box>
                        </Stack>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="caption" fontWeight={900} color="text.disabled" sx={{ display: 'block' }}>SCHEDULED</Typography>
                          <Typography variant="subtitle2" fontWeight={900} color="primary">10:30 AM</Typography>
                        </Box>
                     </CardContent>
                   </Card>
                 ))}
                 {pendingInterviews.length === 0 && (
                   <Paper variant="outlined" sx={{ p: 8, textAlign: 'center', borderRadius: 8, borderStyle: 'dashed' }}>
                     <Typography color="text.disabled" fontWeight={900}>NO PENDING SESSIONS</Typography>
                   </Paper>
                 )}
               </Stack>
            </Stack>
          </Grid>

          {/* History Column */}
          <Grid item xs={12} lg={6}>
            <Stack spacing={4}>
               <Typography variant="h6" color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                 <CheckCircle color="success" /> RECENTLY COMPLETED
               </Typography>

               <Stack spacing={2}>
                 {completedInterviews.slice(0, 4).map(interview => (
                   <Card key={interview._id} sx={{ opacity: 0.7, border: 'none', bgcolor: 'rgba(0,0,0,0.02)' }}>
                     <CardContent sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Stack direction="row" spacing={3} alignItems="center">
                          <CheckCircle color="success" />
                          <Box>
                            <Typography variant="subtitle2" fontWeight={900}>{interview.student?.name}</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={700}>{interview.module?.name}</Typography>
                          </Box>
                        </Stack>
                        <Chip label="EVALUATED" size="small" color="success" sx={{ fontWeight: 900, fontSize: '0.6rem', borderRadius: 2 }} />
                     </CardContent>
                   </Card>
                 ))}
                 {completedInterviews.length === 0 && (
                   <Paper variant="outlined" sx={{ p: 8, textAlign: 'center', borderRadius: 8, borderStyle: 'dashed' }}>
                     <Typography color="text.disabled" fontWeight={900}>NO COMPLETED SESSIONS YET</Typography>
                   </Paper>
                 )}
               </Stack>
            </Stack>
          </Grid>
        </Grid>

      </Box>
    </ThemeProvider>
  );
};

export default InterviewerDashboard;
