export enum OrderStatus {
  Received = 1,
  Allocated = 2,
  Preparing = 3,
  Shipped = 4,
  Cancelled = 9,
}

export interface OrderLine {
  sku: string;
  quantity: number;
  unitPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  lines: OrderLine[];
  status: OrderStatus;
  total: number;
  paid: boolean;
  approved: boolean;
  createdAt: Date;
}
