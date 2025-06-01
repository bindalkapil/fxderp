import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  FormControlLabel,
  Checkbox,
  Grid,
  Select,
  MenuItem,
  InputAdornment
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';

import Page from '../../components/Page';
import { supplierService } from '../../services/supplierService';
import type { SupplierFormData } from '../../types/supplier';

const AddSupplier = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<SupplierFormData>({
    name: '',
    code: '',
    gstin: '',
    pan: '',
    email: '',
    phone: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      country: 'India',
      postalCode: ''
    },
    contactPersons: [{
      name: '',
      email: '',
      phone: '',
      designation: ''
    }],
    bankDetails: [{
      accountName: '',
      accountNumber: '',
      bankName: '',
      branch: '',
      ifscCode: '',
      isPrimary: true
    }],
    paymentTerms: 'Net 30',
    creditLimit: 0,
    status: 'active',
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await supplierService.createSupplier(formData);
      navigate('/suppliers');
    } catch (err) {
      console.error('Error creating supplier:', err);
      setError('Failed to create supplier. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name as string]: value
    }));
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value
      }
    }));
  };

  const handleContactPersonChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updatedContactPersons = [...prev.contactPersons];
      updatedContactPersons[index] = {
        ...updatedContactPersons[index],
        [name]: value
      };
      return {
        ...prev,
        contactPersons: updatedContactPersons
      };
    });
  };

  const handleBankDetailsChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => {
      const updatedBankDetails = [...prev.bankDetails];
      updatedBankDetails[index] = {
        ...updatedBankDetails[index],
        [name]: type === 'checkbox' ? checked : value
      };
      return {
        ...prev,
        bankDetails: updatedBankDetails
      };
    });
  };

  const addContactPerson = () => {
    setFormData(prev => ({
      ...prev,
      contactPersons: [
        ...prev.contactPersons,
        { name: '', email: '', phone: '', designation: '' }
      ]
    }));
  };

  const removeContactPerson = (index: number) => {
    if (formData.contactPersons.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      contactPersons: prev.contactPersons.filter((_, i) => i !== index)
    }));
  };

  const addBankAccount = () => {
    setFormData(prev => ({
      ...prev,
      bankDetails: [
        ...prev.bankDetails,
        {
          accountName: '',
          accountNumber: '',
          bankName: '',
          branch: '',
          ifscCode: '',
          isPrimary: false
        }
      ]
    }));
  };

  const removeBankAccount = (index: number) => {
    if (formData.bankDetails.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      bankDetails: prev.bankDetails.filter((_, i) => i !== index)
    }));
  };

  return (
    <Page title="Add Supplier">
      <Container maxWidth="lg">
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/suppliers')}
            sx={{ mr: 2 }}
          >
            Back to Suppliers
          </Button>
          <Typography variant="h4" component="h1">
            Add New Supplier
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Basic Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="Supplier Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        margin="normal" 
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="Supplier Code"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="GSTIN"
                        name="gstin"
                        value={formData.gstin}
                        onChange={handleChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="PAN"
                        name="pan"
                        value={formData.pan}
                        onChange={handleChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        margin="normal"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Address
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        required
                        label="Address Line 1"
                        name="line1"
                        value={formData.address.line1}
                        onChange={handleAddressChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Address Line 2"
                        name="line2"
                        value={formData.address.line2}
                        onChange={handleAddressChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        required
                        label="City"
                        name="city"
                        value={formData.address.city}
                        onChange={handleAddressChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        required
                        label="State"
                        name="state"
                        value={formData.address.state}
                        onChange={handleAddressChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Postal Code"
                        name="postalCode"
                        value={formData.address.postalCode}
                        onChange={handleAddressChange}
                        margin="normal"
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {/* Contact Persons */}
            <Grid item xs={12}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Contact Persons</Typography>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={addContactPerson}
                    >
                      Add Contact Person
                    </Button>
                  </Box>
                  
                  {formData.contactPersons.map((person, index) => (
                    <Box key={index} mb={3} p={2} border={1} borderRadius={1} borderColor="divider">
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            required
                            label="Name"
                            name="name"
                            value={person.name}
                            onChange={(e) => handleContactPersonChange(index, e)}
                            margin="normal"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={person.email}
                            onChange={(e) => handleContactPersonChange(index, e)}
                            margin="normal"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            required
                            label="Phone"
                            name="phone"
                            value={person.phone}
                            onChange={(e) => handleContactPersonChange(index, e)}
                            margin="normal"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Designation"
                            name="designation"
                            value={person.designation}
                            onChange={(e) => handleContactPersonChange(index, e)}
                            margin="normal"
                          />
                        </Grid>
                        {formData.contactPersons.length > 1 && (
                          <Grid item xs={12} textAlign="right">
                            <Button 
                              color="error" 
                              size="small" 
                              onClick={() => removeContactPerson(index)}
                            >
                              Remove Contact
                            </Button>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            {/* Bank Details */}
            <Grid item xs={12}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6">Bank Details</Typography>
                    <Button 
                      variant="outlined" 
                      size="small" 
                      onClick={addBankAccount}
                    >
                      Add Bank Account
                    </Button>
                  </Box>
                  
                  {formData.bankDetails.map((bank, index) => (
                    <Box key={index} mb={3} p={2} border={1} borderRadius={1} borderColor="divider">
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            required
                            label="Account Holder Name"
                            name="accountName"
                            value={bank.accountName}
                            onChange={(e) => handleBankDetailsChange(index, e as React.ChangeEvent<HTMLInputElement>)}
                            margin="normal"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            required
                            label="Account Number"
                            name="accountNumber"
                            value={bank.accountNumber}
                            onChange={(e) => handleBankDetailsChange(index, e as React.ChangeEvent<HTMLInputElement>)}
                            margin="normal"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            required
                            label="Bank Name"
                            name="bankName"
                            value={bank.bankName}
                            onChange={(e) => handleBankDetailsChange(index, e as React.ChangeEvent<HTMLInputElement>)}
                            margin="normal"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            required
                            label="Branch"
                            name="branch"
                            value={bank.branch}
                            onChange={(e) => handleBankDetailsChange(index, e as React.ChangeEvent<HTMLInputElement>)}
                            margin="normal"
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            required
                            label="IFSC Code"
                            name="ifscCode"
                            value={bank.ifscCode}
                            onChange={(e) => handleBankDetailsChange(index, e as React.ChangeEvent<HTMLInputElement>)}
                            margin="normal"
                          />
                        </Grid>
                        <Grid sx={{ gridColumn: { xs: 'span 12', md: 'span 6' }, display: 'flex', alignItems: 'center' }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                name="isPrimary"
                                checked={bank.isPrimary}
                                onChange={(e) => handleBankDetailsChange(index, e as React.ChangeEvent<HTMLInputElement>)}
                                color="primary"
                              />
                            }
                            label="Primary Account"
                          />
                        </Grid>
                        {formData.bankDetails.length > 1 && (
                          <Grid item xs={12} textAlign="right">
                            <Button 
                              color="error" 
                              size="small" 
                              onClick={() => removeBankAccount(index)}
                              disabled={bank.isPrimary}
                            >
                              Remove Account
                            </Button>
                          </Grid>
                        )}
                      </Grid>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>

            {/* Credit Details */}
            <Grid item xs={12}>
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Credit Details
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                      <FormControl fullWidth margin="normal">
                        <InputLabel>Payment Terms</InputLabel>
                        <Select
                          name="paymentTerms"
                          value={formData.paymentTerms}
                          onChange={handleSelectChange}
                          label="Payment Terms"
                        >
                          <MenuItem value="Net 15">15 Days</MenuItem>
                          <MenuItem value="Net 30">30 Days</MenuItem>
                          <MenuItem value="Net 45">45 Days</MenuItem>
                          <MenuItem value="Net 60">60 Days</MenuItem>
                          <MenuItem value="Due on Receipt">Due on Receipt</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 200 }}>
                      <TextField
                        fullWidth
                        label="Credit Limit"
                        name="creditLimit"
                        type="number"
                        value={formData.creditLimit}
                        onChange={handleChange}
                        margin="normal"
                        InputProps={{
                          startAdornment: <InputAdornment position="start">₹</InputAdornment>,
                        }}
                        inputProps={{
                          min: 0,
                          step: 1000
                        }}
                      />
                    </Box>
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      label="Notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      margin="normal"
                      multiline
                      rows={3}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Form Actions */}
            <Box sx={{ width: '100%', mt: 3, mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate('/suppliers')}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Supplier'}
                </Button>
              </Box>
            </Box>
          </Grid>
        </form>
      </Container>
    </Page>
  );
};

export default AddSupplier;