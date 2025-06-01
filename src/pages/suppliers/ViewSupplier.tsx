import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Paper,
  Grid,
} from '@mui/material';
import { Edit as EditIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import type { Supplier, SupplierStatus, ContactPerson } from '../../types/supplier';
import { supplierService } from '../../services/supplierService';

const statusColors: Record<SupplierStatus, 'success' | 'error' | 'warning'> = {
  active: 'success',
  inactive: 'warning',
  suspended: 'error',
};

const ViewSupplier = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSupplier = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await supplierService.getSupplier(id);
        setSupplier(data);
      } catch (err) {
        setError('Failed to load supplier details');
        console.error('Error fetching supplier:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !supplier) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 3 }}>
          {error || 'Supplier not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Supplier Details</Typography>
        <Box display="flex" gap={2}>
          <Button
            startIcon={<EditIcon />}
            onClick={() => navigate(`/suppliers/${id}/edit`)}
            variant="contained"
            color="primary"
          >
            Edit
          </Button>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/suppliers')}
          >
            Back
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid width="100%">
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h1">
                  {supplier.name}
                </Typography>
                <Chip label={supplier.status} color={statusColors[supplier.status]} size="small" />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Address Section (Multiple) */}
        {(Array.isArray(supplier.address) ? supplier.address : [supplier.address]).map((addr, idx, arr) => (
          <Grid width={{ xs: '100%', md: '50%' }} key={idx}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Address {arr.length > 1 ? idx + 1 : ''}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <Typography><b>Line 1:</b> {addr.line1}</Typography>
                  <Typography><b>Line 2:</b> {addr.line2}</Typography>
                  <Typography><b>City:</b> {addr.city}</Typography>
                  <Typography><b>State:</b> {addr.state}</Typography>
                  <Typography><b>Country:</b> {addr.country}</Typography>
                  <Typography><b>Postal Code:</b> {addr.postalCode}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        {/* Bank Details Section */}
        <Grid width={{ xs: '100%', md: '50%' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Bank Details
              </Typography>
              <Divider sx={{ my: 2 }} />
              {supplier.bankDetails && supplier.bankDetails.length > 0 ? (
                supplier.bankDetails.map((bank, idx) => (
                  <Box key={idx} sx={{ mb: 2, p: 1, border: '1px solid #eee', borderRadius: 1 }}>
                    <Typography><b>Account Name:</b> {bank.accountName}</Typography>
                    <Typography><b>Account Number:</b> {bank.accountNumber}</Typography>
                    <Typography><b>Bank Name:</b> {bank.bankName}</Typography>
                    <Typography><b>Branch:</b> {bank.branch}</Typography>
                    <Typography><b>IFSC Code:</b> {bank.ifscCode}</Typography>
                    <Typography><b>Primary:</b> {bank.isPrimary ? 'Yes' : 'No'}</Typography>
                  </Box>
                ))
              ) : (
                <Typography color="text.secondary">No bank details available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid width={{ xs: '100%', md: '50%' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Basic Information
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Name:
                  </Typography>
                  <Typography>{supplier.name}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Code:
                  </Typography>
                  <Typography>{supplier.code}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Status:
                  </Typography>
                  <Chip
                    label={supplier.status}
                    color={statusColors[supplier.status]}
                    size="small"
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid width={{ xs: '100%', md: '50%' }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Contact Information
              </Typography>
              <Divider sx={{ my: 2 }} />
              
              {supplier.contactPersons && supplier.contactPersons.length > 0 ? (
                supplier.contactPersons.map((person: ContactPerson, index: number) => (
                  <Box key={index} mb={2}>
                    <Typography variant="subtitle2">{person.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {person.designation || 'Contact Person'}
                    </Typography>
                    <Typography variant="body2">
                      {person.email}<br />
                      {person.phone}
                    </Typography>
                    {index < supplier.contactPersons.length - 1 && <Divider sx={{ my: 2 }} />}
                  </Box>
                ))
              ) : (
                <Typography variant="body1" color="textSecondary">
                  No contact persons available
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {supplier?.notes && (
          <Grid width="100%">
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
                Notes
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {supplier.notes}
              </Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default ViewSupplier;
