import type { Supplier, SupplierFormData } from '../types/supplier';

// Define process.env types for TypeScript
declare const process: {
  env: {
    NODE_ENV: 'development' | 'production' | 'test';
  };
};

// Mock data for development
const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'ABC Suppliers',
    code: 'SUP-001',
    gstin: '22ABCDE1234F1Z5',
    pan: 'ABCDE1234F',
    email: 'contact@abcsuppliers.com',
    phone: '+919876543210',
    address: {
      line1: '123 Industrial Area',
      line2: 'Phase 2',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400001'
    },
    contactPersons: [
      {
        name: 'Rajesh Kumar',
        email: 'rajesh@abcsuppliers.com',
        phone: '+919876543211',
        designation: 'Sales Manager'
      }
    ],
    bankDetails: [
      {
        accountName: 'ABC Suppliers',
        accountNumber: '1234567890',
        bankName: 'State Bank of India',
        branch: 'Nariman Point',
        ifscCode: 'SBIN0001234',
        isPrimary: true
      }
    ],
    paymentTerms: 'Net 30',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const API_BASE_URL = '/api/suppliers';

// Check if we're in development mode and should use mock data
const useMock = import.meta.env.DEV;

// Helper function to handle responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

export const supplierService = {
  // Get all suppliers
  async getSuppliers(): Promise<Supplier[]> {
    if (useMock) {
      return new Promise(resolve => setTimeout(() => resolve(mockSuppliers), 500));
    }

    const response = await fetch(API_BASE_URL);
    return handleResponse(response);
  },

  // Get a single supplier by ID
  async getSupplier(id: string): Promise<Supplier> {
    if (useMock) {
      const supplier = mockSuppliers.find(s => s.id === id);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (supplier) resolve(supplier);
          else reject(new Error('Supplier not found'));
        }, 500);
      });
    }

    const response = await fetch(`${API_BASE_URL}/${id}`);
    return handleResponse(response);
  },

  // Create a new supplier
  async createSupplier(data: SupplierFormData): Promise<Supplier> {
    if (useMock) {
      const newSupplier: Supplier = {
        ...data,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        updatedAt: new Date(),
        contactPersons: data.contactPersons || [],
        bankDetails: data.bankDetails || []
      };
      mockSuppliers.push(newSupplier);
      return new Promise(resolve => setTimeout(() => resolve(newSupplier), 500));
    }

    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Update an existing supplier
  async updateSupplier(id: string, data: Partial<SupplierFormData>): Promise<Supplier> {
    if (useMock) {
      const index = mockSuppliers.findIndex(s => s.id === id);
      if (index === -1) {
        return Promise.reject(new Error('Supplier not found'));
      }
      
      const updatedSupplier = {
        ...mockSuppliers[index],
        ...data,
        updatedAt: new Date(),
      };
      
      mockSuppliers[index] = updatedSupplier;
      return new Promise(resolve => setTimeout(() => resolve(updatedSupplier), 500));
    }

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  // Delete a supplier
  async deleteSupplier(id: string): Promise<void> {
    if (useMock) {
      const index = mockSuppliers.findIndex(s => s.id === id);
      if (index !== -1) {
        mockSuppliers.splice(index, 1);
      }
      return new Promise(resolve => setTimeout(resolve, 500));
    }

    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  }
};
