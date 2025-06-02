export type VehicleArrivalStatus = 'pending' | 'arrived' | 'unloading' | 'completed' | 'cancelled';

export interface VehicleArrival {
  id: string;
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  supplier: string;
  supplierReference?: string;
  estimatedArrival: Date;
  actualArrival?: Date;
  status: VehicleArrivalStatus;
  items: VehicleItem[];
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
}

export interface VehicleItem {
  id: string;
  purchaseOrderId: string;
  itemName: string;
  productCategory?: string;
  skus: {
    sku: string;
    quantity: number;
    unit: string;
    unitWt?: number;
    totalWt?: number;
  }[];
  // Optional top-level quantity and unit for form compatibility
  quantity?: number;
  unit?: string;
  receivedQuantity?: number;
  status: 'pending' | 'partially_received' | 'received' | 'rejected';
  notes?: string;
}

export type VehicleArrivalStage = 'in_transit' | 'arrived' | 'unloading' | 'unloaded' | 'returned' | 'cancelled';

export interface VehicleArrivalFormData {
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  supplier: string;
  supplierReference?: string;
  estimatedArrival: Date;
  items: Omit<VehicleItem, 'id' | 'status' | 'receivedQuantity'>[];
  status: VehicleArrivalStage;
  notes?: string;
  supplierAddress?: string; // stringified SupplierAddress JSON
}
