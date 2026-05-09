import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CircularProgress,
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
  Breadcrumbs,
  Link as MuiLink,
  Tabs,
  Tab,
  Badge,
  Alert,
  AlertTitle
} from '@mui/material';
import {
  Mail,
  PersonOff,
  PersonAdd,
  School,
  MoreVert,
  Search,
  ArrowBack,
  Send,
  NavigateNext,
  Add,
  CloudUpload,
  Group,
  TrendingUp,
  Layers,
  EventAvailable,
  CalendarToday,
  AccessTime,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  RadioButtonUnchecked,
  Save,
  Warning,
  HourglassEmpty
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
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 900,
          borderRadius: 8,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          padding: '10px 20px',
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
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
  const [currentTime, setCurrentTime] = useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  const { data: batchRes, isLoading: batchLoading } = useQuery({
    queryKey: ['batch', id],
    queryFn: () => batchApi.getBatch(id),
  });

  const { data: studentsRes, isLoading: studentsLoading } = useQuery({
    queryKey: ['students', id],
    queryFn: () => studentApi.getStudentsByBatch(id),
  });

  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Attendance state
  const [attendanceDate, setAttendanceDate] = useState(new Date());
  const [scrumCompleted, setScrumCompleted] = useState(false);
  const [attendanceMap, setAttendanceMap] = useState({});
  const [remarksMap, setRemarksMap] = useState({});

  const formatDateKey = (date) => date.toISOString().split('T')[0];
  const formatDisplayDate = (date) => date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

  const goToPrevDay = () => {
    const d = new Date(attendanceDate);
    d.setDate(d.getDate() - 1);
    setAttendanceDate(d);
  };
  const goToNextDay = () => {
    const d = new Date(attendanceDate);
    d.setDate(d.getDate() + 1);
    setAttendanceDate(d);
  };
  const goToToday = () => setAttendanceDate(new Date());

  const markAll = (status) => {
    const next = {};
    (studentsRes?.data || []).forEach(s => { next[s._id] = status; });
    setAttendanceMap(prev => ({ ...prev, ...next }));
  };

  const markStudent = (studentId, status) => {
    setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
  };

  const getAttendanceStatusColor = (status) => {
    switch (status) {
      case 'P': return { bg: 'rgba(46,125,50,0.08)', border: 'rgba(46,125,50,0.3)', text: '#2e7d32', label: 'Present' };
      case 'A': return { bg: 'rgba(211,47,47,0.08)', border: 'rgba(211,47,47,0.3)', text: '#d32f2f', label: 'Absent' };
      case 'L': return { bg: 'rgba(123,31,162,0.08)', border: 'rgba(123,31,162,0.3)', text: '#7b1fa2', label: 'Leave' };
      case 'H': return { bg: 'rgba(230,81,0,0.08)', border: 'rgba(230,81,0,0.3)', text: '#e65100', label: 'Half Day' };
      default: return { bg: 'transparent', border: 'transparent', text: 'text.secondary', label: '—' };
    }
  };

  const handleSaveAttendance = () => {
    toast.success(`Attendance saved for ${formatDisplayDate(attendanceDate)}`);
  };

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

  // Derived attendance stats (must be after students is defined)
  const attendanceCounts = students.reduce((acc, s) => {
    const status = attendanceMap[s._id];
    if (status === 'P') acc.present++;
    else if (status === 'A') acc.absent++;
    else if (status === 'L') acc.leave++;
    else if (status === 'H') acc.half++;
    else acc.unmarked++;
    return acc;
  }, { present: 0, absent: 0, leave: 0, half: 0, unmarked: 0 });

  const belowThreshold = students.filter(s => attendanceMap[s._id] === 'A');

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
              <MuiLink
                component={Link}
                to="/courses"
                underline="none"
                color="text.secondary"
                sx={{ fontSize: '0.75rem', fontWeight: 700, '&:hover': { color: 'primary.main' } }}
              >
                BATCHES
              </MuiLink>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.primary' }}>
                DETAIL
              </Typography>
            </Breadcrumbs>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box sx={{
                  bgcolor: 'primary.main',
                  color: 'white',
                  p: 1,
                  borderRadius: 2,
                  display: 'flex',
                  boxShadow: '0 4px 12px rgba(232, 57, 29, 0.2)'
                }}>
                  <School fontSize="medium" />
                </Box>
                <Box>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h4" fontWeight={900} color="text.primary" sx={{ letterSpacing: '-0.02em', mb: 0.2, fontSize: '1.75rem', textTransform: 'none' }}>
                      {batch?.name}
                    </Typography>
                    <Chip label="MANAGED BATCH" size="small" sx={{ bgcolor: 'rgba(232, 57, 29, 0.1)', color: 'primary.main', fontWeight: 900, borderRadius: 2, fontSize: '0.6rem' }} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary" fontWeight={500}>
                    Facilitator: <b>{batch?.facilitator?.name}</b>
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                px: 2.5, 
                py: 1, 
                borderRadius: '12px', 
                border: '1px solid rgba(0,0,0,0.08)',
                bgcolor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <CalendarToday sx={{ fontSize: 18, color: 'primary.main' }} />
                  <Typography variant="subtitle2" fontWeight={900} color="secondary" sx={{ letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
                    {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()}
                  </Typography>
                </Stack>
                <Divider orientation="vertical" flexItem sx={{ height: 20, my: 'auto', borderColor: 'rgba(0,0,0,0.1)' }} />
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccessTime sx={{ fontSize: 18, color: 'text.disabled' }} />
                  <Typography variant="subtitle2" fontWeight={800} color="text.primary" sx={{ letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
                    {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </Typography>
                </Stack>
              </Box>
            </Box>
          </Box>

          {/* KPI Grid - Daily Batch Analysis */}
          <Box sx={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
            gap: 2,
            mb: 3
          }}>
            {(activeTab === 0 ? [
              { label: "Today's Attendance", value: '92%', icon: <EventAvailable />, color: '#2e7d32' },
              { label: 'Present Students', value: `${students.length > 0 ? students.length - 1 : 0}/${students.length}`, icon: <Group />, color: '#1E2126' },
              { label: 'Late Arrivals', value: '01', icon: <TrendingUp />, color: '#E8391D' },
              { label: 'Pending Leaves', value: '02', icon: <Layers />, color: '#9c27b0' },
            ] : [
              { label: 'Present', value: attendanceCounts.present, icon: <CheckCircle />, color: '#2e7d32' },
              { label: 'Absent', value: attendanceCounts.absent, icon: <RadioButtonUnchecked />, color: '#d32f2f' },
              { label: 'On Leave', value: attendanceCounts.leave, icon: <HourglassEmpty />, color: '#7b1fa2' },
              { label: 'Half Day', value: attendanceCounts.half, icon: <EventAvailable />, color: '#e65100' },
            ]).map((stat, i) => (
              <Card key={i} sx={{
                transition: 'all 0.2s ease-in-out',
                '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' },
                borderRadius: '12px',
                border: '1px solid rgba(0,0,0,0.08)',
                height: 90,
                display: 'flex',
                alignItems: 'center',
                bgcolor: 'white'
              }}>
                <CardContent sx={{
                  p: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  width: '100%',
                  '&:last-child': { pb: 2 }
                }}>
                  <Box sx={{
                    p: 1.2,
                    bgcolor: `${stat.color}10`,
                    color: stat.color,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {React.cloneElement(stat.icon, { sx: { fontSize: 20 } })}
                  </Box>
                  <Box>
                    <Typography
                      variant="caption"
                      fontWeight={900}
                      color="text.secondary"
                      sx={{ letterSpacing: '0.05em', display: 'block', fontSize: '0.65rem', lineHeight: 1 }}
                    >
                      {stat.label.toUpperCase()}
                    </Typography>
                    <Typography
                      variant="h5"
                      fontWeight={900}
                      sx={{ color: 'secondary.main', mt: 0.5, lineHeight: 1 }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Tab Actions */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
            <TextField
              placeholder="Search students..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: 'text.disabled', fontSize: 20 }} />
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: 2, 
                  bgcolor: 'white', 
                  width: 320,
                  '& fieldset': { borderColor: 'rgba(0,0,0,0.1)' }
                }
              }}
            />
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<CloudUpload />}
                sx={{ 
                  borderRadius: 2, 
                  borderWidth: 2, 
                  '&:hover': { borderWidth: 2 },
                  textTransform: 'uppercase',
                  fontWeight: 900
                }}
              >
                Bulk Invite
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Add />}
                sx={{ 
                  borderRadius: 2, 
                  px: 3,
                  boxShadow: '0 4px 14px rgba(232, 57, 29, 0.4)',
                  textTransform: 'uppercase',
                  fontWeight: 900
                }}
              >
                Invite Student
              </Button>
            </Stack>
          </Box>

          {/* Batch Management Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, v) => setActiveTab(v)} 
              textColor="primary"
              indicatorColor="primary"
              sx={{
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: '3px 3px 0 0'
                },
                '& .MuiTab-root': {
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  letterSpacing: '0.02em',
                  px: 4,
                  minHeight: 48,
                  color: 'text.secondary',
                  '&.Mui-selected': {
                    color: 'primary.main',
                  }
                }
              }}
            >
              <Tab label="STUDENTS" />
              <Tab label="ATTENDANCE" />
              <Tab label="LEAVES" />
              <Tab label="SCRUM" />
              <Tab label="INTERVIEWS" />
              <Tab label="ANALYTICS" />
            </Tabs>
          </Box>

          {/* Students Table */}
          <Card sx={{ borderRadius: 2, overflow: 'hidden', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
            <TableContainer>
              <Table sx={{ minWidth: 800 }}>
                <TableHead sx={{ bgcolor: 'rgba(247, 247, 245, 0.5)' }}>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem', py: 2 }}>Student</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem' }}>Attendance</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem' }}>Leaves</TableCell>
                    <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem' }}>Curr. Module</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeTab === 0 && students.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase())).map((student) => (
                    <TableRow key={student._id} sx={{ '&:hover': { bgcolor: 'rgba(247, 247, 245, 0.8)' } }}>
                      <TableCell sx={{ py: 3 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar 
                            sx={{ 
                              bgcolor: 'secondary.main', 
                              borderRadius: 2,
                              fontWeight: 900,
                              width: 40,
                              height: 40
                            }}
                          >
                            {student.name[0]}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2" fontWeight={800} sx={{ color: 'secondary.main', lineHeight: 1.2 }}>{student.name}</Typography>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>{student.email}</Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={student.status.toLowerCase()}
                          size="small"
                          sx={{ 
                            fontWeight: 900, 
                            textTransform: 'lowercase', 
                            fontSize: '0.65rem',
                            bgcolor: student.status === STUDENT_STATUS.ACTIVE ? '#228B22' : 'rgba(0,0,0,0.06)',
                            color: student.status === STUDENT_STATUS.ACTIVE ? 'white' : 'text.secondary',
                            borderRadius: 1.5,
                            px: 0.5,
                            height: 20
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700} color="text.primary">94%</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={700} color="text.primary">3/10</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600} color="text.secondary">React Foundations</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" sx={{ color: 'text.disabled' }}>
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                  {students.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} sx={{ py: 12, textAlign: 'center' }}>
                        <Typography variant="body1" color="text.secondary" fontWeight={600}>No students found in this batch.</Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          {/* ============== ATTENDANCE TAB PANEL ============== */}
          {activeTab === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

              {/* Top Bar: Date Nav + Scrum Status */}
              <Card sx={{ borderRadius: 2, border: '1px solid rgba(0,0,0,0.06)', bgcolor: 'white' }}>
                <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>

                    {/* Date Navigator */}
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <IconButton onClick={goToPrevDay} size="small" sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
                        <ChevronLeft />
                      </IconButton>
                      <Box sx={{
                        display: 'flex', alignItems: 'center', gap: 1,
                        px: 2.5, py: 1, borderRadius: '10px',
                        border: '1px solid rgba(0,0,0,0.1)', bgcolor: 'rgba(0,0,0,0.01)'
                      }}>
                        <CalendarToday sx={{ fontSize: 16, color: 'primary.main' }} />
                        <Typography variant="subtitle2" fontWeight={900} color="secondary">
                          {formatDisplayDate(attendanceDate).toUpperCase()}
                        </Typography>
                      </Box>
                      <IconButton onClick={goToNextDay} size="small" sx={{ border: '1px solid rgba(0,0,0,0.1)', borderRadius: 2 }}>
                        <ChevronRight />
                      </IconButton>
                      <Button
                        size="small"
                        variant="outlined"
                        color="primary"
                        onClick={goToToday}
                        sx={{ borderRadius: 2, fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem', px: 2 }}
                      >
                        Today
                      </Button>
                    </Stack>

                    {/* Scrum Status Toggle */}
                    <Box
                      onClick={() => setScrumCompleted(prev => !prev)}
                      sx={{
                        display: 'flex', alignItems: 'center', gap: 1.5,
                        px: 2.5, py: 1, borderRadius: '10px',
                        border: `1.5px solid ${scrumCompleted ? 'rgba(46,125,50,0.4)' : 'rgba(0,0,0,0.12)'}`,
                        bgcolor: scrumCompleted ? 'rgba(46,125,50,0.06)' : 'rgba(0,0,0,0.02)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': { borderColor: 'primary.main' }
                      }}
                    >
                      {scrumCompleted
                        ? <CheckCircle sx={{ fontSize: 18, color: '#2e7d32' }} />
                        : <RadioButtonUnchecked sx={{ fontSize: 18, color: 'text.disabled' }} />}
                      <Box>
                        <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.08em' }}>SCRUM STATUS</Typography>
                        <Typography variant="subtitle2" fontWeight={900} color={scrumCompleted ? '#2e7d32' : 'text.secondary'} sx={{ lineHeight: 1 }}>
                          {scrumCompleted ? 'Completed' : 'Not Completed'}
                        </Typography>
                      </Box>
                    </Box>

                  </Box>
                </CardContent>
              </Card>

              {/* Warning Banner */}
              {belowThreshold.length > 0 && (
                <Alert
                  severity="warning"
                  icon={<Warning />}
                  sx={{ borderRadius: 2, border: '1px solid rgba(237,108,2,0.3)' }}
                >
                  <AlertTitle sx={{ fontWeight: 900, fontSize: '0.85rem' }}>ATTENDANCE WARNING</AlertTitle>
                  <strong>{belowThreshold.length} student{belowThreshold.length > 1 ? 's' : ''}</strong> marked absent today — review before saving.
                </Alert>
              )}

              {/* Bulk Actions */}
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.1em', mr: 1 }}>BULK MARK:</Typography>
                {[{ code: 'P', label: 'Mark All Present', color: '#2e7d32' },
                  { code: 'A', label: 'Mark All Absent', color: '#d32f2f' },
                  { code: 'L', label: 'Mark All Leave', color: '#7b1fa2' },
                  { code: 'H', label: 'Mark All Half Day', color: '#e65100' },
                ].map(({ code, label, color }) => (
                  <Button
                    key={code}
                    size="small"
                    onClick={() => markAll(code)}
                    sx={{
                      fontWeight: 900, fontSize: '0.7rem', px: 2,
                      borderRadius: 2, textTransform: 'uppercase',
                      bgcolor: `${color}12`, color,
                      border: `1px solid ${color}40`,
                      '&:hover': { bgcolor: `${color}20` }
                    }}
                  >
                    {label}
                  </Button>
                ))}
                <Box sx={{ ml: 'auto' }}>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => setAttendanceMap({})}
                    sx={{ borderRadius: 2, fontWeight: 900, fontSize: '0.7rem', textTransform: 'uppercase' }}
                  >
                    Clear All
                  </Button>
                </Box>
              </Box>

              {/* Attendance Table */}
              <Card sx={{ borderRadius: 2, overflow: 'hidden', border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                <TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead sx={{ bgcolor: 'rgba(247,247,245,0.8)' }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem', py: 2 }}>Student</TableCell>
                        <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem' }}>Quick Mark</TableCell>
                        <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', fontSize: '0.7rem' }}>Remarks</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {students.map((student) => {
                        const status = attendanceMap[student._id];
                        const style = getAttendanceStatusColor(status);
                        return (
                          <TableRow
                            key={student._id}
                            sx={{
                              bgcolor: style.bg,
                              borderLeft: `3px solid ${status ? style.border : 'transparent'}`,
                              transition: 'all 0.15s ease',
                              '&:hover': { filter: 'brightness(0.97)' }
                            }}
                          >
                            {/* Student */}
                            <TableCell sx={{ py: 2 }}>
                              <Stack direction="row" spacing={1.5} alignItems="center">
                                <Avatar sx={{ bgcolor: 'secondary.main', borderRadius: 2, width: 36, height: 36, fontSize: '0.9rem', fontWeight: 900 }}>
                                  {student.name[0]}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle2" fontWeight={800} color="secondary" sx={{ lineHeight: 1.2 }}>{student.name}</Typography>
                                  <Typography variant="caption" color="text.secondary">{student.email}</Typography>
                                </Box>
                              </Stack>
                            </TableCell>

                            {/* One-click Buttons */}
                            <TableCell>
                              <Stack direction="row" spacing={0.8}>
                                {[{ code: 'P', color: '#2e7d32' }, { code: 'A', color: '#d32f2f' }, { code: 'L', color: '#7b1fa2' }, { code: 'H', color: '#e65100' }].map(({ code, color }) => (
                                  <Box
                                    key={code}
                                    onClick={() => markStudent(student._id, status === code ? undefined : code)}
                                    sx={{
                                      width: 32, height: 32,
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      borderRadius: '8px',
                                      cursor: 'pointer',
                                      fontWeight: 900, fontSize: '0.75rem',
                                      bgcolor: status === code ? color : `${color}15`,
                                      color: status === code ? 'white' : color,
                                      border: `1.5px solid ${status === code ? color : `${color}40`}`,
                                      transition: 'all 0.15s ease',
                                      '&:hover': { bgcolor: status === code ? color : `${color}30` },
                                      userSelect: 'none'
                                    }}
                                  >
                                    {code}
                                  </Box>
                                ))}
                              </Stack>
                            </TableCell>

                            {/* Status Badge */}
                            <TableCell>
                              {status ? (
                                <Chip
                                  label={style.label}
                                  size="small"
                                  sx={{
                                    fontWeight: 900, fontSize: '0.65rem',
                                    bgcolor: style.bg,
                                    color: style.text,
                                    border: `1px solid ${style.border}`,
                                    borderRadius: 1.5
                                  }}
                                />
                              ) : (
                                <Typography variant="caption" color="text.disabled" fontWeight={600}>Not marked</Typography>
                              )}
                            </TableCell>

                            {/* Remarks */}
                            <TableCell sx={{ minWidth: 200 }}>
                              <TextField
                                size="small"
                                placeholder="Optional remark..."
                                value={remarksMap[student._id] || ''}
                                onChange={e => setRemarksMap(prev => ({ ...prev, [student._id]: e.target.value }))}
                                InputProps={{ sx: { borderRadius: 2, fontSize: '0.8rem', bgcolor: 'rgba(255,255,255,0.8)' } }}
                                sx={{ width: '100%' }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {students.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={4} sx={{ py: 12, textAlign: 'center' }}>
                            <Typography variant="body1" color="text.secondary" fontWeight={600}>No students in this batch.</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>

              {/* Save Button */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<Save />}
                  onClick={handleSaveAttendance}
                  sx={{
                    borderRadius: 2, px: 5, py: 1.5,
                    fontWeight: 900, fontSize: '0.9rem',
                    boxShadow: '0 6px 20px rgba(232,57,29,0.35)',
                    '&:hover': { boxShadow: '0 8px 28px rgba(232,57,29,0.5)' }
                  }}
                >
                  Save Attendance
                </Button>
              </Box>

            </Box>
          )}

        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default BatchDetail;
