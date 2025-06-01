import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Page from '../../components/Page';
import { supplierService } from '../../services/supplierService';
import { SupplierForm } from '../../components/suppliers/SupplierForm';
import type { SupplierFormData } from '../../types/supplier';

const initialFormData: SupplierFormData = {
  name: '',
  code: '',
  gstin: '',
  pan: '',
  email: '',
  phone: '',
  address: [{
    line1: '',
    line2: '',
    city: '',
    state: '',
    country: 'India',
    postalCode: ''
  }],
  contactPersons: [],
  bankDetails: [],
  status: 'active',
  paymentTerms: '',
  creditLimit: 0,
  notes: ''
};

const AddSupplier = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: SupplierFormData) => {
    setIsSubmitting(true);
    
    try {
      await supplierService.createSupplier(formData);
      navigate('/suppliers');
    } catch (err) {
      console.error('Failed to create supplier:', err);
      throw err; // Let the form handle the error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Page title="Add Supplier">
      <SupplierForm
        initialData={initialFormData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        title="Add Supplier"
        submitButtonText="Create Supplier"
        onCancel={() => navigate('/suppliers')}
      />
    </Page>
  );
};

export default AddSupplier;
