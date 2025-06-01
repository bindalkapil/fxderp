import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  IconButton,
  Tooltip,
  Typography,
  Chip,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import Page from '../../components/Page';
import type { Supplier, SupplierStatus } from '../../types/supplier';
import { supplierService } from '../../services/supplierService';

const statusColors: Record<SupplierStatus, 'success' | 'error' | 'warning'> = {
  active: 'success',
  inactive: 'warning',
  suspended: 'error',
};

const Suppliers = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [supplierToDelete, setSupplierToDelete] = useState<Supplier | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  interface ContextMenuState {
    mouseX: number;
    mouseY: number;
    supplier: Supplier;
  }
  
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  const handleAddSupplier = () => {
    navigate('/suppliers/new');
  };

  // Dummy supplier data
  const dummySuppliers: Supplier[] = [
    {
      id: '1',
      name: 'ABC Electronics',
      code: 'SUP-001',
      gstin: '22AAAAA0000A1Z5',
      pan: 'AAAAA1234A',
      email: 'contact@abcelectronics.com',
      phone: '+919876543210',
      address: {
        line1: '123 Tech Park',
        line2: 'Sector 62',
        city: 'Noida',
        state: 'Uttar Pradesh',
        country: 'India',
        postalCode: '201309'
      },
      contactPersons: [
        {
          name: 'Rahul Sharma',
          email: 'rahul@abcelectronics.com',
          phone: '+919876543211',
          designation: 'Sales Manager'
        }
      ],
      bankDetails: [
        {
          accountName: 'ABC Electronics',
          accountNumber: '1234567890',
          bankName: 'HDFC Bank',
          branch: 'Noida Sector 62',
          ifscCode: 'HDFC0001234',
          isPrimary: true
        }
      ],
      paymentTerms: 'Net 30',
      creditLimit: 500000,
      status: 'active',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-06-01'),
      notes: 'Reliable supplier with good quality products'
    },
    {
      id: '2',
      name: 'XYZ Components',
      code: 'SUP-002',
      gstin: '27BBBBB0000B2Z6',
      pan: 'BBBBB5678B',
      email: 'info@xyzcomponents.com',
      phone: '+919876543212',
      address: {
        line1: '456 Industrial Area',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
        postalCode: '560068'
      },
      contactPersons: [
        {
          name: 'Priya Patel',
          email: 'priya@xyzcomponents.com',
          phone: '+919876543213',
          designation: 'Account Manager'
        }
      ],
      bankDetails: [
        {
          accountName: 'XYZ Components',
          accountNumber: '9876543210',
          bankName: 'ICICI Bank',
          branch: 'Koramangala',
          ifscCode: 'ICIC0001234',
          isPrimary: true
        }
      ],
      paymentTerms: 'Net 15',
      creditLimit: 300000,
      status: 'active',
      createdAt: new Date('2024-02-20'),
      updatedAt: new Date('2024-05-25')
    },
    {
      id: '3',
      name: 'Global Hardware Solutions',
      code: 'SUP-003',
      gstin: '29CCCCC0000C3Z7',
      pan: 'CCCCC9012C',
      phone: '+919876543214',
      address: {
        line1: '789 Trade Center',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        postalCode: '400001'
      },
      contactPersons: [
        {
          name: 'Amit Kumar',
          email: 'amit@globalhardware.com',
          phone: '+919876543215',
          designation: 'Director'
        }
      ],
      bankDetails: [
        {
          accountName: 'Global Hardware Solutions',
          accountNumber: '4567890123',
          bankName: 'SBI',
          branch: 'Nariman Point',
          ifscCode: 'SBIN0001234',
          isPrimary: true
        }
      ],
      status: 'inactive',
      createdAt: new Date('2023-11-10'),
      updatedAt: new Date('2024-05-15')
    }
  ];

  // Fetch suppliers on component mount
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        // Try to fetch from API first
        const data = await supplierService.getSuppliers();
        setSuppliers(data);
        setError(null);
      } catch (err) {
        console.warn('Using dummy data due to API error:', err);
        // Fallback to dummy data
        setSuppliers(dummySuppliers);
        setError('Using sample data. Some features may be limited.');
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  // Handle context menu
  const handleContextMenu = (event: React.MouseEvent<HTMLTableRowElement>, supplier: Supplier) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
      supplier
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  // Handle delete confirmation
  const handleDeleteClick = (supplier: Supplier) => {
    setSupplierToDelete(supplier);
    setDeleteDialogOpen(true);
    setContextMenu(null);
  };

  const handleConfirmDelete = async () => {
    if (!supplierToDelete) return;
    
    try {
      await supplierService.deleteSupplier(supplierToDelete.id);
      setSuppliers(suppliers.filter(s => s.id !== supplierToDelete.id));
      setSnackbar({
        open: true,
        message: 'Supplier deleted successfully',
        severity: 'success',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to delete supplier',
        severity: 'error',
      });
      console.error('Error deleting supplier:', err);
    } finally {
      setDeleteDialogOpen(false);
      setSupplierToDelete(null);
    }
  };

  // Handle pagination
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter suppliers based on search term
  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone.includes(searchTerm) ||
    (supplier.email && supplier.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Pagination
  const paginatedSuppliers = filteredSuppliers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Helper function to get context menu position
  const getContextMenuPosition = () => {
    if (!contextMenu) return { top: 0, left: 0 };
    return {
      top: contextMenu.mouseY,
      left: contextMenu.mouseX,
    };
  };

  const contextMenuSupplier = contextMenu?.supplier;

  // Helper function to render the main content
  const renderContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      );
    }


    if (error) {
      return (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      );
    }

    return (
      <>
        <TableContainer component={Card}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Code</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedSuppliers.map((supplier) => (
                <TableRow
                  key={supplier.id}
                  hover
                  onContextMenu={(e) => handleContextMenu(e, supplier)}
                  sx={{ cursor: 'context-menu' }}
                >
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.code}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={supplier.status}
                      color={statusColors[supplier.status]}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/suppliers/${supplier.id}`)}
                      >
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={() => navigate(`/suppliers/${supplier.id}/edit`)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteClick(supplier)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredSuppliers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </>
    );
  };

  return (
    <Page title="Suppliers">
      <Container maxWidth={false}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Suppliers
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddSupplier}
          >
            Add Supplier
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
            }}
            sx={{
              maxWidth: 400,
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.paper',
              },
            }}
          />
        </Box>

        {renderContent()}

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Delete Supplier</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete {supplierToDelete?.name}? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button 
              onClick={handleConfirmDelete} 
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleSnackbarClose} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>

      {/* Context Menu */}
      {contextMenu?.supplier && (
        <Menu
          open={true}
          onClose={handleCloseContextMenu}
          anchorReference="anchorPosition"
          anchorPosition={getContextMenuPosition()}
          onContextMenu={(e) => e.preventDefault()}
        >
          <MenuItem
            onClick={() => {
              if (contextMenuSupplier) {
                navigate(`/suppliers/${contextMenuSupplier.id}`);
                handleCloseContextMenu();
              }
            }}
          >
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View Details</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (contextMenuSupplier) {
                navigate(`/suppliers/${contextMenuSupplier.id}/edit`);
                handleCloseContextMenu();
              }
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              if (contextMenuSupplier) {
                handleDeleteClick(contextMenuSupplier);
              }
            }}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon sx={{ color: 'error.main' }}>
              <DeleteIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Delete Supplier</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {supplierToDelete?.name}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmDelete} 
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Page>
  );
};

export default Suppliers;
