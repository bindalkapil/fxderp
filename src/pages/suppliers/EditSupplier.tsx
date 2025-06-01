import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, CircularProgress, Alert } from '@mui/material';
import type { Supplier, SupplierFormData } from '../../types/supplier';
import { supplierService } from '../../services/supplierService';
import { SupplierForm } from '../../components/suppliers/SupplierForm';

const EditSupplier = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      navigate('/suppliers');
      return;
    }
    const fetchSupplier = async () => {
      try {
        const data = await supplierService.getSupplier(id);
        setSupplier(data);
      } catch (err) {
        setError('Failed to load supplier');
      } finally {
        setLoading(false);
      }
    };
    fetchSupplier();
  }, [id, navigate]);

  const handleSubmit = async (data: SupplierFormData) => {
    if (!id) return;
    try {
      await supplierService.updateSupplier(id, data);
      navigate('/suppliers');
    } catch (err) {
      setError('Failed to update supplier');
    }
  };

  if (loading) return <Box sx={{ p: 3 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ p: 3 }}><Alert severity="error">{error}</Alert></Box>;
  if (!supplier) return <Box sx={{ p: 3 }}>Supplier not found</Box>;

  // Ensure we pass a valid SupplierFormData object
  const initialData: SupplierFormData = {
    name: supplier.name || '',
    code: supplier.code || '',
    gstin: supplier.gstin,
    pan: supplier.pan,
    email: supplier.email,
    phone: supplier.phone,
    address: Array.isArray(supplier.address) ? supplier.address : [supplier.address],
    contactPersons: supplier.contactPersons || [],
    bankDetails: supplier.bankDetails || [],
    paymentTerms: supplier.paymentTerms ?? '',
    creditLimit: supplier.creditLimit,
    status: supplier.status ?? 'active',
    notes: supplier.notes,
  };

  return (
    <Box sx={{ p: 3 }}>
      <SupplierForm
        title="Edit Supplier"
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/suppliers')}
        isSubmitting={false}
        submitButtonText="Update Supplier"
      />
    </Box>
  );
};

export default EditSupplier;
