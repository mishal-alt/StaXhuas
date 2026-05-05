import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from "sonner";
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
  CircularProgress,
  ThemeProvider,
  createTheme,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Collapse,
  InputAdornment
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
  AccountCircle
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
      queryClient.invalidateQueries(['invitations']);
      setShowInviteForm(false);
      reset();
    },
    onError: (err) => toast.error(err.message || 'Failed to send invitation')
  });

  const updateStaffMutation = useMutation({
    mutationFn: ({ id, data }) => userApi.updateUser(id, data),
    onSuccess: () => {
      toast.success('Staff updated successfully');
      queryClient.invalidateQueries(['staff']);
      setEditingStaff(null);
    },
    onError: (err) => toast.error(err.message || 'Failed to update staff')
  });

  const deleteStaffMutation = useMutation({
    mutationFn: userApi.deleteUser,
    onSuccess: () => {
      toast.success('Staff member removed');
      queryClient.invalidateQueries(['staff']);
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

  const filteredStaff = staff.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 12 }}>

          {/* Header - Brush Stroke Style */}
          <Box sx={{
            position: 'relative',
            p: 6,
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
              <Typography variant="h4" color="inherit" sx={{ fontSize: '3rem', textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>Staff Management</Typography>
              <Typography variant="body1" color="inherit" sx={{ opacity: 0.9, fontWeight: 600, letterSpacing: '0.05em' }}>Control access and manage the Staxhaus facilitation team.</Typography>
            </Box>
            <Button
              variant="contained"
              onClick={() => setShowInviteForm(!showInviteForm)}
              startIcon={showInviteForm ? <Close /> : <Add />}
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
              {showInviteForm ? 'Cancel' : 'Invite Staff'}
            </Button>
          </Box>

          {/* KPI Grid - Real Data Analysis */}
          <Grid container spacing={3} justifyContent="center">
            {[
              { label: 'Total Team', value: staff.length, icon: <SupervisorAccount />, color: '#1E2126' },
              { label: 'Facilitators', value: staff.filter(u => u.role === 'facilitator').length, icon: <AccountCircle />, color: '#E8391D' },
              { label: 'Interviewers', value: staff.filter(u => u.role === 'interviewer').length, icon: <Shield />, color: '#1976d2' },
              { label: 'Open Invites', value: invitesRes?.data?.length || 0, icon: <Mail />, color: '#ed6c02' },
            ].map((stat, i) => (
              <Grid item xs={12} sm={3} md={3} lg={3} key={i}>
                <Card sx={{
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' },
                  borderRadius: '24px',
                  border: '1px solid rgba(0,0,0,0.05)',
                  height: '100%'
                }}>
                  <CardContent sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ p: 2, bgcolor: `${stat.color}10`, color: stat.color, borderRadius: 4 }}>
                      {stat.icon}
                    </Box>
                    <Box>
                      <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.1em' }}>
                        {stat.label.toUpperCase()}
                      </Typography>
                      <Typography variant="h4" fontWeight={900} sx={{ fontFamily: 'Outfit' }}>{stat.value}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Collapse in={showInviteForm}>
            <Card sx={{ border: '2px solid', borderColor: 'primary.main', bgcolor: 'rgba(232, 57, 29, 0.02)' }}>
              <CardContent sx={{ p: 4 }}>
                <Box component="form" onSubmit={handleSubmit((data) => inviteMutation.mutate(data))} sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <TextField
                    label="Full Name"
                    placeholder="John Doe"
                    size="small"
                    {...register('name', { required: true })}
                    sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { bgcolor: 'white', borderRadius: 3 } }}
                  />
                  <TextField
                    label="Email Address"
                    type="email"
                    placeholder="john@example.com"
                    size="small"
                    {...register('email', { required: true })}
                    sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { bgcolor: 'white', borderRadius: 3 } }}
                  />
                  <TextField
                    select
                    label="Assign Role"
                    defaultValue={ROLES.FACILITATOR}
                    size="small"
                    {...register('role', { required: true })}
                    sx={{ width: 180, '& .MuiOutlinedInput-root': { bgcolor: 'white', borderRadius: 3 } }}
                  >
                    <MenuItem value={ROLES.FACILITATOR}>Facilitator</MenuItem>
                    <MenuItem value={ROLES.INTERVIEWER}>Interviewer</MenuItem>
                  </TextField>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<Send />}
                    disabled={inviteMutation.isPending}
                  >
                    Send Invitation
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Collapse>


          {/* Search Bar */}
          <Box sx={{ mb: 1 }}>
            <TextField
              fullWidth
              placeholder="Search staff by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          </Box>

          <Stack spacing={4}>
            <Typography variant="h6" color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <VerifiedUser color="success" /> Active Staff Network
            </Typography>

            <Stack spacing={2}>
              {filteredStaff.map(member => (
                <Card key={member._id} sx={{
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateX(8px)',
                    borderColor: 'primary.main',
                    '& .staff-actions': { opacity: 1 }
                  }
                }}>
                  <CardContent sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" spacing={3} alignItems="center" sx={{ flexGrow: 1 }}>
                      <Avatar sx={{ bgcolor: 'secondary.main', borderRadius: 2, fontWeight: 900, width: 48, height: 48 }}>{member.name[0]}</Avatar>
                      <Box>
                        <Typography variant="subtitle1" fontWeight={900}>{member.name}</Typography>
                        <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Mail sx={{ fontSize: 12 }} /> {member.email}
                        </Typography>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={6} alignItems="center">
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
                        opacity: 0,
                        transition: 'opacity 0.2s',
                        ml: 4
                      }}
                    >
                      <IconButton
                        size="small"
                        color="primary"
                        component={Link}
                        to={`/staff/profile/${member._id}`}
                      >
                        <AccountCircle sx={{ fontSize: 18 }} />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => {
                        if (confirm(`Remove ${member.name} from staff?`)) deleteStaffMutation.mutate(member._id);
                      }}>
                        <Delete sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
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
