import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from "sonner";
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths 
} from 'date-fns';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Stack, 
  Chip, 
  IconButton, 
  Divider,
  Paper,
  ThemeProvider,
  createTheme,
  LinearProgress,
  TextField,
  Collapse,
  Tooltip
} from '@mui/material';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  Schedule, 
  Info,
  EventBusy,
  HolidayVillage,
  CalendarToday,
  Add
} from '@mui/icons-material';

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

const StudentAttendanceAndLeaves = () => {
  const queryClient = useQueryClient();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showRequestForm, setShowRequestForm] = useState(false);

  const { data: leavesRes } = useQuery({
    queryKey: ['my-leaves'],
    queryFn: leaveApi.getMyLeaves
  });

  const leaves = leavesRes?.data || [];

  const holidays = [
    { date: new Date(2026, 3, 9), title: 'Election' },
    { date: new Date(2026, 3, 15), title: 'VISHU' },
  ];

  const daysOfWeek = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getLeaveForDay = (day) => {
    return leaves.find(l => isSameDay(new Date(l.date), day));
  };

  const getHolidayForDay = (day) => {
    return holidays.find(h => isSameDay(h.date, day));
  };

  const requestMutation = useMutation({
    mutationFn: leaveApi.applyLeave,
    onSuccess: () => {
      toast.success('Leave request submitted!');
      queryClient.invalidateQueries({ queryKey: ['my-leaves'] });
      setShowRequestForm(false);
      reset();
    },
    onError: (err) => toast.error(err.message || 'Failed to submit request')
  });

  const { register, handleSubmit, reset } = useForm();

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, pb: 12 }}>
        
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
          <Box>
            <Typography variant="h4" color="secondary" sx={{ fontSize: '2.5rem' }}>Attendance & Leaves</Typography>
            <Typography variant="body1" color="text.secondary" fontWeight={600}>View your calendar and manage time off.</Typography>
          </Box>
          <Button 
            variant={showRequestForm ? 'outlined' : 'contained'} 
            color="secondary"
            onClick={() => setShowRequestForm(!showRequestForm)}
            startIcon={showRequestForm ? <Schedule /> : <Add />}
            sx={{ borderRadius: 4 }}
          >
            {showRequestForm ? 'Close Form' : 'Request Leave'}
          </Button>
        </Box>

        {/* Leave Request Form */}
        <Collapse in={showRequestForm}>
          <Card sx={{ border: '2px solid', borderColor: 'primary.main', bgcolor: 'rgba(232, 57, 29, 0.02)' }}>
            <CardContent sx={{ p: 4 }}>
              <Box component="form" onSubmit={handleSubmit((data) => requestMutation.mutate(data))} sx={{ display: 'flex', gap: 3, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <TextField 
                  label="Date" 
                  type="date" 
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  {...register('date', { required: true })}
                  sx={{ width: 200, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }}
                />
                <TextField 
                  label="Reason" 
                  placeholder="e.g. Medical, Emergency" 
                  size="small"
                  {...register('reason', { required: true })}
                  sx={{ flex: 1, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }}
                />
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                  disabled={requestMutation.isPending}
                >
                  Submit Request
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Collapse>

        {/* Analysis Bar */}
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ bgcolor: 'secondary.main', color: 'white' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="caption" fontWeight={900} sx={{ letterSpacing: '0.2em', opacity: 0.6 }}>ATTENDANCE RATE</Typography>
                <Stack direction="row" spacing={3} alignItems="flex-end" sx={{ mt: 1 }}>
                  <Typography variant="h3" fontWeight={900}>92%</Typography>
                  <Chip label="Good Standing" size="small" color="success" sx={{ fontWeight: 900, mb: 1, borderRadius: 2 }} />
                </Stack>
                <Box sx={{ mt: 3, height: 6, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                  <Box sx={{ width: '92%', height: '100%', bgcolor: 'primary.main' }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.2em' }}>LEAVE BALANCE</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 1 }}>
                  <Typography variant="h3" fontWeight={900} color="secondary">10 <span style={{ fontSize: '1rem', fontWeight: 600, color: '#666' }}>Days</span></Typography>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" fontWeight={900} color="success.main" sx={{ display: 'block' }}>AVAILABLE</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>out of 12</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 4, bgcolor: '#1976d2', color: 'white', borderRadius: 8, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
               <Box>
                 <Info sx={{ opacity: 0.5, mb: 1 }} />
                 <Typography variant="subtitle1" fontWeight={900}>Did you know?</Typography>
                 <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.75rem', lineHeight: 1.6 }}>
                    Maintaining above 90% attendance unlocks exclusive placement opportunities.
                 </Typography>
               </Box>
               <Button sx={{ bgcolor: 'white', color: '#1976d2', mt: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' } }}>Learn More</Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Calendar Card */}
        <Card sx={{ border: 'none', boxShadow: '0 20px 60px rgba(0,0,0,0.06)' }}>
          {/* Calendar Header */}
          <Box sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'white' }}>
            <Stack direction="row" spacing={2}>
              <IconButton onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} sx={{ bgcolor: 'action.hover', borderRadius: 3 }}><ChevronLeft /></IconButton>
              <IconButton onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} sx={{ bgcolor: 'action.hover', borderRadius: 3 }}><ChevronRight /></IconButton>
            </Stack>
            
            <Typography variant="h5" fontWeight={900} color="secondary">
              {format(currentMonth, 'MMMM')} <span style={{ color: '#E8391D' }}>{format(currentMonth, 'yyyy')}</span>
            </Typography>

            <Stack direction="row" spacing={3} sx={{ display: { xs: 'none', md: 'flex' } }}>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                 <Box sx={{ width: 10, height: 10, bgcolor: '#4caf50', borderRadius: '50%' }} />
                 <Typography variant="caption" fontWeight={900} color="text.secondary">APPROVED</Typography>
               </Box>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                 <Box sx={{ width: 10, height: 10, bgcolor: '#673ab7', borderRadius: '50%' }} />
                 <Typography variant="caption" fontWeight={900} color="text.secondary">HOLIDAY</Typography>
               </Box>
            </Stack>
          </Box>

          <CardContent sx={{ p: 2 }}>
            {/* Days Name Header */}
            <Grid container spacing={1} sx={{ mb: 1 }}>
              {daysOfWeek.map(day => (
                <Grid item xs={1.714} key={day} sx={{ textAlign: 'center' }}>
                  <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.2em', opacity: 0.4 }}>{day}</Typography>
                </Grid>
              ))}
            </Grid>

            {/* Days Grid */}
            <Grid container spacing={1}>
              {calendarDays.map((day, idx) => {
                const leave = getLeaveForDay(day);
                const holiday = getHolidayForDay(day);
                const isCurrentMonth = isSameMonth(day, monthStart);
                const isToday = isSameDay(day, new Date());
                const isSunday = day.getDay() === 0;

                return (
                  <Grid item xs={1.714} key={idx}>
                    <Paper 
                      elevation={0}
                      sx={{ 
                        minHeight: 110, 
                        p: 2, 
                        borderRadius: 5, 
                        border: isToday ? '2px solid #E8391D' : '1px solid transparent',
                        bgcolor: !isCurrentMonth ? 'rgba(0,0,0,0.02)' : 'white',
                        opacity: !isCurrentMonth ? 0.3 : 1,
                        position: 'relative',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                          borderColor: isToday ? '#E8391D' : 'rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="subtitle2" fontWeight={900} color={isToday ? 'primary' : isSunday ? 'error' : 'secondary'}>
                          {format(day, 'd')}
                        </Typography>
                        {isToday && <Box sx={{ width: 6, height: 6, bgcolor: 'primary.main', borderRadius: '50%', animation: 'pulse 2s infinite' }} />}
                      </Box>

                      <Stack spacing={1}>
                        {leave && (
                          <Chip 
                            label={leave.status.toUpperCase()} 
                            size="small" 
                            color={leave.status === 'approved' ? 'success' : 'warning'}
                            sx={{ fontSize: '0.6rem', fontWeight: 900, borderRadius: 2 }}
                          />
                        )}
                        {holiday && (
                          <Chip 
                            label={holiday.title.toUpperCase()} 
                            size="small" 
                            sx={{ bgcolor: '#673ab7', color: 'white', fontSize: '0.6rem', fontWeight: 900, borderRadius: 2 }}
                          />
                        )}
                      </Stack>

                      <Typography 
                        sx={{ 
                          position: 'absolute', 
                          bottom: 4, 
                          right: 8, 
                          fontSize: '2rem', 
                          fontWeight: 900, 
                          opacity: 0.03, 
                          pointerEvents: 'none',
                          userSelect: 'none'
                        }}
                      >
                        {format(day, 'd')}
                      </Typography>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </CardContent>
        </Card>

      </Box>
    </ThemeProvider>
  );
};

export default StudentAttendanceAndLeaves;
