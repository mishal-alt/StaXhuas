import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import {
  CircularProgress,
Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Stack, 
  TextField, 
  InputAdornment, 
  Chip, 
  IconButton, 
  Divider,
  Paper,
  ThemeProvider,
  createTheme,
  Avatar
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  ChevronRight, 
  CalendarToday, 
  Schedule, 
  Group, 
  School,
  Assessment,
  EventBusy
} from '@mui/icons-material';

import AppShell from '../components/layout/AppShell';
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

const MyInterviews = () => {
  const navigate = useNavigate();
  const { data: interviewsRes, isLoading } = useQuery({
    queryKey: ['my-interviews-list'],
    queryFn: () => interviewApi.getInterviews()
  });

  const interviews = interviewsRes?.data || [];

  const getStatusChip = (status) => {
    switch (status) {
      case 'scheduled': return <Chip label="Scheduled" color="info" size="small" sx={{ fontWeight: 900, borderRadius: 2 }} />;
      case 'in-progress': return <Chip label="In Progress" color="primary" size="small" sx={{ fontWeight: 900, borderRadius: 2, animation: 'pulse 2s infinite' }} />;
      case 'scored': return <Chip label="Completed" color="success" size="small" sx={{ fontWeight: 900, borderRadius: 2 }} />;
      default: return <Chip label={status} size="small" sx={{ fontWeight: 900, borderRadius: 2 }} />;
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, pb: 8 }}>
          
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 4 }}>
            <Box>
              <Typography variant="h4" color="secondary" sx={{ fontSize: '2.5rem' }}>
                Assessment Center
              </Typography>
              <Typography variant="body1" color="text.secondary" fontWeight={600}>
                Track and conduct technical assessments assigned to you.
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
              <TextField 
                placeholder="Search student..." 
                size="small"
                sx={{ bgcolor: 'white', width: { xs: '100%', md: 250 } }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><Search /></InputAdornment>,
                  sx: { borderRadius: 4 }
                }}
              />
              <IconButton sx={{ bgcolor: 'white', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
                <FilterList />
              </IconButton>
            </Stack>
          </Box>

          <Divider sx={{ opacity: 0.1 }} />

          {/* Interview List */}
          <Stack spacing={3}>
            {isLoading ? (
              <Box sx={{ py: 10, textAlign: 'center' }}>
                <CircularProgress color="primary" thickness={6} />
              </Box>
            ) : (
              interviews.map((interview) => (
                <Card 
                  key={interview._id} 
                  onClick={() => navigate(`/interviews/${interview._id}`)}
                  sx={{ 
                    cursor: 'pointer', 
                    transition: 'all 0.3s',
                    '&:hover': { transform: 'scale(1.01)', borderColor: 'primary.main', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} md={7}>
                        <Stack direction="row" spacing={3} alignItems="center">
                          <Avatar sx={{ width: 64, height: 64, bgcolor: 'secondary.main', fontWeight: 900, borderRadius: 4, fontSize: '1.5rem' }}>
                            {interview.student?.name?.[0]}
                          </Avatar>
                          <Box>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                              <Typography variant="h6" fontWeight={900} color="secondary" sx={{ fontFamily: 'Outfit' }}>
                                {interview.student?.name}
                              </Typography>
                              {getStatusChip(interview.status)}
                            </Stack>
                            <Stack direction="row" spacing={3} flexWrap="wrap">
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Group sx={{ fontSize: 14, color: 'primary.main' }} />
                                <Typography variant="caption" fontWeight={900} color="text.secondary">
                                  {interview.student?.batch?.name || 'MERN-B1'}
                                </Typography>
                              </Stack>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <CalendarToday sx={{ fontSize: 14, color: 'primary.main' }} />
                                <Typography variant="caption" fontWeight={900} color="text.secondary">
                                  {format(new Date(interview.scheduledDate), 'dd MMM yyyy')}
                                </Typography>
                              </Stack>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Schedule sx={{ fontSize: 14, color: 'primary.main' }} />
                                <Typography variant="caption" fontWeight={900} color="text.secondary">
                                  {format(new Date(interview.scheduledDate), 'hh:mm a')}
                                </Typography>
                              </Stack>
                            </Stack>
                          </Box>
                        </Stack>
                      </Grid>

                      <Grid item xs={12} md={5}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pl: { md: 4 }, borderLeft: { md: '1px solid' }, borderColor: 'divider' }}>
                           <Box>
                              <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.1em', display: 'block' }}>MODULE ASSESSMENT</Typography>
                              <Typography variant="body2" fontWeight={800} color="secondary">{interview.module?.name}</Typography>
                           </Box>
                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'primary.main' }}>
                              <Typography variant="button" sx={{ fontWeight: 900 }}>Details</Typography>
                              <ChevronRight />
                           </Box>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))
            )}

            {interviews.length === 0 && !isLoading && (
              <Paper variant="outlined" sx={{ p: 10, textAlign: 'center', borderRadius: 8, borderStyle: 'dashed', borderWeight: 2 }}>
                <EventBusy sx={{ fontSize: 64, color: 'action.disabled', mb: 2 }} />
                <Typography variant="h5" fontWeight={900} color="text.secondary" sx={{ textTransform: 'uppercase' }}>No Interviews Assigned</Typography>
                <Typography variant="body2" color="text.secondary">Your assessment queue is currently empty. Assigned interviews will appear here.</Typography>
              </Paper>
            )}
          </Stack>

        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default MyInterviews;
