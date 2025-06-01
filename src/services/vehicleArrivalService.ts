import type { VehicleArrival, VehicleArrivalFormData, VehicleItem } from '../types/vehicleArrival';

// Mock data
const mockVehicleArrivals: VehicleArrival[] = [
  {
    id: '1',
    vehicleNumber: 'KA01AB1234',
    driverName: 'Rajesh Kumar',
    driverPhone: '9876543210',
    supplier: 'ABC Suppliers',
    supplierReference: 'PO-2023-001',
    estimatedArrival: new Date('2023-12-01T10:00:00'),
    status: 'completed',
    items: [
      {
        id: '1-1',
        purchaseOrderId: 'PO-2023-001-1',
        itemName: 'Steel Rods',
        quantity: 100,
        receivedQuantity: 100,
        unit: 'pieces',
        status: 'received',
      },
    ],
    createdAt: new Date('2023-11-30T14:30:00'),
    updatedAt: new Date('2023-12-01T11:30:00'),
  },
  {
    id: '2',
    vehicleNumber: 'KA02CD5678',
    driverName: 'Suresh Patel',
    driverPhone: '8765432109',
    supplier: 'XYZ Traders',
    estimatedArrival: new Date('2023-12-02T14:00:00'),
    status: 'pending',
    items: [
      {
        id: '2-1',
        purchaseOrderId: 'PO-2023-002-1',
        itemName: 'Cement Bags',
        quantity: 200,
        receivedQuantity: 0,
        unit: 'bags',
        status: 'pending',
      },
    ],
    createdAt: new Date('2023-12-01T16:45:00'),
    updatedAt: new Date('2023-12-01T16:45:00'),
  },
];

// Simulate API calls with timeouts
const simulateApiCall = <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};


export const getVehicleArrivals = async (): Promise<VehicleArrival[]> => {
  console.log('getVehicleArrivals called');
  try {
    const result = await simulateApiCall([...mockVehicleArrivals]);
    console.log('getVehicleArrivals result:', result);
    return result;
  } catch (error) {
    console.error('Error in getVehicleArrivals:', error);
    throw error;
  }
};

export const getVehicleArrivalById = async (id: string): Promise<VehicleArrival | undefined> => {
  const arrival = mockVehicleArrivals.find((arrival) => arrival.id === id);
  return simulateApiCall(arrival ? { ...arrival } : undefined);
};

export const createVehicleArrival = async (data: VehicleArrivalFormData): Promise<VehicleArrival> => {
  const newArrival: VehicleArrival = {
    ...data,
    id: Math.random().toString(36).substr(2, 9),
    status: 'pending',
    items: data.items.map((item) => ({
      ...item,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending' as const,
      receivedQuantity: 0,
    })),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  mockVehicleArrivals.push(newArrival);
  return simulateApiCall({ ...newArrival });
};

export const updateVehicleArrivalStatus = async (
  id: string, 
  status: VehicleArrival['status']
): Promise<VehicleArrival | undefined> => {
  const index = mockVehicleArrivals.findIndex((arrival) => arrival.id === id);
  if (index === -1) return undefined;
  
  const updatedArrival = {
    ...mockVehicleArrivals[index],
    status,
    updatedAt: new Date(),
  };
  
  if (status === 'arrived' && !updatedArrival.actualArrival) {
    updatedArrival.actualArrival = new Date();
  }
  
  mockVehicleArrivals[index] = updatedArrival;
  return simulateApiCall({ ...updatedArrival });
};

export const updateReceivedItems = async (
  arrivalId: string,
  updates: Array<{ itemId: string; receivedQuantity: number; status: VehicleItem['status']; notes?: string }>
): Promise<VehicleArrival | undefined> => {
  const index = mockVehicleArrivals.findIndex((arrival) => arrival.id === arrivalId);
  if (index === -1) return undefined;
  
  const updatedItems = mockVehicleArrivals[index].items.map((item) => {
    const update = updates.find((u) => u.itemId === item.id);
    if (!update) return item;
    
    return {
      ...item,
      receivedQuantity: update.receivedQuantity,
      status: update.status,
      notes: update.notes || item.notes,
    };
  });
  
  const allItemsReceived = updatedItems.every(
    (item) => item.status === 'received' || item.status === 'rejected'
  );
  
  const updatedArrival: VehicleArrival = {
    ...mockVehicleArrivals[index],
    items: updatedItems,
    status: allItemsReceived ? 'completed' : 'unloading',
    updatedAt: new Date(),
  };
  
  mockVehicleArrivals[index] = updatedArrival;
  return simulateApiCall({ ...updatedArrival });
};
