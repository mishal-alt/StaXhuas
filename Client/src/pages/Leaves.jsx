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
  IconButton,
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
import { 
  CalendarMonth, 
  CheckCircle, 
  Cancel, 
  Schedule, 
  Description,
  History,
  AssignmentTurnedIn,
  NavigateNext
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

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

const DUMMY_LEAVES = [
  { id: 1, student: 'Hrithic Raj', reason: 'Fever & Medical Checkup', dates: 'May 12 - May 13', status: 'Pending', type: 'Medical' },
  { id: 2, student: 'Ananya S', reason: 'Sister\'s Wedding', dates: 'May 15 - May 17', status: 'Approved', type: 'Personal' },
  { id: 3, student: 'Mohammad Mishal', reason: 'University Exam', dates: 'May 20', status: 'Rejected', type: 'Academic' },
];

const Leaves = () => {
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
                LEAVES
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
                <CalendarMonth />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={900} sx={{ fontSize: '1.5rem', color: '#1E2126', lineHeight: 1.2 }}>
                  Leave Management
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={600}>
                  Review and manage student absence requests based on batch quotas.
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
              { label: 'Pending', count: '03', color: '#ed6c02', icon: <Schedule /> },
              { label: 'Approved Today', count: '05', color: '#2e7d32', icon: <CheckCircle /> },
              { label: 'Rejected', count: '02', color: '#d32f2f', icon: <Cancel /> },
              { label: 'Total Requests', count: '124', color: '#1E2126', icon: <AssignmentTurnedIn /> },
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

          {/* Leaves Table */}
          <Card sx={{ overflow: 'hidden' }}>
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
              <Table>
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', py: 3 }}>Student</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Reason</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Dates</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {DUMMY_LEAVES.map((leave) => (
                    <TableRow key={leave.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                      <TableCell sx={{ py: 3 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: 'secondary.main', borderRadius: 2 }}>{leave.student[0]}</Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={800}>{leave.student}</Typography>
                            <Typography variant="caption" fontWeight={900} color="primary.main" sx={{ fontSize: '0.6rem', textTransform: 'uppercase' }}>{leave.type}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {leave.reason}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <CalendarMonth sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" fontWeight={700} color="text.secondary">{leave.dates}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={leave.status} 
                          size="small" 
                          color={leave.status === 'Approved' ? 'success' : leave.status === 'Pending' ? 'warning' : 'error'}
                          sx={{ fontWeight: 900, borderRadius: 2 }} 
                        />
                      </TableCell>
                      <TableCell align="right">
                        {leave.status === 'Pending' && (
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <IconButton color="success" size="small" sx={{ bgcolor: 'success.main', color: 'white', '&:hover': { bgcolor: 'success.dark' } }}><CheckCircle /></IconButton>
                            <IconButton color="error" size="small" sx={{ bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}><Cancel /></IconButton>
                          </Stack>
                        )}
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

export default Leaves;
