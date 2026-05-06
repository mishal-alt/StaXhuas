import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  ThemeProvider,
  createTheme,
  Divider,
  InputAdornment,
  IconButton,
  Tooltip,
  Autocomplete,
  Menu,
  Breadcrumbs,
  Link
} from '@mui/material';

import AppShell from '../components/layout/AppShell';
import AttendanceRoster from '../features/attendance/AttendanceRoster';
import StudentAttendanceAndLeaves from '../features/attendance/StudentAttendanceAndLeaves';
import * as batchApi from '../api/batches.api';
import { useAuth } from '../context/AuthContext';
import { ROLES } from '../utils/constants';
import { Search, FilterList, Sort, School, NavigateNext } from '@mui/icons-material';

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
  const [searchQuery, setSearchQuery] = useState('');

  // Sort and Filter State
  const [sortBy, setSortBy] = useState('name');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortAnchor, setSortAnchor] = useState(null);
  const [filterAnchor, setFilterAnchor] = useState(null);

  const handleSortClick = (event) => setSortAnchor(event.currentTarget);
  const handleFilterClick = (event) => setFilterAnchor(event.currentTarget);
  const handleSortClose = (value) => {
    if (value) setSortBy(value);
    setSortAnchor(null);
  };
  const handleFilterClose = (value) => {
    if (value) setStatusFilter(value);
    setFilterAnchor(null);
  };

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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pb: 8 }}>

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
              <Link underline="none" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 700, '&:hover': { color: 'primary.main' } }}>
                DASHBOARD
              </Link>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: 'text.primary' }}>
                STUDENTS
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
                <School fontSize="medium" />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight={900} color="text.primary" sx={{ letterSpacing: '-0.02em', mb: 0.2, fontSize: '1.75rem', textTransform: 'none' }}>
                  Student Management
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500}>
                  Manage students, batches and performance
                </Typography>
              </Box>
            </Box>
          </Box>



          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 1.5,
            px: 1,
            mb: 2
          }}>
            <Autocomplete
              size="small"
              options={[{ _id: 'all', name: 'All Batches' }, ...batches]}
              getOptionLabel={(option) => option.name || ''}
              value={[{ _id: 'all', name: 'All Batches' }, ...batches].find(b => b._id === selectedBatch) || null}
              onChange={(event, newValue) => {
                setSelectedBatch(newValue ? newValue._id : 'all');
              }}
              sx={{ width: 250 }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Batch"
                  InputProps={{
                    ...params.InputProps,
                    sx: { borderRadius: 2, bgcolor: 'background.paper' }
                  }}
                />
              )}
            />

            <TextField
              placeholder="Search students by name or email..."
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flex: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  '& fieldset': { border: '1px solid rgba(0,0,0,0.08)' }
                }
              }}
            />
            <Tooltip title="Filter">
              <IconButton
                size="small"
                onClick={handleFilterClick}
                sx={{
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: 2,
                  p: 0.8,
                  bgcolor: statusFilter !== 'all' ? 'primary.light' : 'background.paper',
                  color: statusFilter !== 'all' ? 'primary.contrastText' : 'inherit'
                }}
              >
                <FilterList fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Sort">
              <IconButton
                size="small"
                onClick={handleSortClick}
                sx={{
                  border: '1px solid rgba(0,0,0,0.08)',
                  borderRadius: 2,
                  p: 0.8,
                  bgcolor: sortBy !== 'name' ? 'secondary.light' : 'background.paper',
                  color: sortBy !== 'name' ? 'secondary.contrastText' : 'inherit'
                }}
              >
                <Sort fontSize="small" />
              </IconButton>
            </Tooltip>

            {/* Filter Menu */}
            <Menu
              anchorEl={filterAnchor}
              open={Boolean(filterAnchor)}
              onClose={() => handleFilterClose()}
              PaperProps={{ sx: { borderRadius: 3, mt: 1, minWidth: 150 } }}
            >
              <MenuItem onClick={() => handleFilterClose('all')} selected={statusFilter === 'all'}>All Status</MenuItem>
              <MenuItem onClick={() => handleFilterClose('Active')} selected={statusFilter === 'Active'}>Active</MenuItem>
              <MenuItem onClick={() => handleFilterClose('Inactive')} selected={statusFilter === 'Inactive'}>Inactive</MenuItem>
              <MenuItem onClick={() => handleFilterClose('Suspended')} selected={statusFilter === 'Suspended'}>Suspended</MenuItem>
              <MenuItem onClick={() => handleFilterClose('Terminated')} selected={statusFilter === 'Terminated'}>Terminated</MenuItem>
            </Menu>

            {/* Sort Menu */}
            <Menu
              anchorEl={sortAnchor}
              open={Boolean(sortAnchor)}
              onClose={() => handleSortClose()}
              PaperProps={{ sx: { borderRadius: 3, mt: 1, minWidth: 150 } }}
            >
              <MenuItem onClick={() => handleSortClose('name')} selected={sortBy === 'name'}>Sort by Name</MenuItem>
              <MenuItem onClick={() => handleSortClose('joinDate')} selected={sortBy === 'joinDate'}>Sort by Join Date</MenuItem>
              <MenuItem onClick={() => handleSortClose('attendance')} selected={sortBy === 'attendance'}>Sort by Attendance</MenuItem>
            </Menu>
          </Box>

          {/* Content */}
          <Box sx={{ mt: 0 }}>
            <Box>
              <AttendanceRoster
                batchId={selectedBatch}
                searchQuery={searchQuery}
                sortBy={sortBy}
                statusFilter={statusFilter}
              />
            </Box>
          </Box>

        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default AttendanceAndLeaves;
