import React from 'react';
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ThemeProvider,
  createTheme,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Assessment,
  Person,
  Star,
  ChevronRight,
  Schedule,
  CheckCircle,
  Info,
  Assignment,
  NavigateNext
} from '@mui/icons-material';

import AppShell from '../components/layout/AppShell';
import { useQuery } from '@tanstack/react-query';
import * as interviewApi from '../api/interview.api';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';
import { Groups } from '@mui/icons-material';

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

// Real data will be fetched via React Query

const EvaluationManagement = () => {
  const { user } = useAuth();
  
  const { data: interviewsRes, isLoading } = useQuery({
    queryKey: ['all-interviews', user?._id],
    queryFn: () => interviewApi.getInterviews(
      user?.role === ROLES.FACILITATOR ? { facilitator: user._id } : {}
    ),
    enabled: !!user?._id
  });

  const interviews = Array.isArray(interviewsRes) ? interviewsRes : (interviewsRes?.data?.data || interviewsRes?.data || []);

  // Stats calculation
  const toSchedule = interviews.filter(i => i.status === 'scheduled').length;
  const pendingScores = interviews.filter(i => i.status === 'in_progress').length;
  const completed = interviews.filter(i => i.status === 'passed' || i.status === 'failed').length;
  const passed = interviews.filter(i => i.status === 'passed').length;
  const passRate = completed > 0 ? Math.round((passed / completed) * 100) : 0;
  const reInterviews = interviews.filter(i => i.status === 're_interview_required').length;

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
                component={Link} 
                to="/dashboard" 
                underline="none" 
                color="text.secondary" 
                sx={{ fontSize: '0.75rem', fontWeight: 700, '&:hover': { color: 'primary.main' } }}
              >
                DASHBOARD
              </MuiLink>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.primary' }}>
                EVALUATIONS
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
                <Assessment fontSize="medium" />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={900} color="text.primary" sx={{ letterSpacing: '-0.02em', mb: 0.2, fontSize: '1.75rem', textTransform: 'none' }}>
                  Module Evaluations
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Schedule interviews, assign interviewers, and record final scores
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Stats Section - Standardized 4-Box Grid */}
          <Box sx={{ 
            width: '100%',
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
            gap: { xs: 1.5, md: 2 },
            mb: 2
          }}>
            {[
              { label: 'To Schedule', count: String(toSchedule).padStart(2, '0'), color: '#E8391D', icon: <Schedule /> },
              { label: 'Pending Scores', count: String(pendingScores).padStart(2, '0'), color: '#1E2126', icon: <Assignment /> },
              { label: 'Pass Rate', count: `${passRate}%`, color: '#2e7d32', icon: <CheckCircle /> },
              { label: 'Re-Interviews', count: String(reInterviews).padStart(2, '0'), color: '#d32f2f', icon: <Info /> },
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
                overflow: 'hidden',
                bgcolor: 'white'
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
                      {stat.count}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Evaluations Table */}
          <Card sx={{ overflow: 'hidden' }}>
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
              <Table>
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', py: 3 }}>Student & Module</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Batch</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Interviewer</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Score</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={700}>LOADING INTERVIEWS...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : interviews.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                        <Typography variant="body2" color="text.secondary" fontWeight={700}>NO INTERVIEWS FOUND</Typography>
                      </TableCell>
                    </TableRow>
                  ) : interviews.map((evalItem) => (
                    <TableRow key={evalItem._id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                      <TableCell sx={{ py: 3 }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={800} color="secondary">{evalItem.student?.name || 'Unknown Student'}</Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight={700}>{evalItem.module?.toUpperCase()}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Groups sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" fontWeight={700}>{evalItem.batch?.name || 'N/A'}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" fontWeight={700}>{evalItem.interviewer?.name || 'Not Assigned'}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={evalItem.status?.replace('_', ' ').toUpperCase()}
                          size="small"
                          color={evalItem.status === 'passed' ? 'success' : evalItem.status === 'scheduled' ? 'info' : evalItem.status === 'failed' ? 'error' : 'warning'}
                          sx={{ fontWeight: 900, borderRadius: 2, fontSize: '0.65rem' }}
                        />
                      </TableCell>
                      <TableCell>
                        {evalItem.score !== undefined && evalItem.score !== null ? (
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Star sx={{ color: '#FFB400', fontSize: 18 }} />
                            <Typography variant="subtitle2" fontWeight={900}>{evalItem.score}/{evalItem.maxScore || 100}</Typography>
                          </Stack>
                        ) : (
                          <Typography variant="caption" fontWeight={900} sx={{ opacity: 0.3 }}>NOT SCORED</Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Button 
                          component={Link}
                          to={`/batches/${evalItem.batch?._id || evalItem.batch}?tab=2`}
                          size="small" 
                          endIcon={<ChevronRight />} 
                          sx={{ fontWeight: 900 }}
                        >
                          {evalItem.status === 'passed' || evalItem.status === 'failed' ? 'Details' : 'Record'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default EvaluationManagement;
