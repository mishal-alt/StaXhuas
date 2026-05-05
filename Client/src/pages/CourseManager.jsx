import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  IconButton,
  Chip,
  Paper,
  Divider,
  ThemeProvider,
  createTheme,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import { 
  Add, 
  School,
  Close,
  ExpandMore,
  Book,
  Assignment,
  Settings,
  ChevronRight
} from '@mui/icons-material';

import AppShell from '../components/layout/AppShell';
import * as courseApi from '../api/courses.api';

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
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 900,
          borderRadius: 8,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          padding: '10px 20px',
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
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

const CourseManager = () => {
  const queryClient = useQueryClient();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [activeModuleId, setActiveModuleId] = useState(null);

  const { data: coursesRes, isLoading: coursesLoading } = useQuery({
    queryKey: ['courses'],
    queryFn: courseApi.getCourses,
  });

  const { data: modulesRes, isLoading: modulesLoading } = useQuery({
    queryKey: ['modules', selectedCourse?._id],
    queryFn: () => courseApi.getModules(selectedCourse._id),
    enabled: !!selectedCourse?._id,
  });

  const createCourseMutation = useMutation({
    mutationFn: courseApi.createCourse,
    onSuccess: () => {
      toast.success('Course created successfully');
      queryClient.invalidateQueries(['courses']);
      setShowCourseForm(false);
      resetCourse();
    },
    onError: (err) => toast.error(err.message || 'Failed to create course'),
  });

  const createModuleMutation = useMutation({
    mutationFn: (data) => courseApi.createModule(selectedCourse._id, data),
    onSuccess: () => {
      toast.success('Module created successfully');
      queryClient.invalidateQueries(['modules', selectedCourse?._id]);
      setShowModuleForm(false);
      resetModule();
    },
    onError: (err) => toast.error(err.message || 'Failed to create module'),
  });

  const createTaskMutation = useMutation({
    mutationFn: (data) => courseApi.createTask(activeModuleId, data),
    onSuccess: () => {
      toast.success('Task created successfully');
      queryClient.invalidateQueries(['modules', selectedCourse?._id]);
      setShowTaskForm(false);
      resetTask();
    },
    onError: (err) => toast.error(err.message || 'Failed to create task'),
  });

  const { register: regCourse, handleSubmit: handleCourseSubmit, reset: resetCourse } = useForm();
  const { register: regModule, handleSubmit: handleModuleSubmit, reset: resetModule } = useForm();
  const { register: regTask, handleSubmit: handleTaskSubmit, reset: resetTask } = useForm();

  if (coursesLoading) {
    return (
      <AppShell>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress color="primary" thickness={6} />
        </Box>
      </AppShell>
    );
  }

  const courses = coursesRes?.data || [];
  const modules = modulesRes?.data || [];

  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, pb: 8 }}>
          
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" color="secondary" sx={{ fontSize: '2.5rem' }}>
                Course Manager
              </Typography>
              <Typography variant="body1" color="text.secondary" fontWeight={600}>
                Design and refine your master curriculum tracks.
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<Add />} 
              disableElevation 
              onClick={() => setShowCourseForm(true)}
              sx={{ py: 2, px: 4 }}
            >
              New Course
            </Button>
          </Box>

          <Divider sx={{ opacity: 0.1 }} />

          <Grid container spacing={4}>
            {/* Courses List */}
            <Grid item xs={12} md={4}>
              <Stack spacing={3}>
                <Typography variant="h6" color="secondary">Academic Tracks</Typography>
                <Stack spacing={2}>
                  {courses.map((course) => (
                    <Card 
                      key={course._id} 
                      onClick={() => setSelectedCourse(course)}
                      sx={{ 
                        cursor: 'pointer',
                        border: selectedCourse?._id === course._id ? '2px solid #E8391D' : '2px solid transparent',
                        transition: 'all 0.2s',
                        '&:hover': { transform: 'translateX(8px)', borderColor: selectedCourse?._id === course._id ? '#E8391D' : 'rgba(0,0,0,0.1)' }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="subtitle1" fontWeight={900}>{course.name}</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={700}>
                              {course.durationMonths} MONTHS
                            </Typography>
                          </Box>
                          <ChevronRight sx={{ color: selectedCourse?._id === course._id ? 'primary.main' : 'text.disabled' }} />
                        </Stack>
                      </CardContent>
                    </Card>
                  ))}
                  {courses.length === 0 && (
                    <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 6 }}>
                      <Typography variant="body2" color="text.secondary">No courses found. Create your first track.</Typography>
                    </Paper>
                  )}
                </Stack>
              </Stack>
            </Grid>

            {/* Course Detail / Modules */}
            <Grid item xs={12} md={8}>
              {selectedCourse ? (
                <Stack spacing={4}>
                  <Box sx={{ p: 4, bgcolor: 'secondary.main', color: 'white', borderRadius: 8, position: 'relative', overflow: 'hidden' }}>
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      <Typography variant="h5" fontWeight={900} gutterBottom>{selectedCourse.name}</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8, maxWidth: '80%' }}>{selectedCourse.description}</Typography>
                    </Box>
                    <School sx={{ position: 'absolute', right: -20, bottom: -20, fontSize: 180, opacity: 0.05, transform: 'rotate(-15deg)' }} />
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="secondary">Modules & Learning Path</Typography>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      startIcon={<Add />} 
                      onClick={() => setShowModuleForm(true)}
                    >
                      Add Module
                    </Button>
                  </Box>

                  <Stack spacing={2}>
                    {modulesLoading ? (
                      <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress size={24} /></Box>
                    ) : modules.map((module, index) => (
                      <Accordion key={module._id} sx={{ borderRadius: '12px !important', '&:before': { display: 'none' }, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.1)', boxShadow: 'none', '&.Mui-expanded': { border: '2px solid #E8391D' } }}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box sx={{ width: 32, height: 32, bgcolor: 'action.hover', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'primary.main' }}>
                              {index + 1}
                            </Box>
                            <Typography fontWeight={900}>{module.title}</Typography>
                          </Stack>
                        </AccordionSummary>
                        <AccordionDetails sx={{ px: 4, pb: 4 }}>
                          <Stack spacing={3}>
                            <Typography variant="body2" color="text.secondary">{module.description}</Typography>
                            <Divider />
                            <Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="caption" fontWeight={900} color="text.secondary">TASKS & ASSIGNMENTS</Typography>
                                <Button 
                                  size="small" 
                                  variant="text" 
                                  startIcon={<Add sx={{ fontSize: 16 }} />} 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveModuleId(module._id);
                                    setShowTaskForm(true);
                                  }}
                                  sx={{ fontSize: '0.65rem' }}
                                >
                                  Add Task
                                </Button>
                              </Box>
                              <Stack spacing={1}>
                                {module.tasks?.map((task) => (
                                  <Paper key={task._id} elevation={0} sx={{ p: 2, bgcolor: 'action.hover', borderRadius: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                      <Assignment sx={{ fontSize: 18, color: 'text.secondary' }} />
                                      <Typography variant="body2" fontWeight={700}>{task.title}</Typography>
                                    </Stack>
                                    <Chip label={task.type} size="small" sx={{ fontWeight: 900, fontSize: '0.6rem' }} />
                                  </Paper>
                                ))}
                                {(!module.tasks || module.tasks.length === 0) && (
                                  <Typography variant="caption" color="text.disabled" fontStyle="italic">No tasks defined for this module.</Typography>
                                )}
                              </Stack>
                            </Box>
                          </Stack>
                        </AccordionDetails>
                      </Accordion>
                    ))}
                    {modules.length === 0 && !modulesLoading && (
                      <Paper sx={{ p: 6, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 8, border: '2px dashed rgba(0,0,0,0.05)' }}>
                        <Typography variant="body1" fontWeight={700} color="text.secondary">No modules defined yet.</Typography>
                        <Typography variant="body2" color="text.disabled">Start building the learning path for this track.</Typography>
                      </Paper>
                    )}
                  </Stack>
                </Stack>
              ) : (
                <Box sx={{ 
                  height: '60vh', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  gap: 3, 
                  bgcolor: 'white', 
                  borderRadius: 4, 
                  border: '2px dashed rgba(0,0,0,0.05)' 
                }}>
                  <Box sx={{ p: 3, bgcolor: 'action.hover', borderRadius: '50%' }}>
                    <School sx={{ fontSize: 60, color: 'text.disabled' }} />
                  </Box>
                  <Typography variant="h6" color="text.disabled" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Select a track to manage curriculum
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>

          {/* Dialogs */}
          <Dialog open={showCourseForm} onClose={() => setShowCourseForm(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
            <Box sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={900} sx={{ textTransform: 'uppercase', mb: 4 }}>Create New Track</Typography>
              <Box component="form" onSubmit={handleCourseSubmit((data) => createCourseMutation.mutate(data))} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField fullWidth label="Track Name" placeholder="e.g. MERN Full Stack" {...regCourse('name', { required: true })} />
                <TextField fullWidth type="number" label="Duration (Months)" {...regCourse('durationMonths', { required: true })} />
                <TextField fullWidth multiline rows={4} label="Description" placeholder="What is this track about?" {...regCourse('description', { required: true })} />
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                  <Button onClick={() => setShowCourseForm(false)} color="secondary">Cancel</Button>
                  <Button type="submit" variant="contained" disableElevation disabled={createCourseMutation.isPending}>
                    {createCourseMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Create Track'}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Dialog>

          <Dialog open={showModuleForm} onClose={() => setShowModuleForm(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
            <Box sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={900} sx={{ textTransform: 'uppercase', mb: 4 }}>Add Module</Typography>
              <Box component="form" onSubmit={handleModuleSubmit((data) => createModuleMutation.mutate(data))} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField fullWidth label="Module Title" placeholder="e.g. Introduction to React" {...regModule('title', { required: true })} />
                <TextField fullWidth multiline rows={3} label="Module Description" {...regModule('description', { required: true })} />
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                  <Button onClick={() => setShowModuleForm(false)} color="secondary">Cancel</Button>
                  <Button type="submit" variant="contained" disableElevation disabled={createModuleMutation.isPending}>
                    {createModuleMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Add Module'}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Dialog>

          <Dialog open={showTaskForm} onClose={() => setShowTaskForm(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
            <Box sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={900} sx={{ textTransform: 'uppercase', mb: 4 }}>Add Task</Typography>
              <Box component="form" onSubmit={handleTaskSubmit((data) => createTaskMutation.mutate(data))} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField fullWidth label="Task Title" placeholder="e.g. Build a Todo List" {...regTask('title', { required: true })} />
                <TextField select fullWidth label="Task Type" defaultValue="assignment" {...regTask('type', { required: true })}>
                  <MenuItem value="assignment">Assignment</MenuItem>
                  <MenuItem value="project">Project</MenuItem>
                  <MenuItem value="quiz">Quiz</MenuItem>
                  <MenuItem value="reading">Reading</MenuItem>
                </TextField>
                <TextField fullWidth multiline rows={3} label="Task Description" {...regTask('description', { required: true })} />
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                  <Button onClick={() => setShowTaskForm(false)} color="secondary">Cancel</Button>
                  <Button type="submit" variant="contained" disableElevation disabled={createTaskMutation.isPending}>
                    {createTaskMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Add Task'}
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

export default CourseManager;
