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
  quantity: number;
  unit: string;
  receivedQuantity?: number;
  status: 'pending' | 'partially_received' | 'received' | 'rejected';
  notes?: string;
}

export interface VehicleArrivalFormData {
  vehicleNumber: string;
  driverName: string;
  driverPhone: string;
  supplier: string;
  supplierReference?: string;
  estimatedArrival: Date;
  items: Omit<VehicleItem, 'id' | 'status' | 'receivedQuantity'>[];
  notes?: string;
}
