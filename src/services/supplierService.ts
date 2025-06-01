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
    name: 'ABC Electronics',
    code: 'SUP-001',
    gstin: '22AAAAA0000A1Z5',
    pan: 'AAAAA1234A',
    email: 'contact@abcelectronics.com',
    phone: '+919876543210',
    address: {
      line1: '123 Tech Park',
      line2: 'Sector 62',
      city: 'Noida',
      state: 'Uttar Pradesh',
      country: 'India',
      postalCode: '201309'
    },
    contactPersons: [
      {
        name: 'Rahul Sharma',
        email: 'rahul@abcelectronics.com',
        phone: '+919876543211',
        designation: 'Sales Manager'
      }
    ],
    bankDetails: [
      {
        accountName: 'ABC Electronics',
        accountNumber: '1234567890',
        bankName: 'HDFC Bank',
        branch: 'Noida Sector 62',
        ifscCode: 'HDFC0001234',
        isPrimary: true
      }
    ],
    paymentTerms: '30 Days',
    creditLimit: 500000,
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-06-01'),
    notes: 'Reliable supplier with good quality products'
  },
  {
    id: '2',
    name: 'XYZ Components',
    code: 'SUP-002',
    gstin: '27BBBBB0000B2Z6',
    pan: 'BBBBB5678B',
    email: 'info@xyzcomponents.com',
    phone: '+919876543212',
    address: {
      line1: '456 Industrial Area',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      postalCode: '560068'
    },
    contactPersons: [
      {
        name: 'Priya Patel',
        email: 'priya@xyzcomponents.com',
        phone: '+919876543213',
        designation: 'Account Manager'
      }
    ],
    bankDetails: [
      {
        accountName: 'XYZ Components',
        accountNumber: '9876543210',
        bankName: 'ICICI Bank',
        branch: 'Koramangala',
        ifscCode: 'ICIC0001234',
        isPrimary: true
      }
    ],
    paymentTerms: '15 Days',
    creditLimit: 300000,
    status: 'active',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-05-25')
  },
  {
    id: '3',
    name: 'Global Hardware Solutions',
    code: 'SUP-003',
    gstin: '29CCCCC0000C3Z7',
    pan: 'CCCCC9012C',
    phone: '+919876543214',
    address: {
      line1: '789 Trade Center',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      postalCode: '400001'
    },
    contactPersons: [
      {
        name: 'Amit Kumar',
        email: 'amit@globalhardware.com',
        phone: '+919876543215',
        designation: 'Director'
      }
    ],
    bankDetails: [
      {
        accountName: 'Global Hardware Solutions',
        accountNumber: '4567890123',
        bankName: 'SBI',
        branch: 'Nariman Point',
        ifscCode: 'SBIN0001234',
        isPrimary: true
      }
    ],
    status: 'inactive',
    createdAt: new Date('2023-11-10'),
    updatedAt: new Date('2024-05-15')
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
