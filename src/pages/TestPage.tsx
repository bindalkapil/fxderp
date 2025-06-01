import { Box, Typography } from '@mui/material';
import Page from '../components/Page';

const TestPage = () => {
  return (
    <Page 
      title="Test Page"
      subtitle="This is a test page"
      sx={{ 
        '& .MuiPaper-root': {
          border: '2px solid blue',
          minHeight: 'calc(100vh - 200px)',
          backgroundColor: '#fff',
        }
      }}
    >
      <Box sx={{ 
        p: 3, 
        backgroundColor: 'rgba(0,0,0,0.02)', 
        borderRadius: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Test Page
        </Typography>
        <Typography variant="body1">
          This is a test page to verify routing and layout. The content should now be properly visible.
        </Typography>
      </Box>
    </Page>
  );
};

export default TestPage;
