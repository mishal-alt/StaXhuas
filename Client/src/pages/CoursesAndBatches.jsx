import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from "sonner";
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Stack, 
  TextField, 
  MenuItem, 
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  ThemeProvider,
  createTheme,
  CircularProgress
} from '@mui/material';
import { 
  Add, 
  People, 
  School,
  CalendarMonth,
  Close,
  Assignment
} from '@mui/icons-material';

import AppShell from '../components/layout/AppShell';
import * as courseApi from '../api/courses.api';
import * as batchApi from '../api/batches.api';
import * as userApi from '../api/users.api';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';

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
          padding: '12px 24px',
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
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 16,
          }
        }
      }
    }
  }
});

const CoursesAndBatches = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;
  const queryClient = useQueryClient();

  const [showBatchForm, setShowBatchForm] = useState(false);

  const { data: coursesRes, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: courseApi.getCourses,
  });

  const { data: batchesRes, isLoading: batchesLoading } = useQuery({
    queryKey: ['batches'],
    queryFn: batchApi.getBatches,
  });

  const { data: facilitatorsRes } = useQuery({
    queryKey: ['facilitators'],
    queryFn: userApi.getFacilitators,
    enabled: showBatchForm,
  });


  const createBatchMutation = useMutation({
    mutationFn: batchApi.createBatch,
    onSuccess: () => {
      toast.success('Batch created successfully');
      queryClient.invalidateQueries(['batches']);
      setShowBatchForm(false);
      resetBatch();
    },
    onError: (err) => toast.error(err.message || 'Failed to create batch'),
  });

  const { register: regBatch, handleSubmit: handleBatchSubmit, reset: resetBatch } = useForm();

  if (coursesLoading || batchesLoading) {
    return (
      <AppShell>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress color="primary" thickness={6} />
        </Box>
      </AppShell>
    );
  }

  const courses = coursesRes?.data || [];
  const batches = batchesRes?.data || [];
  const facilitators = facilitatorsRes?.data || [];

  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, pb: 8 }}>
          
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" color="secondary" sx={{ fontSize: '2.5rem' }}>
                Batch Management
              </Typography>
              <Typography variant="body1" color="text.secondary" fontWeight={600}>
                Oversee and optimize your assigned academic cohorts.
              </Typography>
            </Box>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right' }}>
                <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.1em' }}>GLOBAL STATUS</Typography>
                <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                   <Box sx={{ width: 8, height: 8, bgcolor: 'success.main', borderRadius: '50%', animation: 'pulse 2s infinite' }} />
                   <Typography variant="body2" fontWeight={800}>ALL SYSTEMS OPERATIONAL</Typography>
                </Stack>
              </Box>
              {isAdmin && (
                <Button 
                  variant="contained" 
                  startIcon={<Add />} 
                  disableElevation 
                  onClick={() => setShowBatchForm(true)}
                  sx={{ py: 2, px: 4 }}
                >
                  Create Batch
                </Button>
              )}
            </Stack>
          </Box>

          <Divider sx={{ opacity: 0.1 }} />

          {/* Batches Grid */}
          <Grid container spacing={4}>
            {batches.map((batch) => (
              <Grid item xs={12} md={6} lg={4} key={batch._id}>
                <Card sx={{ 
                  height: '100%', 
                  position: 'relative', 
                  borderTop: '6px solid #E8391D',
                  transition: 'all 0.3s',
                  '&:hover': { transform: 'translateY(-8px)', boxShadow: '0 12px 40px rgba(0,0,0,0.1)' }
                }}>
                  <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 4, color: 'primary.main' }}>
                        <School fontSize="large" />
                      </Box>
                      <Chip label="ACTIVE" color="success" size="small" sx={{ fontWeight: 900, borderRadius: 2 }} />
                    </Box>

                    <Box>
                      <Typography variant="h5" fontWeight={900} sx={{ fontFamily: 'Outfit' }}>{batch.name}</Typography>
                      <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.2em' }}>
                        {batch.course?.name || 'GENERIC TRACK'}
                      </Typography>
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 4, textAlign: 'center' }}>
                          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                             <People sx={{ fontSize: 14, color: 'text.secondary' }} />
                             <Typography variant="caption" fontWeight={900} color="text.secondary">STUDENTS</Typography>
                          </Stack>
                          <Typography variant="h6" fontWeight={900}>{batch.students?.length || 0}</Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', borderRadius: 4, textAlign: 'center' }}>
                          <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                             <CalendarMonth sx={{ fontSize: 14, color: 'text.secondary' }} />
                             <Typography variant="caption" fontWeight={900} color="text.secondary">LAUNCHED</Typography>
                          </Stack>
                          <Typography variant="body2" fontWeight={900} sx={{ mt: 0.5 }}>
                            {new Date(batch.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>

                    <Button 
                      fullWidth 
                      variant="contained" 
                      color="secondary" 
                      component={Link} 
                      to={`/batches/${batch._id}`}
                      disableElevation
                      sx={{ mt: 'auto', py: 2 }}
                    >
                      Manage Cohort
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>


          {/* Dialogs */}
          <Dialog open={showBatchForm} onClose={() => setShowBatchForm(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 8 } }}>
            <Box sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={900} sx={{ textTransform: 'uppercase', mb: 4 }}>Launch New Batch</Typography>
              <Box component="form" onSubmit={handleBatchSubmit((data) => createBatchMutation.mutate(data))} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField fullWidth label="Batch Identity" placeholder="e.g. MERN-B1-2026" {...regBatch('name', { required: true })} />
                <TextField 
                  select 
                  fullWidth 
                  label="Academic Track" 
                  defaultValue=""
                  {...regBatch('course', { required: true })}
                >
                  {courses.map(c => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
                </TextField>
                <TextField 
                  select 
                  fullWidth 
                  label="Lead Facilitator" 
                  defaultValue=""
                  {...regBatch('facilitator', { required: true })}
                >
                  {facilitators.map(f => <MenuItem key={f._id} value={f._id}>{f.name}</MenuItem>)}
                </TextField>
                <TextField fullWidth type="date" label="Launch Date" InputLabelProps={{ shrink: true }} {...regBatch('startDate', { required: true })} />
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                  <Button onClick={() => setShowBatchForm(false)} color="secondary">Cancel</Button>
                  <Button type="submit" variant="contained" disableElevation disabled={createBatchMutation.isPending}>
                    {createBatchMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Launch Batch'}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Dialog>


        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default CoursesAndBatches;
