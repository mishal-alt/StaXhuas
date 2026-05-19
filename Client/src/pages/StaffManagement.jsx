import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from "sonner";
import {
  CircularProgress,
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
  ThemeProvider,
  createTheme,
  TextField,
  MenuItem,
  IconButton,
  InputAdornment,
  Pagination,
  Dialog,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import {
  Shield,
  Mail,
  PersonAdd,
  Schedule,
  VerifiedUser,
  Email,
  SupervisorAccount,
  Add,
  Close,
  Send,
  Search,
  Edit,
  Delete,
  AccountCircle,
  NavigateNext,
  FilterList,
  Tune
} from '@mui/icons-material';

import AppShell from '../components/layout/AppShell';
import * as userApi from '../api/users.api';
import * as invitationApi from '../api/invitations.api';
import { ROLES } from '../utils/constants';

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

const StaffManagement = () => {
  const queryClient = useQueryClient();
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const { data: usersRes, isLoading: usersLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      const [f, i] = await Promise.all([
        userApi.getFacilitators(),
        userApi.getInterviewers()
      ]);
      return [...(f?.data || []), ...(i?.data || [])];
    }
  });

  const { data: invitesRes, isLoading: invitesLoading } = useQuery({
    queryKey: ['invitations', 'staff'],
    queryFn: () => invitationApi.getInvitations()
  });

  const inviteMutation = useMutation({
    mutationFn: invitationApi.inviteStudent,
    onSuccess: () => {
      toast.success('Invitation sent successfully');
      queryClient.invalidateQueries({ queryKey: ['invitations'] });
      setShowInviteForm(false);
      reset();
    },
    onError: (err) => toast.error(err.message || 'Failed to send invitation')
  });

  const updateStaffMutation = useMutation({
    mutationFn: ({ id, data }) => userApi.updateUser(id, data),
    onSuccess: () => {
      toast.success('Staff updated successfully');
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      setEditingStaff(null);
    },
    onError: (err) => toast.error(err.message || 'Failed to update staff')
  });

  const deleteStaffMutation = useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      toast.success('Staff member removed');
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    },
    onError: (err) => toast.error(err.message || 'Failed to remove staff')
  });

  const { register, handleSubmit, reset } = useForm();

  if (usersLoading || invitesLoading) {
    return (
      <AppShell>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 20 }}>
          <CircularProgress color="primary" thickness={6} />
        </Box>
      </AppShell>
    );
  }

  const staff = usersRes || [];

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || member.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const paginatedStaff = filteredStaff.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 12 }}>

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
                  STAFF
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
                  <SupervisorAccount fontSize="medium" />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight={900} color="text.primary" sx={{ letterSpacing: '-0.02em', mb: 0.2, fontSize: '1.75rem', textTransform: 'none' }}>
                    Staff Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Control access and manage the Staxhaus facilitation team
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Button
              variant="contained"
              onClick={() => setShowInviteForm(true)}
              startIcon={<Add />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(232, 57, 29, 0.2)'
              }}
            >
              Invite Staff
            </Button>
          </Box>

          {/* KPI Grid - Strictly 4-column layout */}
          <Box sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
            gap: { xs: 1.5, md: 2 },
            mb: 2
          }}>
            {[
              { label: 'Total Team', value: staff.length, icon: <SupervisorAccount />, color: '#1E2126' },
              { label: 'Facilitators', value: staff.filter(u => u.role === 'facilitator').length, icon: <AccountCircle />, color: '#E8391D' },
              { label: 'Interviewers', value: staff.filter(u => u.role === 'interviewer').length, icon: <Shield />, color: '#1976d2' },
              { label: 'Open Invites', value: invitesRes?.data?.length || 0, icon: <Mail />, color: '#ed6c02' },
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
                      {stat.value}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Invite Staff Dialog */}
          <Dialog
            open={showInviteForm}
            onClose={() => { setShowInviteForm(false); reset(); }}
            maxWidth="sm"
            fullWidth
            PaperProps={{ sx: { borderRadius: 4 } }}
          >
            <Box sx={{ p: 4 }}>
              <Typography variant="h6" fontWeight={900} sx={{ textTransform: 'uppercase', mb: 4 }}>
                Invite New Staff
              </Typography>
              <Box
                component="form"
                onSubmit={handleSubmit((data) => inviteMutation.mutate(data))}
                sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
              >
                <TextField
                  fullWidth
                  label="Full Name"
                  placeholder="e.g. John Doe"
                  {...register('name', { required: true })}
                />
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  placeholder="e.g. john@staxhaus.com"
                  {...register('email', { required: true })}
                />
                <TextField
                  select
                  fullWidth
                  label="Assign Role"
                  defaultValue={ROLES.FACILITATOR}
                  {...register('role', { required: true })}
                >
                  <MenuItem value={ROLES.FACILITATOR}>Facilitator</MenuItem>
                  <MenuItem value={ROLES.INTERVIEWER}>Interviewer</MenuItem>
                </TextField>

                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                  <Button
                    onClick={() => { setShowInviteForm(false); reset(); }}
                    color="secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disableElevation
                    disabled={inviteMutation.isPending}
                    startIcon={<Send />}
                  >
                    {inviteMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Send Invitation'}
                  </Button>
                </Stack>
              </Box>
            </Box>
          </Dialog>


          {/* Search & Filter Bar */}
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 1
          }}>
            <TextField
              fullWidth
              placeholder="Search staff by name or email..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.secondary', ml: 1 }} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 4,
                  bgcolor: 'background.paper',
                  '& fieldset': { border: 'none' },
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                  py: 1
                }
              }}
            />
            <TextField
              select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              sx={{
                minWidth: { xs: '100%', sm: 240 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  bgcolor: 'white',
                  '& fieldset': { border: '1px solid rgba(0,0,0,0.05)' },
                  boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
                    transform: 'translateY(-2px)'
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterList sx={{ color: 'primary.main', ml: 1, mr: 0.5 }} />
                  </InputAdornment>
                ),
              }}
              SelectProps={{
                sx: {
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  fontSize: '0.75rem',
                  py: 1.5
                },
                MenuProps: {
                  PaperProps: {
                    sx: {
                      borderRadius: '16px',
                      mt: 1,
                      boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
                      border: '1px solid rgba(0,0,0,0.05)',
                      '& .MuiMenuItem-root': {
                        py: 1.5,
                        px: 2,
                        mx: 1,
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        '&:hover': { bgcolor: 'rgba(232, 57, 29, 0.05)', color: 'primary.main' },
                        '&.Mui-selected': { bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }
                      }
                    }
                  }
                }
              }}
            >
              <MenuItem value="all">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Tune sx={{ fontSize: 16 }} />
                  <span>All Staff Members</span>
                </Stack>
              </MenuItem>
              <MenuItem value={ROLES.FACILITATOR}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccountCircle sx={{ fontSize: 16 }} />
                  <span>Facilitators</span>
                </Stack>
              </MenuItem>
              <MenuItem value={ROLES.INTERVIEWER}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Shield sx={{ fontSize: 16 }} />
                  <span>Interviewers</span>
                </Stack>
              </MenuItem>
            </TextField>
          </Box>

          <Stack spacing={4}>
            <Typography variant="h6" color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <VerifiedUser color="success" /> Active Staff Network
            </Typography>

            <Stack spacing={2}>
              {paginatedStaff.map(member => (
                <Card key={member._id} sx={{
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateX(8px)',
                    borderColor: 'primary.main',
                    '& .staff-actions': { opacity: 1 }
                  }
                }}>
                  <CardContent sx={{
                    p: 2.5,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: { xs: 2, sm: 0 }
                  }}>
                    <Stack direction="row" spacing={3} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' } }}>
                      <Avatar sx={{ bgcolor: 'secondary.main', borderRadius: 2, fontWeight: 900, width: 48, height: 48 }}>{member.name[0]}</Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={900}>{member.name}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Mail sx={{ fontSize: 12 }} /> {member.email}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={{ xs: 2, sm: 6 }} alignItems="center" sx={{ width: { xs: '100%', sm: 'auto' }, justifyContent: { xs: 'space-between', sm: 'center' } }}>
                      <Box sx={{ minWidth: 120, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ display: 'block', mb: 0.5, letterSpacing: '0.05em' }}>
                          ROLE
                        </Typography>
                        <Chip
                          label={member.role.toUpperCase()}
                          size="small"
                          color="primary"
                          sx={{ fontWeight: 900, fontSize: '0.65rem', borderRadius: 1.5, height: 24 }}
                        />
                      </Box>

                      <Box sx={{ minWidth: 120, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ display: 'block', mb: 0.5, letterSpacing: '0.05em' }}>
                          STATUS
                        </Typography>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          px: 1.5,
                          py: 0.5,
                          borderRadius: 2,
                          bgcolor: 'rgba(46, 125, 50, 0.08)',
                          width: 'fit-content'
                        }}>
                          <Box sx={{ width: 6, height: 6, bgcolor: 'success.main', borderRadius: '50%' }} />
                          <Typography variant="caption" fontWeight={900} color="success.main" sx={{ letterSpacing: '0.05em' }}>ACTIVE</Typography>
                        </Box>
                      </Box>
                    </Stack>
                    <Stack
                      direction="row"
                      spacing={1}
                      className="staff-actions"
                      sx={{
                        opacity: { xs: 1, sm: 0 },
                        transition: 'opacity 0.2s',
                        ml: { xs: 0, sm: 4 },
                        mt: { xs: 2, sm: 0 },
                        justifyContent: { xs: 'flex-end', sm: 'center' },
                        width: { xs: '100%', sm: 'auto' }
                      }}
                    >
                      <IconButton
                        size="small"
                        color="primary"
                        component={Link}
                        to={`/staff/profile/${member._id}`}
                        sx={{ bgcolor: { xs: 'primary.light', sm: 'transparent' }, color: { xs: 'primary.contrastText', sm: 'primary.main' } }}
                      >
                        <AccountCircle sx={{ fontSize: 18 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => {
                          if (confirm(`Remove ${member.name} from staff?`)) deleteStaffMutation.mutate(member._id);
                        }}
                        sx={{ bgcolor: { xs: 'error.light', sm: 'transparent' }, color: { xs: 'error.contrastText', sm: 'error.main' } }}
                      >
                        <Delete sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </Card>
              ))}

              {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
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
              {staff.length === 0 && (
                <Paper variant="outlined" sx={{ p: 8, textAlign: 'center', borderRadius: 8, borderStyle: 'dashed' }}>
                  <Typography color="text.secondary">No active staff members found.</Typography>
                </Paper>
              )}
            </Stack>
          </Stack>

        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default StaffManagement;
