import { Box, Typography } from '@mui/material';
import Page from '../../components/Page';

const Customers = () => {
  return (
    <Page title="Customers" subtitle="Manage your customers and clients">
      <Box>
        <Typography variant="h6">Customer Management</Typography>
        <Typography color="textSecondary" paragraph>
          This is where you can manage all your customers and clients. The feature is under development.
        </Typography>
      </Box>
    </Page>
  );
};

export default Customers;
