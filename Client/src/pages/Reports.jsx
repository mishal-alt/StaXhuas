import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Stack,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider,
  ThemeProvider,
  createTheme,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  TrendingDown,
  People,
  EmojiEvents,
  Assessment,
  Download,
  DateRange,
  MoreVert,
  NavigateNext
} from '@mui/icons-material';
import { LineChart, BarChart } from '@mui/x-charts';

import AppShell from '../components/layout/AppShell';

// Custom theme to match Staxhaus brand
const theme = createTheme({
  palette: {
    primary: {
      main: '#E8391D', // Brand Orange
    },
    secondary: {
      main: '#1E2126', // Brand Charcoal
    },
    background: {
      default: '#F7F7F5',
    }
  },
  typography: {
    fontFamily: '"Outfit", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.05em' },
    h4: { fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em' },
    h6: { fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' },
  },
  shape: {
    borderRadius: 24,
  },
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
        }
      }
    }
  }
});

const KPI_DATA = [
  { label: 'Avg Attendance', value: '94%', icon: <People />, trend: '+2.4%', up: true, color: '#1976d2' },
  { label: 'Pass Rate', value: '88%', icon: <EmojiEvents />, trend: '+1.2%', up: true, color: '#2e7d32' },
  { label: 'Scrum Blocker', value: '1.2', icon: <Assessment />, trend: '-0.5%', up: false, color: '#E8391D' },
  { label: 'Active Students', value: '124', icon: <TrendingUp />, trend: '+12', up: true, color: '#9c27b0' },
];

const BATCH_DATA = [
  { name: 'MERN-STACK-2026-B1', progress: 92, status: 'On Track', students: 48, color: '#2e7d32' },
  { name: 'MERN-STACK-2026-B2', progress: 78, status: 'Stable', students: 52, color: '#ed6c02' },
  { name: 'JAVA-LEGACY-02', progress: 45, status: 'Critical', students: 24, color: '#d32f2f' },
];

const Reports = () => {
  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', gap: 6 }}>

          {/* Header */}
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
                  REPORTS
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
                    Performance Analytics
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Comprehensive overview of student and cohort performance
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Stack direction="row" spacing={3}>
              <Button 
                variant="outlined" 
                startIcon={<DateRange />} 
                sx={{ 
                  color: 'text.primary', 
                  borderColor: 'divider',
                  borderRadius: 2,
                  px: 3,
                  py: 1.5
                }}
              >
                Timeframe
              </Button>
              <Button 
                variant="contained" 
                startIcon={<Download />}
                sx={{ 
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(232, 57, 29, 0.2)'
                }}
              >
                Export Ledger
              </Button>
            </Stack>
          </Box>

          <Divider sx={{ opacity: 0.1 }} />

          {/* Stats Section - Standardized 4-Box Grid */}
          <Box sx={{ 
            width: '100%',
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
            gap: { xs: 1.5, md: 2 },
            mb: 2
          }}>
            {KPI_DATA.map((kpi, i) => (
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
                    bgcolor: `${kpi.color}10`, 
                    color: kpi.color, 
                    borderRadius: 2.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {React.cloneElement(kpi.icon, { sx: { fontSize: { xs: 18, sm: 20, md: 22 } } })}
                  </Box>
                  <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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
                        {kpi.label.toUpperCase()}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: kpi.up ? 'success.main' : 'error.main' }}>
                        {kpi.up ? <TrendingUp sx={{ fontSize: 12 }} /> : <TrendingDown sx={{ fontSize: 12 }} />}
                        <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 900, ml: 0.2 }}>{kpi.trend}</Typography>
                      </Box>
                    </Box>
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
                      {kpi.value}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Charts Section */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
              <Card sx={{ height: 500, p: 4 }}>
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h6" fontWeight={900}>Attendance Vector</Typography>
                    <Typography variant="caption" color="text.secondary" fontWeight={700}>Daily sync metrics across all cohorts</Typography>
                  </Box>
                  <IconButton><MoreVert /></IconButton>
                </Box>
                <Box sx={{ width: '100%', height: 350 }}>
                  <LineChart
                    xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7], label: 'Week Days', scaleType: 'point' }]}
                    series={[
                      {
                        data: [92, 95, 88, 94, 96, 90, 93],
                        area: true,
                        color: '#E8391D',
                        label: 'Attendance %',
                      },
                    ]}
                  />
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={5}>
              <Card sx={{ height: 500, p: 4 }}>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight={900}>Module Velocity</Typography>
                  <Typography variant="caption" color="text.secondary" fontWeight={700}>Success threshold distribution</Typography>
                </Box>
                <Box sx={{ width: '100%', height: 350 }}>
                  <BarChart
                    xAxis={[{ scaleType: 'band', data: ['HTML', 'JS', 'React', 'Node', 'DB'] }]}
                    series={[{ data: [98, 82, 75, 88, 92], color: '#1E2126' }]}
                    layout="vertical"
                  />
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Detailed Ledger Section */}
          <Card sx={{ overflow: 'hidden' }}>
            <Box sx={{ p: 4, bgcolor: 'secondary.main', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="h6" fontWeight={900}>Academic Batch Ledger</Typography>
                <Typography variant="caption" sx={{ opacity: 0.6, fontWeight: 700 }}>Comparative performance tracking</Typography>
              </Box>
              <Typography variant="caption" fontWeight={900} sx={{ opacity: 0.4 }}>01 MAY 2026</Typography>
            </Box>
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', py: 3 }}>Cohort Identity</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Deployment Progress</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Magnitude</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {BATCH_DATA.map((batch, i) => (
                    <TableRow key={i} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                      <TableCell sx={{ py: 4 }}>
                        <Stack direction="row" spacing={3} alignItems="center">
                          <Box sx={{ width: 48, height: 48, bgcolor: `${batch.color}20`, color: batch.color, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                            {batch.name[0]}
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={900}>{batch.name}</Typography>
                            <Typography variant="caption" color="text.secondary">COHORT REPOSITORY</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={batch.status}
                          size="small"
                          sx={{
                            fontWeight: 900,
                            bgcolor: `${batch.color}20`,
                            color: batch.color,
                            border: `1px solid ${batch.color}40`
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: 200 }}>
                        <Stack spacing={1}>
                          <LinearProgress
                            variant="determinate"
                            value={batch.progress}
                            sx={{
                              height: 8,
                              borderRadius: 4,
                              bgcolor: 'action.hover',
                              '& .MuiLinearProgress-bar': { bgcolor: batch.color }
                            }}
                          />
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" fontWeight={900} color="text.secondary">SYNC LEVEL</Typography>
                            <Typography variant="caption" fontWeight={900}>{batch.progress}%</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6" fontWeight={900}>{batch.students}</Typography>
                        <Typography variant="caption" color="text.secondary">ACTIVE PROFILES</Typography>
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

export default Reports;

