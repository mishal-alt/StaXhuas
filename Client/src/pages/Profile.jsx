import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Stack, 
  Chip, 
  Avatar, 
  Divider,
  Paper,
  IconButton,
  LinearProgress,
  ThemeProvider,
  createTheme,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Mail, 
  Phone, 
  LocationOn, 
  School, 
  People, 
  EmojiEvents, 
  Code, 
  Assessment,
  Work,
  Description,
  Terminal,
  BarChart,
  VerifiedUser,
  NavigateNext
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

const Profile = () => {
  const { user } = useAuth();
  const isInterviewer = user?.role === 'interviewer';
  const isFacilitator = user?.role === 'facilitator';
  const isStaff = isInterviewer || isFacilitator;

  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, pb: 8 }}>
          
          {/* Header */}
          <Box sx={{
            pt: 4,
            pb: 3,
            px: 6,
            mx: -6,
            mt: -6,
            background: 'white',
            borderBottom: '1px solid #E5E7EB',
            mb: 3
          }}>
            <Breadcrumbs 
              separator={<NavigateNext fontSize="small" sx={{ opacity: 0.5 }} />} 
              sx={{ mb: 1.5 }}
            >
              <MuiLink 
                component={RouterLink} 
                to="/dashboard" 
                underline="none" 
                color="text.secondary" 
                sx={{ fontSize: '0.75rem', fontWeight: 700, '&:hover': { color: 'primary.main' } }}
              >
                DASHBOARD
              </MuiLink>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.primary' }}>
                MY PROFILE
              </Typography>
            </Breadcrumbs>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                bgcolor: 'rgba(232, 57, 29, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.main'
              }}>
                <VerifiedUser />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={900} sx={{ fontSize: '1.5rem', color: '#1E2126', lineHeight: 1.2 }}>
                  My Identity
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Manage your personal information and professional credentials.
                </Typography>
              </Box>
            </Box>
          </Box>
          
          {/* Hero Profile Header */}
          <Card sx={{ position: 'relative', overflow: 'hidden' }}>
            <Box sx={{ 
              position: 'absolute', 
              top: 0, 
              right: 0, 
              width: 300, 
              height: 300, 
              bgcolor: 'primary.main', 
              opacity: 0.03, 
              borderRadius: '0 0 0 100%' 
            }} />
            <CardContent sx={{ p: 6 }}>
              <Grid container spacing={6} alignItems="center">
                <Grid item>
                  <Avatar 
                    sx={{ 
                      width: 140, 
                      height: 140, 
                      bgcolor: 'secondary.main', 
                      fontSize: '3rem', 
                      fontWeight: 900, 
                      borderRadius: 6,
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                    }}
                  >
                    {user?.name?.[0]}
                  </Avatar>
                </Grid>
                <Grid item xs={12} sm>
                  <Box>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                      <Typography variant="h4" color="secondary" sx={{ fontFamily: 'Outfit' }}>{user?.name}</Typography>
                      <VerifiedUser sx={{ color: 'primary.main' }} />
                    </Stack>
                    <Typography variant="body1" color="text.secondary" fontWeight={600} gutterBottom>
                      {isInterviewer ? 'Official Technical Evaluator' : isFacilitator ? 'Lead Academic Facilitator' : 'Elite Student'} at Staxhaus
                    </Typography>
                    
                    <Stack direction="row" spacing={1} sx={{ mt: 3, flexWrap: 'wrap', gap: 1 }}>
                      <Chip label={`ROLE: ${user?.role?.toUpperCase()}`} color="primary" sx={{ fontWeight: 900, borderRadius: 2 }} />
                      <Chip label={isStaff ? 'STAFF ID: STX-402' : 'STUDENT ID: STX-102'} variant="outlined" sx={{ fontWeight: 900, borderRadius: 2 }} />
                      <Chip label="STATUS: ACTIVE" color="success" sx={{ fontWeight: 900, borderRadius: 2 }} />
                    </Stack>
                  </Box>
                </Grid>
                <Grid item xs={12} md="auto">
                  <Button variant="contained" color="secondary" sx={{ borderRadius: 4 }}>Edit Profile</Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          <Grid container spacing={6}>
            {/* Left Sidebar */}
            <Grid item xs={12} lg={4}>
              <Stack spacing={4}>
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" color="secondary" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                       <Mail sx={{ color: 'primary.main' }} /> Identity & Contact
                    </Typography>
                    <Stack spacing={3}>
                      <Box>
                        <Typography variant="caption" fontWeight={900} color="text.secondary">EMAIL ADDRESS</Typography>
                        <Typography variant="body2" fontWeight={700}>{user?.email}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" fontWeight={900} color="text.secondary">PHONE NUMBER</Typography>
                        <Typography variant="body2" fontWeight={700}>+91 98765 43210</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" fontWeight={900} color="text.secondary">LOCATION</Typography>
                        <Typography variant="body2" fontWeight={700}>Bangalore, India</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                <Card sx={{ bgcolor: 'secondary.main', color: 'white' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Typography variant="h6" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                       <EmojiEvents sx={{ color: 'primary.main' }} /> Achievements
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                      {['React', 'NodeJS', 'MERN', 'DevOps'].map(skill => (
                        <Chip key={skill} label={skill} size="small" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', border: '1px solid', fontWeight: 900 }} />
                      ))}
                    </Stack>
                    <Typography variant="caption" sx={{ mt: 3, display: 'block', opacity: 0.6, fontStyle: 'italic' }}>
                      Certified by Staxhaus Academic Board
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>

            {/* Main Content */}
            <Grid item xs={12} lg={8}>
              <Stack spacing={4}>
                {isFacilitator && (
                  <>
                    <Card sx={{ borderTop: '8px solid #E8391D' }}>
                      <CardContent sx={{ p: 4 }}>
                        <Typography variant="h6" color="secondary" sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                          <BarChart sx={{ color: 'primary.main' }} /> Professional Performance
                        </Typography>
                        <Grid container spacing={4}>
                          <Grid item xs={6}>
                            <Paper elevation={0} sx={{ p: 4, bgcolor: 'background.default', borderRadius: 6, textAlign: 'center' }}>
                              <Typography variant="caption" fontWeight={900} color="text.secondary">BATCHES MANAGED</Typography>
                              <Typography variant="h3" fontWeight={900} sx={{ mt: 1 }}>08</Typography>
                            </Paper>
                          </Grid>
                          <Grid item xs={6}>
                            <Paper elevation={0} sx={{ p: 4, bgcolor: 'background.default', borderRadius: 6, textAlign: 'center' }}>
                              <Typography variant="caption" fontWeight={900} color="text.secondary">STUDENTS MENTORED</Typography>
                              <Typography variant="h3" fontWeight={900} sx={{ mt: 1 }}>124</Typography>
                            </Paper>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent sx={{ p: 4 }}>
                        <Typography variant="h6" color="secondary" sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                          <People sx={{ color: 'primary.main' }} /> Active Assignments
                        </Typography>
                        <Stack spacing={2}>
                          {[
                            { name: 'MERN-B1', students: 12, progress: 'Week 12' },
                            { name: 'FS-JAVA-02', students: 8, progress: 'Week 08' },
                          ].map(batch => (
                            <Box key={batch.name} sx={{ p: 3, bgcolor: 'action.hover', borderRadius: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Box>
                                <Typography variant="subtitle2" fontWeight={900}>{batch.name}</Typography>
                                <Typography variant="caption" color="text.secondary" fontWeight={700}>{batch.students} STUDENTS • {batch.progress.toUpperCase()}</Typography>
                              </Box>
                              <Chip label="TRACKING" size="small" color="primary" sx={{ fontWeight: 900, borderRadius: 2 }} />
                            </Box>
                          ))}
                        </Stack>
                      </CardContent>
                    </Card>
                  </>
                )}

                {/* Developer Stats (Mock) - Only for Students */}
                {!isStaff && (
                  <Grid container spacing={4}>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent sx={{ p: 4 }}>
                          <Typography variant="h6" color="secondary" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Code /> Github Pulse
                          </Typography>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 3 }}>
                             {Array.from({ length: 50 }).map((_, i) => (
                               <Box key={i} sx={{ width: 12, height: 12, borderRadius: 0.5, bgcolor: i % 7 === 0 ? 'primary.main' : 'action.hover' }} />
                             ))}
                          </Box>
                          <Typography variant="caption" fontWeight={900} color="text.secondary">COMMITS SYNCED: 1,240</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Card>
                        <CardContent sx={{ p: 4 }}>
                          <Typography variant="h6" color="secondary" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Terminal /> Skill Progress
                          </Typography>
                          <Stack spacing={2}>
                            <Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" fontWeight={900}>EASY</Typography>
                                <Typography variant="caption" fontWeight={900}>120/400</Typography>
                              </Box>
                              <LinearProgress variant="determinate" value={30} sx={{ height: 6, borderRadius: 3, bgcolor: 'action.hover' }} />
                            </Box>
                            <Box>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" fontWeight={900}>MEDIUM</Typography>
                                <Typography variant="caption" fontWeight={900}>95/800</Typography>
                              </Box>
                              <LinearProgress variant="determinate" value={12} sx={{ height: 6, borderRadius: 3, bgcolor: 'action.hover', '& .MuiLinearProgress-bar': { bgcolor: '#ed6c02' } }} />
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                )}
              </Stack>
            </Grid>
          </Grid>

        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default Profile;
