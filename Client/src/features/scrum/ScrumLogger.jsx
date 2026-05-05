import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from "sonner";
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Stack, 
  Chip, 
  Button, 
  TextField, 
  Divider,
  Paper,
  ThemeProvider,
  createTheme,
  Avatar,
  MenuItem
} from '@mui/material';
import { 
  CheckCircle, 
  Bolt, 
  Chat, 
  Assignment, 
  Schedule, 
  History,
  Groups,
  Send
} from '@mui/icons-material';

import * as scrumApi from '../../api/scrum.api';

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

const ScrumLogger = ({ batchId }) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm();

  const logMutation = useMutation({
    mutationFn: (data) => scrumApi.logScrum({ ...data, batch: batchId }),
    onSuccess: () => {
      toast.success('Daily scrum logged successfully');
      queryClient.invalidateQueries(['scrums', batchId]);
      reset();
    },
    onError: (err) => toast.error(err.message || 'Failed to log scrum')
  });

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="secondary" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Groups color="primary" /> Daily Scrum Briefing
          </Typography>
          <Chip label="LIVE SESSION" color="error" size="small" variant="outlined" sx={{ fontWeight: 900 }} />
        </Box>

        <Card sx={{ bgcolor: 'white', border: '1px solid', borderColor: 'divider' }}>
          <CardContent sx={{ p: 4 }}>
            <Box component="form" onSubmit={handleSubmit((data) => logMutation.mutate(data))} sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField 
                    select
                    fullWidth
                    label="Scrum Status"
                    size="small"
                    defaultValue="On-track"
                    {...register('status', { required: true })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  >
                    <MenuItem value="On-track">On-track</MenuItem>
                    <MenuItem value="Delayed">Delayed</MenuItem>
                    <MenuItem value="Blocked">Blocked</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={8}>
                  <TextField 
                    fullWidth
                    label="Current Activity / Module"
                    placeholder="e.g. Building Portfolio Backend"
                    size="small"
                    {...register('activity', { required: true })}
                    sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
                  />
                </Grid>
              </Grid>

              <TextField 
                fullWidth
                multiline
                rows={3}
                label="Detailed Update & Blockers"
                placeholder="What did the cohort achieve today? Are there any major blockers?"
                {...register('update', { required: true })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 4 } }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="secondary" 
                  startIcon={<Send />}
                  disabled={logMutation.isPending}
                  sx={{ borderRadius: 3, px: 4 }}
                >
                  Log Daily Update
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* History Preview */}
        <Paper elevation={0} sx={{ p: 3, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 6 }}>
           <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
             <History sx={{ fontSize: 14 }} /> PREVIOUS LOGS
           </Typography>
           <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
             Log history is available in the Reports section.
           </Typography>
        </Paper>

      </Box>
    </ThemeProvider>
  );
};

export default ScrumLogger;
