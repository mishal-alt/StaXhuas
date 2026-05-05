import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Stack, 
  Button, 
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
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip
} from '@mui/material';
import { 
  Search, 
  Save, 
  CheckCircle, 
  Cancel, 
  Schedule, 
  DoneAll,
  AccessTime
} from '@mui/icons-material';

const DUMMY_STUDENTS = [
  { id: 1, name: 'Hrithic Raj', status: 'Present' },
  { id: 2, name: 'Ananya S', status: 'Present' },
  { id: 3, name: 'Mohammad Mishal', status: 'Absent' },
  { id: 4, name: 'Sneha Kapoor', status: 'Leave' },
  { id: 5, name: 'Rahul V', status: 'Present' },
  { id: 6, name: 'Priya Mani', status: 'Present' },
];

const AttendanceRoster = ({ batchId }) => {
  const [attendance, setAttendance] = useState(
    DUMMY_STUDENTS.reduce((acc, s) => ({ ...acc, [s.id]: s.status }), {})
  );

  const updateStatus = (id, status) => {
    if (!status) return; // Prevent deselecting
    setAttendance(prev => ({ ...prev, [id]: status }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Present': return '#2e7d32';
      case 'Absent': return '#d32f2f';
      case 'Leave': return '#ed6c02';
      case 'Late': return '#0288d1';
      default: return '#9e9e9e';
    }
  };

  return (
    <Card sx={{ borderRadius: 1, overflow: 'hidden' }}>
      <Box sx={{ p: 4, bgcolor: 'action.hover', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 3 }}>
        <Box>
          <Typography variant="h6" fontWeight={900} color="secondary">Daily Attendance Roster</Typography>
          <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </Typography>
        </Box>

        <Stack direction="row" spacing={3} alignItems="center">
           <Stack direction="row" spacing={2} sx={{ display: { xs: 'none', md: 'flex' } }}>
              {[
                { label: 'Present', count: 4, color: '#2e7d32' },
                { label: 'Absent', count: 1, color: '#d32f2f' },
                { label: 'Leave', count: 1, color: '#ed6c02' },
                { label: 'Late', count: 0, color: '#0288d1' },
              ].map((stat) => (
                <Box key={stat.label} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, bgcolor: stat.color, borderRadius: '50%' }} />
                  <Typography variant="caption" fontWeight={900} color="text.secondary">
                    {stat.label.toUpperCase()}: {stat.count}
                  </Typography>
                </Box>
              ))}
           </Stack>
           <Button variant="contained" color="secondary" startIcon={<Save />} disableElevation sx={{ borderRadius: 4 }}>
              Save Records
           </Button>
        </Stack>
      </Box>

      <CardContent sx={{ p: 0 }}>
        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <TextField 
            placeholder="Find student..." 
            size="small"
            sx={{ maxWidth: 400, flex: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              sx: { borderRadius: 4 }
            }}
          />
          <Button variant="text" color="primary" startIcon={<DoneAll />} sx={{ fontWeight: 900 }}>Mark All Present</Button>
        </Box>

        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 0 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', py: 3 }}>Student Name</TableCell>
                <TableCell align="center" sx={{ fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status Selection</TableCell>
                <th style={{ width: '120px' }}></th>
              </TableRow>
            </TableHead>
            <TableBody>
              {DUMMY_STUDENTS.map((student) => (
                <TableRow key={student.id} sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                  <TableCell sx={{ py: 3 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: 'secondary.main', fontWeight: 900, borderRadius: 2 }}>{student.name[0]}</Avatar>
                      <Typography variant="subtitle2" fontWeight={800}>{student.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell align="center">
                    <ToggleButtonGroup
                      value={attendance[student.id]}
                      exclusive
                      onChange={(e, val) => updateStatus(student.id, val)}
                      size="small"
                      sx={{ 
                        '& .MuiToggleButton-root': {
                          px: 3,
                          py: 1,
                          borderRadius: 3,
                          mx: 0.5,
                          border: '1px solid transparent !important',
                          '&.Mui-selected': {
                            bgcolor: 'white',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          }
                        },
                        '& .MuiToggleButton-root[value="Present"].Mui-selected': { color: '#2e7d32', borderColor: '#2e7d32 !important' },
                        '& .MuiToggleButton-root[value="Absent"].Mui-selected': { color: '#d32f2f', borderColor: '#d32f2f !important' },
                        '& .MuiToggleButton-root[value="Leave"].Mui-selected': { color: '#ed6c02', borderColor: '#ed6c02 !important' },
                        '& .MuiToggleButton-root[value="Late"].Mui-selected': { color: '#0288d1', borderColor: '#0288d1 !important' },
                      }}
                    >
                      <ToggleButton value="Present" color="success">
                        <Tooltip title="Present"><CheckCircle /></Tooltip>
                      </ToggleButton>
                      <ToggleButton value="Absent" color="error">
                        <Tooltip title="Absent"><Cancel /></Tooltip>
                      </ToggleButton>
                      <ToggleButton value="Leave" color="warning">
                        <Tooltip title="Leave"><Schedule /></Tooltip>
                      </ToggleButton>
                      <ToggleButton value="Late" color="info">
                        <Tooltip title="Late"><AccessTime /></Tooltip>
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </TableCell>
                  <TableCell align="right" sx={{ pr: 4 }}>
                    <Chip 
                      label={attendance[student.id]} 
                      size="small" 
                      sx={{ 
                        fontWeight: 900, 
                        bgcolor: `${getStatusColor(attendance[student.id])}10`, 
                        color: getStatusColor(attendance[student.id]),
                        minWidth: 80
                      }} 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default AttendanceRoster;
