import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TablePagination,
  type SelectChangeEvent,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  DirectionsCar as DirectionsCarIcon,
  CheckCircle as CheckCircleIcon,
  Pending as PendingIcon,
  LocalShipping as LocalShippingIcon,
  Cancel as CancelIcon,
  Edit as EditIcon,
  Visibility as VisibilityIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';

// Components
import Page from '../../components/Page';

// Types
import type { VehicleArrival, VehicleArrivalStatus } from '../../types/vehicleArrival';

// Services
import {
  getVehicleArrivals,
  updateVehicleArrivalStatus,
} from '../../services/vehicleArrivalService';

// Status configuration
const statusConfig: Record<
  VehicleArrivalStatus,
  { label: string; color: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' }
> = {
  pending: { label: 'Pending', color: 'warning' },
  arrived: { label: 'Arrived', color: 'info' },
  unloading: { label: 'Unloading', color: 'primary' },
  completed: { label: 'Completed', color: 'success' },
  cancelled: { label: 'Cancelled', color: 'error' },
};

// Grid components for MUI v7
const GridContainer = (props: React.ComponentProps<typeof Grid> & { component?: React.ElementType }) => (
  <Box sx={{ width: '100%' }}>
    <Grid container spacing={2} {...props} component={props.component || 'div'} />
  </Box>
);

const GridItem = (props: React.ComponentProps<typeof Grid> & { 
  xs?: number; 
  md?: number;
  component?: React.ElementType;
}) => {
  const { xs, md, component = 'div', ...rest } = props;
  return <Grid item xs={xs} md={md} component={component} {...rest} />;
};

export function VehicleArrival() {
  console.log('Rendering VehicleArrival component');
  const navigate = useNavigate();
  const [arrivals, setArrivals] = useState<VehicleArrival[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<VehicleArrivalStatus | 'all'>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedArrival, setSelectedArrival] = useState<VehicleArrival | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  
  console.log('Initial state:', { loading, arrivals: arrivals.length });

  // Fetch vehicle arrivals
  const fetchArrivals = async () => {
    console.log('fetchArrivals called');
    try {
      setLoading(true);
      console.log('Fetching vehicle arrivals...');
      const data = await getVehicleArrivals();
      console.log('Fetched arrivals:', data);
      setArrivals(data);
    } catch (error) {
      console.error('Error fetching vehicle arrivals:', error);
    } finally {
      console.log('Finished loading, setting loading to false');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArrivals();
  }, []);

  // Filter arrivals based on search term and status
  const filteredArrivals = arrivals.filter((arrival) => {
    const matchesSearch = arrival.vehicleNumber
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || arrival.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Handle pagination
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle status filter change
  const handleStatusFilterChange = (event: SelectChangeEvent<VehicleArrivalStatus | 'all'>) => {
    setStatusFilter(event.target.value as VehicleArrivalStatus | 'all');
    setPage(0);
  };

  // Handle status update
  const handleStatusUpdate = async (id: string, status: VehicleArrivalStatus) => {
    try {
      await updateVehicleArrivalStatus(id, status);
      await fetchArrivals();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Handle view details
  const handleViewDetails = (arrival: VehicleArrival) => {
    setSelectedArrival(arrival);
    setDialogOpen(true);
  };

  // Render status chip
  const renderStatusChip = (status: VehicleArrivalStatus) => {
    const config = statusConfig[status];
    const icon = status === 'pending' ? <PendingIcon /> : 
                status === 'arrived' ? <DirectionsCarIcon /> : 
                status === 'unloading' ? <LocalShippingIcon /> : 
                status === 'completed' ? <CheckCircleIcon /> : <CancelIcon />;
    
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        icon={icon}
        component="div"
      />
    );
  };

  // Pagination
  const paginatedArrivals = filteredArrivals.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Page title="Vehicle Arrival">
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Vehicle Arrival
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/procurement/vehicle-arrival/new')}
          >
            New Arrival
          </Button>
        </Box>

        {/* Filters */}
        <Box sx={{ mb: 3 }}>
          <GridContainer>
            <GridItem xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by vehicle number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </GridItem>
            <GridItem xs={12} md={3}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  {Object.entries(statusConfig).map(([key, { label }]) => (
                    <MenuItem key={key} value={key}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </GridItem>
          </GridContainer>
        </Box>

        {/* Table */}
        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Vehicle Number</TableCell>
                  <TableCell>Driver Name</TableCell>
                  <TableCell>Arrival Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : paginatedArrivals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No vehicle arrivals found
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedArrivals.map((arrival) => (
                    <TableRow key={arrival.id}>
                      <TableCell>{arrival.vehicleNumber}</TableCell>
                      <TableCell>{arrival.driverName}</TableCell>
                      <TableCell>
                        {format(new Date(arrival.actualArrival || arrival.estimatedArrival), 'PPpp')}
                      </TableCell>
                      <TableCell>{renderStatusChip(arrival.status)}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Tooltip title="View Details">
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(arrival)}
                            >
                              <VisibilityIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Update Status">
                            <IconButton
                              size="small"
                              onClick={() => handleViewDetails(arrival)}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredArrivals.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>

        {/* Details Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Vehicle Arrival Details</DialogTitle>
          <DialogContent>
            {selectedArrival && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {selectedArrival.vehicleNumber}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Driver:</strong> {selectedArrival.driverName}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Arrival Time:</strong>{' '}
                  {format(new Date(selectedArrival.actualArrival || selectedArrival.estimatedArrival), 'PPpp')}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Status:</strong> {renderStatusChip(selectedArrival.status)}
                </Typography>
                {selectedArrival.notes && (
                  <Typography variant="body1" gutterBottom>
                    <strong>Notes:</strong> {selectedArrival.notes}
                  </Typography>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
            <Button
              variant="contained"
              onClick={() => {
                if (selectedArrival) {
                  navigate(`/procurement/vehicle-arrival/edit/${selectedArrival.id}`);
                }
              }}
            >
              Edit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Page>
  );
}
