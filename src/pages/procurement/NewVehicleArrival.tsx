import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  MenuItem,
  IconButton,
  Divider,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { GridContainer, GridItem } from '../../components/CustomGrid';


import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { createVehicleArrival } from '../../services/vehicleArrivalService';
import type { VehicleArrivalFormData } from '../../types/vehicleArrival';

const NewVehicleArrival = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<VehicleArrivalFormData>({
    vehicleNumber: '',
    driverName: '',
    driverPhone: '',
    supplier: '',
    supplierReference: '',
    estimatedArrival: new Date(),
    items: [
      { purchaseOrderId: '', itemName: '', quantity: 1, unit: 'pieces' }
    ],
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateTimeChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        estimatedArrival: date
      }));
    }
  };

  const handleItemChange = (index: number, field: keyof VehicleArrivalFormData['items'][0], value: string | number) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [
        ...prev.items,
        { purchaseOrderId: '', itemName: '', quantity: 1, unit: 'pieces' }
      ]
    }));
  };

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const updatedItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        items: updatedItems
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.vehicleNumber.trim()) {
      newErrors.vehicleNumber = 'Vehicle number is required';
    }
    if (!formData.driverName.trim()) {
      newErrors.driverName = 'Driver name is required';
    }
    if (!formData.driverPhone.trim()) {
      newErrors.driverPhone = 'Driver phone is required';
    } else if (!/^\d{10}$/.test(formData.driverPhone)) {
      newErrors.driverPhone = 'Please enter a valid 10-digit phone number';
    }
    if (!formData.supplier.trim()) {
      newErrors.supplier = 'Supplier is required';
    }
    if (!formData.estimatedArrival) {
      newErrors.estimatedArrival = 'Estimated arrival time is required';
    }

    // Validate items
    formData.items.forEach((item, index) => {
      if (!item.purchaseOrderId.trim()) {
        newErrors[`items[${index}].purchaseOrderId`] = 'PO Number is required';
      }
      if (!item.itemName.trim()) {
        newErrors[`items[${index}].itemName`] = 'Item name is required';
      }
      if (item.quantity <= 0) {
        newErrors[`items[${index}].quantity`] = 'Quantity must be greater than 0';
      }
      if (!item.unit.trim()) {
        newErrors[`items[${index}].unit`] = 'Unit is required';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await createVehicleArrival(formData);
      navigate('/procurement/vehicle-arrivals');
    } catch (error) {
      console.error('Error creating vehicle arrival:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            New Vehicle Arrival
          </Typography>
          
          <form onSubmit={handleSubmit}>
            <GridContainer style={{ margin: -12 }}>
              {/* Vehicle Information */}
              <GridItem xs={12}>
                <Typography variant="h6" gutterBottom>
                  Vehicle Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </GridItem>

              <GridItem xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Vehicle Number"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
                  onChange={handleInputChange}
                  error={!!errors.vehicleNumber}
                  helperText={errors.vehicleNumber}
                  required
                />
              </GridItem>

              <GridItem xs={12} md={6}>
                <DateTimePicker
                  label="Estimated Arrival Date & Time"
                  value={formData.estimatedArrival}
                  onChange={handleDateTimeChange}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: !!errors.estimatedArrival,
                      helperText: errors.estimatedArrival,
                      required: true
                    }
                  }}
                />
              </GridItem>

              {/* Driver Information */}
              <GridItem xs={12}>
                <Typography variant="h6" gutterBottom>
                  Driver Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </GridItem>

              <GridItem xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Driver Name"
                  name="driverName"
                  value={formData.driverName}
                  onChange={handleInputChange}
                  error={!!errors.driverName}
                  helperText={errors.driverName}
                  required
                />
              </GridItem>

              <GridItem xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Driver Phone"
                  name="driverPhone"
                  value={formData.driverPhone}
                  onChange={handleInputChange}
                  error={!!errors.driverPhone}
                  helperText={errors.driverPhone || '10-digit mobile number'}
                  required
                />
              </GridItem>

              {/* Supplier Information */}
              <GridItem xs={12}>
                <Typography variant="h6" gutterBottom>
                  Supplier Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </GridItem>

              <GridItem xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Supplier Name"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  error={!!errors.supplier}
                  helperText={errors.supplier}
                  required
                />
              </GridItem>

              <GridItem xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Supplier Reference (Optional)"
                  name="supplierReference"
                  value={formData.supplierReference || ''}
                  onChange={handleInputChange}
                />
              </GridItem>

              {/* Items */}
              <GridItem xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">Items</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addItem}
                  >
                    Add Item
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />

                {formData.items.map((item, index) => (
                  <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1">Item {index + 1}</Typography>
                        {formData.items.length > 1 && (
                          <IconButton
                            color="error"
                            onClick={() => removeItem(index)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>


                      <GridContainer style={{ margin: -8 }}>
                        <GridItem xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="PO Number"
                            value={item.purchaseOrderId}
                            onChange={(e) => handleItemChange(index, 'purchaseOrderId', e.target.value)}
                            error={!!errors[`items[${index}].purchaseOrderId`]}
                            helperText={errors[`items[${index}].purchaseOrderId`]}
                            required
                          />
                        </GridItem>

                        <GridItem xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Item Name"
                            value={item.itemName}
                            onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                            error={!!errors[`items[${index}].itemName`]}
                            helperText={errors[`items[${index}].itemName`]}
                            required
                          />
                        </GridItem>

                        <GridItem xs={6} md={3}>
                          <TextField
                            fullWidth
                            type="number"
                            label="Quantity"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                            error={!!errors[`items[${index}].quantity`]}
                            helperText={errors[`items[${index}].quantity`]}
                            required
                            inputProps={{
                              min: 0.01,
                              step: 0.01
                            }}
                          />
                        </GridItem>

                        <GridItem xs={6} md={3}>
                          <FormControl fullWidth>
                            <InputLabel id={`unit-label-${index}`}>Unit</InputLabel>
                            <Select
                              labelId={`unit-label-${index}`}
                              value={item.unit}
                              label="Unit"
                              onChange={(e) => handleItemChange(index, 'unit', e.target.value)}
                              error={!!errors[`items[${index}].unit`]}
                              required
                            >
                              <MenuItem value="pieces">Pieces</MenuItem>
                              <MenuItem value="kg">Kilograms</MenuItem>
                              <MenuItem value="g">Grams</MenuItem>
                              <MenuItem value="l">Liters</MenuItem>
                              <MenuItem value="ml">Milliliters</MenuItem>
                              <MenuItem value="m">Meters</MenuItem>
                              <MenuItem value="cm">Centimeters</MenuItem>
                              <MenuItem value="boxes">Boxes</MenuItem>
                              <MenuItem value="packs">Packs</MenuItem>
                              <MenuItem value="units">Units</MenuItem>
                            </Select>
                          </FormControl>
                        </GridItem>
                      </GridContainer>
                    </Box>
                  </Box>
                ))}
              </GridItem>

              {/* Notes */}
              <GridItem xs={12}>
                <TextField
                  fullWidth
                  label="Additional Notes (Optional)"
                  name="notes"
                  value={formData.notes || ''}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                />
              </GridItem>

              {/* Form Actions */}
              <GridItem xs={12}>
                <Box display="flex" justifyContent="flex-end" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={() => navigate('/procurement/vehicle-arrival')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Create Arrival
                  </Button>
                </Box>
              </GridItem>
            </GridContainer>
          </form>
        </Paper>
      </Box>
    </LocalizationProvider>
  );
};

export default NewVehicleArrival;
