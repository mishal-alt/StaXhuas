import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  ThemeProvider,
  createTheme
} from '@mui/material';
import {
  Send,
  Refresh,
  Cancel,
  Mail,
  PersonAdd,
  CheckCircle,
  Schedule,
  History
} from '@mui/icons-material';

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

const DUMMY_INVITES = [
  { id: 1, name: 'Suhail Ahmed', email: 'suhail@example.com', batch: 'MERN-B3', status: 'Pending', sentAt: 'May 28, 2026', color: '#ed6c02' },
  { id: 2, name: 'Fathima Z', email: 'fathima@example.com', batch: 'MERN-B3', status: 'Accepted', sentAt: 'May 25, 2026', color: '#2e7d32' },
  { id: 3, name: 'Kevin J', email: 'kevin@example.com', batch: 'FS-JAVA-02', status: 'Expired', sentAt: 'May 10, 2026', color: '#d32f2f' },
];

const Invitations = () => {
  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ py: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>

          {/* Header - Brush Stroke Style */}
          <Box sx={{ 
            position: 'relative', 
            p: 4, 
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
                Student Onboarding
              </Typography>
              <Typography variant="body1" color="inherit" sx={{ opacity: 0.9, fontWeight: 600, letterSpacing: '0.05em' }}>
                Issue new invitations and track your student setup progress.
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<Send />}
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
              New Invite
            </Button>
          </Box>

          {/* KPI Section */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderLeft: '6px solid #E8391D' }}>
                <CardContent sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.2em' }}>
                      PENDING INVITES
                    </Typography>
                    <Typography variant="h3" fontWeight={900} sx={{ mt: 1 }}>08</Typography>
                  </Box>
                  <Box sx={{ p: 2, bgcolor: 'rgba(232, 57, 29, 0.05)', color: '#E8391D', borderRadius: 4 }}>
                    <Schedule fontSize="large" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderLeft: '6px solid #2e7d32' }}>
                <CardContent sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.2em' }}>
                      ACCEPTED (MONTH)
                    </Typography>
                    <Typography variant="h3" fontWeight={900} sx={{ mt: 1 }}>24</Typography>
                  </Box>
                  <Box sx={{ p: 2, bgcolor: 'rgba(46, 125, 50, 0.05)', color: '#2e7d32', borderRadius: 4 }}>
                    <CheckCircle fontSize="large" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card sx={{ borderLeft: '6px solid #9e9e9e' }}>
                <CardContent sx={{ p: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.2em' }}>
                      EXPIRED LINKS
                    </Typography>
                    <Typography variant="h3" fontWeight={900} sx={{ mt: 1 }}>02</Typography>
                  </Box>
                  <Box sx={{ p: 2, bgcolor: 'rgba(0, 0, 0, 0.05)', color: '#9e9e9e', borderRadius: 4 }}>
                    <History fontSize="large" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Main Table Section */}
          <Card sx={{ overflow: 'hidden' }}>
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', py: 3 }}>Recipient</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Target Batch</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sent Date</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {DUMMY_INVITES.map((invite) => (
                    <TableRow key={invite.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                      <TableCell sx={{ py: 3 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box sx={{ width: 40, height: 40, bgcolor: 'primary.main', color: 'white', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                            {invite.name[0]}
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={800}>{invite.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{invite.email}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700} color="secondary">{invite.batch}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" fontWeight={900} color="text.secondary">{invite.sentAt}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={invite.status}
                          size="small"
                          sx={{
                            fontWeight: 900,
                            bgcolor: `${invite.color}20`,
                            color: invite.color,
                            border: `1px solid ${invite.color}40`
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {invite.status !== 'Accepted' && (
                          <Tooltip title="Resend Invitation">
                            <Button size="small" variant="text" color="primary" startIcon={<Refresh />}>
                              Resend
                            </Button>
                          </Tooltip>
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

export default Invitations;

