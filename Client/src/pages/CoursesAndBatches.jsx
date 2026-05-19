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
  Link as MuiLink,
  Accordion,
  AccordionSummary,
  AccordionDetails
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
  NavigateNext,
  CheckCircle,
  PendingActions,
  Mic,
  Campaign,
  ExpandMore
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
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 900,
          borderRadius: 8,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          padding: '12px 24px',
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.03)',
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
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
      queryClient.invalidateQueries({ queryKey: ['batches'] });
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
      queryClient.invalidateQueries({ queryKey: ['batches'] });
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
                borderRadius: '12px',
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
                    borderRadius: '8px',
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
                  borderRadius: '12px',
                  bgcolor: 'background.paper',
                  '& fieldset': { border: 'none' },
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  py: 1
                }
              }}
            />
          </Box>

          {/* Conditional Rendering: Admin List vs Facilitator Mini-Dashboard */}
          {isAdmin ? (
            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden' }}>
              <Table>
                <TableHead sx={{ bgcolor: '#FAFAFA' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 900, color: 'text.secondary', py: 2 }}>BATCH IDENTITY</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: 'text.secondary', py: 2 }}>COURSE TRACK</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: 'text.secondary', py: 2 }}>FACILITATOR</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: 'text.secondary', py: 2 }}>START DATE</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: 'text.secondary', py: 2 }}>STATUS</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 900, color: 'text.secondary', py: 2 }}>ACTIONS</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedBatches.map((batch) => (
                    <TableRow key={batch._id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell sx={{ fontWeight: 800, py: 2.5 }}>{batch.name}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>{batch.course?.name || 'N/A'}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>{batch.facilitator?.name || 'UNASSIGNED'}</TableCell>
                      <TableCell sx={{ fontWeight: 700, color: 'text.secondary' }}>
                        {new Date(batch.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={batch.isActive ? "ACTIVE" : "INACTIVE"}
                          size="small"
                          color={batch.isActive ? "success" : "default"}
                          sx={{ fontWeight: 900, borderRadius: '6px' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton
                            size="small"
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
                            sx={{ bgcolor: 'rgba(232, 57, 29, 0.05)', color: 'primary.main', borderRadius: '8px' }}
                          >
                            <Edit sx={{ fontSize: 18 }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this batch?')) {
                                deleteBatchMutation.mutate(batch._id);
                              }
                            }}
                            sx={{ bgcolor: 'rgba(211, 47, 47, 0.05)', color: 'error.main', borderRadius: '8px' }}
                          >
                            <Delete sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            /* Facilitator Mini-Dashboard View */
            <Stack spacing={2}>
              {paginatedBatches.map((batch, index) => (
                <Accordion
                  key={batch._id}
                  disableElevation
                  sx={{
                    borderRadius: '12px !important',
                    border: '1px solid #E5E7EB',
                    '&:before': { display: 'none' },
                    overflow: 'hidden',
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: 'primary.main',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                    }
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMore sx={{ color: 'primary.main' }} />}
                    sx={{
                      px: 3,
                      py: 1,
                      '& .MuiAccordionSummary-content': {
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        justifyContent: 'space-between'
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexGrow: 1 }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        bgcolor: 'action.hover',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'primary.main',
                        fontWeight: 900
                      }}>
                        {index + 1}
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={900}>{batch.name}</Typography>
                        <Typography variant="caption" fontWeight={800} color="text.secondary" sx={{ letterSpacing: '0.05em' }}>
                          {batch.course?.name || 'NO COURSE'}
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                      <Chip
                        label={batch.isActive ? "ACTIVE" : "OFF"}
                        size="small"
                        color={batch.isActive ? "success" : "default"}
                        sx={{ fontWeight: 900, borderRadius: '6px', height: 24 }}
                      />
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails sx={{ p: 0, borderTop: '1px solid #F3F4F6', bgcolor: '#FAFAFA' }}>
                    <Box sx={{ p: 3 }}>
                      <Grid container spacing={2}>
                        {[
                          { icon: <School sx={{ fontSize: 20 }} />, label: 'Students', value: `${batch.studentCount || 0} enrolled`, color: '#1976d2' },
                          { icon: <CheckCircle sx={{ fontSize: 20 }} />, label: 'Attendance', value: `${batch.attendanceMarkedToday || 0}/${batch.studentCount || 0} marked`, color: '#2e7d32' },
                          { icon: <PendingActions sx={{ fontSize: 20 }} />, label: 'Leaves', value: `${batch.pendingLeaves || 0} pending`, color: '#ed6c02' },
                          { icon: <Mic sx={{ fontSize: 20 }} />, label: 'Interviews', value: `${batch.upcomingInterviews || 0} upcoming`, color: '#9c27b0' },
                          { icon: <Campaign sx={{ fontSize: 20 }} />, label: 'Scrum Status', value: batch.scrumCompleted ? 'Completed for today' : 'Not yet completed', color: batch.scrumCompleted ? '#2e7d32' : '#E8391D' }
                        ].map((stat, i) => (
                          <Grid item xs={12} sm={6} md={4} lg={2.4} key={i}>
                            <Box sx={{
                              p: 2,
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: 1
                            }}>
                              <Box sx={{ color: stat.color, display: 'flex' }}>{stat.icon}</Box>
                              <Box>
                                <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ fontSize: '0.65rem' }}>{stat.label.toUpperCase()}</Typography>
                                <Typography variant="body2" fontWeight={900} color="secondary.main">{stat.value}</Typography>
                              </Box>
                            </Box>
                          </Grid>
                        ))}
                      </Grid>

                      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <Button
                          variant="contained"
                          color="secondary"
                          component={Link}
                          to={`/batches/${batch._id}`}
                          size="small"
                          sx={{ py: 1, px: 4, borderRadius: 2, fontWeight: 900 }}
                        >
                          Batch Console
                        </Button>
                      </Box>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Stack>
          )}

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


          {/* Dialogs */}
          <Dialog open={showBatchForm} onClose={() => { setShowBatchForm(false); setEditingBatch(null); }} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
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
