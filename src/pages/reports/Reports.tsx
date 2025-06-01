import { Box, Typography } from '@mui/material';
import Page from '../../components/Page';

const Reports = () => {
  return (
    <Page title="Reports" subtitle="Generate and view business reports">
      <Box>
        <Typography variant="h6">Business Reports</Typography>
        <Typography color="textSecondary" paragraph>
          This is where you can generate and view various business reports. The feature is under development.
        </Typography>
      </Box>
    </Page>
  );
};

export default Reports;
