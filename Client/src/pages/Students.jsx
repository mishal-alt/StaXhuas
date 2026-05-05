import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Button, 
  Stack, 
  TextField, 
  InputAdornment, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Avatar,
  ThemeProvider,
  createTheme,
  Divider
} from '@mui/material';
import { 
  Search, 
  FilterList, 
  MoreVert, 
  PersonAdd, 
  School,
  TrendingUp,
  Mail,
  Group
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

const DUMMY_STUDENTS = [
  { id: 1, name: 'Hrithic Raj', email: 'hrithic@staxhaus.com', batch: 'MERN-B1', status: 'Active', progress: 'Module 4', color: '#2e7d32' },
  { id: 2, name: 'Ananya S', email: 'ananya@staxhaus.com', batch: 'MERN-B1', status: 'Active', progress: 'Module 4', color: '#2e7d32' },
  { id: 3, name: 'Mohammad Mishal', email: 'mishal@staxhaus.com', batch: 'MERN-B2', status: 'Active', progress: 'Module 1', color: '#2e7d32' },
  { id: 4, name: 'Sneha Kapoor', email: 'sneha@staxhaus.com', batch: 'MERN-B1', status: 'Discontinued', progress: 'Module 2', color: '#ed6c02' },
  { id: 5, name: 'Rahul V', email: 'rahul@staxhaus.com', batch: 'FS-JAVA-02', status: 'Active', progress: 'Module 8', color: '#2e7d32' },
];

const Students = () => {
  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, pb: 8 }}>
          
          {/* Header */}
          <Box sx={{ 
            bgcolor: '#E8391D', 
            p: 4, 
            borderRadius: 6, 
            color: 'white',
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: 4,
            boxShadow: '0 8px 32px rgba(232, 57, 29, 0.15)'
          }}>
            <Box>
              <Typography variant="h4" color="inherit" sx={{ fontSize: '2.5rem' }}>
                Student Roster
              </Typography>
              <Typography variant="body1" color="inherit" sx={{ opacity: 0.9, fontWeight: 600 }}>
                Manage and monitor students across your assigned batches.
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<PersonAdd />}
              sx={{ 
                bgcolor: 'white', 
                color: '#E8391D',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                px: 4,
                py: 1.5,
                borderRadius: 4
              }}
            >
              Invite Student
            </Button>
          </Box>

          {/* KPI Stats */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ bgcolor: 'secondary.main', color: 'white' }}>
                <CardContent sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <Box>
                      <Typography variant="caption" fontWeight={900} sx={{ letterSpacing: '0.2em', opacity: 0.7 }}>TOTAL STUDENTS</Typography>
                      <Typography variant="h3" fontWeight={900} sx={{ mt: 1, fontFamily: 'Outfit' }}>42</Typography>
                   </Box>
                   <Group sx={{ fontSize: 48, opacity: 0.2 }} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <Box>
                      <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.2em' }}>ACTIVE NOW</Typography>
                      <Typography variant="h3" fontWeight={900} sx={{ mt: 1, fontFamily: 'Outfit' }} color="secondary">38</Typography>
                   </Box>
                   <TrendingUp sx={{ fontSize: 48, color: 'success.main', opacity: 0.2 }} />
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <Box>
                      <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.2em' }}>ON LEAVE</Typography>
                      <Typography variant="h3" fontWeight={900} sx={{ mt: 1, fontFamily: 'Outfit' }} color="primary">04</Typography>
                   </Box>
                   <Mail sx={{ fontSize: 48, color: 'primary.main', opacity: 0.2 }} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Table Container */}
          <Card sx={{ overflow: 'hidden' }}>
            <Box sx={{ p: 3, bgcolor: 'action.hover', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
              <TextField 
                placeholder="Search students..." 
                size="small"
                sx={{ bgcolor: 'white', maxWidth: 400, flex: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <Button variant="outlined" color="secondary" startIcon={<FilterList />}>Filter</Button>
            </Box>
            
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
              <Table>
                <TableHead sx={{ bgcolor: 'white' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', py: 3 }}>Student</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Batch</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Progress</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {DUMMY_STUDENTS.map((student) => (
                    <TableRow key={student.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                      <TableCell sx={{ py: 3 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: 'secondary.main', fontWeight: 900, borderRadius: 2 }}>{student.name[0]}</Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={800}>{student.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{student.email}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip label={student.batch} size="small" sx={{ fontWeight: 900, borderRadius: 2 }} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700} color="secondary">{student.progress}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={student.status} 
                          size="small" 
                          sx={{ 
                            fontWeight: 900, 
                            bgcolor: `${student.color}10`, 
                            color: student.color,
                            border: `1px solid ${student.color}40`
                          }} 
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small"><MoreVert /></IconButton>
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

export default Students;
