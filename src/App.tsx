import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { SnackbarProvider } from 'notistack';

// Layout
import Layout from './components/layout/Layout';

// Pages
import Dashboard from './pages/Dashboard.tsx';
// Import the component as a named import
import { VehicleArrival } from './pages/procurement/VehicleArrival';
import NewVehicleArrival from './pages/procurement/NewVehicleArrival.tsx';
import PurchaseOrders from './pages/procurement/PurchaseOrders.tsx';
import Inventory from './pages/inventory/Inventory.tsx';
import Sales from './pages/sales/Sales.tsx';
import Dispatch from './pages/dispatch/Dispatch.tsx';
import Suppliers from './pages/suppliers/Suppliers.tsx';
import AddSupplier from './pages/suppliers/AddSupplier.tsx';
import EditSupplier from './pages/suppliers/EditSupplier';
import ViewSupplier from './pages/suppliers/ViewSupplier.tsx';
import Customers from './pages/customers/Customers.tsx';
import Ledger from './pages/ledger/Ledger.tsx';
import Reports from './pages/reports/Reports.tsx';
import TestPage from './pages/TestPage';

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2e7d32',  // Green 800
      light: '#4caf50', // Green 500
      dark: '#1b5e20',  // Green 900
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#66bb6a',  // Green 400
      light: '#81c784', // Green 300
      dark: '#388e3c',  // Green 700
      contrastText: '#000000',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: '#2e7d32', // Green 800
        },
      },
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <SnackbarProvider maxSnack={3}>
          <CssBaseline />
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Router>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  
                  {/* Procurement */}
                  <Route path="/procurement/vehicle-arrival" element={<VehicleArrival />} />
                  <Route path="/procurement/vehicle-arrival/new" element={<NewVehicleArrival />} />
                  <Route path="/procurement/purchase-orders" element={<PurchaseOrders />} />
                  
                  {/* Inventory */}
                  <Route path="/inventory" element={<Inventory />} />
                  
                  {/* Sales */}
                  <Route path="/sales" element={<Sales />} />
                  
                  {/* Dispatch */}
                  <Route path="/dispatch" element={<Dispatch />} />
                  
                  {/* Master Data */}
                  <Route path="/suppliers">
                    <Route index element={<Suppliers />} />
                    <Route path="new" element={<AddSupplier />} />
                    <Route path=":id" element={<ViewSupplier />} />
                    <Route path=":id/edit" element={<EditSupplier />} />
                  </Route>
                  <Route path="/customers" element={<Customers />} />
                  
                  {/* Financial */}
                  <Route path="/ledger" element={<Ledger />} />
                  
                  {/* Reports */}
                  <Route path="/reports" element={<Reports />} />
                  
                  {/* Test Route */}
                  <Route path="/test" element={<TestPage />} />
                  
                  {/* 404 - Keep this last */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Route>
              </Routes>
            </Router>
          </Box>
        </SnackbarProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
