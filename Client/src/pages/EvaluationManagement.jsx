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

const DUMMY_EVALUATIONS = [
  { id: 1, student: 'Hrithic Raj', module: 'Module 4: React Advanced', interviewer: 'Sandeep K', status: 'Completed', score: 85 },
  { id: 2, student: 'Ananya S', module: 'Module 4: React Advanced', interviewer: 'Sandeep K', status: 'Scheduled', score: null },
  { id: 3, student: 'Sneha Kapoor', module: 'Module 2: Node.js Basics', interviewer: 'Rahul P', status: 'Failed', score: 45 },
];

const EvaluationManagement = () => {
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

          {/* Stats Grid */}
          <Grid container spacing={3}>
            {[
              { label: 'To Schedule', count: '05', color: '#E8391D', icon: <Schedule /> },
              { label: 'Pending Scores', count: '02', color: '#1E2126', icon: <Assignment /> },
              { label: 'Pass Rate', count: '92%', color: '#2e7d32', icon: <CheckCircle /> },
              { label: 'Re-Interviews', count: '01', color: '#d32f2f', icon: <Info /> },
            ].map((stat, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card>
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                      <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                      <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.1em' }}>{stat.label.toUpperCase()}</Typography>
                    </Stack>
                    <Typography variant="h3" fontWeight={900} sx={{ fontFamily: 'Outfit', color: stat.color }}>{stat.count}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Evaluations Table */}
          <Card sx={{ overflow: 'hidden' }}>
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
              <Table>
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', py: 3 }}>Student & Module</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Interviewer</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Score</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {DUMMY_EVALUATIONS.map((evalItem) => (
                    <TableRow key={evalItem.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                      <TableCell sx={{ py: 3 }}>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={800} color="secondary">{evalItem.student}</Typography>
                          <Typography variant="caption" color="text.secondary" fontWeight={700}>{evalItem.module.toUpperCase()}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" fontWeight={700}>{evalItem.interviewer}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={evalItem.status}
                          size="small"
                          color={evalItem.status === 'Completed' ? 'success' : evalItem.status === 'Scheduled' ? 'info' : 'error'}
                          sx={{ fontWeight: 900, borderRadius: 2 }}
                        />
                      </TableCell>
                      <TableCell>
                        {evalItem.score ? (
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Star sx={{ color: '#FFB400', fontSize: 18 }} />
                            <Typography variant="subtitle2" fontWeight={900}>{evalItem.score}/100</Typography>
                          </Stack>
                        ) : (
                          <Typography variant="caption" fontWeight={900} sx={{ opacity: 0.3 }}>NOT SCORED</Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Button size="small" endIcon={<ChevronRight />} sx={{ fontWeight: 900 }}>
                          {evalItem.status === 'Completed' ? 'Details' : 'Record'}
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
