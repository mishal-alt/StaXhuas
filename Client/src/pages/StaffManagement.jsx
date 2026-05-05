import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  Collapse
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
  Send
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
  const invitations = invitesRes?.data || [];
  const staffInvitations = invitations.filter(i => i.role !== ROLES.STUDENT);

  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, pb: 12 }}>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
            <Box>
              <Typography variant="h4" color="secondary" sx={{ fontSize: '2.5rem' }}>Staff Management</Typography>
              <Typography variant="body1" color="text.secondary" fontWeight={600}>Control access and manage the Staxhaus facilitation team.</Typography>
            </Box>
            <Button 
              variant={showInviteForm ? 'outlined' : 'contained'} 
              color="secondary"
              onClick={() => setShowInviteForm(!showInviteForm)}
              startIcon={showInviteForm ? <Close /> : <Add />}
            >
              {showInviteForm ? 'Cancel' : 'Invite Staff'}
            </Button>
          </Box>

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

          <Grid container spacing={6}>
            <Grid item xs={12} lg={8}>
               <Stack spacing={4}>
                  <Typography variant="h6" color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <VerifiedUser color="success" /> Active Staff Network
                  </Typography>

                  <Grid container spacing={3}>
                    {staff.map(member => (
                      <Grid item xs={12} md={6} key={member._id}>
                        <Card sx={{ transition: 'all 0.3s', '&:hover': { transform: 'translateY(-4px)', borderColor: 'primary.main' } }}>
                          <CardContent sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Avatar sx={{ bgcolor: 'secondary.main', borderRadius: 2, fontWeight: 900 }}>{member.name[0]}</Avatar>
                              <Box>
                                <Typography variant="subtitle1" fontWeight={900}>{member.name}</Typography>
                                <Typography variant="caption" color="text.secondary" fontWeight={700}>{member.email}</Typography>
                                <Box sx={{ mt: 1 }}>
                                  <Chip 
                                    label={member.role.toUpperCase()} 
                                    size="small" 
                                    color="primary" 
                                    sx={{ fontWeight: 900, fontSize: '0.6rem', borderRadius: 2 }} 
                                  />
                                </Box>
                              </Box>
                            </Stack>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                    {staff.length === 0 && (
                      <Grid item xs={12}>
                        <Paper variant="outlined" sx={{ p: 8, textAlign: 'center', borderRadius: 8, borderStyle: 'dashed' }}>
                          <Typography color="text.secondary">No active staff members found.</Typography>
                        </Paper>
                      </Grid>
                    )}
                  </Grid>
               </Stack>
            </Grid>

            <Grid item xs={12} lg={4}>
               <Stack spacing={4}>
                  <Typography variant="h6" color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Schedule color="primary" /> Pending Onboarding
                  </Typography>

                  <Stack spacing={2}>
                    {staffInvitations.map(invite => (
                      <Card key={invite._id} sx={{ bgcolor: 'rgba(0,0,0,0.02)', border: 'none' }}>
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                            <Typography variant="subtitle2" fontWeight={900}>{invite.name}</Typography>
                            <Chip label={invite.role.toUpperCase()} size="small" sx={{ fontSize: '0.55rem', fontWeight: 900, borderRadius: 1 }} />
                          </Box>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Email sx={{ fontSize: 14, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary" fontWeight={700}>{invite.email}</Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                    {staffInvitations.length === 0 && (
                      <Paper variant="outlined" sx={{ p: 4, textAlign: 'center', borderRadius: 4, borderStyle: 'dashed' }}>
                         <Typography variant="caption" color="text.secondary" fontWeight={900}>NO PENDING INVITES</Typography>
                      </Paper>
                    )}
                  </Stack>
               </Stack>
            </Grid>
          </Grid>

        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default StaffManagement;
