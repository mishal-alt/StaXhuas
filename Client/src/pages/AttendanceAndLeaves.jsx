import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Box, 
  Typography, 
  TextField, 
  MenuItem, 
  ThemeProvider,
  createTheme,
  Divider
} from '@mui/material';

import AppShell from '../components/layout/AppShell';
import AttendanceRoster from '../features/attendance/AttendanceRoster';
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
  const [selectedBatch, setSelectedBatch] = useState('all');

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
                Student Management
              </Typography>
              <Typography variant="body1" color="inherit" sx={{ opacity: 0.9, fontWeight: 600, letterSpacing: '0.05em' }}>
                Manage all students across different cohorts.
              </Typography>
            </Box>
            
            <TextField
              select
              label="Select Batch"
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              variant="outlined"
              sx={{ 
                width: 180,
                zIndex: 1,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  borderRadius: '12px 20px 12px 20px',
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
              <MenuItem value="all" sx={{ fontWeight: 800 }}>All Students</MenuItem>
              {batches.map(b => (
                <MenuItem key={b._id} value={b._id} sx={{ fontWeight: 800 }}>{b.name}</MenuItem>
              ))}
            </TextField>
          </Box>

          <Divider sx={{ opacity: 0.1 }} />

          {/* Content */}
          <Box sx={{ mt: 2 }}>
            <Box>
              <AttendanceRoster batchId={selectedBatch} />
            </Box>
          </Box>

        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default AttendanceAndLeaves;
