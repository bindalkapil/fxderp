import { Box, Typography } from '@mui/material';
import Page from '../../components/Page';

const Dispatch = () => {
  return (
    <Page title="Dispatch" subtitle="Manage your dispatches and deliveries">
      <Box>
        <Typography variant="h6">Dispatch Management</Typography>
        <Typography color="textSecondary" paragraph>
          This is where you can manage all your dispatches and deliveries. The feature is under development.
        </Typography>
      </Box>
    </Page>
  );
};

export default Dispatch;
