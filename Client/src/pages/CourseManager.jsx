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
  ChevronRight,
  Edit,
  Delete,
  AccessTime,
  CheckCircle,
  TrendingUp
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
  shape: { borderRadius: 4 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 900,
          borderRadius: 4,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          padding: '10px 20px',
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          border: '1px solid rgba(0,0,0,0.03)',
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 4,
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
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingModule, setEditingModule] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

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
    mutationFn: (data) => {
      if (editingCourse) {
        return courseApi.updateCourse(editingCourse._id, data);
      }
      return courseApi.createCourse(data);
    },
    onSuccess: () => {
      toast.success(editingCourse ? 'Course updated' : 'Course created');
      queryClient.invalidateQueries(['courses']);
      setShowCourseForm(false);
      setEditingCourse(null);
      resetCourse();
    },
    onError: (err) => toast.error(err.message || 'Action failed'),
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (id) => courseApi.deleteCourse(id),
    onSuccess: () => {
      toast.success('Course track deleted');
      queryClient.invalidateQueries(['courses']);
      setSelectedCourse(null);
    },
    onError: (err) => toast.error(err.message || 'Delete failed'),
  });

  const createModuleMutation = useMutation({
    mutationFn: (data) => {
      if (editingModule) {
        return courseApi.updateModule(editingModule._id, data);
      }
      const payload = {
        ...data,
        orderIndex: modules.length + 1
      };
      return courseApi.createModule(selectedCourse._id, payload);
    },
    onSuccess: () => {
      toast.success(editingModule ? 'Module updated' : 'Module created');
      queryClient.invalidateQueries(['modules', selectedCourse?._id]);
      setShowModuleForm(false);
      setEditingModule(null);
      resetModule();
    },
    onError: (err) => toast.error(err.message || 'Action failed'),
  });

  const createTaskMutation = useMutation({
    mutationFn: (data) => {
      if (editingTask) {
        return courseApi.updateTask(editingTask._id, data);
      }
      return courseApi.createTask(activeModuleId, data);
    },
    onSuccess: () => {
      toast.success(editingTask ? 'Task updated' : 'Task created');
      queryClient.invalidateQueries(['modules', selectedCourse?._id]);
      setShowTaskForm(false);
      setEditingTask(null);
      resetTask();
    },
    onError: (err) => toast.error(err.message || 'Action failed'),
  });

  const deleteModuleMutation = useMutation({
    mutationFn: (id) => courseApi.deleteModule(id),
    onSuccess: () => {
      toast.success('Module deleted');
      queryClient.invalidateQueries(['modules', selectedCourse?._id]);
    },
    onError: (err) => toast.error(err.message || 'Delete failed'),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id) => courseApi.deleteTask(id),
    onSuccess: () => {
      toast.success('Task deleted');
      queryClient.invalidateQueries(['modules', selectedCourse?._id]);
    },
    onError: (err) => toast.error(err.message || 'Delete failed'),
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
            boxShadow: '0 20px 60px rgba(232, 57, 29, 0.3)',
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
                Course Manager
              </Typography>
              <Typography variant="body1" color="inherit" sx={{ opacity: 0.9, fontWeight: 600, letterSpacing: '0.05em' }}>
                Design and refine your master course tracks.
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setShowCourseForm(true)}
              sx={{ 
                bgcolor: 'white', 
                color: '#E8391D',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)', transform: 'translateY(-2px)' },
                px: 5,
                py: 2,
                borderRadius: '16px 40px 16px 40px',
                fontWeight: 900,
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 1
              }}
            >
              New Course
            </Button>
          </Box>

          {/* Analytics Board - Curriculum Intel */}
          <Grid container spacing={3} justifyContent="center">
            {[
              { label: 'Master Tracks', value: courses.length, icon: <School />, color: '#E8391D' },
              { label: 'Active Tracks', value: courses.filter(c => c.isActive).length, icon: <CheckCircle />, color: '#1976d2' },
              { label: 'Total Duration', value: courses.reduce((sum, c) => sum + (c.durationMonths || 0), 0) + ' Mo', icon: <AccessTime />, color: '#2e7d32' },
              { label: 'Avg Duration', value: courses.length ? (courses.reduce((sum, c) => sum + (c.durationMonths || 0), 0) / courses.length).toFixed(1) + ' Mo' : '0 Mo', icon: <TrendingUp />, color: '#9c27b0' },
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

          <Grid container spacing={4} sx={{ mt: 1 }}>
            {/* Courses List */}
            <Grid item xs={12} md={3}>
              <Stack spacing={3}>
                <Typography variant="h6" color="secondary">Course Tracks</Typography>
                <Box sx={{ maxHeight: '70vh', overflowY: 'auto', pr: 0, '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
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
                        <Typography variant="body2" color="text.secondary">No courses found. Create your first course track.</Typography>
                      </Paper>
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Grid>

            {/* Course Detail / Modules */}
            <Grid item xs={12} md={9}>
              {selectedCourse ? (
                <Stack spacing={4}>
                  <Box sx={{
                    p: 4,
                    bgcolor: 'secondary.main',
                    color: 'white',
                    borderRadius: 2,
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover .course-header-actions': { opacity: 1 }
                  }}>
                    <Box sx={{ position: 'relative', zIndex: 1 }}>
                      <Typography variant="h5" fontWeight={900} gutterBottom>{selectedCourse.name}</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8, maxWidth: '80%' }}>{selectedCourse.description}</Typography>
                    </Box>
                    <Stack
                      direction="row"
                      spacing={1}
                      className="course-header-actions"
                      sx={{
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        position: 'absolute',
                        top: 24,
                        right: 24,
                        zIndex: 2
                      }}
                    >
                      <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }} onClick={() => {
                        setEditingCourse(selectedCourse);
                        resetCourse(selectedCourse);
                        setShowCourseForm(true);
                      }}>
                        <Edit sx={{ fontSize: 18 }} />
                      </IconButton>
                      <IconButton size="small" sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }} onClick={() => {
                        if (confirm('Delete this course track?')) deleteCourseMutation.mutate(selectedCourse._id);
                      }}>
                        <Delete sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Stack>
                    <School sx={{ position: 'absolute', right: -20, bottom: -20, fontSize: 180, opacity: 0.05, transform: 'rotate(-15deg)' }} />
                  </Box>

                  <Stack direction="row" spacing={24} alignItems="center">
                    <Typography variant="h6" color="secondary">Modules & Learning Path</Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Add />}
                      onClick={() => setShowModuleForm(true)}
                      sx={{ borderRadius: 2 }}
                    >
                      Add Module
                    </Button>
                  </Stack>

                  <Stack spacing={2}>
                    {modulesLoading ? (
                      <Box sx={{ textAlign: 'center', py: 4 }}><CircularProgress size={24} /></Box>
                    ) : modules.map((module, index) => (
                      <Accordion key={module._id} sx={{
                        borderRadius: '4px !important',
                        '&:before': { display: 'none' },
                        overflow: 'hidden',
                        border: '1px solid rgba(0,0,0,0.1)',
                        boxShadow: 'none',
                        '&.Mui-expanded': { border: '2px solid #E8391D' },
                        '&:hover .module-actions': { opacity: 1 }
                      }}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                          <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                            <Box sx={{ width: 32, height: 32, bgcolor: 'action.hover', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: 'primary.main' }}>
                              {index + 1}
                            </Box>
                            <Typography fontWeight={900} sx={{ flexGrow: 1 }}>{module.name}</Typography>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mr: 2, color: 'text.secondary' }}>
                              <AccessTime sx={{ fontSize: 16 }} />
                              <Typography variant="caption" fontWeight={700}>{module.durationWeeks} WEEKS</Typography>
                            </Stack>
                            <Stack direction="row" className="module-actions" sx={{ opacity: 0, transition: 'opacity 0.2s' }}>
                              <IconButton size="small" color="primary" onClick={(e) => {
                                e.stopPropagation();
                                setEditingModule(module);
                                resetModule(module);
                                setShowModuleForm(true);
                              }}><Edit sx={{ fontSize: 18 }} /></IconButton>
                              <IconButton size="small" color="error" onClick={(e) => { e.stopPropagation(); if (confirm('Delete module?')) deleteModuleMutation.mutate(module._id); }}><Delete sx={{ fontSize: 18 }} /></IconButton>
                            </Stack>
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
                                  <Paper key={task._id} elevation={0} sx={{
                                    p: 2,
                                    bgcolor: 'action.hover',
                                    borderRadius: 3,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    '&:hover .task-actions': { opacity: 1 }
                                  }}>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                      <Assignment sx={{ fontSize: 18, color: 'text.secondary' }} />
                                      <Typography variant="body2" fontWeight={700}>{task.title}</Typography>
                                    </Stack>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                      <Box className="task-actions" sx={{ opacity: 0, transition: 'opacity 0.2s' }}>
                                        <IconButton size="small" color="primary" onClick={() => {
                                          setEditingTask(task);
                                          resetTask(task);
                                          setShowTaskForm(true);
                                        }}><Edit sx={{ fontSize: 16 }} /></IconButton>
                                        <IconButton size="small" color="error" onClick={() => { if (confirm('Delete task?')) deleteTaskMutation.mutate(task._id); }}><Delete sx={{ fontSize: 16 }} /></IconButton>
                                      </Box>
                                      <Chip label={task.type} size="small" sx={{ fontWeight: 900, fontSize: '0.6rem' }} />
                                    </Stack>
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
                  width: '700px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  gap: 3,
                  bgcolor: 'white',
                  borderRadius: 2,
                  border: '2px dashed rgba(0,0,0,0.1)',
                  px: 4
                }}>
                  <Box sx={{ p: 3, bgcolor: 'action.hover', borderRadius: '50%' }}>
                    <School sx={{ fontSize: 60, color: 'text.disabled' }} />
                  </Box>
                  <Typography variant="h6" color="text.disabled" fontWeight={800} sx={{ textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Select a course track to manage
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>

          {/* Dialogs */}
          <Dialog open={showCourseForm} onClose={() => { setShowCourseForm(false); setEditingCourse(null); resetCourse(); }} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
            <Box sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={900} sx={{ textTransform: 'uppercase', mb: 4 }}>{editingCourse ? 'Edit Course Track' : 'Add Course Track'}</Typography>
              <Box component="form" onSubmit={handleCourseSubmit((data) => createCourseMutation.mutate(data))} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField fullWidth label="Track Name" placeholder="e.g. Full Stack Development" {...regCourse('name', { required: true })} />
                <TextField fullWidth type="number" label="Duration (Months)" {...regCourse('durationMonths', { required: true, min: 1 })} />
                <TextField fullWidth multiline rows={4} label="Description" placeholder="Briefly describe the learning path..." {...regCourse('description', { required: true })} />
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                  <Button onClick={() => { setShowCourseForm(false); setEditingCourse(null); resetCourse(); }} color="secondary">Cancel</Button>
                  <Button type="submit" variant="contained" disableElevation disabled={createCourseMutation.isPending}>
                    {createCourseMutation.isPending ? <CircularProgress size={24} color="inherit" /> : (editingCourse ? 'Update Track' : 'Create Track')}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Dialog>

          <Dialog open={showModuleForm} onClose={() => { setShowModuleForm(false); setEditingModule(null); resetModule(); }} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
            <Box sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={900} sx={{ textTransform: 'uppercase', mb: 4 }}>{editingModule ? 'Edit Module' : 'Add Module'}</Typography>
              <Box component="form" onSubmit={handleModuleSubmit((data) => createModuleMutation.mutate(data))} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField fullWidth label="Module Name" placeholder="e.g. Introduction to React" {...regModule('name', { required: true })} />
                <TextField fullWidth type="number" label="Duration (Weeks)" {...regModule('durationWeeks', { required: true, min: 1 })} />
                <TextField fullWidth multiline rows={3} label="Module Description" {...regModule('description')} />
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                  <Button onClick={() => { setShowModuleForm(false); setEditingModule(null); resetModule(); }} color="secondary">Cancel</Button>
                  <Button type="submit" variant="contained" disableElevation disabled={createModuleMutation.isPending}>
                    {createModuleMutation.isPending ? <CircularProgress size={24} color="inherit" /> : (editingModule ? 'Update Module' : 'Add Module')}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Dialog>

          <Dialog open={showTaskForm} onClose={() => { setShowTaskForm(false); setEditingTask(null); resetTask(); }} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
            <Box sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={900} sx={{ textTransform: 'uppercase', mb: 4 }}>{editingTask ? 'Edit Task' : 'Add Task'}</Typography>
              <Box component="form" onSubmit={handleTaskSubmit((data) => createTaskMutation.mutate(data))} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <TextField fullWidth label="Task Title" placeholder="e.g. Build a Todo List" {...regTask('title', { required: true })} />
                <TextField select fullWidth label="Task Type" {...regTask('type', { required: true })}>
                  <MenuItem value="technical">Technical</MenuItem>
                  <MenuItem value="personal">Personal / Soft Skills</MenuItem>
                </TextField>
                <TextField fullWidth multiline rows={3} label="Task Description" {...regTask('description', { required: true })} />
                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                  <Button onClick={() => { setShowTaskForm(false); setEditingTask(null); resetTask(); }} color="secondary">Cancel</Button>
                  <Button type="submit" variant="contained" disableElevation disabled={createTaskMutation.isPending}>
                    {createTaskMutation.isPending ? <CircularProgress size={24} color="inherit" /> : (editingTask ? 'Update Task' : 'Add Task')}
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
