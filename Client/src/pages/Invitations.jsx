import React, { useState } from 'react';
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
  Pagination,
  ThemeProvider,
  createTheme,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import {
  Send,
  Refresh,
  Cancel,
  Mail,
  PersonAdd,
  CheckCircle,
  Schedule,
  History,
  NavigateNext
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
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;

  const paginatedInvites = DUMMY_INVITES.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(DUMMY_INVITES.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };
  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ py: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>

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
                <MuiLink underline="none" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 700, '&:hover': { color: 'primary.main' } }}>
                  DASHBOARD
                </MuiLink>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.primary' }}>
                  INVITATIONS
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
                  <Mail fontSize="medium" />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={900} color="text.primary" sx={{ letterSpacing: '-0.02em', mb: 0.2, fontSize: '1.75rem', textTransform: 'none' }}>
                    Student Onboarding
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Issue new invitations and track your student setup progress
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Button 
              variant="contained" 
              startIcon={<Send />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(232, 57, 29, 0.2)'
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
                  {paginatedInvites.map((invite) => (
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
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4, bgcolor: 'background.paper', borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  shape="rounded"
                  size="large"
                  sx={{
                    '& .MuiPaginationItem-root': {
                      fontWeight: 900,
                      borderRadius: 2,
                      '&.Mui-selected': {
                        boxShadow: '0 4px 12px rgba(232, 57, 29, 0.3)',
                      }
                    }
                  }}
                />
              </Box>
            )}
          </Card>
        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default Invitations;

