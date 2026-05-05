import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Stack, 
  TextField, 
  MenuItem, 
  Tabs,
  Tab,
  ThemeProvider,
  createTheme,
  CircularProgress,
  Divider
} from '@mui/material';
import { 
  CheckCircle, 
  Mail, 
  People, 
  AssignmentTurnedIn,
  MoveToInbox
} from '@mui/icons-material';

import AppShell from '../components/layout/AppShell';
import AttendanceRoster from '../features/attendance/AttendanceRoster';
import LeaveInbox from '../features/leaves/LeaveInbox';
import StudentAttendanceAndLeaves from '../features/attendance/StudentAttendanceAndLeaves';
import * as batchApi from '../api/batches.api';
import { useAuth } from '../context/AuthContext';
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
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 900,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
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

const AttendanceAndLeaves = () => {
  const { user } = useAuth();
  const isStudent = user?.role === ROLES.STUDENT;

  const { data: batchesRes, isLoading: batchesLoading } = useQuery({
    queryKey: ['batches'],
    queryFn: batchApi.getBatches,
    enabled: !isStudent
  });

  const batches = batchesRes?.data || [];
  const [selectedBatch, setSelectedBatch] = useState('');
  const [activeTab, setActiveTab] = useState(0); // 0: Attendance, 1: Leaves

  React.useEffect(() => {
    if (batches.length > 0 && !selectedBatch) {
      setSelectedBatch(batches[0]._id);
    }
  }, [batches, selectedBatch]);

  if (isStudent) {
    return (
      <AppShell>
        <StudentAttendanceAndLeaves />
      </AppShell>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, pb: 8 }}>
          
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 4 }}>
            <Box>
              <Typography variant="h4" color="secondary" sx={{ fontSize: '2.5rem' }}>
                Daily Operations
              </Typography>
              <Typography variant="body1" color="text.secondary" fontWeight={600}>
                Manage attendance and leaves for your cohorts.
              </Typography>
            </Box>
            
            <TextField
              select
              label="Select Batch"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              sx={{ width: 300 }}
              InputProps={{ sx: { borderRadius: 4, fontWeight: 900 } }}
            >
              {batches.map(b => (
                <MenuItem key={b._id} value={b._id} sx={{ fontWeight: 800 }}>{b.name}</MenuItem>
              ))}
            </TextField>
          </Box>

          <Divider sx={{ opacity: 0.1 }} />

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={(e, v) => setActiveTab(v)} 
              indicatorColor="primary" 
              textColor="primary"
            >
              <Tab icon={<AssignmentTurnedIn />} iconPosition="start" label="Daily Attendance" />
              <Tab icon={<MoveToInbox />} iconPosition="start" label="Leaves Inbox" />
            </Tabs>
          </Box>

          {/* Content */}
          <Box sx={{ mt: 2 }}>
            {activeTab === 0 && (
              <Box>
                {selectedBatch ? <AttendanceRoster batchId={selectedBatch} /> : (
                  <Box sx={{ p: 8, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 8 }}>
                    <Typography variant="h6" color="text.secondary">Please select a batch to mark attendance.</Typography>
                  </Box>
                )}
              </Box>
            )}
            {activeTab === 1 && (
              <Box>
                {selectedBatch ? <LeaveInbox batchId={selectedBatch} /> : (
                  <Box sx={{ p: 8, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 8 }}>
                    <Typography variant="h6" color="text.secondary">Please select a batch to review leaves.</Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>

        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default AttendanceAndLeaves;
