import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography
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
  Visibility as VisibilityIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

// Components
import Page from '../../components/Page';

// Types
import type { VehicleArrival, VehicleArrivalStatus } from '../../types/vehicleArrival';

// Services
import {
  getVehicleArrivals
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
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle status filter change
  const handleStatusFilterChange = (event: any) => {
    setStatusFilter(event.target.value);
    setPage(0);
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
                  <TableCell>Supplier</TableCell>
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
                      <TableCell>{arrival.supplier}</TableCell>
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
          maxWidth="md"
          fullWidth
          sx={{
            '& .MuiDialog-paper': {
              minWidth: 700,
              maxWidth: '900px',
            },
          }}
        >
          <DialogTitle>Vehicle Arrival Details</DialogTitle>
          <DialogContent>
            {selectedArrival && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Vehicle: {selectedArrival.vehicleNumber}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Driver:</strong> {selectedArrival.driverName} ({selectedArrival.driverPhone})
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Supplier:</strong> {selectedArrival.supplier}
                  {selectedArrival.supplierReference && (
                    <> (<strong>Ref:</strong> {selectedArrival.supplierReference})</>
                  )}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Estimated Arrival:</strong> {format(new Date(selectedArrival.estimatedArrival), 'PPpp')}
                </Typography>
                {selectedArrival.actualArrival && (
                  <Typography variant="body1" gutterBottom>
                    <strong>Actual Arrival:</strong> {format(new Date(selectedArrival.actualArrival), 'PPpp')}
                  </Typography>
                )}
                <Typography variant="body1" gutterBottom>
                  <strong>Status:</strong> {renderStatusChip(selectedArrival.status)}
                </Typography>
                {selectedArrival.notes && (
                  <Typography variant="body1" gutterBottom>
                    <strong>Notes:</strong> {selectedArrival.notes}
                  </Typography>
                )}

                {/* Items List */}
                <Box mt={3}>
                  <Typography variant="subtitle1" gutterBottom>
                    <strong>Items</strong>
                  </Typography>
                  {selectedArrival.items.map((item) => (
                    <Box key={item.id} mb={2} p={2} sx={{ border: '1px solid #eee', borderRadius: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        <strong>Product Category:</strong> {item.productCategory || '-'}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Item Name:</strong> {item.itemName}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Purchase Order ID:</strong> {item.purchaseOrderId}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Quantity:</strong> {item.quantity} {item.unit}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Received Quantity:</strong> {item.receivedQuantity ?? '-'}
                      </Typography>
                      <Typography variant="body2" gutterBottom>
                        <strong>Status:</strong> {item.status}
                      </Typography>
                      {item.notes && (
                        <Typography variant="body2" gutterBottom>
                          <strong>Notes:</strong> {item.notes}
                        </Typography>
                      )}
                      {/* SKUs Table */}
                      {item.skus && item.skus.length > 0 && (
                        <Box mt={1}>
                          <Typography variant="subtitle2" gutterBottom>
                            SKUs
                          </Typography>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>SKU</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Unit</TableCell>
                                <TableCell>Unit Wt</TableCell>
                                <TableCell>Total Wt</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {item.skus.map((sku, skuIdx) => (
                                <TableRow key={skuIdx}>
                                  <TableCell>{sku.sku}</TableCell>
                                  <TableCell>{sku.quantity}</TableCell>
                                  <TableCell>{sku.unit}</TableCell>
                                  <TableCell>{sku.unitWt ?? '-'}</TableCell>
                                  <TableCell>{sku.totalWt ?? '-'}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </Box>
                      )}
                    </Box>
                  ))}
                </Box>
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
