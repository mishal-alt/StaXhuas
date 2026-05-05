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
              <Typography variant="h4" color="inherit" sx={{ fontSize: '3rem', textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                Daily Operations
              </Typography>
              <Typography variant="body1" color="inherit" sx={{ opacity: 0.9, fontWeight: 600, letterSpacing: '0.05em' }}>
                Manage attendance and leaves for your cohorts.
              </Typography>
            </Box>
            
            <TextField
              select
              label="Select Batch"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              variant="outlined"
              sx={{ 
                width: 300,
                zIndex: 1,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  borderRadius: '12px 32px 12px 32px', // Matching organic feel
                  height: 56,
                  '& fieldset': { border: 'none' },
                  '&:hover fieldset': { border: 'none' },
                  '&.Mui-focused fieldset': { border: 'none' },
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                },
                '& .MuiInputLabel-root': { 
                  color: 'rgba(255,255,255,0.8)', 
                  fontWeight: 800,
                  '&.Mui-focused': { color: 'white' },
                  '&.MuiInputLabel-shrink': { 
                    color: 'white', 
                    transform: 'translate(14px, -28px) scale(0.75)',
                  }
                },
                '& .MuiSelect-select': {
                  fontWeight: 900,
                  py: 1.5,
                  color: '#1E2126'
                }
              }}
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
