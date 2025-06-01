import { Box, Typography, Button, Paper } from '@mui/material';
import Page from '../../components/Page';
import { Add as AddIcon } from '@mui/icons-material';

const Inventory = () => {
  return (
    <Page 
      title="Inventory Management"
      subtitle="View and manage your inventory items"
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
        display: 'flex', 
        flexDirection: 'column',
        height: '100%',
        gap: 2,
        minHeight: 0
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          flexShrink: 0
        }}>
          <Typography variant="h5" component="h2">
            Inventory Items
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => console.log('Add new item')}
          >
            Add Item
          </Button>
        </Box>
        
        <Paper sx={{ 
          flex: 1,
          display: 'flex', 
          flexDirection: 'column',
          minHeight: 0
        }}>
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            gap: 2, 
            flexWrap: 'wrap',
            borderBottom: '1px solid',
            borderColor: 'divider',
            flexShrink: 0
          }}>
            <Button variant="outlined" size="small">All Items</Button>
            <Button variant="outlined" size="small">In Stock</Button>
            <Button variant="outlined" size="small">Low Stock</Button>
            <Button variant="outlined" size="small">Out of Stock</Button>
          </Box>
          
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            p: 3,
            overflow: 'auto',
            minHeight: 0
          }}>
            <Typography color="textSecondary">
              No inventory items found. Add your first item to get started.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Page>
  );
};

export default Inventory;
