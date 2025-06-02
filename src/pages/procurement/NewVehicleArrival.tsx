import { useEffect, useState } from 'react';
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
  Autocomplete,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { GridContainer, GridItem } from '../../components/CustomGrid';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { createVehicleArrival } from '../../services/vehicleArrivalService';
import { supplierService } from '../../services/supplierService';
import type { VehicleArrivalFormData } from '../../types/vehicleArrival';
import type { Supplier } from '../../types/supplier';
import { productCategories } from './productsData';
import type { ProductCategory } from './productsData';

const ARRIVAL_STAGES = [
  { label: 'In Transit', value: 'in_transit' },
  { label: 'Arrived', value: 'arrived' },
  { label: 'Unloading', value: 'unloading' },
  { label: 'Unloaded', value: 'unloaded' },
];

const NewVehicleArrival = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<VehicleArrivalFormData>({
    vehicleNumber: '',
    driverName: '',
    driverPhone: '',
    supplier: '',
    supplierAddress: '',
    estimatedArrival: new Date(),
    items: [
      {
        productCategory: '',
        itemName: '',
        skus: [
          { sku: '', quantity: 1, unit: 'Box/Crate' }
        ],
        purchaseOrderId: ''
      },
    ],
    status: 'in_transit',
    notes: '',
  });
  const [supplierOptions, setSupplierOptions] = useState<Supplier[]>([]);

  useEffect(() => {
    supplierService.getSuppliers().then(suppliers => {
      setSupplierOptions(suppliers.filter(s => s.status === 'active'));
    });
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

  // For changing product-level fields (category, name)
  const handleItemChange = (
    index: number,
    field: keyof VehicleArrivalFormData['items'][0],
    value: any
  ) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };
    setFormData(prev => ({
      ...prev,
      items: updatedItems,
    }));
  };

  // For changing SKU-level fields
  const handleSkuChange = (
    productIndex: number,
    skuIndex: number,
    field: keyof VehicleArrivalFormData['items'][0]['skus'][0],
    value: any
  ) => {
    const updatedItems = [...formData.items];
    updatedItems[productIndex].skus[skuIndex] = {
      ...updatedItems[productIndex].skus[skuIndex],
      [field]: value,
    };
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  // Add a new product
  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          purchaseOrderId: '',
          productCategory: '',
          itemName: '',
          skus: [
            { sku: '', quantity: 1, unit: 'Box/Crate', unitWt: undefined, totalWt: undefined }
          ],
          
        },
      ]
    }));
  };

  // Add a new SKU to a product
  const addSku = (productIndex: number) => {
    const updatedItems = [...formData.items];
    updatedItems[productIndex].skus.push({ sku: '', quantity: 1, unit: 'Box/Crate', unitWt: undefined, totalWt: undefined });
    setFormData(prev => ({ ...prev, items: updatedItems }));
  };

  // Remove a SKU from a product
  const removeSku = (productIndex: number, skuIndex: number) => {
    const updatedItems = [...formData.items];
    updatedItems[productIndex].skus = updatedItems[productIndex].skus.filter((_, i) => i !== skuIndex);
    setFormData(prev => ({ ...prev, items: updatedItems }));
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

    // Validate products
    formData.items.forEach((item, index) => {
      if (!item.purchaseOrderId.trim()) {
        newErrors[`items[${index}].purchaseOrderId`] = 'PO Number is required';
      }
      if (!item.itemName.trim()) {
        newErrors[`items[${index}].itemName`] = 'Product name is required';
      }
      // SKU validation
      if (!item.skus || item.skus.length === 0 || !item.skus[0].sku) {
        newErrors[`items[${index}].skus`] = 'SKU is required';
      }
      if ((item.quantity ?? 0) <= 0) {
        newErrors[`items[${index}].quantity`] = 'Quantity must be greater than 0';
      }
      if (!item.unit || !item.unit.trim()) {
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
                <Autocomplete
                  fullWidth
                  freeSolo
                  options={supplierOptions}
                  inputValue={formData.supplier}
                  onInputChange={(
                    event: React.SyntheticEvent<Element, Event>,
                    newInputValue: string
                  ) => {
                    setFormData(prev => ({ ...prev, supplier: newInputValue, supplierAddress: '' }));
                  }}
                  onChange={(
                    event: React.SyntheticEvent<Element, Event>,
                    newValue: Supplier | string | null
                  ) => {
                    if (typeof newValue === 'string') {
                      setFormData(prev => ({ ...prev, supplier: newValue, supplierAddress: '' }));
                    } else if (newValue && typeof newValue === 'object') {
                      // Handle address auto-selection
                      let addresses = Array.isArray(newValue.address) ? newValue.address : [newValue.address];
                      let selectedAddress = '';
                      if (addresses.length === 1) {
                        selectedAddress = JSON.stringify(addresses[0]);
                      } else if (addresses.length > 1) {
                        // Prefer primary address if available, else first
                        const primary = addresses.find(addr => addr.isPrimary);
                        selectedAddress = JSON.stringify(primary || addresses[0]);
                      }
                      setFormData(prev => ({ ...prev, supplier: newValue.name, supplierAddress: selectedAddress }));
                    } else {
                      setFormData(prev => ({ ...prev, supplier: '', supplierAddress: '' }));
                    }
                  }}
                  getOptionLabel={(option: Supplier | string) =>
                    typeof option === 'string' ? option : option.name
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Supplier Name"
                      error={!!errors.supplier}
                      helperText={errors.supplier}
                      required
                    />
                  )}
                />
              </GridItem>

              {/* Supplier Address Dropdown */}
              <GridItem xs={12} md={6}>
                <FormControl fullWidth disabled={!supplierOptions.find(s => s.name === formData.supplier)}>
                  <InputLabel id="supplier-address-label">Supplier Address</InputLabel>
                  <Select
                    labelId="supplier-address-label"
                    label="Supplier Address"
                    value={formData.supplierAddress || ''}
                    onChange={e => setFormData(prev => ({ ...prev, supplierAddress: e.target.value }))}
                  >
                    {(() => {
                      const selectedSupplier = supplierOptions.find(s => s.name === formData.supplier);
                      if (!selectedSupplier) return null;
                      // If address is an array, map all; else, map the single address
                      const addresses = Array.isArray(selectedSupplier.address)
                        ? selectedSupplier.address
                        : [selectedSupplier.address];
                      return addresses.map((addr, idx) => (
                        <MenuItem key={idx} value={JSON.stringify(addr)}>
                          {`${addr.line1}, ${addr.line2 ? addr.line2 + ', ' : ''}${addr.city}, ${addr.state}, ${addr.country} - ${addr.postalCode}`}
                        </MenuItem>
                      ));
                    })()}
                  </Select>
                </FormControl>
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

              {/* Products */}
              <GridItem xs={12}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6">Products</Typography>
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addItem}
                  >
                    Add Product
                  </Button>
                </Box>
                <Divider sx={{ mb: 2 }} />

                {formData.items.map((item, productIndex) => (
                  <Box key={productIndex} sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="subtitle1">Product {productIndex + 1}</Typography>
                        {formData.items.length > 1 && (
                          <IconButton
                            color="error"
                            onClick={() => removeItem(productIndex)}
                            size="small"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                      <GridContainer style={{ margin: -8 }}>
                        <GridItem xs={12} md={3}>
                          <Autocomplete
                            fullWidth
                            options={productCategories.map((p: ProductCategory) => p.category)}
                            value={item.productCategory || ''}
                            onChange={(_, newValue) => handleItemChange(productIndex, 'productCategory', newValue || '')}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Product Category"
                                required
                              />
                            )}
                          />
                        </GridItem>
                        <GridItem xs={12} md={3}>
                          <Autocomplete
                            fullWidth
                            options={
                              (productCategories.find((cat: ProductCategory) => cat.category === item.productCategory)?.products || [])
                            }
                            getOptionLabel={(option) => typeof option === 'string' ? option : option.name}
                            value={
                              (productCategories.find((cat: ProductCategory) => cat.category === item.productCategory)?.products.find(p => p.name === item.itemName)) || null
                            }
                            onChange={(_, newValue) => handleItemChange(productIndex, 'itemName', newValue ? (typeof newValue === 'string' ? newValue : newValue.name) : '')}
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label="Product Name"
                                required
                                error={!!errors[`items[${productIndex}].itemName`]}
                                helperText={errors[`items[${productIndex}].itemName`] && errors[`items[${productIndex}].itemName`].replace('Item', 'Product')}
                              />
                            )}
                          />
                        </GridItem>
                      </GridContainer>
                      <Box mt={2}>
                        <Typography variant="subtitle2">SKUs</Typography>
                        {item.skus.map((skuObj, skuIndex) => (
                          <GridContainer key={skuIndex} style={{ margin: -8, marginBottom: 8 }}>
                            <GridItem xs={12} md={3}>
                              <Autocomplete
                                fullWidth
                                options={
                                  (
                                    productCategories
                                      .find((cat: ProductCategory) => cat.category === item.productCategory)?.products
                                      .find((p) => p.name === item.itemName)?.skus || []
                                  )
                                }
                                value={skuObj.sku || ''}
                                onChange={(_, newValue) => handleSkuChange(productIndex, skuIndex, 'sku', newValue || '')}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="SKU / Size"
                                    required
                                    error={!!errors[`items[${productIndex}].skus[${skuIndex}].sku`]}
                                    helperText={errors[`items[${productIndex}].skus[${skuIndex}].sku`]}
                                  />
                                )}
                              />
                            </GridItem>
                            <GridItem xs={12} md={2}>
                              <Autocomplete
                                fullWidth
                                options={['Box/Crate','kgs']}
                                value={skuObj.unit || ''}
                                onChange={(_, newValue) => handleSkuChange(productIndex, skuIndex, 'unit', newValue || '')}
                                renderInput={(params) => (
                                  <TextField
                                    {...params}
                                    label="Unit"
                                    required
                                    error={!!errors[`items[${productIndex}].skus[${skuIndex}].unit`]}
                                    helperText={errors[`items[${productIndex}].skus[${skuIndex}].unit`]}
                                  />
                                )}
                              />
                            </GridItem>
                            {/* Quantity always after Unit */}
                            {skuObj.unit === 'kgs' ? (
                              <>
                                <GridItem xs={12} md={2}>
                                  <TextField
                                    fullWidth
                                    type="number"
                                    label="Quantity (Kgs)"
                                    value={skuObj.quantity ?? ''}
                                    onChange={e => {
                                      handleSkuChange(productIndex, skuIndex, 'quantity', Number(e.target.value));
                                      handleSkuChange(productIndex, skuIndex, 'totalWt', Number(e.target.value)); // Keep totalWt in sync for kgs
                                    }}
                                    required
                                    inputProps={{ min: 0 }}
                                  />
                                </GridItem>
                                <GridItem xs={12} md={2}>
                                  <TextField
                                    fullWidth
                                    type="number"
                                    label="Total Wt (Kgs)"
                                    value={skuObj.quantity ?? ''}
                                    InputProps={{ readOnly: true }}
                                  />
                                </GridItem>
                              </>
                            ) : (
                              <GridItem xs={12} md={2}>
                                <TextField
                                  fullWidth
                                  type="number"
                                  label="Quantity"
                                  value={skuObj.quantity ?? ''}
                                  onChange={e => handleSkuChange(productIndex, skuIndex, 'quantity', Number(e.target.value))}
                                  required
                                  inputProps={{ min: 0 }}
                                />
                              </GridItem>
                            )}
                            {/* Unit-specific fields */}
                            {skuObj.unit === 'Box/Crate' && (
  <>
    <GridItem xs={12} md={2}>
      <TextField
        fullWidth
        type="number"
        label="Unit Wt"
        value={skuObj.unitWt ?? ''}
        onChange={e => handleSkuChange(productIndex, skuIndex, 'unitWt', Number(e.target.value))}
        required
        inputProps={{ min: 0 }}
      />
    </GridItem>
    <GridItem xs={12} md={2}>
      <TextField
        fullWidth
        type="number"
        label="Total Wt"
        value={skuObj.unitWt && skuObj.quantity ? skuObj.unitWt * skuObj.quantity : ''}
        InputProps={{ readOnly: true }}
      />
    </GridItem>
  </>
)}
                            
                            <GridItem xs={12} md={1}>
                              {item.skus.length > 1 && (
                                <IconButton color="error" onClick={() => removeSku(productIndex, skuIndex)} size="small">
                                  <DeleteIcon />
                                </IconButton>
                              )}
                            </GridItem>
                          </GridContainer>
                        ))}
                        <Button
                          variant="outlined"
                          startIcon={<AddIcon />}
                          onClick={() => addSku(productIndex)}
                          sx={{ mt: 1 }}
                        >
                          Add SKU
                        </Button>
                      </Box>
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

              {/* Arrival Stage Dropdown (Moved to Bottom) */}
              <GridItem xs={12} md={4}>
                <FormControl fullWidth required>
                  <InputLabel id="arrival-stage-label">Arrival Stage</InputLabel>
                  <Select
                    labelId="arrival-stage-label"
                    label="Arrival Stage"
                    value={formData.status || 'in_transit'}
                    onChange={e => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  >
                    {ARRIVAL_STAGES.map(stage => (
                      <MenuItem key={stage.value} value={stage.value}>{stage.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
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
