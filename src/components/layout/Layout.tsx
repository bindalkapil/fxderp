import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { styled, useTheme } from '@mui/material/styles';
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar as MuiAppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  LocalShipping as LocalShippingIcon,
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  PointOfSale as PointOfSaleIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  AccountBalance as LedgerIcon,
  Assessment as ReportsIcon,
} from '@mui/icons-material';

const drawerWidth = 240;
const collapsedWidth = 73; // Width when collapsed (icon only)

const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open',
})<{ open?: boolean }>(({ theme, open }) => ({
  flex: 1,
  padding: 0,
  margin: 0,
  marginLeft: open ? `${drawerWidth}px` : `${collapsedWidth}px`,
  width: open ? `calc(100vw - ${drawerWidth}px)` : `calc(100vw - ${collapsedWidth}px)`,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: theme.palette.background.default,
  transition: theme.transitions.create(['margin', 'width'], {
    easing: open ? theme.transitions.easing.easeOut : theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const Content = styled(Box)(({ theme }) => ({
  flex: 1,
  overflow: 'auto',
  padding: theme.spacing(3),
  paddingTop: 0,
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  minHeight: 'calc(100vh - 64px)', // Viewport height minus header height
  marginTop: '64px', // Height of the AppBar
  width: '100%',
  maxWidth: '100%',
  margin: '0 auto',
  [theme.breakpoints.up('lg')]: {
    maxWidth: '100%',
    padding: theme.spacing(3),
    paddingTop: 0,
  },
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Vehicle Arrival', icon: <LocalShippingIcon />, path: '/procurement/vehicle-arrival' },
  { text: 'Purchase Orders', icon: <ShoppingCartIcon />, path: '/procurement/purchase-orders' },
  { text: 'Inventory', icon: <InventoryIcon />, path: '/inventory' },
  { text: 'Sales', icon: <PointOfSaleIcon />, path: '/sales' },
  { text: 'Dispatch', icon: <LocalShippingIcon />, path: '/dispatch' },
  { text: 'Suppliers', icon: <PersonIcon />, path: '/suppliers' },
  { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
  { text: 'Ledger', icon: <LedgerIcon />, path: '/ledger' },
  { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
];

export default function Layout() {
  const theme = useTheme();
  const [open, setOpen] = useState(true);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const StyledAppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })<{ open?: boolean }>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    position: 'fixed',
    width: open ? `calc(100% - ${drawerWidth}px)` : `calc(100% - ${collapsedWidth}px)`,
    marginLeft: open ? `${drawerWidth}px` : `${collapsedWidth}px`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <StyledAppBar position="fixed" open={open}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: collapsedWidth }} /> {/* Spacer to align with sidebar */}
            <Typography variant="h6" noWrap component="div" sx={{ ml: 2 }}>
              FXD Partner App
            </Typography>
          </Box>
          {/* Right side of the header can be used for additional controls */}
          <Box />
        </Toolbar>
      </StyledAppBar>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          whiteSpace: 'nowrap',
          boxSizing: 'border-box',
          position: 'fixed',
          height: '100vh',
          '& .MuiDrawer-paper': {
            position: 'fixed',
            width: open ? drawerWidth : collapsedWidth,
            height: '100vh',
            overflowX: 'hidden',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: open
                ? theme.transitions.duration.enteringScreen
                : theme.transitions.duration.leavingScreen,
            }),
          },
        }}
      >
        <DrawerHeader>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: open ? 'space-between' : 'center',
            p: 2,
            width: '100%',
            height: 64, // Match AppBar height
          }}>
            {open && (
              <Typography 
                variant="h6" 
                noWrap 
                component="div" 
                sx={{ 
                  ml: 1,
                  flexGrow: 1
                }}
              >
                Menu
              </Typography>
            )}
            <IconButton onClick={handleDrawerToggle}>
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
          </Box>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem 
              key={item.text} 
              disablePadding 
              component={Link} 
              to={item.path}
              sx={{
                color: 'inherit',
                textDecoration: 'none',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                display: 'block',
              }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon 
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: 'inherit'
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={{ 
                    opacity: open ? 1 : 0,
                    whiteSpace: 'nowrap',
                    transition: 'opacity 0.2s',
                  }} 
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Content>
          <Outlet />
        </Content>
      </Main>
    </Box>
  );
}
