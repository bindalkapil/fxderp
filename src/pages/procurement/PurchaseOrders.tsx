import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  IconButton,
  Chip,
  Typography,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider
} from '@mui/material';
import { 
  Add as AddIcon, 
  MoreVert as MoreVertIcon, 
  Visibility as VisibilityIcon, 
  Edit as EditIcon,
  Receipt as ReceiptIcon,
  Print as PrintIcon,
  Delete as DeleteIcon 
} from '@mui/icons-material';
import Page from '../../components/Page';

interface PurchaseOrder {
  id: string;
  poNumber: string;
  supplier: string;
  orderDate: string;
  deliveryDate: string;
  status: 'draft' | 'sent' | 'received' | 'cancelled';
  totalAmount: number;
  items: {
    id: string;
    product: string;
    quantity: number;
    unit: string;
    rate: number;
    amount: number;
  }[];
}

const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    poNumber: 'PO-2025-001',
    supplier: 'Fresh Fruits Co.',
    orderDate: '2025-05-28',
    deliveryDate: '2025-06-02',
    status: 'sent',
    totalAmount: 25000,
    items: [
      { id: '1', product: 'Apples', quantity: 100, unit: 'kg', rate: 80, amount: 8000 },
      { id: '2', product: 'Oranges', quantity: 150, unit: 'kg', rate: 60, amount: 9000 },
      { id: '3', product: 'Bananas', quantity: 50, unit: 'dozen', rate: 60, amount: 3000 },
    ],
  },
  {
    id: '2',
    poNumber: 'PO-2025-002',
    supplier: 'Tropical Fruits Ltd.',
    orderDate: '2025-05-30',
    deliveryDate: '2025-06-05',
    status: 'draft',
    totalAmount: 18000,
    items: [
      { id: '4', product: 'Mangoes', quantity: 50, unit: 'kg', rate: 120, amount: 6000 },
      { id: '5', product: 'Pineapples', quantity: 30, unit: 'piece', rate: 80, amount: 2400 },
    ],
  },
  {
    id: '3',
    poNumber: 'PO-2025-003',
    supplier: 'Berry Good Farms',
    orderDate: '2025-05-25',
    deliveryDate: '2025-05-30',
    status: 'received',
    totalAmount: 32000,
    items: [
      { id: '6', product: 'Strawberries', quantity: 200, unit: 'punnets', rate: 100, amount: 20000 },
      { id: '7', product: 'Blueberries', quantity: 100, unit: 'punnets', rate: 120, amount: 12000 },
    ],
  },
];

const PurchaseOrders = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPo, setSelectedPo] = useState<PurchaseOrder | null>(null);

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, po: PurchaseOrder) => {
    setAnchorEl(event.currentTarget);
    setSelectedPo(po);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'default';
      case 'sent':
        return 'primary';
      case 'received':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Page 
      title="Purchase Orders" 
      subtitle="Manage your purchase orders"
      sx={{
        '& .MuiPaper-root': {
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0
        }
      }}
      headerAction={
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={<AddIcon />}
          component={Link}
          to="/procurement/purchase-orders/new"
        >
          New Purchase Order
        </Button>
      }
    >
      <TableContainer 
        component={Paper} 
        sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'auto',
          minHeight: 0
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>PO Number</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Order Date</TableCell>
              <TableCell>Delivery Date</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Total Amount (₹)</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockPurchaseOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((po) => (
              <TableRow key={po.id}>
                <TableCell>
                  <Typography variant="body2" color="primary">
                    {po.poNumber}
                  </Typography>
                </TableCell>
                <TableCell>{po.supplier}</TableCell>
                <TableCell>{new Date(po.orderDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(po.deliveryDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={po.status} 
                    color={getStatusColor(po.status) as any}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">₹{po.totalAmount.toLocaleString()}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuOpen(e, po)}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={mockPurchaseOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem component={Link} to={`/procurement/purchase-orders/${selectedPo?.id}`}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Details</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to={`/procurement/purchase-orders/${selectedPo?.id}/edit`}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ReceiptIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Receive Items</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <PrintIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Print</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText sx={{ color: 'error.main' }}>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Page>
  );
};

export default PurchaseOrders;
