import { Box, Typography } from '@mui/material';
import Page from '../../components/Page';

const Sales = () => {
  return (
    <Page title="Sales" subtitle="Manage your sales and invoices">
      <Box>
        <Typography variant="h6">Sales Management</Typography>
        <Typography color="textSecondary" paragraph>
          This is where you can manage all your sales and invoices. The feature is under development.
        </Typography>
      </Box>
    </Page>
  );
};

export default Sales;
