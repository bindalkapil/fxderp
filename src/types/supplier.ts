export interface SupplierAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
}

export interface ContactPerson {
  name: string;
  email: string;
  phone: string;
  designation?: string;
}

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  bankName: string;
  branch: string;
  ifscCode: string;
  isPrimary: boolean;
}

export type SupplierStatus = 'active' | 'inactive' | 'suspended';

export interface Supplier {
  id: string;
  name: string;
  code: string;
  gstin?: string;
  pan?: string;
  email?: string;
  phone: string;
  address: SupplierAddress;
  contactPersons: ContactPerson[];
  bankDetails: BankDetails[];
  paymentTerms?: string;
  creditLimit?: number;
  status: SupplierStatus;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface SupplierFormData {
  name: string;
  code: string;
  gstin?: string;
  pan?: string;
  email?: string;
  phone: string;
  address: Omit<SupplierAddress, 'id'>;
  contactPersons: Omit<ContactPerson, 'id'>[];
  bankDetails: Omit<BankDetails, 'id'>[];
  paymentTerms: string;
  creditLimit?: number;
  status: 'active' | 'inactive' | 'suspended';
  notes?: string;
}
