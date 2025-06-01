import { Box, Typography } from '@mui/material';
import Page from '../../components/Page';

const Ledger = () => {
  return (
    <Page title="Ledger" subtitle="View and manage financial transactions">
      <Box>
        <Typography variant="h6">General Ledger</Typography>
        <Typography color="textSecondary" paragraph>
          This is where you can view and manage all financial transactions. The feature is under development.
        </Typography>
      </Box>
    </Page>
  );
};

export default Ledger;
