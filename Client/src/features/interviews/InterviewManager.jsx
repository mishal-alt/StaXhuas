import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "sonner";
import { format } from 'date-fns';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Stack, 
  Chip, 
  Button, 
  Avatar, 
  Divider,
  Paper,
  ThemeProvider,
  createTheme,
  IconButton
} from '@mui/material';
import { 
  Assessment, 
  AssignmentInd, 
  Schedule, 
  History, 
  CheckCircle, 
  ChevronRight,
  Add
} from '@mui/icons-material';

import * as interviewApi from '../../api/interviews.api';

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

const InterviewManager = ({ batchId }) => {
  const queryClient = useQueryClient();
  const { data: interviewsRes } = useQuery({
    queryKey: ['batch-interviews', batchId],
    queryFn: () => interviewApi.getInterviews({ batch: batchId })
  });

  const interviews = interviewsRes?.data || [];

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AssignmentInd color="primary" /> Module Evaluations
          </Typography>
          <Button variant="outlined" color="secondary" startIcon={<Add />} sx={{ borderRadius: 4 }}>
            Schedule New
          </Button>
        </Box>

        <Grid container spacing={3}>
          {interviews.map((interview) => (
            <Grid item xs={12} md={6} key={interview._id}>
              <Card sx={{ transition: 'all 0.3s', '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(232, 57, 29, 0.02)' } }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Avatar sx={{ bgcolor: 'secondary.main', fontWeight: 900, borderRadius: 2 }}>{interview.student?.name?.[0]}</Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight={900}>{interview.student?.name}</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>
                        {interview.module?.name} • ATTEMPT #{interview.attemptNumber || 1}
                      </Typography>
                    </Box>
                    <Chip 
                      label={interview.status.toUpperCase()} 
                      size="small" 
                      color={interview.status === 'scored' ? 'success' : 'warning'}
                      sx={{ fontWeight: 900, fontSize: '0.6rem', borderRadius: 2 }}
                    />
                  </Stack>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Stack direction="row" spacing={2}>
                       <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" fontWeight={900} color="text.disabled" sx={{ display: 'block' }}>DATE</Typography>
                          <Typography variant="subtitle2" fontWeight={800}>{format(new Date(interview.scheduledAt), 'MMM dd')}</Typography>
                       </Box>
                       <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="caption" fontWeight={900} color="text.disabled" sx={{ display: 'block' }}>TIME</Typography>
                          <Typography variant="subtitle2" fontWeight={800}>10:00 AM</Typography>
                       </Box>
                    </Stack>
                    <Button size="small" variant="contained" color="secondary" endIcon={<ChevronRight />}>
                      {interview.status === 'scored' ? 'View Result' : 'Start Assessment'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
          {interviews.length === 0 && (
            <Grid item xs={12}>
               <Paper variant="outlined" sx={{ p: 6, textAlign: 'center', borderRadius: 6, borderStyle: 'dashed' }}>
                  <Typography variant="body2" color="text.disabled" fontWeight={900}>NO EVALUATIONS SCHEDULED FOR THIS BATCH</Typography>
               </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </ThemeProvider>
  );
};

export default InterviewManager;
