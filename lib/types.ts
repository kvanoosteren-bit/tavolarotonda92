export interface Order {
  id: string;
  naam: string;
  email: string;
  telefoon: string;
  aantal: number;
  totaal: number;
  timestamp: string;
  status: "pending" | "confirmed" | "completed";
}

export interface StockResponse {
  available: number;
  total: number;
}

export interface OrderResponse {
  success: boolean;
  available: number;
  orderId: string;
}

export interface OrderError {
  success: false;
  error: string;
}

export interface OrderFormData {
  naam: string;
  email: string;
  telefoon: string;
  aantal: number;
}
