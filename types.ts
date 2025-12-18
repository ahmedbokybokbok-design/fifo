
export enum UserRole {
  PHARMACY = 'PHARMACY',
  WAREHOUSE = 'WAREHOUSE',
  ADMIN = 'ADMIN'
}

export type RegistrationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface User {
  id: string;
  name: string;
  phone: string;
  password?: string; // In a real app, this would be hashed
  role: UserRole;
  status: RegistrationStatus;
}

export interface RegistrationRequest {
  id: string;
  name: string;
  type: 'PHARMACY' | 'WAREHOUSE';
  licenseNumber: string;
  location: string;
  requestDate: string;
  status: RegistrationStatus;
  contactPhone: string;
  password?: string; // Captured during registration
}

export interface Warehouse {
  id: string;
  name: string;
  rating: number;
  lastUpdated: string;
  integrationType: 'ORGASOFT' | 'MANUAL' | 'EXCEL' | 'PDF';
}

export interface DrugOffer {
  warehouseId: string;
  price: number;
  discount: number; // Percentage
  bonus: string; // e.g., "10+1"
  stockStatus: 'AVAILABLE' | 'LOW' | 'OUT_OF_STOCK';
  lastUpdated: string;
}

export interface Drug {
  id: string;
  tradeName: string;
  scientificName: string;
  manufacturer: string;
  type: string; // Tablet, Syrup, etc.
  offers: DrugOffer[];
}

export interface MarketItem {
  id: string;
  sellerName: string;
  tradeName: string;
  quantity: number;
  expiryDate: string;
  originalPrice: number;
  sellingPrice: number; // Or discount percentage
  description: string;
  location: string;
  imageUrl?: string;
  postedAt: string;
}

export interface UploadHistory {
  id: string;
  fileName: string;
  uploadTime: string;
  status: 'PROCESSED' | 'PROCESSING' | 'FAILED';
  itemsCount: number;
}

export interface DailyStatus {
  morning: boolean;
  evening: boolean;
  lastSync?: string;
}

export interface CartItem {
  id: string;
  drugId: string;
  tradeName: string;
  warehouseId: string;
  warehouseName: string;
  price: number;
  discount: number;
  quantity: number;
  bonus: string;
}

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  itemsCount: number;
  totalAmount: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  orderDate: string;
  details: OrderItem[];
  invoiceRequested?: boolean;
}

export type ViewState = 'SEARCH' | 'MARKETPLACE' | 'WAREHOUSE_DASHBOARD' | 'ADMIN_DASHBOARD' | 'CART' | 'INVOICES';
