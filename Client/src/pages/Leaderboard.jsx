import React from 'react';
import { 
  Box, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Avatar, 
  Stack, 
  Chip, 
  Divider,
  Paper,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { 
  EmojiEvents, 
  TrendingUp, 
  TrendingDown, 
  Remove,
  Stars,
  WorkspacePremium
} from '@mui/icons-material';

import AppShell from '../components/layout/AppShell';

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

const LEADERBOARD_DATA = [
  { id: 1, name: 'Suhail Ahmed', points: 2450, rank: 1, trend: 'up', avatar: 'S' },
  { id: 2, name: 'Fathima Z', points: 2320, rank: 2, trend: 'up', avatar: 'F' },
  { id: 3, name: 'Hrithic Raj', points: 2180, rank: 3, trend: 'down', avatar: 'H' },
  { id: 4, name: 'Sneha Kapoor', points: 2100, rank: 4, trend: 'stable', avatar: 'S' },
  { id: 5, name: 'Arjun V', points: 1950, rank: 5, trend: 'up', avatar: 'A' },
  { id: 6, name: 'Mohammad Mishal', points: 1820, rank: 6, trend: 'down', avatar: 'M' },
];

const Leaderboard = () => {
  const topThree = LEADERBOARD_DATA.slice(0, 3);
  const others = LEADERBOARD_DATA.slice(3);

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <TrendingUp sx={{ color: '#2e7d32', fontSize: 16 }} />;
    if (trend === 'down') return <TrendingDown sx={{ color: '#d32f2f', fontSize: 16 }} />;
    return <Remove sx={{ color: '#9e9e9e', fontSize: 16 }} />;
  };

  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 6, pb: 12 }}>
          
          {/* Header */}
          <Box>
            <Typography variant="h4" color="secondary" sx={{ fontSize: '2.5rem' }}>The Hall of Fame</Typography>
            <Typography variant="body1" color="text.secondary" fontWeight={600}>Top performing students across all active cohorts.</Typography>
          </Box>

          {/* Podium */}
          <Grid container spacing={4} alignItems="flex-end" sx={{ mt: 2 }}>
            {/* Rank 2 */}
            <Grid item xs={12} md={4} order={{ xs: 2, md: 1 }}>
              <Card sx={{ height: 'fit-content', transform: { md: 'translateY(-20px)' }, textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: '#90a4ae', fontWeight: 900, fontSize: '2rem' }}>{topThree[1].avatar}</Avatar>
                  <Typography variant="h6" color="secondary">{topThree[1].name}</Typography>
                  <Typography variant="h4" color="primary" sx={{ my: 1 }}>{topThree[1].points}</Typography>
                  <Chip label="2nd PLACE" size="small" sx={{ fontWeight: 900, borderRadius: 2 }} />
                </CardContent>
              </Card>
            </Grid>

            {/* Rank 1 */}
            <Grid item xs={12} md={4} order={{ xs: 1, md: 2 }}>
              <Card sx={{ bgcolor: 'secondary.main', color: 'white', transform: { md: 'translateY(-60px)' }, textAlign: 'center', p: 3, border: '4px solid #E8391D' }}>
                <CardContent>
                  <Box sx={{ position: 'relative', width: 'fit-content', mx: 'auto' }}>
                    <EmojiEvents sx={{ position: 'absolute', top: -30, right: -20, fontSize: 50, color: '#FFD700', transform: 'rotate(15deg)' }} />
                    <Avatar sx={{ width: 120, height: 120, mx: 'auto', mb: 2, bgcolor: '#E8391D', fontWeight: 900, fontSize: '3rem', border: '4px solid white' }}>{topThree[0].avatar}</Avatar>
                  </Box>
                  <Typography variant="h5" fontWeight={900}>{topThree[0].name}</Typography>
                  <Typography variant="h3" sx={{ my: 1, color: '#E8391D' }}>{topThree[0].points}</Typography>
                  <Chip label="TOP PERFORMER" size="small" sx={{ bgcolor: 'white', color: 'secondary.main', fontWeight: 900, borderRadius: 2 }} />
                </CardContent>
              </Card>
            </Grid>

            {/* Rank 3 */}
            <Grid item xs={12} md={4} order={{ xs: 3, md: 3 }}>
              <Card sx={{ height: 'fit-content', transform: { md: 'translateY(-10px)' }, textAlign: 'center', p: 2 }}>
                <CardContent>
                  <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: '#a1887f', fontWeight: 900, fontSize: '2rem' }}>{topThree[2].avatar}</Avatar>
                  <Typography variant="h6" color="secondary">{topThree[2].name}</Typography>
                  <Typography variant="h4" color="primary" sx={{ my: 1 }}>{topThree[2].points}</Typography>
                  <Chip label="3rd PLACE" size="small" sx={{ fontWeight: 900, borderRadius: 2 }} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Table */}
          <Paper sx={{ borderRadius: 8, overflow: 'hidden', mt: 4 }}>
            <Box sx={{ p: 4, bgcolor: 'action.hover', borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" fontWeight={900} color="secondary">Rankings Continuation</Typography>
            </Box>
            <Stack divider={<Divider />}>
              {others.map((student) => (
                <Box key={student.id} sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', '&:hover': { bgcolor: 'action.hover' } }}>
                  <Stack direction="row" spacing={3} alignItems="center">
                    <Typography variant="h6" color="text.disabled" sx={{ width: 30 }}>{student.rank}</Typography>
                    <Avatar sx={{ bgcolor: 'secondary.main', fontWeight: 900 }}>{student.avatar}</Avatar>
                    <Box>
                      <Typography variant="subtitle1" fontWeight={900}>{student.name}</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Stars sx={{ fontSize: 14, color: '#FFD700' }} />
                        <Typography variant="caption" color="text.secondary" fontWeight={700}>COHORT C58</Typography>
                      </Stack>
                    </Box>
                  </Stack>
                  <Stack direction="row" spacing={4} alignItems="center">
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="subtitle1" fontWeight={900}>{student.points}</Typography>
                      <Typography variant="caption" color="text.secondary" fontWeight={700}>TOTAL POINTS</Typography>
                    </Box>
                    <Box sx={{ p: 1, bgcolor: 'action.hover', borderRadius: 2 }}>
                      {getTrendIcon(student.trend)}
                    </Box>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Paper>

        </Box>
      </AppShell>
    </ThemeProvider>
  );
};

export default Leaderboard;
