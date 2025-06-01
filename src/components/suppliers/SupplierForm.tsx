import { useState, type ChangeEvent } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  TextField,
  Typography,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import type { SupplierFormData } from '../../types/supplier';

interface SupplierFormProps {
  initialData: SupplierFormData;
  onSubmit: (data: SupplierFormData) => Promise<void>;
  isSubmitting: boolean;
  title: string;
  submitButtonText: string;
  onCancel: () => void;
}

export const SupplierForm = ({
  initialData,
  onSubmit,
  isSubmitting,
  title,
  submitButtonText,
  onCancel,
}: SupplierFormProps) => {
  // Ensure at least one contact person and bank detail entry exists on open
  const getInitialFormData = (data: SupplierFormData) => ({
    ...data,
    contactPersons: data.contactPersons && data.contactPersons.length > 0 ? data.contactPersons : [{ name: '', email: '', phone: '', designation: '' }],
    bankDetails: data.bankDetails && data.bankDetails.length > 0 ? data.bankDetails : [{ accountName: '', accountNumber: '', bankName: '', branch: '', ifscCode: '', isPrimary: true }],
    address: Array.isArray(data.address) ? (data.address.length > 0 ? data.address : [{ line1: '', line2: '', city: '', state: '', country: '', postalCode: '' }]) : (data.address ? [data.address] : [{ line1: '', line2: '', city: '', state: '', country: '', postalCode: '' }])
  });
  const [formData, setFormData] = useState<SupplierFormData>(getInitialFormData(initialData));
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof SupplierFormData] as object || {}),
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.code) newErrors.code = 'Code is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await onSubmit(formData);
  };

  // Address handlers
  const handleAddressChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => {
    const { name, value } = e.target;
    const field = name.split('.').pop();
    setFormData(prev => {
      const newAddresses = prev.address.map((addr, i) =>
        i === idx ? { ...addr, [field!]: value } : addr
      );
      return { ...prev, address: newAddresses };
    });
  };

  const handleAddAddress = () => {
    setFormData(prev => ({
      ...prev,
      address: [
        ...prev.address,
        { line1: '', line2: '', city: '', state: '', country: '', postalCode: '' }
      ]
    }));
  };

  const handleRemoveAddress = (idx: number) => {
    setFormData(prev => {
      const newAddresses = prev.address.filter((_, i) => i !== idx);
      return { ...prev, address: newAddresses.length > 0 ? newAddresses : [{ line1: '', line2: '', city: '', state: '', country: '', postalCode: '' }] };
    });
  };

  // Contact Persons handlers
  const handleContactChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => {
    const { name, value } = e.target;
    const field = name.split('.').pop();
    setFormData(prev => {
      const newContactPersons = prev.contactPersons.map((person, i) =>
        i === idx ? { ...person, [field!]: value } : person
      );
      return { ...prev, contactPersons: newContactPersons };
    });
  };

  const handleAddContact = () => {
    setFormData(prev => ({
      ...prev,
      contactPersons: [
        ...prev.contactPersons,
        { name: '', email: '', phone: '', designation: '' }
      ]
    }));
  };

  const handleRemoveContact = (idx: number) => {
    setFormData(prev => {
      const newContactPersons = prev.contactPersons.filter((_, i) => i !== idx);
      return { ...prev, contactPersons: newContactPersons };
    });
  };

  // Bank Details handlers
  const handleBankChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => {
    const { name, value } = e.target;
    const field = name.split('.').pop();
    setFormData(prev => {
      const newBankDetails = prev.bankDetails.map((bank, i) =>
        i === idx ? { ...bank, [field!]: value } : bank
      );
      return { ...prev, bankDetails: newBankDetails };
    });
  };

  const handleBankPrimaryChange = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
    const checked = e.target.checked;
    setFormData(prev => {
      const newBankDetails = prev.bankDetails.map((bank, i) =>
        i === idx ? { ...bank, isPrimary: checked } : { ...bank, isPrimary: false }
      );
      return { ...prev, bankDetails: newBankDetails };
    });
  };

  const handleAddBank = () => {
    setFormData(prev => ({
      ...prev,
      bankDetails: [
        ...prev.bankDetails,
        { accountName: '', accountNumber: '', bankName: '', branch: '', ifscCode: '', isPrimary: prev.bankDetails.length === 0 }
      ]
    }));
  };

  const handleRemoveBank = (idx: number) => {
    setFormData(prev => {
      const newBankDetails = prev.bankDetails.filter((_, i) => i !== idx);
      // If the removed bank was primary, set the first one as primary
      if (!newBankDetails.some(b => b.isPrimary) && newBankDetails.length > 0) {
        newBankDetails[0].isPrimary = true;
      }
      return { ...prev, bankDetails: newBankDetails };
    });
  };

  // Helper function to render form fields
  const renderTextField = (
    name: string,
    label: string,
    required = false,
    type = 'text',
    fullWidth = true
  ) => (
    <TextField
      fullWidth={fullWidth}
      label={label}
      name={name}
      value={formData[name as keyof SupplierFormData] || ''}
      onChange={handleChange}
      required={required}
      type={type}
      error={!!errors[name]}
      helperText={errors[name]}
      disabled={isSubmitting}
      sx={{ mb: 2 }}
      variant="outlined"
      size="small"
    />
  );
  


  return (
    <Container maxWidth="lg">
      <>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4">{title}</Typography>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<ArrowBackIcon />}
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Back
          </Button>
        </Box>

        {Object.values(errors).length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Alert severity="error">
              {Object.values(errors).map((msg, idx) => (
                <div key={idx}>{msg}</div>
              ))}
            </Alert>
          </Box>
        )}

        <Card>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Basic Information */}
                <Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
                  {renderTextField('name', 'Name', true)}
                  {renderTextField('code', 'Code', true)}
                  {renderTextField('gstin', 'GSTIN')}
                  {renderTextField('pan', 'PAN')}
                </Box>
                <Divider sx={{ my: 2 }} />
                {/* Contact Persons (first always shown, add for more) */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Contact Persons
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  {formData.contactPersons.length === 0 ? (
                    <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                          label="Name"
                          name="contactPersons.0.name"
                          value=""
                          onChange={e => handleContactChange(e, 0)}
                          fullWidth
                          size="small"
                        />
                        <TextField
                          label="Email"
                          name="contactPersons.0.email"
                          value=""
                          onChange={e => handleContactChange(e, 0)}
                          fullWidth
                          size="small"
                        />
                        <TextField
                          label="Phone"
                          name="contactPersons.0.phone"
                          value=""
                          onChange={e => handleContactChange(e, 0)}
                          fullWidth
                          size="small"
                        />
                        <TextField
                          label="Designation"
                          name="contactPersons.0.designation"
                          value=""
                          onChange={e => handleContactChange(e, 0)}
                          fullWidth
                          size="small"
                        />
                      </Box>
                    </Card>
                  ) : (
                    formData.contactPersons.map((person, idx) => (
                      <Card key={idx} variant="outlined" sx={{ mb: 2, p: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <TextField
                            label="Name"
                            name={`contactPersons.${idx}.name`}
                            value={person.name}
                            onChange={e => handleContactChange(e, idx)}
                            fullWidth
                            size="small"
                          />
                          <TextField
                            label="Email"
                            name={`contactPersons.${idx}.email`}
                            value={person.email}
                            onChange={e => handleContactChange(e, idx)}
                            fullWidth
                            size="small"
                          />
                          <TextField
                            label="Phone"
                            name={`contactPersons.${idx}.phone`}
                            value={person.phone}
                            onChange={e => handleContactChange(e, idx)}
                            fullWidth
                            size="small"
                          />
                          <TextField
                            label="Designation"
                            name={`contactPersons.${idx}.designation`}
                            value={person.designation}
                            onChange={e => handleContactChange(e, idx)}
                            fullWidth
                            size="small"
                          />
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            sx={{ mt: 1 }}
                            onClick={() => handleRemoveContact(idx)}
                            disabled={isSubmitting || formData.contactPersons.length === 1}
                          >
                            Remove
                          </Button>
                        </Box>
                      </Card>
                    ))
                  )}
                  {formData.contactPersons.length > 0 && (
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={handleAddContact}
                      disabled={isSubmitting}
                    >
                      Add Contact Person
                    </Button>
                  )}
                </Box>

                {/* Address (Multiple) */}
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Address
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  {formData.address.map((addr, idx) => (
                    <Card key={idx} variant="outlined" sx={{ mb: 2, p: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                          label="Address Line 1"
                          name={`address.${idx}.line1`}
                          value={addr.line1}
                          onChange={e => handleAddressChange(e, idx)}
                          fullWidth
                          size="small"
                          sx={{ mb: 1 }}
                        />
                        <TextField
                          label="Address Line 2"
                          name={`address.${idx}.line2`}
                          value={addr.line2}
                          onChange={e => handleAddressChange(e, idx)}
                          fullWidth
                          size="small"
                          sx={{ mb: 1 }}
                        />
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
                          <TextField
                            label="City"
                            name={`address.${idx}.city`}
                            value={addr.city}
                            onChange={e => handleAddressChange(e, idx)}
                            fullWidth
                            size="small"
                          />
                          <TextField
                            label="State"
                            name={`address.${idx}.state`}
                            value={addr.state}
                            onChange={e => handleAddressChange(e, idx)}
                            fullWidth
                            size="small"
                          />
                          <TextField
                            label="Country"
                            name={`address.${idx}.country`}
                            value={addr.country}
                            onChange={e => handleAddressChange(e, idx)}
                            fullWidth
                            size="small"
                          />
                          <TextField
                            label="Postal Code"
                            name={`address.${idx}.postalCode`}
                            value={addr.postalCode}
                            onChange={e => handleAddressChange(e, idx)}
                            fullWidth
                            size="small"
                          />
                        </Box>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          sx={{ mt: 1 }}
                          onClick={() => handleRemoveAddress(idx)}
                          disabled={isSubmitting || formData.address.length === 1}
                        >
                          Remove
                        </Button>
                      </Box>
                    </Card>
                  ))}
                  <Button
                    variant="contained"
                    color="secondary"
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={handleAddAddress}
                    disabled={isSubmitting}
                  >
                    Add Address
                  </Button>
                </Box>

                {/* Bank Details (first always shown, add for more) */}
                <Box sx={{ mt: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Bank Details
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  {formData.bankDetails.length === 0 ? (
                    <Card variant="outlined" sx={{ mb: 2, p: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                          label="Account Name"
                          name="bankDetails.0.accountName"
                          value=""
                          onChange={e => handleBankChange(e, 0)}
                          fullWidth
                          size="small"
                        />
                        <TextField
                          label="Account Number"
                          name="bankDetails.0.accountNumber"
                          value=""
                          onChange={e => handleBankChange(e, 0)}
                          fullWidth
                          size="small"
                        />
                        <TextField
                          label="Bank Name"
                          name="bankDetails.0.bankName"
                          value=""
                          onChange={e => handleBankChange(e, 0)}
                          fullWidth
                          size="small"
                        />
                        <TextField
                          label="Branch"
                          name="bankDetails.0.branch"
                          value=""
                          onChange={e => handleBankChange(e, 0)}
                          fullWidth
                          size="small"
                        />
                        <TextField
                          label="IFSC Code"
                          name="bankDetails.0.ifscCode"
                          value=""
                          onChange={e => handleBankChange(e, 0)}
                          fullWidth
                          size="small"
                        />
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <input
                            type="checkbox"
                            checked={false}
                            onChange={e => handleBankPrimaryChange(e, 0)}
                            style={{ marginRight: 8 }}
                          />
                          <Typography variant="body2">Primary Account</Typography>
                        </Box>
                      </Box>
                    </Card>
                  ) : (
                    formData.bankDetails.map((bank, idx) => (
                      <Card key={idx} variant="outlined" sx={{ mb: 2, p: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <TextField
                            label="Account Name"
                            name={`bankDetails.${idx}.accountName`}
                            value={bank.accountName}
                            onChange={e => handleBankChange(e, idx)}
                            fullWidth
                            size="small"
                          />
                          <TextField
                            label="Account Number"
                            name={`bankDetails.${idx}.accountNumber`}
                            value={bank.accountNumber}
                            onChange={e => handleBankChange(e, idx)}
                            fullWidth
                            size="small"
                          />
                          <TextField
                            label="Bank Name"
                            name={`bankDetails.${idx}.bankName`}
                            value={bank.bankName}
                            onChange={e => handleBankChange(e, idx)}
                            fullWidth
                            size="small"
                          />
                          <TextField
                            label="Branch"
                            name={`bankDetails.${idx}.branch`}
                            value={bank.branch}
                            onChange={e => handleBankChange(e, idx)}
                            fullWidth
                            size="small"
                          />
                          <TextField
                            label="IFSC Code"
                            name={`bankDetails.${idx}.ifscCode`}
                            value={bank.ifscCode}
                            onChange={e => handleBankChange(e, idx)}
                            fullWidth
                            size="small"
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <input
                              type="checkbox"
                              checked={bank.isPrimary}
                              onChange={e => handleBankPrimaryChange(e, idx)}
                              style={{ marginRight: 8 }}
                            />
                            <Typography variant="body2">Primary Account</Typography>
                          </Box>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            sx={{ mt: 1 }}
                            onClick={() => handleRemoveBank(idx)}
                            disabled={isSubmitting || formData.bankDetails.length === 1}
                          >
                            Remove
                          </Button>
                        </Box>
                      </Card>
                    ))
                  )}
                  {formData.bankDetails.length > 0 && (
                    <Button
                      variant="contained"
                      color="secondary"
                      size="small"
                      sx={{ mt: 1 }}
                      onClick={handleAddBank}
                      disabled={isSubmitting}
                    >
                      Add Bank Account
                    </Button>
                  )}
                </Box>

                {/* Submit Button */}
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={onCancel}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : <SaveIcon />}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : submitButtonText}
                  </Button>
                </Box>
              </Box> {/* close main form Box */}
            </Box>
          </form>
        </CardContent>
      </Card>
    </>
  </Container>
);

}

export default SupplierForm;
