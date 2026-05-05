import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Stack, 
  Chip, 
  Button, 
  IconButton, 
  Divider,
  Paper,
  LinearProgress,
  Checkbox,
  FormControlLabel,
  ThemeProvider,
  createTheme,
  Avatar,
  Tooltip
} from '@mui/material';
import { 
  Assignment, 
  OpenInNew, 
  Description, 
  Code, 
  CheckCircle, 
  RadioButtonUnchecked,
  Info,
  ChevronRight,
  Forum
} from '@mui/icons-material';

import AppShell from '../components/layout/AppShell';

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
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 900,
          borderRadius: 16,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }
      }
    }
  }
});

const StudentTasks = () => {
  const [completedTasks, setCompletedTasks] = useState([]);

  const tasks = [
    { id: '1', title: 'Array Methods Mastery', type: 'technical', description: 'Complete the exercise on map, filter, and reduce.' },
    { id: '2', title: 'Time Management Workshop', type: 'personal', description: 'Watch the video and submit your weekly schedule.' },
    { id: '3', title: 'React Hooks Deep Dive', type: 'technical', description: 'Build a small app using useEffect and custom hooks.' },
    { id: '4', title: 'Professional Communication', type: 'personal', description: 'Draft a mock follow-up email after an interview.' }
  ];

  const toggleTask = (id) => {
    setCompletedTasks(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const progress = (completedTasks.length / tasks.length) * 100;

  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, pb: 12 }}>
          
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
            <Box>
              <Typography variant="h4" color="secondary" sx={{ fontSize: '2.5rem' }}>Tasks & Resources</Typography>
              <Typography variant="body1" color="text.secondary" fontWeight={600}>Everything you need to master this module.</Typography>
            </Box>
            <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 6, display: 'flex', alignItems: 'center', gap: 4 }}>
               <Typography variant="caption" fontWeight={900}>PROGRESS</Typography>
               <Box sx={{ width: 120 }}>
                 <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4, bgcolor: 'action.hover' }} />
               </Box>
               <Typography variant="subtitle2" fontWeight={900} color="primary">{completedTasks.length}/{tasks.length}</Typography>
            </Paper>
          </Box>

          <Grid container spacing={6}>
            {/* Tasks Column */}
            <Grid item xs={12} lg={8}>
              <Stack spacing={4}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Assignment sx={{ color: 'primary.main' }} /> Current Assignments
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    <Chip label="ALL" size="small" variant="contained" color="secondary" sx={{ fontWeight: 900, borderRadius: 2 }} />
                    <Chip label="TECHNICAL" size="small" variant="outlined" sx={{ fontWeight: 900, borderRadius: 2 }} />
                    <Chip label="PERSONAL" size="small" variant="outlined" sx={{ fontWeight: 900, borderRadius: 2 }} />
                  </Stack>
                </Box>

                <Stack spacing={3}>
                  {tasks.map(task => {
                    const isDone = completedTasks.includes(task.id);
                    return (
                      <Card key={task.id} sx={{ opacity: isDone ? 0.6 : 1, transition: 'all 0.3s', '&:hover': { borderColor: 'primary.main' } }}>
                        <CardContent sx={{ p: 4, display: 'flex', gap: 3 }}>
                          <Checkbox 
                            checked={isDone} 
                            onChange={() => toggleTask(task.id)}
                            icon={<RadioButtonUnchecked />}
                            checkedIcon={<CheckCircle />}
                            color="success"
                            sx={{ mt: -1 }}
                          />
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                              <Typography variant="subtitle1" fontWeight={900} sx={{ textDecoration: isDone ? 'line-through' : 'none' }}>
                                {task.title}
                              </Typography>
                              <Chip 
                                label={task.type.toUpperCase()} 
                                size="small" 
                                color={task.type === 'technical' ? 'primary' : 'default'}
                                sx={{ fontWeight: 900, fontSize: '0.6rem', borderRadius: 2 }} 
                              />
                            </Box>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                              {task.description}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Stack>
              </Stack>
            </Grid>

            {/* Resources Column */}
            <Grid item xs={12} lg={4}>
              <Stack spacing={4}>
                <Typography variant="h6" color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Description /> Module Resources
                </Typography>

                <Stack spacing={2}>
                  {[
                    { name: 'Module Handbook.pdf', type: 'PDF', size: '2.4 MB', icon: <Description />, color: '#d32f2f' },
                    { name: 'Base Boilerplate Code', type: 'GITHUB', size: 'Repository', icon: <Code />, color: '#1976d2' },
                  ].map((res, i) => (
                    <Card key={i} sx={{ '&:hover': { bgcolor: 'action.hover' }, transition: 'all 0.2s', cursor: 'pointer' }}>
                      <CardContent sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                         <Stack direction="row" spacing={3} alignItems="center">
                            <Box sx={{ p: 1.5, bgcolor: `${res.color}10`, color: res.color, borderRadius: 3 }}>
                               {res.icon}
                            </Box>
                            <Box>
                               <Typography variant="subtitle2" fontWeight={900}>{res.name}</Typography>
                               <Typography variant="caption" color="text.secondary" fontWeight={700}>{res.size}</Typography>
                            </Box>
                         </Stack>
                         <OpenInNew sx={{ color: 'text.disabled', fontSize: 18 }} />
                      </CardContent>
                    </Card>
                  ))}

                  <Paper elevation={0} sx={{ p: 4, bgcolor: 'secondary.main', color: 'white', borderRadius: 8, mt: 4 }}>
                    <Typography variant="h6" fontWeight={900} sx={{ mb: 1.5 }}>Need help?</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.6, fontSize: '0.75rem', lineHeight: 1.6, mb: 4 }}>
                      Stuck on a task? Reach out to your facilitator or post in the batch Discord channel.
                    </Typography>
                    <Button 
                      fullWidth 
                      variant="outlined" 
                      color="inherit" 
                      startIcon={<Forum />}
                      sx={{ borderColor: 'rgba(255,255,255,0.2)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
                    >
                      Open Discord
                    </Button>
                  </Paper>
                </Stack>
              </Stack>
            </Grid>
          </Grid>

        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default StudentTasks;
