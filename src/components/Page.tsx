import type { ReactNode } from 'react';
import { Box, Typography, Paper } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';

interface PageProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  headerAction?: ReactNode;
  sx?: SxProps<Theme>;
}

const Page = ({ title, subtitle, children, headerAction, sx = {} }: PageProps) => {
  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        minHeight: 0,
        ...sx
      }}
    >
      <Box 
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          mb: 3,
          flexShrink: 0
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography color="textSecondary" variant="subtitle1">
              {subtitle}
            </Typography>
          )}
        </Box>
        {headerAction && (
          <Box>
            {headerAction}
          </Box>
        )}
      </Box>
      <Box 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          width: '100%'
        }}
      >
        <Paper 
          sx={{ 
            p: 3,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
            minHeight: 0
          }}
        >
          {children}
        </Paper>
      </Box>
    </Box>
  );
};

export default Page;
