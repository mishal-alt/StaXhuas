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
  InputAdornment,
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
  Pagination,
  ThemeProvider,
  createTheme,
  Breadcrumbs,
  Link as MuiLink
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
  Layers,
  NavigateNext
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
                  component={Link}
                  to="/dashboard"
                  underline="none"
                  color="text.secondary"
                  sx={{ fontSize: '0.75rem', fontWeight: 700, '&:hover': { color: 'primary.main' } }}
                >
                  DASHBOARD
                </MuiLink>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.primary' }}>
                  BATCHES
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
                  <Layers fontSize="medium" />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={900} color="text.primary" sx={{ letterSpacing: '-0.02em', mb: 0.2, fontSize: '1.75rem', textTransform: 'none' }}>
                    Batch Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    High-level overview of cohort tracks and student enrollment
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Stack direction="row" spacing={4} alignItems="center">
              {isAdmin && (
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setShowBatchForm(true)}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(232, 57, 29, 0.2)'
                  }}
                >
                  Create Batch
                </Button>
              )}
            </Stack>
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
              { label: 'Total Batches', value: batches.length, icon: <Layers />, color: '#E8391D' },
              { label: 'Active Cohorts', value: batches.filter(b => b.status !== 'completed').length, icon: <CalendarMonth />, color: '#1976d2' },
              { label: 'Enrolled Students', value: batches.reduce((sum, b) => sum + (b.students?.length || 0), 0), icon: <People />, color: '#2e7d32' },
              { label: 'Course Tracks', value: courses.length, icon: <School />, color: '#9c27b0' },
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
                <CardContent sx={{
                  p: 2.5,
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  gap: { xs: 2, sm: 4 }
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, width: '100%' }}>
                    <Box sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 3, color: 'primary.main', display: { xs: 'none', sm: 'block' } }}>
                      <School />
                    </Box>

                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="subtitle1" fontWeight={900}>{batch.name}</Typography>
                      <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.1em' }}>
                        {batch.course?.name || 'COURSE'}
                      </Typography>
                    </Box>

                    {/* Mobile Status Indicator */}
                    <Box sx={{
                      display: { xs: 'flex', sm: 'none' },
                      alignItems: 'center',
                      gap: 1,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2,
                      bgcolor: batch.isActive ? 'rgba(46, 125, 50, 0.08)' : 'rgba(211, 47, 47, 0.08)',
                    }}>
                      <Box sx={{ width: 6, height: 6, bgcolor: batch.isActive ? 'success.main' : 'error.main', borderRadius: '50%' }} />
                      <Typography variant="caption" fontWeight={900} color={batch.isActive ? 'success.main' : 'error.main'}>
                        {batch.isActive ? 'ACTIVE' : 'OFF'}
                      </Typography>
                    </Box>
                  </Box>

                  <Stack direction="row" spacing={{ xs: 4, sm: 6 }} sx={{ display: 'flex', width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'space-between', sm: 'center' } }}>
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

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'space-between', sm: 'center' } }}>
                    <Stack
                      direction="row"
                      spacing={1}
                      className="batch-actions"
                      sx={{
                        opacity: { xs: 1, sm: 0 },
                        transition: 'opacity 0.2s',
                        display: 'flex'
                      }}
                    >
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          setEditingBatch(batch);
                          resetBatch({
                            name: batch.name,
                            course: batch.course?._id,
                            facilitator: batch.facilitator?._id,
                            startDate: new Date(batch.startDate).toISOString().split('T')[0],
                            isActive: batch.isActive
                          });
                          setShowBatchForm(true);
                        }}
                        sx={{ bgcolor: { xs: 'primary.light', sm: 'transparent' }, color: { xs: 'primary.contrastText', sm: 'primary.main' } }}
                      >
                        <Edit sx={{ fontSize: 18 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          if (confirm('Delete this batch?')) deleteBatchMutation.mutate(batch._id);
                        }}
                        sx={{ bgcolor: { xs: 'error.light', sm: 'transparent' }, color: { xs: 'error.contrastText', sm: 'error.main' } }}
                      >
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
                      sx={{ py: 1, px: 3, borderRadius: 2, flexGrow: { xs: 1, sm: 0 } }}
                    >
                      Manage
                    </Button>
                  </Box>
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
