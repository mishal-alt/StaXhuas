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
  Link as MuiLink,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import * as invitationApi from '../api/invitations.api';
import * as batchApi from '../api/batches.api';
import { Link } from 'react-router-dom';
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
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const itemsPerPage = 8;
  const [open, setOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', batch: '' });

  const { data: invitationsRes, isLoading: invitationsLoading } = useQuery({
    queryKey: ['invitations'],
    queryFn: () => invitationApi.getInvitations(),
  });

  const { data: batchesRes } = useQuery({
    queryKey: ['batches'],
    queryFn: batchApi.getBatches,
  });

  const inviteMutation = useMutation({
    mutationFn: (data) => invitationApi.inviteStudent(data),
    onSuccess: () => {
      toast.success('Invitation sent successfully');
      setOpen(false);
      setInviteForm({ name: '', email: '', batch: '' });
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to send invitation');
    }
  });

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inviteForm.email || !inviteForm.batch) {
      toast.error('Please fill in all required fields');
      return;
    }
    inviteMutation.mutate({
      email: inviteForm.email,
      name: inviteForm.name,
      batch: inviteForm.batch,
      role: 'student'
    });
  };

  const batches = batchesRes?.data || [];
  const invitations = invitationsRes?.data || [];
  const paginatedInvites = invitations.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(invitations.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ed6c02';
      case 'accepted': return '#2e7d32';
      case 'expired': return '#d32f2f';
      default: return '#666';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ pb: 3, display: 'flex', flexDirection: 'column', gap: 4 }}>

          {/* Header */}
          <Box sx={{
            pt: 3,
            pb: 2,
            px: 6,
            mx: -6,
            mt: -4.5,
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
                ONBOARDING
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
              onClick={handleOpen}
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

          {/* New Invite Dialog */}
          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3, boxShadow: '0 20px 60px rgba(0,0,0,0.1)' } }}>
            <DialogTitle sx={{ 
              fontWeight: 900, 
              textTransform: 'uppercase', 
              pt: 4, 
              px: 4,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 1, borderRadius: 1.5, display: 'flex' }}>
                <PersonAdd fontSize="small" />
              </Box>
              Send New Invitation
            </DialogTitle>
            <form onSubmit={handleSubmit}>
              <DialogContent sx={{ px: 4, pb: 4 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontWeight: 500 }}>
                  Enter student details below to send a secure invitation link to their email.
                </Typography>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Recipient Full Name"
                    placeholder="e.g. John Doe"
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                    variant="outlined"
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                  <TextField
                    fullWidth
                    required
                    label="Email Address"
                    type="email"
                    placeholder="student@staxhaus.com"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    variant="outlined"
                    InputProps={{ sx: { borderRadius: 2 } }}
                  />
                  <TextField
                    select
                    fullWidth
                    required
                    label="Assign to Batch"
                    value={inviteForm.batch}
                    onChange={(e) => setInviteForm({ ...inviteForm, batch: e.target.value })}
                    variant="outlined"
                    InputProps={{ sx: { borderRadius: 2 } }}
                  >
                    {batches.map((batch) => (
                      <MenuItem key={batch._id} value={batch._id}>
                        {batch.name}
                      </MenuItem>
                    ))}
                    {batches.length === 0 && (
                      <MenuItem disabled>No active batches found</MenuItem>
                    )}
                  </TextField>
                </Stack>
              </DialogContent>
              <DialogActions sx={{ p: 3, px: 4, borderTop: '1px solid #E5E7EB', bgcolor: '#F9FAFB' }}>
                <Button onClick={handleClose} color="inherit" sx={{ fontWeight: 700 }}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={inviteMutation.isPending}
                  startIcon={inviteMutation.isPending ? <CircularProgress size={20} color="inherit" /> : <Send />}
                  sx={{ px: 4 }}
                >
                  {inviteMutation.isPending ? 'Processing...' : 'Send Invite'}
                </Button>
              </DialogActions>
            </form>
          </Dialog>

          {/* KPI Grid */}
          <Box sx={{ 
            width: '100%',
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
            gap: { xs: 1.5, md: 2 },
            mb: 2
          }}>
            {[
              { label: 'Total Sent', value: invitations.length, icon: <Mail />, color: '#1E2126' },
              { label: 'Pending Invites', value: invitations.filter(i => i.status === 'pending').length, icon: <Schedule />, color: '#E8391D' },
              { label: 'Accepted', value: invitations.filter(i => i.status === 'accepted').length, icon: <CheckCircle />, color: '#2e7d32' },
              { label: 'Expired', value: invitations.filter(i => i.status === 'expired').length, icon: <History />, color: '#9e9e9e' },
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
                overflow: 'hidden'
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
                      {stat.value.toString().padStart(2, '0')}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

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
                  {invitationsLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                        <CircularProgress size={40} />
                        <Typography variant="body2" sx={{ mt: 2, fontWeight: 700, color: 'text.secondary' }}>Loading invitations...</Typography>
                      </TableCell>
                    </TableRow>
                  ) : paginatedInvites.map((invite) => (
                    <TableRow key={invite._id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                      <TableCell sx={{ py: 3 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Box sx={{ width: 40, height: 40, bgcolor: 'secondary.main', color: 'white', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                            {invite.name ? invite.name[0] : invite.email[0].toUpperCase()}
                          </Box>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={800}>{invite.name || 'Student'}</Typography>
                            <Typography variant="caption" color="text.secondary">{invite.email}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700} color="secondary">{invite.batch?.name || 'N/A'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" fontWeight={900} color="text.secondary">
                          {new Date(invite.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={invite.status.toUpperCase()}
                          size="small"
                          sx={{
                            fontWeight: 900,
                            fontSize: '0.65rem',
                            bgcolor: `${getStatusColor(invite.status)}20`,
                            color: getStatusColor(invite.status),
                            border: `1px solid ${getStatusColor(invite.status)}40`,
                            borderRadius: 1.5
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        {invite.status !== 'accepted' && (
                          <Tooltip title="Resend Invitation">
                            <Button size="small" variant="text" color="primary" startIcon={<Refresh />} sx={{ fontWeight: 800 }}>
                              Resend
                            </Button>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {!invitationsLoading && invitations.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                        <Typography variant="body1" sx={{ fontWeight: 800, color: 'text.secondary' }}>No invitations found.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
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

