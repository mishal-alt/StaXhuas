import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { toast } from "sonner";
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
  InputAdornment,
  Pagination
} from '@mui/material';
import {
  Add,
  People,
  School,
  CalendarMonth,
  Close,
  Assignment,
  Search,
  Edit,
  Delete,
  Layers
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
  const [editingBatch, setEditingBatch] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

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
    mutationFn: (data) => editingBatch ? batchApi.updateBatch(editingBatch._id, data) : batchApi.createBatch(data),
    onSuccess: () => {
      toast.success(`Batch ${editingBatch ? 'updated' : 'created'} successfully`);
      queryClient.invalidateQueries(['batches']);
      setShowBatchForm(false);
      setEditingBatch(null);
      resetBatch();
    },
    onError: (err) => toast.error(err.message || `Failed to ${editingBatch ? 'update' : 'create'} batch`),
  });

  const deleteBatchMutation = useMutation({
    mutationFn: batchApi.deleteBatch,
    onSuccess: () => {
      toast.success('Batch deleted successfully');
      queryClient.invalidateQueries(['batches']);
    },
    onError: (err) => toast.error(err.message || 'Failed to delete batch'),
  });

  const { register: regBatch, handleSubmit: handleBatchSubmit, reset: resetBatch, control } = useForm();

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

  const filteredBatches = batches.filter(batch =>
    batch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.course?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedBatches = filteredBatches.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredBatches.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 8 }}>

          {/* Header - Brush Stroke Style */}
          <Box sx={{
            position: 'relative',
            p: 6,
            borderRadius: '30px 150px 40px 120px',
            background: 'linear-gradient(115deg, #E8391D 0%, #FF5A36 100%)',
            color: 'white',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 4,
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '-50%',
              left: '-10%',
              width: '120%',
              height: '200%',
              background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 40%)',
              pointerEvents: 'none'
            }
          }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="h4" color="inherit" sx={{ fontSize: '3rem', textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                Batch Management
              </Typography>
              <Typography variant="body1" color="inherit" sx={{ opacity: 0.9, fontWeight: 600, letterSpacing: '0.05em' }}>
                High-level overview of cohort tracks and student enrollment.
              </Typography>
            </Box>
            <Stack direction="row" spacing={4} alignItems="center" sx={{ position: 'relative', zIndex: 1 }}>
              {isAdmin && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setShowBatchForm(true)}
                  sx={{
                    bgcolor: 'white',
                    color: '#E8391D',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.9)', transform: 'translateY(-2px)' },
                    px: 5,
                    py: 2,
                    borderRadius: '16px 40px 16px 40px',
                    fontWeight: 900,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  Create Batch
                </Button>
              )}
            </Stack>
          </Box>

          {/* Analytics Board - Real Data */}
          <Grid container spacing={3} justifyContent="center">
            {[
              { label: 'Total Batches', value: batches.length, icon: <Layers />, color: '#E8391D' },
              { label: 'Active Cohorts', value: batches.filter(b => b.status !== 'completed').length, icon: <CalendarMonth />, color: '#1976d2' },
              { label: 'Enrolled Students', value: batches.reduce((sum, b) => sum + (b.students?.length || 0), 0), icon: <People />, color: '#2e7d32' },
              { label: 'Course Tracks', value: courses.length, icon: <School />, color: '#9c27b0' },
            ].map((stat, i) => (
              <Grid item xs={12} sm={3} md={3} lg={3} key={i}>
                <Card sx={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' },
                  borderRadius: '24px',
                  border: '1px solid rgba(0,0,0,0.05)',
                  height: '100%',
                  bgcolor: 'white'
                }}>
                  <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
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

          {/* Search Bar */}
          <Box sx={{ mb: 2 }}>
            <TextField
              fullWidth
              placeholder="Search batches by name or course track..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.secondary', ml: 1 }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 4,
                  bgcolor: 'background.paper',
                  '& fieldset': { border: 'none' },
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  py: 1
                }
              }}
            />
          </Box>

          {/* Batches List (Linear Type) */}
          <Stack spacing={2}>
            {paginatedBatches.map((batch) => (
              <Card key={batch._id} sx={{
                position: 'relative',
                borderLeft: '6px solid #E8391D',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateX(8px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  '& .batch-actions': { opacity: 1 }
                }
              }}>
                <CardContent sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 3, color: 'primary.main', display: { xs: 'none', sm: 'block' } }}>
                    <School />
                  </Box>

                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="subtitle1" fontWeight={900}>{batch.name}</Typography>
                    <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.1em' }}>
                      {batch.course?.name || 'COURSE'}
                    </Typography>
                  </Box>

                  <Stack direction="row" spacing={6} sx={{ display: { xs: 'none', md: 'flex' }, mx: 4 }}>
                    <Box sx={{ textAlign: 'center', minWidth: 80 }}>
                      <Typography variant="caption" fontWeight={900} color="text.secondary" display="block">STUDENTS</Typography>
                      <Typography variant="subtitle2" fontWeight={900}>{batch.students?.length || 0}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center', minWidth: 100 }}>
                      <Typography variant="caption" fontWeight={900} color="text.secondary" display="block">LAUNCHED</Typography>
                      <Typography variant="subtitle2" fontWeight={900}>
                        {new Date(batch.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </Typography>
                    </Box>
                  </Stack>

                  <Box sx={{
                    display: { xs: 'none', sm: 'flex' },
                    alignItems: 'center',
                    gap: 1,
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 2,
                    bgcolor: batch.isActive ? 'rgba(46, 125, 50, 0.08)' : 'rgba(211, 47, 47, 0.08)',
                    minWidth: 90,
                    justifyContent: 'center'
                  }}>
                    <Box sx={{ width: 6, height: 6, bgcolor: batch.isActive ? 'success.main' : 'error.main', borderRadius: '50%' }} />
                    <Typography variant="caption" fontWeight={900} color={batch.isActive ? 'success.main' : 'error.main'} sx={{ letterSpacing: '0.05em' }}>
                      {batch.isActive ? 'ACTIVE' : 'INACTIVE'}
                    </Typography>
                  </Box>

                  <Stack
                    direction="row"
                    spacing={1}
                    className="batch-actions"
                    sx={{
                      opacity: 0,
                      transition: 'opacity 0.2s',
                      display: { xs: 'none', sm: 'flex' }
                    }}
                  >
                    <IconButton size="small" color="primary" onClick={() => {
                      setEditingBatch(batch);
                      resetBatch({
                        name: batch.name,
                        course: batch.course?._id,
                        facilitator: batch.facilitator?._id,
                        startDate: new Date(batch.startDate).toISOString().split('T')[0],
                        isActive: batch.isActive
                      });
                      setShowBatchForm(true);
                    }}>
                      <Edit sx={{ fontSize: 18 }} />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => {
                      if (confirm('Delete this batch?')) deleteBatchMutation.mutate(batch._id);
                    }}>
                      <Delete sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Stack>

                  <Button
                    variant="contained"
                    color="secondary"
                    component={Link}
                    to={`/batches/${batch._id}`}
                    disableElevation
                    size="small"
                    sx={{ py: 1, px: 3, borderRadius: 2 }}
                  >
                    Manage Batch
                  </Button>
                </CardContent>
              </Card>
            ))}

            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontWeight: 900,
                      borderRadius: 2,
                      '&.Mui-selected': {
                        boxShadow: '0 4px 12px rgba(232, 57, 29, 0.3)',
                      }
                    }
                  }}
                />
              </Box>
            )}
          </Stack>


          {/* Dialogs */}
          <Dialog open={showBatchForm} onClose={() => { setShowBatchForm(false); setEditingBatch(null); }} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 8 } }}>
            <Box sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={900} sx={{ textTransform: 'uppercase', mb: 4 }}>
                {editingBatch ? 'Edit Batch' : 'Create New Batch'}
              </Typography>
              <Box component="form" onSubmit={handleBatchSubmit((data) => createBatchMutation.mutate(data))} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField fullWidth label="Batch Identity" placeholder="e.g. MERN-B1-2026" {...regBatch('name', { required: true })} />
                <Controller
                  name="course"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="Course Name"
                      error={!!field.error}
                    >
                      {courses.map(c => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
                    </TextField>
                  )}
                />
                <Controller
                  name="facilitator"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="Facilitator"
                      error={!!field.error}
                    >
                      {facilitators.map(f => <MenuItem key={f._id} value={f._id}>{f.name}</MenuItem>)}
                    </TextField>
                  )}
                />
                <Controller
                  name="isActive"
                  control={control}
                  defaultValue={true}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      fullWidth
                      label="Batch Status"
                    >
                      <MenuItem value={true}>Active</MenuItem>
                      <MenuItem value={false}>Inactive</MenuItem>
                    </TextField>
                  )}
                />
                <Box>
                  <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ display: 'block', mb: 1, ml: 1 }}>START DATE</Typography>
                  <TextField
                    fullWidth
                    type="date"
                    {...regBatch('startDate', { required: true })}
                  />
                </Box>
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                  <Button onClick={() => { setShowBatchForm(false); setEditingBatch(null); }} color="secondary">Cancel</Button>
                  <Button type="submit" variant="contained" disableElevation disabled={createBatchMutation.isPending}>
                    {createBatchMutation.isPending ? <CircularProgress size={24} color="inherit" /> : (editingBatch ? 'Save Changes' : 'Create Batch')}
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
