import type { VehicleArrival, VehicleArrivalFormData, VehicleItem } from '../types/vehicleArrival';

// Mock data
const mockVehicleArrivals: VehicleArrival[] = [
  // COMPLETED (already present)
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
        productCategory: 'Pomegranate',
        itemName: 'POMO-MH',
        skus: [
          { sku: 'A3', quantity: 50, unit: 'Box/Crate', unitWt: 5, totalWt: 250 },
          { sku: 'A2', quantity: 30, unit: 'Box/Crate', unitWt: 5, totalWt: 150 },
          { sku: 'Loose', quantity: 20, unit: 'Kg', totalWt: 20 }
        ],
        quantity: 100,
        unit: 'Box/Crate',
        receivedQuantity: 100,
        status: 'received',
        notes: 'All items received in good condition.'
      },
      {
        id: '1-2',
        purchaseOrderId: 'PO-2023-001-2',
        productCategory: 'Mango',
        itemName: 'MNG-ALPH',
        skus: [
          { sku: '20 Dana', quantity: 10, unit: 'Box/Crate', unitWt: 10, totalWt: 100 },
          { sku: 'Loose', quantity: 5, unit: 'Kg', totalWt: 5 }
        ],
        quantity: 15,
        unit: 'Box/Crate',
        receivedQuantity: 15,
        status: 'received',
        notes: 'Partial loose items included.'
      },
    ],
    createdAt: new Date('2023-11-30T14:30:00'),
    updatedAt: new Date('2023-12-01T11:30:00'),
  },
  // IN_TRANSIT
  {
    id: '3',
    vehicleNumber: 'KA03EF7890',
    driverName: 'Priya Singh',
    driverPhone: '9123456780',
    supplier: 'FreshFarms',
    supplierReference: 'PO-2023-003',
    estimatedArrival: new Date('2023-12-03T09:00:00'),
    status: 'pending',
    items: [
      {
        id: '3-1',
        purchaseOrderId: 'PO-2023-003-1',
        productCategory: 'Orange',
        itemName: 'ORG-NAVL',
        skus: [
          { sku: '70 Count', quantity: 30, unit: 'Box/Crate', unitWt: 6, totalWt: 180 },
          { sku: 'Premium', quantity: 10, unit: 'Box/Crate', unitWt: 6, totalWt: 60 }
        ],
        quantity: 40,
        unit: 'Box/Crate',
        receivedQuantity: 0,
        status: 'pending',
        notes: 'Expected early morning.'
      },
    ],
    createdAt: new Date('2023-12-02T08:00:00'),
    updatedAt: new Date('2023-12-02T08:00:00'),
  },
  // ARRIVED
  {
    id: '4',
    vehicleNumber: 'KA04GH2345',
    driverName: 'Amit Verma',
    driverPhone: '9988776655',
    supplier: 'GreenLeaf',
    supplierReference: 'PO-2023-004',
    estimatedArrival: new Date('2023-12-04T11:00:00'),
    actualArrival: new Date('2023-12-04T11:05:00'),
    status: 'arrived',
    items: [
      {
        id: '4-1',
        purchaseOrderId: 'PO-2023-004-1',
        productCategory: 'Banana',
        itemName: 'BAN-ROB',
        skus: [
          { sku: 'Hands', quantity: 20, unit: 'Bunch', unitWt: 2, totalWt: 40 },
          { sku: 'Loose', quantity: 10, unit: 'Kg', totalWt: 10 }
        ],
        quantity: 30,
        unit: 'Bunch',
        receivedQuantity: 0,
        status: 'pending',
        notes: 'Vehicle just arrived at gate.'
      },
    ],
    createdAt: new Date('2023-12-03T10:00:00'),
    updatedAt: new Date('2023-12-04T11:05:00'),
  },
  // UNLOADING
  {
    id: '5',
    vehicleNumber: 'KA05IJ6789',
    driverName: 'Sunil Rao',
    driverPhone: '9012345678',
    supplier: 'AgroMart',
    supplierReference: 'PO-2023-005',
    estimatedArrival: new Date('2023-12-05T13:00:00'),
    actualArrival: new Date('2023-12-05T13:10:00'),
    status: 'unloading',
    items: [
      {
        id: '5-1',
        purchaseOrderId: 'PO-2023-005-1',
        productCategory: 'Apple',
        itemName: 'Apple-Turkey',
        skus: [
          { sku: 'Grade B', quantity: 25, unit: 'Box/Crate', unitWt: 5, totalWt: 125 },
          { sku: 'Premium', quantity: 5, unit: 'Box/Crate', unitWt: 5, totalWt: 25 }
        ],
        quantity: 30,
        unit: 'Box/Crate',
        receivedQuantity: 10,
        status: 'partially_received',
        notes: 'Unloading in progress.'
      },
    ],
    createdAt: new Date('2023-12-04T12:00:00'),
    updatedAt: new Date('2023-12-05T13:10:00'),
  },
  // UNLOADED
  {
    id: '6',
    vehicleNumber: 'KA06KL9876',
    driverName: 'Meena Joshi',
    driverPhone: '9876123450',
    supplier: 'FruitHub',
    supplierReference: 'PO-2023-006',
    estimatedArrival: new Date('2023-12-06T15:00:00'),
    actualArrival: new Date('2023-12-06T15:05:00'),
    status: 'completed',
    items: [
      {
        id: '6-1',
        purchaseOrderId: 'PO-2023-006-1',
        productCategory: 'Pomegranate',
        itemName: 'POMO-GJ',
        skus: [
          { sku: 'A1', quantity: 18, unit: 'Box/Crate', unitWt: 5, totalWt: 90 },
          { sku: 'Loose', quantity: 2, unit: 'Kg', totalWt: 2 }
        ],
        quantity: 20,
        unit: 'Box/Crate',
        receivedQuantity: 20,
        status: 'received',
        notes: 'Unloading completed.'
      },
    ],
    createdAt: new Date('2023-12-05T14:00:00'),
    updatedAt: new Date('2023-12-06T15:05:00'),
  },
  // RETURNED
  {
    id: '7',
    vehicleNumber: 'KA07MN5432',
    driverName: 'Rohit Shetty',
    driverPhone: '9098765432',
    supplier: 'AgroReturns',
    supplierReference: 'PO-2023-007',
    estimatedArrival: new Date('2023-12-07T10:00:00'),
    status: 'cancelled',
    items: [
      {
        id: '7-1',
        purchaseOrderId: 'PO-2023-007-1',
        productCategory: 'Mango',
        itemName: 'MNG-KESAR',
        skus: [
          { sku: '30 Dana', quantity: 10, unit: 'Box/Crate', unitWt: 10, totalWt: 100 }
        ],
        quantity: 10,
        unit: 'Box/Crate',
        receivedQuantity: 0,
        status: 'rejected',
        notes: 'Vehicle returned due to quality issues.'
      },
    ],
    createdAt: new Date('2023-12-06T09:00:00'),
    updatedAt: new Date('2023-12-07T10:00:00'),
  },
  // CANCELLED
  {
    id: '8',
    vehicleNumber: 'KA08OP2468',
    driverName: 'Deepak Kumar',
    driverPhone: '9876345671',
    supplier: 'CancelledFruits',
    supplierReference: 'PO-2023-008',
    estimatedArrival: new Date('2023-12-08T16:00:00'),
    status: 'cancelled',
    items: [
      {
        id: '8-1',
        purchaseOrderId: 'PO-2023-008-1',
        productCategory: 'Banana',
        itemName: 'BAN-NEND',
        skus: [
          { sku: '12 Count', quantity: 15, unit: 'Bunch', unitWt: 2, totalWt: 30 }
        ],
        quantity: 15,
        unit: 'Bunch',
        receivedQuantity: 0,
        status: 'pending',
        notes: 'Order was cancelled before dispatch.'
      },
    ],
    createdAt: new Date('2023-12-07T15:00:00'),
    updatedAt: new Date('2023-12-08T16:00:00'),
  },
  // PENDING (existing entry for reference)
  {
    id: '2',
    vehicleNumber: 'KA02CD5678',
    driverName: 'Suresh Patel',
    driverPhone: '8765432109',
    supplier: 'XYZ Traders',
    supplierReference: 'PO-2023-002',
    estimatedArrival: new Date('2023-12-02T14:00:00'),
    status: 'pending',
    items: [
      {
        id: '2-1',
        purchaseOrderId: 'PO-2023-002-1',
        productCategory: 'Apple',
        itemName: 'Apple-CA',
        skus: [
          { sku: 'Grade A', quantity: 40, unit: 'Box/Crate', unitWt: 4, totalWt: 160 },
          { sku: 'Loose', quantity: 10, unit: 'Kg', totalWt: 10 }
        ],
        quantity: 50,
        unit: 'Box/Crate',
        receivedQuantity: 0,
        status: 'pending',
        notes: 'Awaiting arrival.'
      },
      {
        id: '2-2',
        purchaseOrderId: 'PO-2023-002-2',
        productCategory: 'Banana',
        itemName: 'BAN-CAVL',
        skus: [
          { sku: 'Hands', quantity: 24, unit: 'Bunch', unitWt: 2, totalWt: 48 },
          { sku: 'Loose', quantity: 12, unit: 'Kg', totalWt: 12 }
        ],
        quantity: 36,
        unit: 'Bunch',
        receivedQuantity: 0,
        status: 'pending',
        notes: 'To be checked for ripeness on arrival.'
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
