import { Box, Typography, Paper } from '@mui/material';
import Page from '../components/Page';

const Dashboard = () => {
  return (
    <Page
      title="Dashboard"
      subtitle="Welcome to FXD Partner App"
      sx={{
        '& .MuiPaper-root': {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0
        }
      }}
    >
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 2fr' }, 
        gap: 3,
        flex: 1,
        minHeight: 0,
        '& > *': {
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column'
        }
      }}>
        <Paper sx={{ 
          p: 2, 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto'
        }}>
          <Typography variant="h6" gutterBottom>Quick Stats</Typography>
          <Box sx={{ mt: 2 }}>
            <Typography>Total Orders: 0</Typography>
            <Typography>Pending Shipments: 0</Typography>
            <Typography>Low Stock Items: 0</Typography>
          </Box>
        </Paper>
        <Paper sx={{ 
          p: 2,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto'
        }}>
          <Typography variant="h6" gutterBottom>Recent Activity</Typography>
          <Box sx={{ mt: 2, flex: 1, overflow: 'auto' }}>
            <Typography>No recent activity</Typography>
          </Box>
        </Paper>
      </Box>
    </Page>
  );
};

export default Dashboard;
