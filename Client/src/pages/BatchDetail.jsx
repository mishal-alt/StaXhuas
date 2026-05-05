import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  IconButton,
  Tooltip,
  ThemeProvider,
  createTheme,
  CircularProgress
} from '@mui/material';
import {
  Mail,
  PersonOff,
  PersonAdd,
  School,
  MoreVert,
  Search,
  ArrowBack,
  Send
} from '@mui/icons-material';
import { toast } from "sonner";

import AppShell from '../components/layout/AppShell';
import * as batchApi from '../api/batches.api';
import * as studentApi from '../api/students.api';
import * as invitationApi from '../api/invitations.api';
import { STUDENT_STATUS } from '../utils/constants';

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

const BatchDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [inviteEmail, setInviteEmail] = useState('');

  const { data: batchRes, isLoading: batchLoading } = useQuery({
    queryKey: ['batch', id],
    queryFn: () => batchApi.getBatch(id),
  });

  const { data: studentsRes, isLoading: studentsLoading } = useQuery({
    queryKey: ['students', id],
    queryFn: () => studentApi.getStudentsByBatch(id),
  });

  const inviteMutation = useMutation({
    mutationFn: (email) => invitationApi.inviteStudent({ email, role: 'student', batch: id }),
    onSuccess: () => {
      toast.success('Invitation sent successfully');
      setInviteEmail('');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to send invite');
    }
  });

  const statusMutation = useMutation({
    mutationFn: ({ studentId, data }) => studentApi.changeStudentStatus(studentId, data),
    onSuccess: () => {
      toast.success('Status updated');
      queryClient.invalidateQueries(['students', id]);
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update status');
    }
  });

  if (batchLoading || studentsLoading) {
    return (
      <AppShell>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <CircularProgress color="primary" thickness={6} />
        </Box>
      </AppShell>
    );
  }

  const batch = batchRes?.data;
  const students = studentsRes?.data || [];

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    inviteMutation.mutate(inviteEmail);
  };

  const handleStatusChange = (studentId, currentStatus) => {
    const newStatus = currentStatus === STUDENT_STATUS.ACTIVE ? STUDENT_STATUS.DISCONTINUED : STUDENT_STATUS.ACTIVE;
    const remark = prompt(`Enter mandatory remark for changing status to ${newStatus}:`);
    if (remark && remark.length >= 5) {
      statusMutation.mutate({ studentId, data: { status: newStatus, remark } });
    } else if (remark) {
      toast.error('Remark must be at least 5 characters');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case STUDENT_STATUS.ACTIVE: return 'success';
      case STUDENT_STATUS.DISCONTINUED: return 'warning';
      case STUDENT_STATUS.TERMINATED: return 'error';
      default: return 'default';
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, pb: 8 }}>

          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 4 }}>
            <Box>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="h4" color="secondary" sx={{ fontSize: '2.5rem' }}>{batch?.name}</Typography>
                <Chip label="MANAGED BATCH" size="small" color="primary" sx={{ fontWeight: 900, borderRadius: 2 }} />
              </Stack>
              <Typography variant="body1" color="text.secondary" fontWeight={600}>
                Facilitator: <b>{batch?.facilitator?.name}</b> • Active Cohort Overview
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleInvite} sx={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
              <TextField
                size="small"
                placeholder="student@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                InputProps={{ sx: { borderRadius: 4, bgcolor: 'white', width: 280 } }}
              />
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                startIcon={inviteMutation.isPending ? <CircularProgress size={16} color="inherit" /> : <Send />}
                disabled={inviteMutation.isPending}
              >
                Invite
              </Button>
            </Box>
          </Box>

          <Divider sx={{ opacity: 0.1 }} />

          {/* Roster Table */}
          <Card sx={{ overflow: 'hidden' }}>
            <Box sx={{ p: 3, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight={900} color="secondary">Student Roster</Typography>
            </Box>
            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', py: 3 }}>Student Identity</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Academic Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Lifecycle Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student._id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                      <TableCell sx={{ py: 3 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: 'secondary.main', borderRadius: 2 }}>{student.name[0]}</Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={800}>{student.name}</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={700}>{student.email}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={student.status}
                          color={getStatusColor(student.status)}
                          size="small"
                          sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem' }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <Tooltip title={student.status === STUDENT_STATUS.ACTIVE ? 'Deactivate Account' : 'Reactivate Account'}>
                            <Button
                              variant="outlined"
                              color={student.status === STUDENT_STATUS.ACTIVE ? 'error' : 'success'}
                              size="small"
                              onClick={() => handleStatusChange(student._id, student.status)}
                              startIcon={student.status === STUDENT_STATUS.ACTIVE ? <PersonOff /> : <PersonAdd />}
                              sx={{ borderRadius: 3 }}
                            >
                              {student.status === STUDENT_STATUS.ACTIVE ? 'Disable' : 'Enable'}
                            </Button>
                          </Tooltip>
                          <IconButton size="small"><MoreVert /></IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                  {students.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} sx={{ py: 8, textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary">No students enrolled in this batch yet.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default BatchDetail;
