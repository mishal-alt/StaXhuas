import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  Chip, 
  Avatar, 
  Divider,
  Paper,
  IconButton,
  TextField,
  Rating,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { 
  ChevronLeft, 
  School, 
  CalendarToday, 
  Schedule, 
  Star, 
  CheckCircle, 
  Cancel, 
  Info, 
  Save, 
  AssignmentInd,
  Feedback,
  ThumbUp,
  ThumbDown
} from '@mui/icons-material';
import { toast } from "sonner";

import AppShell from '../components/layout/AppShell';
import * as interviewApi from '../api/interviews.api';

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
          padding: '12px 24px',
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

const InterviewDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState({
    technicalRating: 0,
    communicationRating: 0,
    strengths: '',
    weaknesses: '',
    recommendation: '',
  });

  const { data: interviewRes, isLoading } = useQuery({
    queryKey: ['interview', id],
    queryFn: () => interviewApi.getInterviewById(id),
    enabled: !!id
  });

  const submitMutation = useMutation({
    mutationFn: (data) => interviewApi.scoreInterview(id, data),
    onSuccess: () => {
      toast.success('Feedback submitted successfully');
      queryClient.invalidateQueries(['interview', id]);
      navigate('/my-interviews');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to submit feedback');
    }
  });

  if (isLoading) return (
    <AppShell>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress color="primary" thickness={6} />
      </Box>
    </AppShell>
  );

  const interview = interviewRes?.data;
  if (!interview) return (
    <AppShell>
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h6" color="error">Interview session not found.</Typography>
        <Button onClick={() => navigate('/my-interviews')} sx={{ mt: 2 }}>Return to List</Button>
      </Box>
    </AppShell>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.technicalRating || !formData.communicationRating || !formData.recommendation) {
      return toast.error('Please complete all ratings and recommendations');
    }
    if (formData.strengths.length < 10) {
      return toast.error('Strengths feedback is too short (min 10 characters)');
    }

    submitMutation.mutate({
      ...formData,
      status: 'scored',
      interviewerFeedback: `STRENGTHS: ${formData.strengths}\nWEAKNESSES: ${formData.weaknesses}\nRECOMMENDATION: ${formData.recommendation}`
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ maxWidth: '1000px', mx: 'auto', display: 'flex', flexDirection: 'column', gap: 4, pb: 8 }}>
          
          <Button 
            startIcon={<ChevronLeft />} 
            onClick={() => navigate('/my-interviews')}
            sx={{ alignSelf: 'flex-start', color: 'text.secondary', fontWeight: 800 }}
          >
            Assessment Queue
          </Button>

          <Grid container spacing={4}>
            {/* Sidebar info */}
            <Grid item xs={12} md={4}>
              <Stack spacing={4}>
                <Card sx={{ borderTop: '8px solid #E8391D' }}>
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Avatar 
                      sx={{ 
                        width: 100, height: 100, 
                        bgcolor: 'secondary.main', 
                        mx: 'auto', mb: 3, 
                        fontWeight: 900, fontSize: '2.5rem',
                        borderRadius: 5,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
                      }}
                    >
                      {interview.student?.name?.[0]}
                    </Avatar>
                    <Typography variant="h5" fontWeight={900} color="secondary" sx={{ fontFamily: 'Outfit' }}>
                      {interview.student?.name}
                    </Typography>
                    <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ letterSpacing: '0.1em' }}>
                      {interview.student?.batch?.name || 'MERN-B1'}
                    </Typography>
                    
                    <Box sx={{ mt: 3 }}>
                       <Chip label={`ATTEMPT #${interview.attemptNumber}`} color="primary" sx={{ fontWeight: 900, borderRadius: 2 }} />
                    </Box>

                    <Divider sx={{ my: 4, opacity: 0.1 }} />

                    <Stack spacing={2} sx={{ textAlign: 'left' }}>
                       <Stack direction="row" spacing={2} alignItems="center">
                          <School sx={{ color: 'primary.main', fontSize: 18 }} />
                          <Box>
                             <Typography variant="caption" fontWeight={900} color="text.secondary">MODULE</Typography>
                             <Typography variant="body2" fontWeight={800}>{interview.module?.name}</Typography>
                          </Box>
                       </Stack>
                       <Stack direction="row" spacing={2} alignItems="center">
                          <CalendarToday sx={{ color: 'primary.main', fontSize: 18 }} />
                          <Box>
                             <Typography variant="caption" fontWeight={900} color="text.secondary">DATE</Typography>
                             <Typography variant="body2" fontWeight={800}>05 MAY 2026</Typography>
                          </Box>
                       </Stack>
                       <Stack direction="row" spacing={2} alignItems="center">
                          <Schedule sx={{ color: 'primary.main', fontSize: 18 }} />
                          <Box>
                             <Typography variant="caption" fontWeight={900} color="text.secondary">TIME</Typography>
                             <Typography variant="body2" fontWeight={800}>10:30 AM</Typography>
                          </Box>
                       </Stack>
                    </Stack>
                  </CardContent>
                </Card>

                <Card sx={{ bgcolor: 'secondary.main', color: 'white' }}>
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                       <Info sx={{ color: 'primary.main' }} />
                       <Typography variant="subtitle2" fontWeight={900}>EVALUATOR NOTE</Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ opacity: 0.7, fontStyle: 'italic', fontSize: '0.8rem', lineHeight: 1.6 }}>
                      "Detail the qualitative performance of the candidate. Your recommendation directly influences the academic progression of the student."
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>

            {/* Evaluation Form */}
            <Grid item xs={12} md={8}>
              <Card>
                <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'action.hover' }}>
                   <Typography variant="h6" fontWeight={900} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Feedback color="primary" /> Evaluation Feedback
                   </Typography>
                </Box>
                <CardContent sx={{ p: 4 }}>
                  <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    
                    {/* Ratings */}
                    <Grid container spacing={4}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ display: 'block', mb: 1, letterSpacing: '0.1em' }}>TECHNICAL SKILLS (1-10)</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                          {[1,2,3,4,5,6,7,8,9,10].map(num => (
                            <Button
                              key={num}
                              onClick={() => setFormData({...formData, technicalRating: num})}
                              variant={formData.technicalRating === num ? 'contained' : 'outlined'}
                              sx={{ 
                                minWidth: 40, width: 40, height: 40, p: 0, 
                                borderRadius: 2, 
                                fontWeight: 900,
                                transition: 'all 0.2s',
                                transform: formData.technicalRating === num ? 'scale(1.1)' : 'none'
                              }}
                            >
                              {num}
                            </Button>
                          ))}
                        </Stack>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ display: 'block', mb: 1, letterSpacing: '0.1em' }}>COMMUNICATION (1-10)</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                          {[1,2,3,4,5,6,7,8,9,10].map(num => (
                            <Button
                              key={num}
                              onClick={() => setFormData({...formData, communicationRating: num})}
                              variant={formData.communicationRating === num ? 'contained' : 'outlined'}
                              sx={{ 
                                minWidth: 40, width: 40, height: 40, p: 0, 
                                borderRadius: 2, 
                                fontWeight: 900,
                                transition: 'all 0.2s',
                                transform: formData.communicationRating === num ? 'scale(1.1)' : 'none'
                              }}
                            >
                              {num}
                            </Button>
                          ))}
                        </Stack>
                      </Grid>
                    </Grid>

                    {/* Textual Feedback */}
                    <Stack spacing={4}>
                      <Box>
                         <Typography variant="caption" fontWeight={900} color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, letterSpacing: '0.1em' }}>
                            <ThumbUp fontSize="small" /> KEY STRENGTHS
                         </Typography>
                         <TextField 
                            fullWidth multiline rows={4} 
                            placeholder="What did the student do well? Be specific about technical implementations."
                            value={formData.strengths}
                            onChange={(e) => setFormData({...formData, strengths: e.target.value})}
                            InputProps={{ sx: { borderRadius: 4, bgcolor: 'action.hover' } }}
                         />
                      </Box>
                      <Box>
                         <Typography variant="caption" fontWeight={900} color="error.main" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5, letterSpacing: '0.1em' }}>
                            <ThumbDown fontSize="small" /> AREAS FOR IMPROVEMENT
                         </Typography>
                         <TextField 
                            fullWidth multiline rows={4} 
                            placeholder="Where did the student struggle? Provide constructive guidance."
                            value={formData.weaknesses}
                            onChange={(e) => setFormData({...formData, weaknesses: e.target.value})}
                            InputProps={{ sx: { borderRadius: 4, bgcolor: 'action.hover' } }}
                         />
                      </Box>
                    </Stack>

                    {/* Final Recommendation */}
                    <Box sx={{ pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
                       <Typography variant="caption" fontWeight={900} color="text.secondary" sx={{ display: 'block', mb: 3, textAlign: 'center', letterSpacing: '0.2em' }}>FINAL RECOMMENDATION</Typography>
                       <Grid container spacing={3}>
                          {[
                            { id: 'pass', label: 'PASS', color: 'success', icon: <CheckCircle /> },
                            { id: 'improvement', label: 'NEEDS IMPROVEMENT', color: 'info', icon: <Info /> },
                            { id: 'fail', label: 'FAIL', color: 'error', icon: <Cancel /> },
                          ].map(rec => (
                            <Grid item xs={4} key={rec.id}>
                               <Button
                                  fullWidth
                                  onClick={() => setFormData({...formData, recommendation: rec.id})}
                                  variant={formData.recommendation === rec.id ? 'contained' : 'outlined'}
                                  color={rec.color}
                                  sx={{ 
                                    flexDirection: 'column', 
                                    py: 3, 
                                    gap: 1, 
                                    borderRadius: 5,
                                    borderWidth: 2,
                                    '&:hover': { borderWidth: 2 }
                                  }}
                               >
                                  {rec.icon}
                                  <Typography variant="caption" fontWeight={900}>{rec.label}</Typography>
                               </Button>
                            </Grid>
                          ))}
                       </Grid>
                    </Box>

                    <Button 
                      type="submit" 
                      variant="contained" 
                      color="secondary" 
                      fullWidth 
                      sx={{ py: 2.5, fontSize: '1.1rem', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
                      disabled={submitMutation.isPending}
                      startIcon={<Save />}
                    >
                      {submitMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Submit Evaluation'}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default InterviewDetail;
